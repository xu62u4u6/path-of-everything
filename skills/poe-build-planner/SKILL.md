---
name: poe-build-planner
description: Research and plan Path of Exile 1 archetypes as practical guides with verified mechanics, variants, transition points, and multiple budget tiers. Use when creating a build concept, league starter, mapper, bosser, Hardcore or SSF variant, leveling path, gear progression, gem setup, passive plan, upgrade roadmap, or comparing alternative ascendancies and scaling packages. Verify the current patch, PoEDB item/gem data, PoE Wiki mechanics and formulas, poe.ninja population/build examples, and current league prices; do not copy a single showcase character or trust stale guides.
---

# PoE Build Planner

Turn a mechanical concept into a playable progression plan. Design around the user's goal, not around the highest poe.ninja DPS snapshot.

## Plan in Passes

Unless the user explicitly requests a complete guide immediately, use progressive planning:

1. `Concept overview`: state the skill's real scaling engine, delivery options, likely archetypes, major constraints, and current-version uncertainties. Use one or two complete guides plus a small poe.ninja sample only to establish the design space.
2. `Direction choice`: let the user confirm the intended gameplay, budget, and variant before researching every slot and transition.
3. `Guide build-out`: verify the chosen package, create legal budget tiers, test state sustainability, and write the full guide.

Do not exhaustively research every possible variant before the user has accepted the overview. One layer of evidence is enough to surface a question; investigate deeper only when the answer changes the chosen direction.

If the concept depends on a novel or user-observed interaction that is not yet behaviorally verified, enter `Mechanics Lab` before planning a full guide. Read `references/mechanics-lab.md`, test the smallest claim that can invalidate the engine, and stop after one useful falsification step unless the user asks to continue. During the first lab response, do not call the whole build viable or unviable, recommend a final architecture, or invent a hit-count, corpse-count, DPS, or budget threshold. Report only established facts, the unresolved claim, the event graph, one controlled test, and which later decision depends on its result.

## Define the Brief

Establish:

- PoE 1 patch and league, Trade/SSF, Softcore/Hardcore, and start date.
- Primary job: campaign, league start, mapping, invitations, pinnacle bosses, Ubers, Delve, or generalist.
- Budget now and expected ceiling; use the user's units and league economy.
- Preferred/avoided buttons, minions, aiming, weapon swaps, temporary buffs, and failure tolerance.
- Required uniques already owned and whether the build must function before acquiring them.
- Whether league-specific, discontinued, corrupted, Imbued, mutated, Foulborn, corpse, or other special components may be used, and what happens if they are unavailable.

Make reasonable defaults when missing, but label them.

Do not impose universal eHP, resistance-overcap, damage, or budget thresholds. Express defence and performance requirements by content, failure tolerance, and build state; numeric targets must be current, sourced, and presented as contextual goals rather than permanent rules.

## Research the Mechanic First

Use Path of Everything as the numerical core. When a gem, reference build, or
candidate package can be represented in PoB, route it through
`$poe-build-audit` and its Path of Everything/pob-mcp workflow before doing
manual arithmetic. Keep the planner's existing progression, defence,
availability, pricing, behavioral, and legal-package judgement unchanged; PoB
does not prove those claims.

At the first planning task in a new league, require the shared seasonal gate in
Path of Everything's `docs/agent-runtime.md`. Propose reusable, non-private,
patch-scoped results for its `facts/` directory and write them only when the
user authorizes durable recording.

For the concept overview, verify the main skill, its dominant damage source, and only the interaction that could invalidate the concept. Apply the complete checklist below after the user chooses a direction.

1. Verify the current skill and every relevant transfigured variant in PoEDB.
2. Verify support allow/exclude rules, item-provided supports, skill costs, minion inheritance, and any unusual conversion, sacrifice, repeat, chain, overlap, trigger, or cooldown behavior.
3. Use PoE Wiki for formulas and ambiguous semantics.
4. Search official patch notes for the skill and every enabling component.
5. Verify that every special acquisition method exists in the named league at the planned date. Separate farmable now, trade-only finite supply, Standard-only, and unavailable.
6. Verify attainable level/quality, corruption and modification limits, and the exact properties lost when replacing any special component.
7. Build a short interaction proof: inputs, scaling vectors, constraints, and failure conditions.

Reject or revise a concept early if the interaction does not work. Never repair it with invented items, mods, or unsupported PoB custom lines.

For multi-event skills and multi-button loops, build an event graph and damage-eligibility matrix before applying damage effectiveness or overlap counts. Include first-hit latency, steady-state cadence, projectile or minion travel, targeting, corpse generation and consumption, and animation lock. Compare one manual calculation with the relevant PoB result; unresolved disagreement remains `unverified`.

Do not create arbitrary go or no-go thresholds before damage, cadence, positioning, and defensive cost are modeled together.

## Decompose Scaling and Replacements

Before ranking upgrades, identify the build's real base-damage components and which of them each modifier affects. Do not treat a percentage increase to gem flat damage as the same percentage increase to total damage when weapon damage, minion life, corpse life, sacrifice, or another source dominates.

Compare complete legal packages:

`old package -> removed effects + retained effects + new package -> net result`

