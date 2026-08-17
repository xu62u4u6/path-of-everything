# Facts

Facts are reviewed, patch-scoped claims with reproducible evidence. YAML files
are the human-reviewable source of truth; generated indexes are build artifacts.

Do not store live prices as timeless facts. Store the query, league, observation
time, listing scope, and expiration policy. Character-specific calculations
belong in sanitized `cases/`, not in general facts.
