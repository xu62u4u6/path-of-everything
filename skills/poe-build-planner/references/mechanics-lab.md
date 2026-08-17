# Mechanics Lab

Use this mode when a build depends on an unusual overlap, secondary damage event, trigger, minion behavior, or user-observed interaction that has not yet been behaviorally verified. Do not build budget tiers or a complete guide until the core engine survives the lab.

## 1. State the claim

Record one falsifiable sentence and label its current evidence:

`rules text | calculated | observed pattern | user-tested | unknown`

Absence from poe.ninja means only that the sampled ladder did not expose an example. It does not invalidate the mechanic.

## 2. Draw the event graph

Write the actual sequence from input to damage:

`button -> cast or trigger -> projectile/minion/corpse -> travel or targeting -> hit/explosion/ailment -> repeat`

Include first-hit latency and the sustainable cycle, not only tooltip cast time.

## 3. Build the damage-eligibility matrix

| Event | Hit/DoT | Attack/spell/secondary | Projectile/AoE/minion | Added damage applies? | Conversion | Can overlap same target? |
|---|---|---|---|---|---|---|

Treat each ball, corpse explosion, projectile impact, nova, repeat, or minion attack as a separate event until evidence proves they share modifiers.

## 4. Compare manual math with PoB

Hand-calculate one representative event and compare it with the matching PoB calculation page. Verify selected part, count, enemy preset, configuration, and unsupported mechanics. If the semantic unit differs or PoB omits the interaction, keep the result `unverified`.

## 5. Design one falsification test

Record:

- hypothesis and expected observation;
- negative or control case;
- target size, distance, positioning, and relevant stats;
- repeat count or recording method;
- patch and result.

Prefer visible counters such as poison stacks, self-reflected ailments, life changes, charge use, or frame-by-frame recordings. Preserve a user's successful test as `user-tested` with its conditions.

## 6. Verdict

Use only:

- `verified`: current evidence supports the scoped behavior;
- `unverified`: plausible but a material test is missing;
- `invalidated`: the required interaction fails under the tested conditions.

This verdict applies only to the scoped interaction, not to the whole build. In the first lab response, do not recommend a final architecture or set an arbitrary hit-count, corpse-count, DPS, or budget gate. Give one controlled test with a negative case, then state which later decision depends on its result.

After verification, return to concept planning and evaluate whether the observed hit count, cadence, positioning, opportunity cost, and defence make a practical build. Do not declare viability from overlap alone.
