# Incident log fixtures

Point the loader at one of these instead of the live dataset:

```bash
INCIDENT_DATA_URL="file://$PWD/lib/__fixtures__/incidents-edge-cases.json" pnpm build
```

## `incidents-edge-cases.json`

Derived from the real dataset, then mutated to exercise every path the live
data does **not**. Several fields in the log are populated in zero of the
current entries, so without this file they would first render in production,
without warning.

| Entry                          | Covers                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------- |
| `asana-mcp-cross-tenant-…`     | `aiid_incident`, `helio_pack` and `sources[].archive_url` all populated (0/7 live); an invented `reversible` value |
| `flowise-custom-mcp-rce-…`     | **no `control`** with verdict `unclear` — schema-legal, absent from live data; **empty `tools`**, legal on `infrastructure` since Aug 2026 |
| `litellm-supply-chain-…`       | `surface: browser_agent` — the one surface value with no live coverage        |
| `tanstack-npm-supply-chain-…`  | Invented `surface`, `tools`, `root_cause` and verdict values — schema drift   |
| `pocketos-production-…`        | `agent_stack` with both `framework` and `model`; legacy boolean `reversible: true` |
| `openclaw-inbox-deletion-…`    | `agent_stack` with `framework` only; **`reversible: "unclear"`**              |
| `lobstar-agent-token-…`        | `organization: "not disclosed"` — a real value, not an empty state            |

`reversible` is deliberately **mixed** across the file: strings on three entries,
booleans on the rest. Upstream changed the field from a boolean to a
`yes`/`no`/`unclear` string in August 2026, and this site deploys separately
from the data repo, so both encodings have to load. Do not tidy this into one
shape — the mixture is the test. Note also that `"unclear"` is truthy, so any
code doing `incident.reversible ? …` will pass a boolean-only fixture and still
report an unknown as a confident "Yes".

The fourth row is the important one. The log added two controlled-vocabulary
values in a single day during drafting, so a build against this fixture must
**succeed**, with the invented values appearing in the filter facets on their
own. If it ever fails, something has hardcoded a vocabulary that should have
stayed open.

Failure fixtures are deliberately not committed — they are one-line mutations
(empty `incidents`, `count` mismatch, a missing required field) and the loader's
error message names the entry and field in each case.
