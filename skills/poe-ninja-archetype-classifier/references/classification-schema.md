# Classification record

Use one record per proposed archetype.

```yaml
snapshot:
  game: poe1
  league: Mirage
  ladder: Experience
  time_machine: week-1
  total_characters: 0
  observed_at: YYYY-MM-DD
archetype:
  label: "Main Skill | Delivery | Ascendancy | Enabler"
  main_skill: ""
  delivery: normal | trigger | totem | mine | trap | minion | warcry-proxy | hybrid
  damage_engine: hit | ignite | poison | bleed | dot | minion | corpse | retaliation | hybrid
  ascendancy: ""
  second_ascendancy: ""
  defining_items: []
  defining_keystones: []
measurement:
  filtered_characters: 0
  share_percent: 0
  mutually_exclusive_with: []
evidence:
  representative_urls: []
  supporting_signals: []
  contradicting_signals: []
confidence: high | medium | low
prediction_context:
  creator_mentions: 0
  consensus: none | weak | moderate | strong
  predicted_roles: []
  prediction_sources: []
notes: ""
```

## Minimum viable classification

A report may classify at skill-family level when cross-filter counts are unavailable, but label it `skill family`, use low confidence, and do not claim mutually exclusive market share.

## Boundary cases

- Treat a movement or utility six-link as auxiliary when the character's damage is clearly elsewhere.
- Separate transfigured gems when their mechanics change delivery or scaling.
- Do not infer self-cast from `Normal`; it means only that poe.ninja did not classify the main link as Totem, Mine, or Trap.
- Treat General's Cry and similar proxy attacks as delivery engines, not ordinary self-attacks.
- Identify aurabots, cursebots, and other support characters separately; their listed main skill may not describe their party role.
