---
name: poe-ninja-archetype-classifier
description: Classify populations in Path of Exile 1 poe.ninja league snapshots into build archetypes using main skill, delivery mode, ascendancy, core items, and keystones, and compare pre-league creator predictions with observed results. Use for meta-distribution reports, historical Time Machine comparisons, league-starter prediction research, creator consensus and disagreement, peer-cohort construction, or defensible archetype shares with overlap warnings. Use individual characters only as representative samples or when the user explicitly asks for an archetype label. Do not use for a single-character build review, mechanics, DPS or defence, upgrades, resource sustain, or state uptime; use poe-build-audit instead.
---

# Poe Ninja Archetype Classifier

Turn poe.ninja snapshots into reproducible archetype reports. Treat site percentages as overlapping filters, not mutually exclusive build labels.

## Route the request

- Use this skill when the primary unit is a snapshot or cohort and the result requires counts, shares, comparisons, or creator predictions.
- Use `$poe-build-audit` for a named character, profile, or PoB when the user asks how it works, why it fails, how sustainable it is, or what to upgrade.
- For “my character versus the meta,” use this skill only to build the peer cohort; use `$poe-build-audit` to inspect the target character.

## Establish the snapshot

1. Confirm PoE 1, league, ladder, mode, and snapshot label.
2. Use the Builds URL with `timemachine=<label>` and verify the Time machine control shows that label.
3. Record the page's `Found N characters` count and lookup date.
4. Preserve the direct snapshot URL in the report.

Do not silently substitute Latest for a missing historical snapshot. Distinguish Week 1, the snapshot around seven days after launch, from the calendar week before league launch.

### Extract counts from the current Builds search

The poe.ninja Builds frontend may load search results from a versioned internal API whose response is protobuf rather than JSON. Treat that route as an implementation detail that can drift: derive the current version identifier from the Builds page, cache the raw response and dictionaries, and preserve the human-readable Builds URL as the report citation.

When forming an intersection within one dimension, repeat the query parameter, for example `skills=A&skills=B` or `items=A&items=B`. Do not join values with a comma: the API can silently ignore that filter and return the unfiltered total. After every programmatic query, validate that:

- the filtered total is no greater than every corresponding marginal total;
- removing one filter does not reduce the total;
- repeated runs for the same version and time-machine label produce the same total;
- the human-readable page expresses the same filters.

If any invariant fails, keep the cohort unresolved and inspect the current frontend request format before reporting growth.

## Collect pre-league predictions

When evaluating a league start or explaining why an archetype became popular, research creator predictions published after patch notes and before league launch. Read [references/creator-predictions.md](references/creator-predictions.md) and keep predictions separate from observed poe.ninja population.

Use multiple creators across regions and specialties. Record the original publication date, game version, mode, stated rank, exact archetype, evidence link, and whether the creator personally tested it. Do not treat reposted tier-list images, reaction videos, or community summaries as equivalent to the creator's original claim.

Normalize creator labels into the same archetype format used for poe.ninja. Compare consensus, disagreement, and omissions against Day 1 and Week 1 results; never add creator votes to ladder percentages.

Verify creator identity before counting a prediction. Match the display name to at least one stable channel handle or creator-maintained profile, and store aliases separately. Treat localized phonetic names and common misspellings as search hints, not canonical identities. If identity remains ambiguous, exclude the source from consensus and report it as unresolved.

## Collect the coarse distribution

Record:

- ascendancies;
- main skills;
- main-skill modes such as Normal, Totem, Mine, and Trap;
- second ascendancies when the league has them.

Report these as marginal distributions. They overlap and must not be summed into a build total.

## Build archetype candidates

Start from each material main skill, then split it only when a feature changes the gameplay loop or scaling engine:

1. Delivery: self-use, trigger, totem, mine, trap, minion, or warcry proxy.
2. Damage engine: hit, ailment, damage over time, corpse/life scaling, retaliation, or minion damage.
3. Ascendancy: split when it implies a materially different engine or defence package.
4. Enabler: split on a build-defining unique, keystone, weapon type, or item-granted skill.
5. Defence: add as a suffix only when it is central to identity, such as CI or low life.

Name archetypes as `skill | delivery or engine | ascendancy | optional enabler`. Avoid labels based only on a character name or the highest-DPS row.

## Verify each candidate

Filter one candidate at a time and inspect the changed character count plus the relevant sidebar distributions. Open at least three representative characters when available: a typical row, a high-end row, and a boundary case.

When a representative character's embedded PoB must be evaluated to distinguish
its skill part, minion item set, delivery mode, or item-granted engine, route
that bounded check through `$poe-build-audit` and Path of Everything/pob-mcp.
Do not use language-model arithmetic when PoB exposes the state, and do not turn
the check into a damage or defence audit.

Stop representative-character inspection once the classification discriminators are proven. Do not turn the sample inspection into a damage, defence, resource, uptime, or upgrade audit.

For each candidate, record evidence and confidence using [references/classification-schema.md](references/classification-schema.md). Assign:

- High: skill, delivery, ascendancy, and enabler agree; sampled characters are coherent.
- Medium: the engine is clear but one discriminator is missing or mixed.
- Low: inferred mainly from marginal percentages or fewer than three useful characters.

Keep ambiguous characters in `Unresolved or hybrid`; never force totals to 100% by guessing.

## Calculate shares safely

Prefer the filtered `Found N characters` count divided by the unfiltered snapshot count. Use displayed rounded percentages only when counts cannot be obtained, and mark them approximate.

Before summing archetypes, test whether their filters are mutually exclusive. If not, report each share separately or define an explicit precedence order. State the residual unclassified share and rounding error.

## Apply precedence for row-level data

When individual character features are available, assign in this order:

1. Item-granted or proxy skill engine.
2. Trigger, mine, trap, totem, minion, or warcry delivery.
3. Main damaging skill and transfigured variant.
4. Damage engine.
5. Ascendancy and defining enabler.
6. Defence suffix.

If two main damage packages remain active, label the row hybrid unless one is clearly auxiliary.

## Iterate and audit

Maintain a short trial log:

- attempted rule or extraction route;
- observed failure;
- revised rule;
- validation evidence.

Before pruning candidates, build a coverage ledger from every material positive delta in the raw skill distribution:

`candidate | included, excluded, or unresolved | exact intersection | reason`

Every material delta must appear once. Do not discard an item-granted skill merely because it is absent from ordinary gem links; inspect rows and representative characters to determine whether it is the main damage engine, an auxiliary package, or a presentation artifact.

Required failure checks:

- economy Data Dumps do not contain historical character builds;
- virtualized filter lists may expose only visible rows;
- a main-skill percentage is not an archetype percentage;
- comma-separated values in one Builds query dimension can be silently ignored; use repeated query parameters and validate the filtered total;
- ladder cutoff, public-profile selection, survivor bias, and rerolls distort population claims;
- poe.ninja Path of Building configuration does not prove buff uptime.

Stop refining when remaining ambiguity is immaterial to the requested resolution. Report both the useful result and its limits.

At the first snapshot task in a new league, apply the seasonal gate in Path of
Everything's `docs/agent-runtime.md` before trusting league names, imports, or
engine-dependent classifications. Propose reusable, non-private, patch-scoped
classification facts for `facts/`; write them only with explicit authorization.

## Output

Provide:

1. Snapshot scope and sample size.
2. Coarse ascendancy, skill, and delivery distributions.
3. Archetype table with count/share, defining evidence, and confidence.
4. Unresolved or overlapping bucket.
5. Trial log and known biases.
6. Pre-league creator consensus, disagreement, and retrospective outcome when requested.
7. Direct poe.ninja and creator-source links with publication and lookup dates.
