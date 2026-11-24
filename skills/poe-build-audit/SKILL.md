---
name: poe-build-audit
description: Audit Path of Exile 1 builds from a poe.ninja character, account, Path of Building export, pobb.in link, profile, or pasted gear. Use for build reviews, troubleshooting damage or survivability, validating PoB DPS, identifying upgrades, checking whether charges/buffs/debuffs/flasks/shrines/guard skills/minion effects and other conditional states are actually sustainable, or explaining interactions among items, skills, passives, ascendancies, Bloodlines, jewels, spectres, and Animate Guardian gear. Research current-version values and mechanics instead of relying on memory.
---

# PoE Build Audit

Audit the build as a system, but control research depth. Do not perform a full forensic audit before the user has seen a useful overview.

## Work in Passes

Unless the user explicitly requests a full audit in one response, use three passes:

1. `Overview`: identify the build engine, major damage and defence packages, obvious conditional states, and no more than five material uncertainties. Check only the exact current text needed to avoid a misleading first impression.
2. `Targeted verification`: after the user reviews the overview, investigate the selected uncertainties and hidden states. Research one layer deeper, then report what changed.
3. `Deep audit`: calculate uptime, legal replacements, damage ranges, recovery loops, and scenario-specific defences only for questions that remain material.

Stop after the overview when user confirmation can prevent wasted research. A suspicious field is a question, not yet a finding.

When the user asks a bounded deep question about the actual action loop, button burden, trigger order, resource sustain, ramp, uptime, or a failure state, perform `Targeted verification` for that scope immediately. Do not force an extra overview round first.

## Establish Scope

1. Confirm PoE 1, ruleset, league, patch, platform, and character snapshot date.
2. State the audit goal: mapping, bossing, progression, Hardcore, damage accuracy, defence, or upgrades.
3. Treat the current date and patch as unstable facts. Verify them from current sources.
4. In the overview, verify only league-specific components central to the engine. Verify the rest when they become relevant to a recommendation.
5. Preserve the user's intended mechanic. Do not silently redesign an unusual build into the meta version.

## Current-Character Gate

Treat `current`, `latest`, `目前角色`, and similar wording as a hard source
requirement. Load a fresh character model or PoB export in the same turn and
record account, character, league, level, `updatedUtc`, and snapshot path. Do
not use memory, Wiki pages, or an older local snapshot as a substitute. Memory
and Wiki may locate the character or explain a mechanic, but never supply the
current gem, item, quality, count, or modifier value when a fresh source is
requested. If the fresh source cannot be reached, state the blocker and ask for
the export/link instead of silently falling back.

Before calculating, prove that PoB is using that artifact: load its XML, select
the requested socket group and active skill, select the weapon/item set and
minion subskill when relevant, then report the resulting build identity and
selection. Label every number as `current snapshot`, `hypothetical override`,
`cached`, or `memory-derived`.

## Judge Patch Survival by the Complete Engine

When reviewing patch notes or deciding whether a build is alive, identify the character's actual engine before judging the named skill gem. Decompose it into:

`active skill | delivery and base-damage source | scaling package | mandatory items and special variants | ascendancy and Bloodline | persistent states | acquisition sources`

Build a patch delta ledger for every mandatory component:

`component | snapshot value | new value | new-league availability | Standard legacy status | replacement | engine impact`

Keep these verdicts separate:

1. The skill gem survives.
2. The general archetype survives.
3. The existing Standard character still functions.
4. The exact engine can be rebuilt in the new league.

Do not call a build buffed merely because the active gem was buffed. A missing acquisition source, unobtainable mutation, legacy-only roll, or irreplaceable persistent state can kill the exact engine while the gem and broader archetype remain viable. Conversely, distinguish an expensive or numerically weaker rebuild from a mechanically impossible one.

For legacy items, state whether old rolls remain until modified and warn when a Divine Orb or other currency would update them to current values. Never apply current rolls automatically to a captured legacy item.

