# Current-Data Sources

Treat PoE data as versioned. Record patch, league, page URL, and lookup date.

## Source Roles

1. **Official Path of Exile patch notes**: changes and authoritative wording when present.
2. **PoEDB**: current item, gem, passive, modifier, stat IDs, tiers, and hidden implementation fields.
3. **PoE Wiki**: mechanic explanations, formulas, interactions, and version history.
4. **poe.ninja**: observed characters, embedded PoB models, ladder statistics, and economy snapshots.
5. **Official trade**: current listings and rare-item feasibility; listings are asks, not completed sales.
6. **PoB Community Fork**: calculation model and configuration experiments; check support status and version.
7. **Forums/Reddit/videos**: leads and empirical reports only; reproduce or corroborate material claims.

## Verification Rules

- Search the current patch notes for the main skill and all enabling items, supports, ascendancies, and global mechanics.
- For every league-specific item, gem, corpse, craft, or transformation, verify that its acquisition mechanic is enabled in the named league on the snapshot date. Check current patch/league announcements and observed current-league supply; a current database entry alone is insufficient.
- Distinguish currently farmable, currently tradeable from finite migrated supply, Standard-only, and unavailable. Never describe trade presence as proof that the source mechanic is active.
- Prefer exact item/gem text from the character snapshot when legacy, Foulborn, mutated, corrupted, or pre-change variants may exist.
- Verify attainable level, quality, corruption state, and further modification limits before proposing a replacement for an Imbued or otherwise special gem.
- Check stat semantics in PoEDB when shrine effect, buff effect, rounding, caps, or hidden allow/exclude rules matter.
- Use PoE Wiki version history to detect stale explanations.
- Do not cite a search result snippet when the underlying page can be opened.
- If PoEDB and Wiki disagree, inspect patch notes and game data, state the conflict, and avoid false certainty.

## poe.ninja Character Endpoints

The bundled script uses endpoints observed on 2026-07-16:

```text
/poe1/api/profile/characters/{account-slug}/0
/poe1/api/profile/characters/{account-slug}/{league}/{character}/model/0
```

These are not a promised public API. If they fail, inspect the current profile page's JavaScript assets for the route used by `ProfileListPage` or the character model hook. Do not keep retrying invented URL variants.

## Official Trade Pricing Workflow

Use this workflow whenever recommending, comparing, or adding a purchasable item to an upgrade list:

1. Search the named league and record the lookup date. Price the complete legal item state, including required rolls, variants, implicits, corruption, and special provenance.
2. Default the official trade status to `securable` (**Instant Buyout Only**). Do not use `online` whisper listings to establish the actionable purchase price. If instant supply is empty, say so before widening to `available` or in-person listings.
3. Sort by normalized price ascending and inspect at least the lowest 5 listings, or all listings when fewer than 5 exist. For high-variance items such as Watcher's Eye, rare jewels, clusters, and multi-mod rares, inspect the lowest 10 when practical.
4. Read every modifier on those candidates. Rank the useful rolls and extra modifiers against the current build's actually active auras, skills, damage types, defences, and unresolved constraints; do not stop at the two searched modifiers.
5. Report the instant-buyout floor, the best-value candidate, its exact relevant rolls and extra modifiers, listing count, league/date, and a reproducible official trade link or query. Treat all listings as current asks, not completed sales.
