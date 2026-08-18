# Agent Runtime

Use Path of Everything as the first calculation layer for PoE skills. Keep
research and audit judgement in the skill; keep arithmetic and PoB state
evaluation in the CLI or vendored pob-mcp bridge.

## Resolve the runtime

Prefer `PATH_OF_EVERYTHING_ROOT`. Otherwise locate a checkout containing both
`package.json` and `vendor/pob-mcp/`. Require `POB_PATH` to point to a current
stock Path of Building checkout and use `POB_CMD` when `luajit` is not on PATH.
Do not clone, pull, install, or update dependencies without authorization.

## Calculation priority

1. Preserve the source PoB XML as a private local artifact.
2. Use `npm run pob:compact` first for gem base values, build outputs, skill
   parts, minion subskills, Animate Guardian item sets, and boss scenarios.
3. State `--enemy-boss` explicitly for reported comparisons. Use `pinnacle` as
   the stable default, `uber` only for an explicit Uber scenario, and `saved`
   only when auditing the author's saved configuration.
4. If the compact command lacks a required mutation or output, query the
   vendored pob-mcp bridge capabilities and use PoB's calculation graph. Do not
   replace an available PoB operation with language-model arithmetic.
5. If PoB fails, capture the command and exact error, then check input identity,
   selected weapon/item set, socket group, active skill, skill part, minion
   skill, configuration, and engine patch before inspecting source code.
6. Use source extraction or manual calculation only when PoB cannot represent
   the mechanic. Label the result and the unsupported PoB boundary.

PoB desktop can accept a `https://pobb.in/<id>` link directly in its
Import/Export tab. The headless bridge accepts XML, so use Path of Everything's
URL input to perform the same import without printing the character export:

```bash
POB_PATH=/path/to/PathOfBuilding \
npm run pob:compact -- \
  --build-url https://pobb.in/<id> \
  --enemy-boss pinnacle
```

The CLI resolves the link to `https://pobb.in/pob/<id>`, decodes the URL-safe
base64/zlib payload, and sends the resulting XML through `load_build_xml`.
Keep the decoded XML in a private temporary path when a reusable artifact is
needed; do not commit a character export.

Example:

```bash
cd "$PATH_OF_EVERYTHING_ROOT"
POB_PATH=/path/to/PathOfBuilding \
npm run pob:compact -- \
  --build /private/path/build.xml \
  --socket-group 6 --active-skill 1 \
  --minion-skill 2 --minion-item-set 2 \
  --enemy-boss pinnacle
```

PoB configuration proves a calculated state, not its real uptime, AI behavior,
targeting, availability, price, or legality. Continue applying the skill's
existing state ledger, defensive priority, behavioral verification, and
complete-legal-state checks.

## Seasonal gate

At the first task for a new league or when the engine reports an older patch:

1. Verify the live PoE patch and league from current sources.
2. Compare them with the compact output's engine version and
   `upstream/path-of-building.lock.json` plus `upstream/pob-mcp.lock.json`.
3. With authorization, update the stock PoB checkout first. Update the vendored
   pob-mcp only when bridge compatibility or required capabilities changed.
4. Run `npm run test:pob` against the updated checkout and `npm test`.
5. Recheck league names, poe.ninja import, trade behavior, transfigured gems,
   special acquisition, boss presets, and representative minion calculations.
6. Mark stale facts superseded or invalidated; never silently rewrite their
   historical patch scope.

## Factsheets

When a result is reusable, non-private, version-scoped, and reproducible,
propose a fact under `facts/`. Write it only when the user authorized durable
recording. Follow `schemas/fact.schema.json` and include the patch, league when
relevant, method, verification time, PoB commit for headless results, sources,
status, and reproduction notes.

Do not publish account names, character names, raw builds, private Wiki data,
session credentials, or current prices as timeless facts. Character-specific
results belong only in an explicitly approved sanitized case. Run
`npm run check:privacy` after editing facts.
