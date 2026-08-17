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

The repository is being bootstrapped. The first milestone is a compact,
headless Path of Building workflow that can load a build, select the correct
skill and minion item set, calculate stats, and compare legal scenarios.

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
