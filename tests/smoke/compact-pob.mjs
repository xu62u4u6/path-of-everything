import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { BridgeClient, resolvePobSource } from '../../packages/cli/src/bridge-client.mjs';

const pobPath = process.env.POB_PATH;
if (!pobPath) throw new Error('POB_PATH must point to a stock PoB checkout or src directory.');

const client = new BridgeClient({
  pobSource: await resolvePobSource(pobPath),
  command: process.env.POB_CMD || 'luajit',
  bridgeScript: resolve('vendor/pob-mcp/lua/vanilla_stdio_bridge.lua'),
  timeoutMs: 60_000,
});

let result;
let guardianResult;
let guardianBootsOnly;
let guardianWithWeapon;
try {
  await client.start();
  const capabilities = await client.request('get_capabilities');
  assert.ok(capabilities.capabilities.actions.includes('get_compact_output'));
  await client.request('new_build');
  const created = await client.request('create_socket_group', { label: 'anonymous SRS regression' });
  await client.request('add_gem', {
    groupIndex: created.socketGroup.index,
    gemName: 'Summon Raging Spirit',
    level: 20,
  });
  await client.request('set_main_selection', { mainSocketGroup: created.socketGroup.index });

  // Round-trip through XML so the smoke covers the real --build path without
  // storing a character export in the public repository.
  const exported = await client.request('export_build_xml');
  await client.request('load_build_xml', { xml: exported.xml, name: 'anonymous-srs.xml' });
  await client.request('set_main_selection', { mainSocketGroup: created.socketGroup.index });
  result = (await client.request('get_compact_output')).result;

  await client.request('new_build');
  const guardian = await client.request('create_socket_group', { label: 'anonymous AG selection regression' });
  await client.request('add_gem', {
    groupIndex: guardian.socketGroup.index,
    gemName: 'Animate Guardian',
    level: 20,
  });
  await client.request('set_main_selection', {
    mainSocketGroup: guardian.socketGroup.index,
    skillPart: 1,
    minionSkill: 1,
    minionItemSet: 1,
  });
  guardianResult = (await client.request('get_compact_output')).result;
  await client.request('add_item_text', {
    text: 'Rarity: Normal\nIron Greaves',
    slotName: 'Boots',
  });
  guardianBootsOnly = (await client.request('get_compact_output')).result;
  await client.request('add_item_text', {
    text: 'Rarity: Normal\nDriftwood Club',
    slotName: 'Weapon 1',
  });
  guardianWithWeapon = (await client.request('get_compact_output')).result;
} finally {
  await client.stop();
}

assert.equal(result.schemaVersion, 1);
assert.equal(result.selection.skillName, 'Summon Raging Spirit');
assert.equal(result.selection.outputScope, 'minion');
assert.deepEqual(result.offense.baseDamage.physical, { min: 158, max: 237 });
assert.equal(result.offense.baseDamageAverage, 197.5);
assert.ok(result.engine.version);
assert.equal(result.warnings.length, 2);
assert.equal(guardianResult.selection.skillName, 'Animate Guardian');
assert.equal(guardianResult.selection.minionSkill, 1);
assert.equal(guardianResult.selection.minionItemSet, 1);
assert.equal(guardianResult.offense.averageHit, 0);
assert.equal(guardianBootsOnly.offense.averageHit, 0);
assert.deepEqual(guardianWithWeapon.offense.baseDamage.physical, { min: 9, max: 16 });

console.log('compact PoB smoke passed: SRS XML reload, AG equipment selection, and weapon-dependent AG damage');