Include built-in supports, corruptions, sockets, item-granted skills, reservation, charge generation, attributes, and uptime. Never propose an ordinary replacement as if it retained an Imbued or league-specific property from the old component.

## Survey Existing Builds

Use poe.ninja as evidence of implementations, not as authority:

- Sample both representative and top-end characters.
- Compare ascendancies, skill links, key uniques, trees, defensive packages, and snapshot dates.
- Check HC/SSF where useful for resilience or accessibility.
- Note sample size, ladder cutoff, survivor bias, and characters imported in mapping gear.
- Open several individual characters; percentages alone can hide incompatible sub-archetypes.

Use one or two complete, current guides to understand leveling order, gameplay friction, and transition logic that poe.ninja snapshots cannot show. Treat guides as hypotheses to test against current mechanics, not as authorities to copy.

Check current prices through poe.ninja economy and official trade. Record league and lookup date. When recommending or comparing a purchasable item, follow the Instant Buyout pricing workflow in `references/sources.md`: inspect the low-price candidates and value their complete modifier sets rather than quoting an uninspected whisper-listing floor. For rare items, verify that the proposed affix combination can exist before pricing it.

## Define Variants

Separate variants when they change the gameplay loop or scaling engine, for example:

- Self-cast versus trigger, totem, mine, or minion delivery.
- Critical versus non-critical.
- Life, hybrid, low-life, or CI defence.
- Mapping package versus boss package.
- Trade-only unique engine versus SSF-accessible engine.

For each viable variant, state strengths, weaknesses, entry requirement, and transition cost. Recommend one default while preserving alternatives.

Treat Animate Guardian and spectre sets as optional support packages when they materially change the build. For each package, list exact effects, range, uptime class, replacement risk, required minion defences, socket/reservation cost, and a no-package fallback. Do not add AG or spectres merely because their buffs look efficient; confirm they survive the intended content and remain near the player or target often enough.

When a user supplies experiential knowledge, preserve it with an evidence label:

- `Verified mechanic`: current text or formula supports it.
- `Observed build pattern`: supported by multiple current characters or guides, but not a game rule.
- `User-confirmed practice`: valuable operational knowledge such as minion survivability, mapping feel, or transition timing.
- `Speculative risk`: expectations about nerfs, prices, or future availability.

Never convert a user example into a universal rule without comparison. Write nerf signals such as unusually low investment, bypassed costs, immunity, or excessive clear as risk indicators, not predictions that GGG will definitely nerf the build. Keep version-specific snapshots and named seasonal examples out of the core workflow unless they are clearly dated references.

## Build Budget Tiers

Choose budget boundaries from the current league and build, not fixed universal numbers. Each tier must be independently functional.

- `Entry`: minimum engine, capped obligations, usable links, resource solution, and accessible substitutes.
- `Established`: reliable damage/defence loop, solved ailments and sustain, core unique package.
- `High investment`: expensive scaling, corrupted implicits, exceptional gems, clusters, timeless jewels, or crafted rares.
- Add a showcase tier only when it adds a genuinely different ceiling; do not disguise mirror-tier gear as the normal goal.

For every transition, list the gate and order of operations. Avoid recommending a partial swap that breaks attributes, reservation, resistances, charge generation, or recovery.
Do not place a league-specific component in a budget tier until its current-league source and price are verified. If only finite trade supply exists, label the tier trade-dependent and provide a functional fallback.

## Validate States and Numbers

Use `$poe-build-audit` and its PoB-first Path of Everything workflow whenever a
PoB, gem calculation, or reference character is available. Otherwise apply the same state discipline:

- Separate permanent, sustainable, burst-only, mapping-only, and unsupported conditions.
- Present baseline, realistic sustained, and burst numbers when possible.
- Model boss starts, no-add encounters, phase transitions, death recovery, and ramp time.
- Include mana/life cost, flask behavior, minion replacement, guard-skill cycles, and charge consumption.
- Keep uncertain calculations as targets to verify in PoB, not facts.

## Produce the Guide

Read `references/guide-schema.md` for the output structure. Read `references/sources.md` for research and citation rules.

Before the full guide, present a planning overview containing:

1. The proposed build identity and scaling engine.
2. Two or three viable variants and the decision that separates them.
3. Known mandatory mechanics, likely hidden support packages, and unresolved current-version checks.
4. A recommended direction with its main tradeoff.

After the user confirms the direction, the full guide must contain:

1. Version, league, mode, prices-as-of date, and intended content.
2. One-paragraph build identity and gameplay loop.
3. Why the core interaction works, with current sources.
4. Recommended variant plus meaningful alternatives.
5. Leveling and transition milestones.
6. Gem groups and socket priorities at each stage.
7. Passive/ascendancy/mastery/cluster progression.
8. Slot-by-slot gear across budget tiers with substitutes.
9. Optional AG/spectre support packages, required minion survival, and no-package alternatives.
10. Ailment, curse, stun, recovery, resource, and map-mod handling.
11. State/uptime assumptions behind damage and defence.
12. Upgrade order with complete legal-state deltas, expected impact, and rollback plan.
13. Current-league availability, known weaknesses, unverified details, and next PoB tests.

Prefer decision rules over rigid shopping lists. Explain what a slot must solve so the guide survives price changes.
