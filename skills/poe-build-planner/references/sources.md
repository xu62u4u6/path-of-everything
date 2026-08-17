# Research Sources and Skepticism Rules

## Roles

- **Official patch notes**: verify changes for the current patch.
- **PoEDB**: verify current item, gem, modifier, passive, tags, allow/exclude rules, tiers, and implementation stats.
- **PoE Wiki**: verify mechanics, formulas, terminology, and version history.
- **poe.ninja builds**: observe real character packages and population; never equate ladder presence with starter viability.
- **poe.ninja economy and official trade**: price current items for the named league and date.
- **PoB Community Fork**: test the assembled build and configuration states.
- **Guides, videos, forums, Reddit**: discover ideas and gameplay reports, then verify material claims elsewhere.

## Required Checks

1. Confirm PoE 1, patch, league, and lookup date.
2. Search patch notes for the main skill, supports, ascendancy, Bloodline, key uniques, and any global mechanic that enables the build.
3. Open PoEDB entries for every core component; do not rely on search snippets.
4. Open PoE Wiki for every non-obvious interaction or formula.
5. Sample multiple poe.ninja characters from the same sub-archetype and inspect their snapshots.
6. Check exact variants: legacy, Replica, Foulborn, mutated, transfigured, corrupted, or alternate-quality items can invalidate a comparison.
7. Price the actual required roll/implicit, not only the base unique.
8. For league-specific gems, items, corpses, crafts, and transformations, verify that the source mechanic is enabled in the named league at the planned date.
9. Classify availability as farmable now, trade-only finite supply, Standard-only, or unavailable. Confirm attainable level/quality and modification limits for Imbued, corrupted, or otherwise special components.

## Skepticism Rules

- A popular build can be expensive, carried by party play, or selected for ladder survival.
- A rare build can be undiscovered, mechanically broken, or simply absent from the ladder cutoff.
- A level 100 character proves that one snapshot existed, not that the leveling path was smooth.
- A PoB configuration proves a modeled scenario, not uptime.
- Tags help discovery but do not by themselves prove support compatibility.
- A trade listing is an asking price, not a sale.
- “Unchanged in patch notes” does not prove the full build is unchanged; dependencies may have changed.
- A database entry or trade listing does not prove that its acquisition mechanic exists in the current league.
- When sources disagree, surface the disagreement and design a PoB or in-game test instead of choosing the convenient answer.

## Official Trade Pricing Workflow

Use this workflow whenever recommending, comparing, or placing a purchasable item in a budget tier:

1. Search the named league and record the lookup date. Price the complete legal item state, including required rolls, variants, implicits, corruption, and special provenance.
2. Default the official trade status to `securable` (**Instant Buyout Only**). Do not use `online` whisper listings to establish the actionable purchase price. If instant supply is empty, say so before widening to `available` or in-person listings.
3. Sort by normalized price ascending and inspect at least the lowest 5 listings, or all listings when fewer than 5 exist. For high-variance items such as Watcher's Eye, rare jewels, clusters, and multi-mod rares, inspect the lowest 10 when practical.
4. Read every modifier on those candidates. Rank the useful rolls and extra modifiers against the planned build's actually active auras, skills, damage types, defences, and unresolved constraints; do not stop at the searched modifiers.
5. Report the instant-buyout floor, the best-value candidate, its exact relevant rolls and extra modifiers, listing count, league/date, and a reproducible official trade link or query. Treat all listings as current asks, not completed sales.
