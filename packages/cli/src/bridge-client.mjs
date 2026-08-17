import { spawn } from 'node:child_process';
import { access } from 'node:fs/promises';
import path from 'node:path';

function lineReader(stream) {
  let buffer = '';
  const lines = [];
  const waiters = [];

  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    buffer += chunk;
    while (buffer.includes('\n')) {
      const index = buffer.indexOf('\n');
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 1);
      const waiter = waiters.shift();
      if (waiter) waiter.resolve(line);
      else lines.push(line);
    }
  });

  return async function readLine(timeoutMs) {
    if (lines.length) return lines.shift();
    return new Promise((resolve, reject) => {
      const waiter = { resolve: (line) => { clearTimeout(timer); resolve(line); } };
      const timer = setTimeout(() => {
        const index = waiters.indexOf(waiter);
        if (index >= 0) waiters.splice(index, 1);
        reject(new Error(`PoB bridge timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      waiters.push(waiter);
    });
  };
}

export async function resolvePobSource(value) {
  if (!value) throw new Error('Set POB_PATH or pass --pob-path with a Path of Building checkout.');
  const candidate = path.resolve(value);
  const source = path.basename(candidate) === 'src' ? candidate : path.join(candidate, 'src');
  await access(path.join(source, 'HeadlessWrapper.lua'));
  return source;
}

export class BridgeClient {
  constructor({ pobSource, command = 'luajit', bridgeScript, timeoutMs = 60_000 }) {
    this.pobSource = pobSource;
    this.command = command;
    this.bridgeScript = bridgeScript;
    this.timeoutMs = timeoutMs;
  }

  async start() {
    const checkout = path.dirname(this.pobSource);
    const runtimeLua = path.join(checkout, 'runtime', 'lua');
    const inheritedLuaPath = process.env.LUA_PATH ? `${process.env.LUA_PATH};` : '';
    const env = {
      ...process.env,
      POB_API_STDIO: '1',
      LUA_PATH: `${inheritedLuaPath}${runtimeLua}/?.lua;${runtimeLua}/?/init.lua;;`,
    };
    this.stderr = '';
    this.process = spawn(this.command, [this.bridgeScript], {
      cwd: this.pobSource,
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    this.process.stderr.setEncoding('utf8');
    this.process.stderr.on('data', (chunk) => { this.stderr += chunk; });
    this.readLine = lineReader(this.process.stdout);

    await new Promise((resolve, reject) => {
      this.process.once('spawn', resolve);
      this.process.once('error', (error) => reject(new Error(`Could not start ${this.command}: ${error.message}`)));
    });
    try {
      const ready = await this.readJson();
      if (!ready.ready) throw new Error('PoB bridge did not send a ready message.');
      this.ready = true;
    } catch (error) {
      this.process.kill();
      const detail = this.stderr.trim();
      throw new Error(detail ? `${error.message}\n${detail}` : error.message);
    }
  }

  async readJson() {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const line = await this.readLine(this.timeoutMs);
      if (!line.trim().startsWith('{')) continue;
      try { return JSON.parse(line); } catch { /* PoB may print non-protocol logs. */ }
    }
    throw new Error('PoB bridge produced no JSON response.');
  }

  async request(action, params = {}) {
    this.process.stdin.write(`${JSON.stringify({ action, params })}\n`);
    const response = await this.readJson();
    if (!response.ok) throw new Error(`${action}: ${response.error || 'operation failed'}`);
    return response;
  }

  async stop() {
    if (!this.process || this.process.exitCode !== null) return;
    if (!this.ready) { this.process.kill(); return; }
    try { await this.request('quit'); } catch { this.process.kill(); }
    this.ready = false;
  }
}