## Use Path of Everything First

For any value or state that Path of Building can represent, use the Path of
Everything CLI or its vendored pob-mcp bridge before manual arithmetic or source
archaeology. Resolve the checkout, calculation order, seasonal gate, privacy
boundary, and factsheet workflow from `docs/agent-runtime.md` in that checkout.

Start with `npm run pob:compact`. Always select the actual socket group, active
skill, skill part, minion subskill, Animate Guardian item set, weapon set, and
enemy scenario. If the compact surface lacks a required operation, query the
pob-mcp bridge capabilities and keep the calculation in PoB. Inspect PoB source
or calculate manually only after recording why PoB cannot express the question.

For mechanism validation or before/after tuning, use the full snapshot endpoint
(`npm run pob:full` / `get_full_output`) instead of adding a skill-specific
extractor. Keep the adjustable input in the input schema and inspect the same
output paths for every skill. Start with the reusable questions in
`packages/cli/src/validation-cases.mjs`: base damage, support eligibility,
added-damage effectiveness, secondary damage ownership, minion stat ownership,
conversion, trigger cooldowns, counts/overlap, resource loops, and special
actor eligibility. A case is a question plus inputs and assertion paths; it is
not a proof until the exported values and current mechanics evidence agree.

For gem-level and quality questions, read the selected gem from
`inputs.skills.groups[].gems[]` by socket group and `skillId`/name, then compare
its raw level/quality with PoB's `calculation.mainOutput.GemLevel` and
`GemQuality` after the selection has been proven. The latter is the effective
quality of the selected active skill in PoB (including applicable item,
support, and socket quality); do not call it a sum of every linked gem, and do
not use it without recording the selected group/skill. If PoB does not expose a
breakdown, report raw gem quality and effective PoB quality separately and
leave the source split explicit. For mine and minion questions, separate raw
and effective gem quality, support quality, active-count limit, actual count
near the enemy, throw count, aura-effect multiplier, and cap before doing
arithmetic.

PoB desktop accepts a `https://pobb.in/<id>` link in its Import/Export tab. For
headless work, pass that link to Path of Everything with `--build-url`; the CLI
resolves the raw `/pob/<id>` endpoint, decodes the URL-safe base64/zlib export,
and loads the XML through the PoB bridge. `--build` remains the local-XML
input. Keep fetched XML private and do not print or commit a character export.

PoB remains a calculator, not proof of uptime, AI behavior, legal acquisition,
price, or survivability. Preserve every existing state-ledger, defensive,
behavioral, legal-state, and source-verification check in this skill.

At the first audit in a new league, or when compact output reports a stale
engine, apply the seasonal gate before publishing current-version numbers.

### Reject incompatible calculations before interpreting damage

Before using a compact result, run `scripts/check_pob_identity.py` with the
source XML, captured compact output, actual PoB path and requested selection:

```bash
python3 scripts/check_pob_identity.py \
  --build /private/current-with-spectre.xml --compact /private/compact.log \
  --pob-path /path/to/PathOfBuilding \
  --socket-group 3 --active-skill 1 --skill-name "Raise Spectre" \
  --minion-skill 1 --skill-part-name "Ice Mortar"
```

The active source tree must exist in the runtime. The loaded class, ascendancy,
level, socket group, active skill and requested minion/skill part must match.
A successful process exit from PoB is not proof of a successful import: missing
trees can silently produce another class, no ascendancy, or the wrong skill.
If this check rejects a result, discard its damage and defence numbers. Never
rescale them into an approximate current DPS or rewrite the source tree version
to an older one to make the import succeed. A pass validates technical identity
only; continue the existing minion, state, support and behavioral checks.

On the first incompatibility, inspect the official PoB releases and runtime
capabilities. Record the installed version, required tree, available compatible
release and exact failure. Use an already available compatible runtime when
permitted; installation or updates still follow the user's authorization.
Explain a concrete remedy or the exact remaining permission/blocker once,
rather than repeatedly rerunning the same incompatible input or merely saying
the engine is old. Do not promise a DPS comparison until the gate passes.

