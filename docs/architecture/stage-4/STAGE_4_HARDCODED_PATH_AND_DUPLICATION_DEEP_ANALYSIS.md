# Stage 4 Hardcoded Path and Duplication Deep Analysis

| ID | File/path | Issue | Related source | Severity/blast radius | Planning impact | Action | Blocks Prompt 3 | Blocks edits | Human review |
|---|---|---|---|---|---|---|---|---|---|
| HP-001 | 28 files / 72 route-context occurrences | hardcoded consumers | routes.js/AppRoutes | high/application | migration batches required | classify each occurrence | no | yes | yes |
| HP-002 | nine alias values | same path, different semantic key | routes.js | medium/import graph | canonical key map required | retain aliases initially | no | yes | yes |
| HP-003 | /offers | constant without index declaration | PUBLIC_ROUTES | medium/public | scope uncertain | base-only or index decision | no | yes | yes |
| HP-004 | 34 paths | declaration missing metadata | routeMetadata | critical/access/nav | candidate incomplete | add disposition plan | no | yes | yes |
| HP-005 | /marketplace/service/:serviceId vs slug links | dynamic param semantics | DYNAMIC_ROUTES and consumers | high/public detail | builder cannot be normalized blindly | contract review | yes | yes | yes |
| HP-006 | /profile/:username,/u/:username,/providers/:username | compatibility route family | dynamic constants | high/SEO/inbound | redirect retention plan required | identify canonical and telemetry | no | yes | yes |
| HP-007 | /403,/not-authorized | unauthorized aliases | system constants/pages | medium/UX/security | redirect policy coordination | preserve pending decision | no | yes | yes |
| HP-008 | Auth.jsx/Admin.jsx/RequireRole/AdminGate | apparently unreferenced route logic | active router/guards | high/future reuse | cannot delete or migrate blindly | reachability proof | no | yes | yes |
| HP-009 | metadata-derived nav vs hidden routes | orphan/hidden ambiguity | navigation configs | medium/discoverability | hidden-route ledger | classify intentional hidden | no | yes | yes |
| HP-010 | routeValidation auth prefixes | literals in guard utility | AUTH_ROUTES | high/auth | centralization consumer | preserve semantics | no | yes | no |
| HP-011 | wildcard and explicit NotFound | overlapping 404 surfaces | AppRoutes | high/invalid URLs | order tests required | preserve order | no | yes | no |
| HP-012 | browser and API registries | namespace collision risk | client routes/server registries | critical/system | never merge | separate plans | yes if mixed | yes | yes |
| HP-013 | no duplicate runtime path | positive finding | AppRoutes | low | stable baseline | regression assertion | no | no | no |
| HP-014 | no inconsistent casing/trailing declaration | positive finding | constants/AppRoutes | low | normalization stable | add validation | no | no | no |

Prompt 3 may plan around these issues but may not implement or declare final authority.

