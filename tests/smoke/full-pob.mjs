import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { BridgeClient, resolvePobSource } from '../../packages/cli/src/bridge-client.mjs';

const pobPath = process.env.POB_PATH;
if (!pobPath) throw new Error('POB_PATH must point to a stock PoB checkout or src directory.');

const client = new BridgeClient({
  pobSource: await resolvePobSource(pobPath),
  command: process.env.POB_CMD || 'luajit',
  bridgeScript: resolve('vendor/pob-mcp/lua/vanilla_stdio_bridge.lua'),
  compatLua: resolve('packages/cli/lua'),
  timeoutMs: 60_000,
});

try {
  await client.start();
  await client.request('new_build');
  const group = await client.request('create_socket_group', { label: 'full export regression' });
  await client.request('add_gem', {
    groupIndex: group.socketGroup.index,
    gemName: 'Summon Raging Spirit',
    level: 15,
  });
  await client.request('set_main_selection', { mainSocketGroup: group.socketGroup.index });
  const full = (await client.request('get_full_output', { maxDepth: 6, maxKeys: 5000 })).result;

  assert.equal(full.schemaVersion, 2);
  assert.equal(full.exportType, 'pob-calculation');
  assert.equal(full.selection.skillName, 'Summon Raging Spirit');
  assert.equal(full.inputs.skills.groups.length, 1);
  assert.deepEqual(full.normalized.offense.baseDamage.physical, { min: 72, max: 108 });
  assert.equal(full.normalized.offense.baseDamageAverage, 90);
  assert.ok(full.calculation.mainOutput);
  assert.equal(full.limits.maxDepth, 6);
} finally {
  await client.stop();
}

console.log('full PoB export smoke passed: inputs, normalized output, and sanitized calculation graph');
