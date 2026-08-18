#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BridgeClient, resolvePobSource } from './bridge-client.mjs';
import { fetchPobbBuildXml } from './pobb-input.mjs';
import { getValidationCase, VALIDATION_CASES } from './validation-cases.mjs';

const HELP = `Usage:
  path-of-everything pob compact --build BUILD.xml [selection options]
  path-of-everything pob full --build BUILD.xml [selection options]
  path-of-everything pob full --input INPUT.json
  path-of-everything pob cases [--case CASE_ID]
  path-of-everything pob compact --build-url https://pobb.in/BUILD_ID [selection options]
  path-of-everything pob compact --new-skill "Summon Raging Spirit" [--gem-level 20]

Options:
  --pob-path PATH          PoB checkout or its src directory (or POB_PATH)
  --pob-cmd COMMAND        LuaJIT executable (or POB_CMD, default: luajit)
  --input PATH             JSON input file; command-line options override it
  --socket-group N         Main socket group
  --active-skill N         Active skill within the group
  --skill-part N           Skill part used by PoB
  --minion-skill N         Minion subskill used by PoB
  --minion-item-set N      Animate Guardian/minion item set used by PoB
  --enemy-boss MODE        none, standard, pinnacle, uber, or saved (default: pinnacle)
  --max-depth N            Full export recursion limit (default: 8)
  --max-keys N             Full export keys per table limit (default: 10000)
  --timeout-ms N           Per-response timeout (default: 60000)
`;

function parseArgs(argv) {
  const [scope, command, ...tokens] = argv;
  if (scope !== 'pob' || !['compact', 'full', 'inspect', 'cases'].includes(command)) throw new Error(HELP);
  const options = {};
  options.command = command === 'inspect' ? 'full' : command;
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

function normalizeInputFile(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('--input must contain a JSON object.');
  }
  const normalized = {};
  for (const key of ['build', 'build_url', 'new_skill']) {
    if (input[key] !== undefined) normalized[key] = input[key];
  }
  for (const [source, target] of [
    ['buildUrl', 'build_url'],
    ['newSkill', 'new_skill'],
  ]) {
    if (input[source] !== undefined && normalized[target] === undefined) normalized[target] = input[source];
  }
  const selection = input.selection || {};
  for (const [source, target] of [
    ['socketGroup', 'socket_group'],
    ['activeSkill', 'active_skill'],
    ['skillPart', 'skill_part'],
    ['minionSkill', 'minion_skill'],
    ['minionItemSet', 'minion_item_set'],
  ]) {
    if (selection[source] !== undefined) normalized[target] = selection[source];
  }
  const scenario = input.scenario || {};
  if (scenario.enemyBoss !== undefined) normalized.enemy_boss = scenario.enemyBoss;
  if (scenario.enemyLevel !== undefined) normalized.enemy_level = scenario.enemyLevel;
  if (input.config && typeof input.config === 'object' && !Array.isArray(input.config)) {
    normalized.config = input.config;
  }
  const exportOptions = input.options || {};
  if (exportOptions.maxDepth !== undefined) normalized.max_depth = exportOptions.maxDepth;
  if (exportOptions.maxKeys !== undefined) normalized.max_keys = exportOptions.maxKeys;
  return normalized;
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
  const parsedOptions = parseArgs(process.argv.slice(2));
  if (parsedOptions.help) { await writeStdout(HELP); return; }
  if (parsedOptions.command === 'cases') {
    const selected = parsedOptions.case ? getValidationCase(parsedOptions.case) : null;
    if (parsedOptions.case && !selected) throw new Error(`Unknown validation case: ${parsedOptions.case}`);
    await writeStdout(`${JSON.stringify({ schemaVersion: 1, cases: selected ? [selected] : VALIDATION_CASES })}\n`);
    return;
  }
  let options = parsedOptions;
  if (parsedOptions.input) {
    let input;
    try {
      input = JSON.parse(await readFile(path.resolve(parsedOptions.input), 'utf8'));
    } catch (error) {
      throw new Error(`Could not read --input JSON: ${error.message}`);
    }
    options = { ...normalizeInputFile(input), ...parsedOptions };
  }
  const inputs = [options.build, options.build_url, options.new_skill].filter(Boolean);
  if (inputs.length !== 1) {
    throw new Error('Choose exactly one input: --build, --build-url, or --new-skill.');
  }

  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const pobSource = await resolvePobSource(options.pob_path || process.env.POB_PATH);
  const client = new BridgeClient({
    pobSource,
    command: options.pob_cmd || process.env.POB_CMD || 'luajit',
    bridgeScript: path.join(root, 'vendor/pob-mcp/lua/vanilla_stdio_bridge.lua'),
    compatLua: path.join(root, 'packages/cli/lua'),
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
    } else if (options.build_url) {
      const imported = await fetchPobbBuildXml(options.build_url);
      await client.request('load_build_xml', imported);
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
    const config = options.config && typeof options.config === 'object' ? { ...options.config } : {};
    if (bossMode !== null) config.enemyIsBoss = bossMode;
    if (options.enemy_level !== undefined) config.enemyLevel = Number(options.enemy_level);
    if (Object.keys(config).length > 0) await client.request('set_config', config);

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
    const response = await client.request(options.command === 'full' ? 'get_full_output' : 'get_compact_output', {
      maxDepth: optionalInteger(options, 'max_depth'),
      maxKeys: optionalInteger(options, 'max_keys'),
    });
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
