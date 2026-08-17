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

Prerequisites are Node.js 20+, LuaJIT, and a stock
[`PathOfBuilding`](https://github.com/PathOfBuildingCommunity/PathOfBuilding)
checkout. No PoB source patch is required.

```bash
POB_PATH=/path/to/PathOfBuilding \
POB_CMD=luajit \
npm run pob:compact -- --build example.xml \
  --socket-group 1 --active-skill 1
```

For a blank level 20 gem calculation:

```bash
POB_PATH=/path/to/PathOfBuilding \
npm run pob:compact -- --new-skill "Summon Raging Spirit" --gem-level 20
```

Minion builds may also specify `--skill-part`, `--minion-skill`, and
`--minion-item-set`. The output explicitly warns that configured PoB states do
not prove real uptime.

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
