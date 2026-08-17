# Architecture

Path of Everything uses one repository so tool schemas, skills, facts, and
regression fixtures can be released and tested together.

## Boundaries

1. The CLI is the source of truth for deterministic behavior.
2. MCP is a thin adapter over the same services and returns compact JSON by default.
3. Skills define research and audit workflows without duplicating calculations.
4. Facts are reviewed, version-scoped records compiled into a searchable index.
5. Raw snapshots and private overlays live outside the repository.

## Data flow

```text
source or build
  -> immutable local artifact
  -> normalized model
  -> deterministic calculation
  -> validation and warnings
  -> compact result
  -> optional reviewed fact or sanitized case
```

## Upstream policy

The Path of Building runtime remains a pinned stock checkout. The MCP bridge is
imported under `vendor/pob-mcp/`, with its upstream commit recorded in a lock
file. Local changes require regression fixtures and must remain syncable with
upstream.

## Token budget

The public MCP surface should expose a small number of high-level tools rather
than every internal operation. Raw XML, complete item data, and calculation
breakdowns are written as artifacts and returned only when explicitly requested.
