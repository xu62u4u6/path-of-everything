# Batch upgrade price checks

Use `scripts/batch_price_checks.py` after preparing exact item requirements.
It reads a private JSON watchlist, groups poe.ninja requests by category, caches
responses for ten minutes, attempts official instant-buyout queries sequentially,
and fetches the lowest five listings (ten for `ghastly` or `caspiro`). It stops
further official requests after a 403/429 instead of retrying each item. Raw
responses, retrieval times, exact queries and compact reports remain local.
No authentication cookies, purchases or installs are performed.

```bash
python3 scripts/batch_price_checks.py --manifest /private/watchlist.json \
  --output /private/price-check
# Reproduce the report without network access:
python3 scripts/batch_price_checks.py --manifest /private/watchlist.json \
  --output /private/price-check --offline
```

`--refresh` bypasses the ten-minute cache. Do not use it to retry an access
block. Source timestamps remain separate from report generation time.

Watchlist shape:

```json
{
  "league": "Covens",
  "title": "Upgrade prices",
  "statIdsSource": "Verified official stats URL and retrieval date, or explicitly dated cache",
  "items": [{
    "id": "spectre21",
    "label": "Raise Spectre 21/0",
    "category": "SkillGem",
    "name": "Raise Spectre",
    "gemLevel": 21,
    "gemQuality": 0,
    "coverage": "Exact gem level/quality; reference is not an instant listing",
    "query": {
      "query": {
        "status": {"option": "securable"},
        "type": "Raise Spectre",
        "filters": {"misc_filters": {"filters": {
          "gem_level": {"min": 21, "max": 21},
          "quality": {"min": 0, "max": 0}
        }}}
      },
      "sort": {"price": "asc"}
    }
  }],
  "pendingNonPurchases": ["Confirm remaining ascendancy in game"]
}
```

Use current trade metadata or an explicitly dated local capture for modifier
IDs; never invent them. When live metadata/search is blocked, generated query
links are reproducible but unvalidated; label them accordingly. Omit category
and name for rare-item checks that have no meaningful aggregated market price.
For exchange categories such as Tattoo use `"sourceKind": "exchange"`; current
normalization requires the API primary denomination to be chaos.

The helper only gathers evidence. Read its compact report first, then inspect
all affixes of plausible candidates from `report.json` or the relevant cached
fetch response. It does not certify eligibility, pick the best item, compute
DPS, or solve timeless-jewel seed selection. Do not treat an aggregate unique
price as the price of a required roll, minion variant, or seed. Keep price
references distinct from verified instant buyouts, and keep blocked upgrades
unchecked. Corrupted and uncorrupted gems remain separate reference records.

The output shopping-list links use search IDs when a query succeeds, otherwise
the exact encoded query. The API must validate it before claiming it opens the
intended results. Stop at a reported access block; never request a user's raw
session cookie in chat.
