export const VALIDATION_CASES = Object.freeze([
  {
    id: 'srs-level-15-base-damage',
    category: 'base-damage',
    question: 'At gem level 15, quality 0, with no supports or conditional buffs, what are Summon Raging Spirit\'s base physical damage minimum, maximum, and average?',
    input: { skill: 'Summon Raging Spirit', gemLevel: 15, quality: 0, supports: [], conditions: [] },
    assert: ['normalized.offense.baseDamage.physical', 'normalized.offense.baseDamageAverage'],
  },
  {
    id: 'animate-guardian-base-damage',
    category: 'base-damage',
    question: 'With an empty Animate Guardian item set, what base damage, attack speed, and base critical chance does the selected skill report?',
    input: { skill: 'Animate Guardian', itemSet: 'empty', supports: [], conditions: [] },
    assert: ['normalized.offense.baseDamage', 'normalized.offense.attackOrCastRate', 'normalized.offense.critChance'],
  },
  {
    id: 'animate-guardian-of-smiting-base-damage',
    category: 'base-damage',
    question: 'For Animate Guardian of Smiting with an empty item set, what is the skill\'s own base damage before items and supports?',
    input: { skill: 'Animate Guardian of Smiting', itemSet: 'empty', supports: [], conditions: [] },
    assert: ['normalized.offense.baseDamage', 'normalized.offense.baseDamageAverage'],
  },
  {
    id: 'stormblast-aura-effect',
    category: 'aura-debuff',
    question: 'Does the selected skill\'s increased Damage Taken per mine scale with Aura Effect, and does the cap remain unchanged?',
    input: { skill: 'Stormblast Mine', quality: 23, activeMines: [1, 5, 10, 15], auraEffect: [0, 30, 50] },
    assert: ['normalized.aura.perMineDamageTaken', 'normalized.aura.totalDamageTaken', 'normalized.aura.cap'],
  },
  {
    id: 'support-eligibility',
    category: 'support-compatibility',
    question: 'Is the proposed support linked to and allowed by the selected skill, rather than merely sharing a tag?',
    input: { skill: '<selected>', support: '<selected>' },
    assert: ['normalized.selection.linked', 'normalized.selection.allowed', 'normalized.selection.excluded'],
  },
  {
    id: 'added-damage-effectiveness',
    category: 'damage-scaling',
    question: 'Which damage components receive Added Damage, and what is the actual Added Damage Effectiveness for the selected skill part?',
    input: { skill: '<selected>', skillPart: '<selected>', addedDamage: '<selected>' },
    assert: ['normalized.skill.addedDamageEffectiveness', 'normalized.offense.baseDamage', 'normalized.offense.finalDamage'],
  },
  {
    id: 'secondary-damage-boundary',
    category: 'damage-ownership',
    question: 'Does the proposed modifier affect the primary hit, a secondary explosion, a corpse-based effect, or none of them?',
    input: { skill: '<selected>', modifier: '<selected>' },
    assert: ['normalized.damage.primaryHit', 'normalized.damage.secondary', 'normalized.damage.corpseEffect'],
  },
  {
    id: 'minion-stat-ownership',
    category: 'minion-scaling',
    question: 'Does this modifier belong to the player, minion, skill gem, equipped item, or allied minion, and does PoB apply it to the intended actor?',
    input: { modifier: '<selected>', target: '<selected>' },
    assert: ['normalized.modifier.owner', 'normalized.modifier.target', 'normalized.modifier.applied'],
  },
  {
    id: 'conversion-and-mitigation',
    category: 'damage-pipeline',
    question: 'What is the damage type at each stage after conversion, and which mitigation or damage-taken modifier is applied?',
    input: { skill: '<selected>', conversion: '<selected>', enemy: '<selected>' },
    assert: ['normalized.damage.sourceType', 'normalized.damage.convertedType', 'normalized.damage.mitigationOrder', 'normalized.damage.final'],
  },
  {
    id: 'trigger-eligibility-and-cooldown',
    category: 'trigger-loop',
    question: 'Can the proposed trigger trigger this skill, what event owns the cooldown, and how many activations occur during the loop?',
    input: { trigger: '<selected>', skill: '<selected>', loopSeconds: 5 },
    assert: ['normalized.trigger.eligible', 'normalized.trigger.cooldownOwner', 'normalized.trigger.activations'],
  },
  {
    id: 'count-cap-and-overlap',
    category: 'area-and-count',
    question: 'What count, radius, projectile, or overlap assumption is required, and is it a cap, a PoB setting, or an in-game condition?',
    input: { skill: '<selected>', count: '<selected>', radius: '<selected>' },
    assert: ['normalized.mechanic.count', 'normalized.mechanic.cap', 'normalized.mechanic.overlap'],
  },
  {
    id: 'resource-and-action-loop',
    category: 'sustainability',
    question: 'Can the startup and repeating action sequence pay its resource cost before buffs, corpses, charges, or cooldowns expire?',
    input: { durationSeconds: 5, skills: ['<selected>'], resources: ['mana', 'energyShield', 'corpses', 'charges'] },
    assert: ['normalized.loop.startup', 'normalized.loop.costPerSecond', 'normalized.loop.recoveryPerSecond', 'normalized.loop.sustainable'],
  },
  {
    id: 'special-actor-eligibility',
    category: 'eligibility',
    question: 'Is the actor eligible for the proposed effect, including Construct, minion, spectre, Animate Guardian, ally, or player-only restrictions?',
    input: { actor: '<selected>', effect: '<selected>' },
    assert: ['normalized.actor.classification', 'normalized.effect.eligible', 'normalized.effect.negation'],
  },
]);

export function getValidationCase(id) {
  return VALIDATION_CASES.find((entry) => entry.id === id) || null;
}
