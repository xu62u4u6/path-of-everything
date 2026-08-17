# Evidence Workbook

Use this checklist for full audits. Omit rows that truly do not apply.

## Evidence Labels

- `Snapshot fact`: directly present in the character, PoB, item, or game-data artifact.
- `Rules text`: exact current wording from a dated source; wording alone does not prove every behavioral edge case.
- `Calculated`: derived from stated inputs; show the formula and rounding.
- `Behavior observed`: reproduced in game or shown by a scoped, current recording.
- `User-tested`: reported by the user under described conditions; preserve scope and version rather than generalizing it.
- `Inferred`: likely but not directly exposed by the artifact.
- `Unknown`: material information is missing.
- `Stale`: snapshot predates a relevant change.

## Component Ledger

| Category | Required evidence |
|---|---|
| Identity | Patch, league, level, class, ascendancy, Bloodline, snapshot |
| Skills | Variant, level, quality, links, item supports, selected part/count |
| Items | All slots and swaps, exact mods, implicits, enchants, corruptions |
| Availability | Acquisition source, current-league presence, modification limits, legacy/Standard status |
| Tree | Nodes, masteries, keystones, clusters, timeless changes, jewels |
| Character | Bandit, pantheon, tattoos, runegrafts, alternate trees |
| Minions | Type, level, count, life, AG equipment, spectres, replacement loop |
| Flasks | Flask class, instant/duration, effect window, charges, triggers |
| Actions | Startup toggles, repeated and situational buttons, automation, trigger order, rebuild actions |
| PoB | Config inputs, custom mods, enemy preset, stages, counts, Full DPS |

## Legal Replacement Ledger

Before recommending a swap, record:

| Field | Required check |
|---|---|
| Old package | Every property, support, socket, state, and obligation currently supplied |
| New package | Exact attainable variant, level, quality, corruption, and league source |
| Lost | Effects removed by the swap, including hidden or built-in supports |
| Gained | Effects newly supplied by the swap |
| Dependencies | Attributes, reservation, links, charges, minions, range, and uptime |
| Net result | Baseline, realistic sustained, and burst delta under the same scenario |

Never carry a property from the old package into the new package unless the new state legally retains it.

## State Ledger

For each meaningful state, capture:

| Field | Question |
|---|---|
| Source | What exact mod, node, skill, or ally grants it? |
| Trigger | Hit, crit, kill, cast, flask use, proximity, damage taken? |
| Availability | Does the trigger exist against a no-add boss? |
| Duration | How long does one application last? |
| Rate | How many eligible events occur per second? |
| Consumption | Does another skill spend or replace it? |
| Ramp | Time from zero to the modeled stack/count? |
| Refresh | Can it refresh before expiry during movement or phases? |
| Snapshot | Does the skill snapshot or update dynamically? |
| Verdict | Permanent, sustainable, high uptime, burst, mapping-only, unsupported? |

## Resource Ledger

| Field | Question |
|---|---|
| Capacity | What is the maximum, and how much is actually usable? |
| Cost | What is paid per manual use and per triggered or repeated event? |
| Opening | Can the complete startup sequence be paid in order? |
| Sustain | What are average cost and recovery per second? |
| Conditions | Does recovery require a target, hit, kill, corpse, flask, minion, or recent state? |
| Failure | What happens during no-target phases, denial modifiers, or a failed trigger? |

## Action Ledger

| Class | Required record |
|---|---|
| Startup | Auras, toggles, preload, corpses, charges, summons, first damage time |
| Repeating | Main cadence, refresh interval, cast or animation lock, movement compatibility |
| Situational | Curse, guard, movement, flask, weapon swap, target-specific actions |
| Recovery | Resummon, AG or spectre rebuild, refill, death recovery, failed-sequence reset |

For interleaved triggers, write a timestamped opening and steady-state sequence. Average resource gain does not prove that the next event can be paid on the exact tick it occurs.

## Behavioral Eligibility

For unusual AI, control, relocation, targeting, overlap, secondary damage, or trigger behavior, record:

| Actor or event | Proposed effect | Eligible? | Negation or override | Evidence type | Patch |
|---|---|---|---|---|---|

Search all components affecting the same actor or event for limiting language before concluding. If current rules text does not resolve actual behavior, use a scoped in-game test or mark it `Unknown`.

## Useful Estimates

For independent attempts with probability `p`, event rate `r`, and window `t`:

`P(at least one proc) = 1 - (1 - p)^(r*t)`

Expected first-proc time:

`E[T] ~= 1 / (r*p)`

For a random result among `k` equally likely states, use `p/k` for a specific state. Confirm whether effect scaling modifies the chance and whether chances above 100% have additional behavior.

For a resource cycle:

`net gain rate = acquisition rate - average consumption rate`

Do not call a maximum stack sustainable merely because net gain is positive. It must also refill within the effect duration and survive phase gaps.

For conditional critical damage, compare expected multipliers rather than multiplying tooltip crit chance by tooltip DPS blindly:

`average crit factor = 1 + critChance * (critMultiplier - 1)`

Recompute after flat base critical chance, increased/reduced critical chance, caps, and conditional multiplier changes.

## Scenario Matrix

Always test:

| Scenario | Typical failures |
|---|---|
| Hideout | No enemies, hits, kills, corpses, recent conditions |
| Boss opening | Charges/stacks at zero unless preload is legal |
| Sustained boss | Ramp may become valid; verify range and resource sustain |
| Mapping | Kill effects may be near-permanent but backtracking matters |
| Phase transition | Charges, short buffs, minions, and debuffs can expire |
| After death | AG/spectres, portals, flask charges, and setup time matter |

## Damage Reconciliation

Identify all multipliers represented by counts: chains, repeats, projectiles, overlaps, minions, brands, traps, stages, and enemy targets. Verify whether the same enemy can be hit by each instance. Report a range when positioning controls overlap.

Decompose base damage before applying percentage changes. Identify whether an upgrade affects gem flat damage, weapon damage, minion or corpse life, sacrifice damage, added damage, or all components. Report the weighted total change, not the changed component's percentage alone.

Do not mix:

- One-hit damage and DPS.
- One nova/projectile and all overlaps.
- Mapping buffs and no-add boss damage.
- Guard-active maximum hit and guard-down defence.
- Maximum charges and average charges during a consuming cycle.
