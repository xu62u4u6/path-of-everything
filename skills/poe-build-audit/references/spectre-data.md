# Compact Spectre Evidence

Use after identifying the actual monster(s) in a Raise Spectre build. Ask for
species, counts and combat/support roles when the current export omits them;
continue independent gear checks while waiting. Resolve translated or informal
names against the English monster page and retain the verified metadata ID.
Do not guess a URL from a translated nickname or treat a matching item page as
a monster.

Run the helper with an exact verified English PoEDB monster URL:

```bash
python3 scripts/fetch_spectre.py \
  --url https://poedb.tw/us/Forged_Frostbearer \
  --output /private/task/spectre.json \
  --save-html /private/task/spectre.html
```

For repeat checks, `--html /private/task/spectre.html` parses an existing
capture without network access. The helper uses existing `beautifulsoup4`;
if unavailable, state the dependency and use a scoped manual read rather than
installing packages without authorization. Only the verified PoEDB host and
English monster route are accepted. Remote Lua and JavaScript are read as
inert data, never executed.

The JSON preserves source URL, retrieval timestamp, HTML hash, monster metadata
ID, eligibility, base multipliers/resistances, the displayed monster level,
and each skill's ID, types, cast/cooldown properties and displayed modifiers.
Read this compact output first; inspect the raw page only for a specific
missing field. A challenge page, missing monster export or absent level is an
error, not a successful empty result. Unrecognized eligibility and missing
skill blocks are explicit warnings.

Keep three layers distinct:

- Monster base data: multipliers, resistances and available skills.
- Page sample: displayed skill values at its selected/default monster level.
- Character model: effective Raise Spectre level, raised-monster level,
  supports, count, buffs and enemy scenario calculated through PoB.

Match by metadata ID and skill ID, then resolve PoB's skill index. Do not assume
that list position is stable between the PoEDB export and installed PoB.
Raw template names/tags need not describe actual damage: inspect the skill's
numeric damage stats. Skill data does not establish AI frequency, mortar
shotgun/overlap, nearby range, buff uptime or current-league corpse acquisition.
Those remain scoped evidence questions, not inferred multipliers.