For spectres, an export without a recorded species or minion damage is not a
zero-DPS character. Obtain the species and actual count from current evidence
or the user, preserve the original XML, and record the selection in a separate
input. Per-projectile, per-minion and total overlap remain separate quantities.

At task end, propose reusable verified results for `facts/`; write them only
with explicit authorization and never include private character data.

## Existing Build-Guide Website

When asked to turn a character or PoB into HTML/a guide, reuse the existing
`poe-build-guide` importer and shared Vue renderer before considering a new
frontend. Read [`references/build-guide-website.md`](references/build-guide-website.md)
and the checkout README for the data contract, import/build commands and
version boundary. Path of Everything supplies calculations; it does not replace
the website importer. Keep private character exports and previews private.

## Acquire Evidence

Prefer, in order:

1. A current PoB export supplied by the user.
2. A poe.ninja character model plus its embedded PoB export.
3. Official public character data.
4. Screenshots or pasted data, explicitly noting omissions.

For poe.ninja profiles, run `scripts/fetch_poe_ninja.py`. Pass the complete account name including its discriminator; the script converts it to poe.ninja's profile slug. If the private API changes, inspect the current profile page assets rather than inventing an endpoint.

Treat poe.ninja and imported PoB data as snapshots with presentation and parser limitations. A gem group, socket slot, passive override, or displayed item proves that the data was recorded; it does not by itself prove the effect is linked, allocated, active, or present in the user's current in-game state.

PoB exports can contain both active and weapon-swap equipment plus skill groups. Never combine their items, sockets, supports, or damage packages into one simultaneous state. Identify the selected weapon set; when both sets are used in play, record weapon swapping as an explicit action-loop and failure-cost step.

Read `references/evidence-workbook.md` before a full audit. Read `references/sources.md` whenever current mechanics, values, prices, or patch behavior must be checked. When recommending or comparing a purchasable item, follow its Instant Buyout pricing workflow instead of quoting an uninspected whisper-listing floor. Read `references/behavioral-exceptions.md` when AI, control, relocation, targeting, overlap, secondary damage, or trigger eligibility is material.

## Spectre Evidence

When Raise Spectre is present, identify the actual monster species, count and
roles from the current source or ask the user. A character name or the Raise
Spectre gem alone does not identify its monsters. After identifying a species,
retrieve its current PoEDB monster page and skill data before judging its
supports, damage type, cooldowns or defences. Use
[`references/spectre-data.md`](references/spectre-data.md) and
`scripts/fetch_spectre.py` for a compact, source-preserving extraction instead
of loading the whole page. Match the PoEDB metadata ID and skill ID to PoB;
monster and skill ordering can differ. If extraction or matching fails, keep
the missing part unknown. Never treat the page's displayed monster-level
values as final raised-spectre stats or infer overlap/uptime from them.

## Inventory Before Full Analysis

Collect all of the following that exist:

- Class, ascendancy nodes, secondary/Bloodline ascendancy, level, bandit, pantheon.
- Main and weapon-swap equipment, all implicits/explicits/crafts/enchants/corruptions/mutated mods, sockets, item-provided skills and supports.
- Every active skill group, gem level/quality/variant, links, enabled state, and selected main skill.
- For Imbued, corrupted, legacy, mutated, Foulborn, alternate-quality, or otherwise special components: exact provenance, attainable level/quality, modification limits, and current-league availability.
- Passive tree, masteries, keystones, cluster paths, timeless transformations, jewels, tattoos, runegrafts, and alternate trees.
- Flasks by class, prefix/suffix/enchant, duration, automation, and whether instant recovery creates any continuing effect.
- Minion details, spectre identities, Animate Guardian item set, corpses, and party-only assumptions.
- Action map: startup toggles, repeated skills, situational buttons, automated skills, trigger chains and socket order, manual flasks, and rebuild actions after death.
- Separate temporary damage minions from permanent utility minions. Record control and relocation eligibility, AI overrides, self-damage, recovery, resistances, and the cost of losing each permanent minion.
- PoB configuration inputs, custom modifiers, enemy settings, stages, stacks, counts, Full DPS selections, and placeholders.
- Snapshot time, stale or missing slots, unsupported calculations, and weapon-set selection.

