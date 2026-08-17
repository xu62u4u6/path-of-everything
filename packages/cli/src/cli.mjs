#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BridgeClient, resolvePobSource } from './bridge-client.mjs';

const HELP = `Usage:
  path-of-everything pob compact --build BUILD.xml [selection options]
  path-of-everything pob compact --new-skill "Summon Raging Spirit" [--gem-level 20]

Options:
  --pob-path PATH          PoB checkout or its src directory (or POB_PATH)
  --pob-cmd COMMAND        LuaJIT executable (or POB_CMD, default: luajit)
  --socket-group N         Main socket group
  --active-skill N         Active skill within the group
  --skill-part N           Skill part used by PoB
  --minion-skill N         Minion subskill used by PoB
  --minion-item-set N      Animate Guardian/minion item set used by PoB
  --enemy-boss MODE        none, standard, pinnacle, uber, or saved (default: pinnacle)
  --timeout-ms N           Per-response timeout (default: 60000)
`;

function parseArgs(argv) {
  const [scope, command, ...tokens] = argv;
  if (scope !== 'pob' || command !== 'compact') throw new Error(HELP);
  const options = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token === '--help' || token === '-h') return { help: true };
    if (!token.startsWith('--')) throw new Error(`Unexpected argument: ${token}\n\n${HELP}`);
    const key = token.slice(2).replaceAll('-', '_');
    const value = tokens[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${token}`);
    options[key] = value;
    index += 1;
  }
  return options;
}

function optionalInteger(options, key) {
  if (options[key] === undefined) return undefined;
  const value = Number(options[key]);
  if (!Number.isInteger(value) || value < 1) throw new Error(`--${key.replaceAll('_', '-')} must be a positive integer.`);
  return value;
}

function writeStdout(value) {
  return new Promise((resolve, reject) => {
    process.stdout.write(value, (error) => error ? reject(error) : resolve());
  });
}

function enemyBossMode(value = 'pinnacle') {
  const modes = { none: 'None', standard: 'Boss', pinnacle: 'Pinnacle', uber: 'Uber', saved: null };
  const mode = modes[value.toLowerCase()];
  if (mode === undefined) throw new Error('--enemy-boss must be none, standard, pinnacle, uber, or saved.');
  return mode;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) { await writeStdout(HELP); return; }
  if (Boolean(options.build) === Boolean(options.new_skill)) {
    throw new Error('Choose exactly one input: --build or --new-skill.');
  }

  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const pobSource = await resolvePobSource(options.pob_path || process.env.POB_PATH);
  const client = new BridgeClient({
    pobSource,
    command: options.pob_cmd || process.env.POB_CMD || 'luajit',
    bridgeScript: path.join(root, 'vendor/pob-mcp/lua/vanilla_stdio_bridge.lua'),
    timeoutMs: optionalInteger(options, 'timeout_ms') || 60_000,
  });

  try {
    await client.start();
    if (options.build) {
      const buildPath = path.resolve(options.build);
      await client.request('load_build_xml', {
        xml: await readFile(buildPath, 'utf8'),
        name: path.basename(buildPath),
      });
    } else {
      await client.request('new_build');
      const group = await client.request('create_socket_group', { label: options.new_skill });
      await client.request('add_gem', {
        groupIndex: group.socketGroup.index,
        gemName: options.new_skill,
        level: optionalInteger(options, 'gem_level') || 20,
      });
      options.socket_group = String(group.socketGroup.index);
    }

    const bossMode = enemyBossMode(options.enemy_boss);
    if (bossMode !== null) await client.request('set_config', { enemyIsBoss: bossMode });

    const selection = {
      mainSocketGroup: optionalInteger(options, 'socket_group'),
      mainActiveSkill: optionalInteger(options, 'active_skill'),
      skillPart: optionalInteger(options, 'skill_part'),
      minionSkill: optionalInteger(options, 'minion_skill'),
      minionItemSet: optionalInteger(options, 'minion_item_set'),
    };
    if (Object.values(selection).some((value) => value !== undefined)) {
      await client.request('set_main_selection', selection);
    }
    const response = await client.request('get_compact_output');
    await writeStdout(`${JSON.stringify(response.result)}\n`);
  } finally {
    await client.stop();
  }
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
