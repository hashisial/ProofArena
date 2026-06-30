# Stage 4.1 Route Source-of-Truth Candidate Analysis

| Candidate ID | File | Current role | Coverage | Router | Navigation | Guards | Redirects | Conflicts/gaps | Strengths | Weaknesses | Migration risk | Recommended status | Human review |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C-001 | `client/src/constants/routes.js` | grouped paths, aliases, builders, facade | public/auth/dashboard/admin/role/dynamic/system | yes | yes indirectly/directly | yes | yes | 9 aliases; `/offers` undeclared; hardcoded alternatives | all declared non-wildcard paths represented; widespread reuse | compatibility facade and aliases complicate canonical key selection | high | primary source-of-truth candidate, not final | yes |
| C-002 | `client/src/routes/AppRoutes.jsx` | runtime declaration tree | all 108 browser leaves, layouts/guards/fallback | yes | no | nesting authority | wildcard/system pages | paths resolved from C-001; metadata gaps | sole runtime tree; no duplicate declarations | component/guard composition, not ideal constants owner | critical behavior risk | supporting runtime declaration authority | yes |
| C-003 | `client/src/config/routeMetadata.js` | IDs, labels, roles, visibility, policy metadata | 73 routes | indirect | primary config input | layout/access policy | fallback helpers | omits 34 declarations | unique records; drives nav and policy | incomplete; cannot be sole route authority yet | critical | supporting policy source | yes |
| C-004 | `client/src/constants/navigation.js` + config navigation files | navigation registry | 42 unique enabled destinations | no | yes | access filtering | no | route subset only; local compatibility literal | configured links all resolve | not a route declaration source | medium | navigation-only supporting source | no |
| C-005 | `client/src/utils/accessPolicy.js` | auth/role/fallback decisions | protected metadata routes | no | filter | yes | yes | depends on incomplete metadata | coherent central policy | cannot establish path existence | high | guard/redirect supporting source | yes |
| C-006 | `client/src/utils/routeValidation.js` and `routeMetadata.js` | group/known/fallback helpers | metadata plus prefix fallbacks | no | breadcrumbs | yes | yes | two hardcoded auth prefixes; metadata gaps | reusable validation | overlapping policy functions | high | supporting source needing reconciliation | yes |
| C-007 | `ROUTE_MAP.md` / `NAVIGATION_SYSTEM.md` | historical documentation | broad | no | no | no | no | can lag runtime | useful intent/compatibility notes | not executable evidence | medium | supporting documentation only | no |
| C-008 | Server `API_ROUTE_REGISTRY` / `V1_ROUTE_REGISTRY` | API route mounts | backend API only | no browser | no | server middleware | API 404 | overlapping `/api` and `/api/v1` domain | explicit API registries | wrong domain for browser governance | critical if merged | excluded supporting API authority | yes |

## Candidate Decision

`client/src/constants/routes.js` is the strongest **candidate** because every non-wildcard declared browser path is represented and the router, navigation, guards, metadata, and redirects already import it. It is not finally locked in Prompt 1. Prompt 2 must reconcile aliases, stale `/offers`, metadata omissions, hardcoded consumers, dynamic parameter semantics, and test requirements first.

