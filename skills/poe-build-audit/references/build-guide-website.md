# Reuse the existing build-guide renderer

The website project is the separate `poe-build-guide` checkout, usually a sibling
of this repository. Locate that checkout rather than creating a replacement frontend. Read its
README, `docs/REVERSE_ENGINEERED_REQUIREMENTS.md`, applicable agent instructions
and Git status first. Do not overwrite unrelated edits.

The existing workflow is:

`fresh character model -> PoB XML -> import:pob -> build.generated.json + guide.json -> shared Vue renderer`

Path of Everything is the numerical engine; website generation is a separate
existing program. A new build normally needs data, not a new HTML/CSS template.

```bash
npm run import:pob -- --slug BUILD_SLUG --name 'DISPLAY NAME' \
  --pob-url /absolute/private/snapshot.xml \
  --pob-path /absolute/PathOfBuilding --icon-league LEAGUE
BUILD_SLUG=BUILD_SLUG npm run build
```

The importer also accepts a public `https://pobb.in/<id>` link. Do not upload a
private character export to obtain a link. Inspect scripts before execution;
use an isolated copy of the same renderer when preserving the original
checkout or keeping private build data out of its source tree. Reuse existing
dependencies without installing packages. Do not copy/rewrite Vue components
or CSS as a substitute for importing data.

Data ownership:

- `build.generated.json`: imported facts; refreshed by importer.
- `guide.json`: authored explanation; importer only creates a missing draft.
- `scenarios.json` -> `npm run scenarios -- BUILD_SLUG` ->
  `numbers.generated.json`: calculated values. Guide prose references these
  using `{{pob:<run>.<minion|player>.<Key>[:decimals]}}`.

At this verification, the importer pins tree version 3_29. Check the live
script and input tree version; do not describe that as current-patch mechanic
support. Unsupported seasonal systems, missing item/socket details, spectre
species/count and snapshot time need source-backed handling or explicit gaps.
A successful import does not establish DPS, skill overlap, AI uptime or prices.

For clusters, use the existing `scripts/pob-export-layout.lua` in a disposable
PoB copy, following the README. Pass `--pob-layout-file`; its XML hash must match
the exact imported XML. Never invent synthetic-node coordinates. Local tree
and sprite files may be supplied with `--tree-file` / `--sprites-file`; verify
they match the pinned version.

Build validates every fixture. Run the default build and selected build when
editing shared components, including AG regression coverage. Inspect desktop
and mobile screenshots and exercise tabs, gear, tree selection/cancellation,
zoom, masteries and overflow. Keep local previews on verified Tailscale or
loopback; separate host checks from unverified Mac/physical-phone behavior.
Publishing or pushing requires the applicable user authorization.