Do not infer an absent AG item set, spectre identity, or custom modifier. Mark it unknown. Before finalizing an audit that uses minions or unexplained ally effects, ask for the relevant unknown AG equipment, spectre identities/counts, and other hidden support minions. Do not ask for an auxiliary minion that a verified build restriction forbids.

Before declaring that a socket setup is broken, confirm links from item socket data, a screenshot, or the user. Do not treat separate PoB `<Skill>` groups or poe.ninja grouping as conclusive physical-link evidence.

Before valuing a tattoo, passive, mastery, or timeless-jewel result, prove that its final node is active. Distinguish placement from effect: a tattoo can remain recorded on a node while a timeless transformation prevents the tattoo from applying. Use the post-transformation tree or PoB contribution breakdown; do not recommend replacing an inactive tattoo as though its displayed modifier currently contributes.

## Compare Legal Build States

Treat each upgrade as a complete, legal replacement state rather than an isolated stat delta.

1. Record everything removed, retained, and added by the swap, including built-in supports, implicits, corruptions, sockets, reservation, attributes, and conditional states.
2. Verify the proposed target can exist and can be obtained in the current league. Distinguish currently obtainable, trade-only legacy supply, Standard-only, and unavailable.
3. Do not compare an ordinary gem or item as if it retained an Imbued, item-provided, corrupted, or league-specific property from the old state.
4. Weight the change by the build's actual damage or defence components. A gem-level increase to one flat component is not the same as the same percentage increase to total damage when another component supplies most of the base damage.
5. Reject recommendations based only on level, rarity, tooltip convention, or poe.ninja presentation when the complete package is worse.

For damage, first write a source decomposition such as:

`total base damage = gem flat + weapon contribution + life sacrifice + added damage + secondary source`

Then identify which terms the proposed change actually modifies. Apply the same method to defence by separating armour, physical damage reduction, conversion, avoidance, guard windows, recovery, and maximum-hit-only effects.

## Build a State Ledger

For every condition that changes damage, defence, recovery, speed, or resource availability, record:

`state | source | trigger | duration | refresh rate | ramp time | mapping | no-add boss | phase transition | PoB setting | verdict`

Classify each state:

- `Permanent`: equipped/passive condition remains true without combat actions.
- `Sustainable`: deterministic refresh completes before expiry under the stated scenario.
- `High uptime`: probabilistic but quantified and reliable enough for the scenario.
- `Burst only`: available for a bounded opening or Vaal/flask window.
- `Mapping only`: relies on kills, corpses, or frequent packs.
- `Unsupported`: checked in PoB but no source is present.
- `Unknown`: source may be hidden, such as AG or spectres.

Model acquisition, consumption, and refresh together. Examples include charges consumed by guard skills, Elusive replacing itself, rage decay, flask effects disabling conditional items, minions dying, and buffs paused by boss invulnerability.

Separate these timelines:

1. Hideout baseline.
2. First second of a boss.
3. Sustained boss after ramp.
4. Mapping with kills.
5. Long phase transition or death recovery.

## Audit Resource and Action Loops

For each resource used by the loop, record:

`resource | maximum | actually usable | cost per press | opening burst | sustained cost/s | recovery/s | recovery conditions | no-target state | denial modifiers`

Do not substitute total mana for unreserved mana, maximum Energy Shield for Energy Shield present at combat start, or configured recovery for unconditional recovery.

For player input and automation, record:

