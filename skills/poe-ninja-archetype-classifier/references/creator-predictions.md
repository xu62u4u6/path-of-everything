# Creator prediction research

Use creator material to generate candidates and explain expectations. Do not use it as a substitute for poe.ninja population or verified mechanics.

## Source order

Prefer:

1. Original video, stream VOD, post, spreadsheet, or published PoB.
2. Creator-maintained guide or profile.
3. Timestamped clip preserving the full claim.
4. Community transcription or tier-list image only when the original is unavailable.

Record whether the source appeared before or after final gem numbers, patch-note corrections, or launch. A prediction made before final data is a different evidence class.

## Seed creator set

Refresh identities and active channels every league. Useful initial searches include:

- Taiwan Traditional Chinese:
  - `惡魔貓貓貓` — canonical Twitch handle `devilcatwith2cat`; `惡魔貓` is a common short alias.
  - `一花枝` — canonical Twitch handle `1hoeji`; Bahamut author handle `adam5555` is a corroborating identity.
- International English:
  - `Jungroan` — canonical Twitch handle `jungroan`; `鄭榮` is a Chinese community phonetic alias, not the channel name.
  - `Fubgun` — canonical Twitch handle `fubgun` and YouTube display name `Fubgun`; `Fungun` is a common misspelling and `Fub Gun` is only a search variant.

These are discovery seeds, not a permanent authority list. Add creators whose expertise matches the content, such as Hardcore, SSF, racing, minions, bows, bossing, or economy. Preserve the user's spelling as an alias until the channel identity is verified.

Reverify the identity from an original channel or creator-maintained page before each league's extraction. Do not assume that a search-result display name, translated name, mirror upload, or similarly named account is the same creator. Record both `display_name` and the platform-specific handle so later audits can reproduce the match.

## Extraction record

```yaml
creator:
  display_name: ""
  verified_channel: ""
  region_language: ""
source:
  url: ""
  published_at: YYYY-MM-DD
  captured_at: YYYY-MM-DD
  patch: ""
  timing: pre-final-numbers | post-patch-notes | post-final-numbers | post-launch
prediction:
  archetype: "Skill | Delivery or Engine | Ascendancy | Enabler"
  rank: S | A | B | C | D | recommended | avoid | unranked
  intended_mode: trade-sc | trade-hc | ssf-sc | ssf-hc | unknown
  intended_job: []
  personally_tested: yes | no | unclear
  stated_constraints: []
  confidence: high | medium | low
outcome:
  day_1_share: null
  week_1_share: null
  observed_strength: confirmed | partial | contradicted | not-measurable
  notes: ""
```

## Consensus rules

- Strong: at least three independent creators recommend the same normalized archetype for the same mode and role, with no material contradiction.
- Moderate: two independent creators agree, or three agree but target different roles or modes.
- Weak: one recommendation plus indirect support, or agreement based on a shared untested source.
- None: isolated prediction, conflicting recommendations, or incomparable modes.

Do not count collaborations, reaction videos, and copied tier lists as independent votes. Track creator specialization and audience influence separately from mechanical confidence; a popular recommendation can increase market prices and ladder population without proving the build is stronger.

## Retrospective comparison

Compare predictions with Day 1 and Week 1 using four outcomes:

- Confirmed: the exact archetype appears materially and its observed package matches the prediction.
- Partial: the skill appears, but the winning ascendancy, delivery, or enabler differs.
- Contradicted: the predicted package is absent or clearly displaced by another variant.
- Not measurable: ladder cutoff, private profiles, support role, late transition, or missing snapshot prevents a fair test.

Report prediction accuracy descriptively unless the same rubric and complete source set were used across multiple leagues. Do not publish a creator leaderboard from cherry-picked predictions.
