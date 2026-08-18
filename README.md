# Path of Everything

Evidence-first tools for Path of Exile.

Path of Everything is an experimental, public toolkit for deterministic build
calculation, build auditing, trade research, poe.ninja analysis, and
version-scoped facts. Its goal is to let agents call tested tools instead of
repeating arithmetic or re-researching already verified claims.

## Design principles

- Calculations belong in deterministic tools, not language-model arithmetic.
- Every result states its patch, data snapshot, assumptions, and warnings.
- Current market observations are timestamped snapshots, not permanent facts.
- Skills stay thin and call the same CLI services exposed through MCP.
- Private characters, credentials, local Wiki data, and personal facts stay local.

## Planned components

```text
skills/          Agent workflows for audit, planning, and poe.ninja research
packages/        CLI, MCP adapter, connectors, and facts index
vendor/pob-mcp/  Pinned upstream PoB headless bridge
facts/           Reviewed, patch-scoped public facts
cases/           Sanitized public regression cases
fixtures/        Test inputs with explicit publication approval
schemas/         Machine-readable contracts
scripts/         Setup, update, validation, and upstream sync commands
```

## Status

The compact headless Path of Building workflow is available as an MVP. It calls
an unmodified Path of Building checkout through the vendored Lua bridge and
returns one small JSON object instead of the full calculation graph.

For mechanism work, the CLI also exposes a schema-owned full calculation
snapshot. It preserves the compact fields and adds build inputs, skills, items,
tree, selected PoB output tables, limits, and warnings:

```bash
POB_PATH=/path/to/PathOfBuilding \
POB_CMD=luajit \
npm run pob:full -- --build build.xml --socket-group 1 --active-skill 1
```

The same selection and scenario can be kept in an editable JSON input file:

```bash
POB_PATH=/path/to/PathOfBuilding \
npm run pob:full -- --input calculation-input.json
```

`schemas/pob-calculation-input.schema.json` and
`schemas/pob-calculation-output.schema.json` define the input/output contract.
The output's `calculation.mainOutput` is a bounded, JSON-safe diagnostic view;
its fields may vary with the pinned PoB version. Reusable mechanism questions
live in `packages/cli/src/validation-cases.mjs`, so SRS, Animate Guardian,
Stormblast, support eligibility, conversion, triggers, and resource loops all
consume the same exported calculation state.

Prerequisites are Node.js 20+, LuaJIT, and a stock
[`PathOfBuilding`](https://github.com/PathOfBuildingCommunity/PathOfBuilding)
checkout. No PoB source patch is required.

The CLI includes the small Lua compatibility layer required by stock PoB when
the selected standalone LuaJIT does not provide `lua-utf8`.

```bash
POB_PATH=/path/to/PathOfBuilding \
POB_CMD=luajit \
npm run pob:compact -- --build example.xml \
  --socket-group 1 --active-skill 1
```

PoB's desktop Import/Export tab accepts a `pobb.in` link directly. For
headless use, Path of Everything provides the equivalent URL input; it fetches
the raw export, decodes it, and only sends XML to PoB:

```bash
POB_PATH=/path/to/PathOfBuilding \
npm run pob:compact -- \
  --build-url https://pobb.in/<id> \
  --enemy-boss pinnacle
```

The URL is not included in the compact JSON output. The decoded XML stays in
memory unless the caller explicitly saves it.

For a blank level 20 gem calculation:

```bash
POB_PATH=/path/to/PathOfBuilding \
npm run pob:compact -- --new-skill "Summon Raging Spirit" --gem-level 20
```

Minion builds may also specify `--skill-part`, `--minion-skill`, and
`--minion-item-set`. The output explicitly warns that configured PoB states do
not prove real uptime. Calculations default to a Guardian/Pinnacle boss for a
stable comparison baseline; use `--enemy-boss saved` to preserve the build's
saved setting, or choose `none`, `standard`, or `uber` explicitly.

## Agent skills

The versioned PoE audit, planning, and poe.ninja classification skills live in
`skills/`. Their shared PoB-first, seasonal-update, factsheet, and privacy
contract is `docs/agent-runtime.md`. Install or update the required skill folder
in the agent's skill directory; keep this repository as the source of truth.

## Privacy

Do not commit character exports, account identifiers, trade-session cookies,
local caches, personal Wiki content, or unreviewed snapshots. Run:

```bash
npm run check:privacy
```

Only sanitized fixtures under `fixtures/public/` may contain a Path of Building
XML export.

## License

Path of Everything is licensed under GPL-3.0-only. Vendored projects retain
their original copyright notices and licenses.