`startup | repeating cadence | situational actions | automated actions | movement or targeting delay | recovery after failure`

When several skills share an action, resource, corpse, target, charge, or trigger pool, build a timestamped opening and steady-state timeline. Check trigger order, cooldown ownership, manual-skill cost before triggered cost, eligibility and proximity, failure behavior, and whether utility or movement skills also advance the trigger sequence. Average net gain alone does not prove that a burst sequence is payable or smooth.

## Verify Interactions

Use a research budget for each unusual combination:

1. First layer: retrieve the exact current item, gem, passive, or monster text from PoEDB and compare it with the character snapshot.
2. Second layer only if semantics remain ambiguous: use PoE Wiki for the mechanic or formula.
3. Check official patch notes only when version history, availability, or a recent behavior change is material.
4. Inspect PoB implementation or source code only when a parser conflict blocks a material conclusion. Do not descend into source archaeology merely to explain a nonessential display field.
5. Stop once the question is answered. Label hard evidence, calculated inference, user-confirmed state, and unresolved behavior separately.
6. For league-specific or special acquisition, verify both the mechanic and current availability before recommending acquisition.

Do not assume support compatibility from tags alone. Check the support's allow/exclude rules and the active skill's actual behavior. Do not assume “instant” means “no interaction”; determine whether any buff or flask effect persists after the instant action.
Do not infer an effect's owner from poe.ninja grouping or `itemSlot` alone. Trace whether it belongs to the active gem, an Imbued built-in support, the socketed item, an ally, or a PoB custom modifier.

Rules text proves wording, not every target's in-game eligibility. For claims involving AI, control, relocation, targeting, overlap, secondary damage, or trigger failure, record:

`actor or event | proposed effect | eligible? | negation or override | evidence type | patch`

Before concluding, scan every component that affects the same actor or event for limiting language such as `cannot`, `only`, `does not`, `unaffected`, `ignore`, or `instead`. Require an explicit current mechanics source or a scoped observation for behavioral claims; otherwise label the behavior `Unknown` and propose one falsification test.

Treat PoB enabled and configuration flags as calculation inputs. State separately whether an effect was excluded from the modeled number and whether it is actually inactive in game.

## Reconcile Displayed Numbers

- Identify whether DPS is per hit, per nova/projectile/minion, per cast, sustained DPS, or Full DPS.
- Check overlap/count assumptions, repeats, chains, shotgunning rules, enemy resistance, boss preset, curses, exposure, Wither, ailments, stages, and conditional critical bonuses.
- Recalculate a range: baseline, realistic sustained, and theoretical burst. Do not present a single inflated number as ordinary DPS.
- Evaluate defence by hit type and state window. A maximum hit with full charges but no active guard skill is one slice, not average survivability.
- Include recovery, resource costs, and failure loops; capped resistances alone do not establish durability.

## Report

For the first pass, produce a compact overview:

1. Build identity and intended loop.
2. Core packages that clearly work.
3. Major non-permanent or hidden states.
4. Up to five suspected issues, phrased as questions when evidence is incomplete.
5. The next checks that would materially change the verdict.

For a QoL or action-loop audit, report button burden as `startup | repeating cadence | situational | recovery` and identify the first resource, travel, targeting, or animation bottleneck.

Do not publish precise uptime, damage ranges, or replacement rankings in the overview unless they are already directly supported and central to the user's question.

For a requested full audit, lead with confirmed corrections to misleading PoB/poe.ninja assumptions. Then provide:

1. Build identity and intended loop.
2. State ledger with ramp and uptime verdicts.
3. Realistic damage range and assumptions.
4. Defence/recovery by scenario.
5. Interactions that work, fail, or remain unknown.
6. Legal-state comparison for each recommended change, including what is lost.
7. Prioritized changes grouped by low cost, structural, and optional damage.
8. Patch, league availability, snapshot date, and direct source links.

Be explicit when the user's correction overturns an earlier assumption.
