---
name: poe-patch-brief
description: Turn Path of Exile 1 expansion patch notes into a Traditional Chinese quick-reading page with evidence-backed version directions, contextual buff/nerf judgments, numeric comparisons, and full source coverage. Use for PN simplification or testing this workflow on another patch; use build-specific skills for individual character advice.
---

# PoE patch brief

Produce a page that helps someone finish reading a PN: version directions first, then compact official-chapter rows. Treat mechanics as reasoning work. Parsing, validation and rendering are deterministic; direction and significance are LLM judgments.

## Source and scope

Confirm the exact game/version, official full expansion post, snapshot and base-patch scope. Retrieve the main post rather than comments, teasers or a subsequent hotfix. Retain HTML and source URL; English is authoritative for missing translated sections. Historical versions must use their historical PN; current PoEDB names are navigation aids, not proof of historical mechanics.

Run `python3 scripts/extract.py official.html --version 3.28 --url OFFICIAL_URL --out source.json`. Requires Python 3 and BeautifulSoup4. Inspect chapter counts, text, child lists, links and images. Revision records may be embedded under Bug Fixes rather than a separate heading: stop main-text extraction at dated Updates markers, retain them in revision_log, and exclude withdrawn/superseded text from the reading layer. Tie analysis to source_sha256 so changed snapshots cannot silently reuse old judgments. Stop on missing main post/version or unhandled prose. The extractor omits the revision-history section because the updated main text is the selected snapshot; record another scope if requested.

Read [analysis.md](references/analysis.md) for the exact data contract and judgment traps before authoring `analysis.json`.

## Read, reason, then condense

1. Read every node in `source.json` with its parent context. Author concise changes, one independently understandable outcome per change; group related nodes into one named entity, retaining each change's evidence IDs. Keep official sections distinct. Cover administrative/cosmetic changes in specific named groups; do not bury gameplay exceptions in a miscellaneous bucket.
2. Compare bases before calculating: same level, quality, stacks, target and delivery. For ranges use the mean only for damage distributions; never average across gem levels or item roll tiers. Separate a stat's relative change from effective damage, uptime, resource demand, or survival. Compute explicit scenarios where multiple modifiers interact.
3. Search across sections for the same entity and mechanic, including bug fixes, item changes and passive trees. Add `related` entry IDs and a concrete cross-section consequence. A good single-section summary can still miss the actual build outcome.
4. Derive a small number of version directions from the completed entries. Each direction needs supporting entry IDs, explicit/inferred status, representative before/after evidence and relevant exceptions. Name the beneficiaries by mechanic or delivery when that explains the evidence; do not reuse another version's elemental categories. Put changes that remove a strategy or alter progression above trivial stat edits. A direction is a falsifiable synthesis, not a count of green labels.
5. Render `analysis.json` into an offline-capable page. The reading layer contains entity, compact old→new changes and necessary combined conclusion. Raw English, derivation, source links, secondary navigation and duplicate summaries belong in disclosure. Keep old-item behavior beside the affected item. If an existing PoEDB name→URL index is available, pass it with `render.py --catalog index.json` for exact-name links; otherwise expose the named search link. Do not guess variant URLs from a base-skill match. Use semantic color only for attribute/direction; no card wrappers, decorative icon grids, promotional hero or disclaimer prose. Inspect mobile and desktop and test filtering, disclosures and source links.

For a long PN, analysis can be partitioned by official chapters when agent work is authorized; give each partition the same schema, then have one owner perform cross-chapter synthesis. Never use a keyword classifier as the decision-maker or let workers invent different metric conventions.

## Verify and iterate

Run `python3 scripts/verify.py source.json analysis.json` and `python3 scripts/render.py source.json analysis.json --out dist`. Automated coverage proves source mapping, not semantic correctness. Manually review every complex judgment and each proposed direction against original text; audit common-regime summaries for counterexamples. Record observed failures and narrow workflow fixes in the task's evaluation artifact, not in global memory.

For forward testing, give an independent agent the skill and a different version's raw sources, without the intended directions or judgments. Compare its output against that version's PN and the reading goal. Correct demonstrated failures in the skill, rerun affected checks, then complete both requested artifacts. Syntax validation alone is insufficient.

Deliver the runnable artifacts and the validated skill location. Publish only within the task's existing website authorization, using that hosting workflow; this skill itself grants no permission to send messages, create schedules, alter Wiki memory or expose private sources.
