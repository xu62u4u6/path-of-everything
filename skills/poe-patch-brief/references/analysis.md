# Analysis data contract

`analysis.json` is one object:

```json
{
  "version":"3.28",
  "source_sha256":"copy the exact source.json sha256",
  "title":"幻境",
  "sections":{"s01":"幻境賽季"},
  "directions":[{
    "title":"具體改版方向",
    "status":"inferred",
    "summary":"改變什麼、誰受益、代價或例外",
    "supports":["e001","e002"],
    "exceptions":["e003"]
  }],
  "entries":[{
    "id":"e001","section":"s01","name":"實體或機制",
    "verdict":"up","importance":"major",
    "changes":[{"text":"1 級半徑 1.6 → 1.8 公尺；20 級不變","source_ids":["s01-001"],"metrics":[{"label":"1 級半徑","old":1.6,"new":1.8,"unit":"公尺"}]}],
    "conclusion":"僅在需要合併影響或解釋條件時填寫，避免重複 changes",
    "reason":"具體推導與缺少哪個數據如何影響結論",
    "legacy":"官方明示的自動套用／神聖石可更新／保留舊版；無關時空字串",
    "related":["e002"]
  }]
}
```

- `sections` must translate all source section IDs. `entries` can cover many sources if the changes remain inspectable. Every source node is assigned to at least one `changes[].source_ids`; child-list heading IDs are attached to the relevant grouped entity, not discarded. A source's full original is exposed beside its analysis.
- Verdict: `up`, `down`, `mixed`, `rework`, `new`, `fix`, `neutral`. `mixed` needs genuinely different outcomes or a concrete benefit/cost, not merely one number up and another down. Put the decisive tradeoff in visible `conclusion`; hiding it only in `reason` fails the reading goal. Likewise, if the headline direction conflicts with an individual number (Storm Brand, Spellbreaker), the combined result belongs in the reading layer. `importance`: `major` (strategy/progression/system impact), `normal`, `minor` (wording/cosmetic). Importance is editorial, not population usage unless measured.
- Metrics optional. Only extract values you have read and verified. `old`/`new` numeric; for newly introduced/unbounded properties use null with `old_text`/`new_text`. Never turn null into zero. Use a 100→125 cost index only if labeled as an index. Prefer one or two meaningful comparisons over every available number. Derive ratios in reason if they combine independent changes. Show % change versus percentage-point changes distinctly.
- Direction `status`: `explicit` only where official narrative actually states that direction; otherwise `inferred`. Supports point to independently meaningful entries; source references inherited through entries. Exceptions are evidence that bounds the claim; do not invent opposition just to fill this array. Avoid duplicate directions explaining the same change twice.
- Keep facts and predictions distinguishable by wording: "原文把 X 改為 Y" vs "因此在 Z 條件下可省下一個輔助". Never write generic non-responsibility disclaimers.

# Judgment traps worth testing

- Level range is not a damage roll: 1.6–1.8 radius across levels becoming 1.8 helps leveling only.
- Less damage 62%→44% changes the multiplier .38→.56, +47.37% per hit, before projectile count/attack-time tradeoffs.
- Faster interval plus fewer projectiles must combine: `(3/.8)/(4/1)-1 = -6.25%`; quality 1.15/1.10 yields about -1.99%.
- Flat damage taken becoming more negative improves that mitigation; negative denominators cannot be interpreted as ordinary growth percentages.
- A global proc cap, cooldown or higher resource cost can dominate a gem buff. Self-cast speed does not automatically accelerate triggers.
- A DoT buff plus hit nerf must name the build distinction; a life-to-damage build can lose damage when "more life" becomes "less damage taken".
- Legacy: new modifier additions, base changes and roll changes can have different upgrade rules on the same item. Retain each rule.
- A bug fix can nerf a strategy. Link it from the affected entity even if it remains in the official bug-fix chapter.
- Missing detail in a translation is a retrieval task. Inspect linked official English images/tables rather than declaring the mechanic unknowable while evidence is available.

# Lessons verified on 3.28

- Preserve denominators and exact conditions: "gain 80% of physical as extra lightning" needs physical, and "against branded enemy" must not acquire a nearby condition from another skill.
- Grouping multiple changes must still expose losses: a claw with more ES and leech but removed block is a tradeoff; higher variance / removed guaranteed item levels is not identical to globally lowered item levels.
- Reusable rewards need more than first-use probability. At maximum roll, .5 probability of .4 nonconsumption gives .5 + .5/(1-.4)=1.333 uses; guaranteed .2 nonconsumption gives 1/(1-.2)=1.25.
- Check an alleged mixed outcome against actual mechanics: a shorter Impale and lower extra-hit probability on Woespike provide no stated ordinary-Impale benefit. Mark the ordinary use down, rather than inventing an expiry reward.
