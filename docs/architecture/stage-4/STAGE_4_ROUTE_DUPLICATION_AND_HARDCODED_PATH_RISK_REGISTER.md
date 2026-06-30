# Stage 4 Route Duplication and Hardcoded Path Risk Register

| Risk ID | Title | File/system | Route/path | Type | Severity | Likelihood | Blast radius | Evidence | Required action | Blocks centralization | Blocks production edits | Human review |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RR-001 | Metadata coverage gap | `config/routeMetadata.js` | 34 declared routes | missing policy metadata | critical | certain | guards/nav/breadcrumbs | 108 declarations vs 73 metadata | classify every missing route | yes | yes | yes for roles |
| RR-002 | Hardcoded route-context literals | 28 client files | 32 unique literals/72 occurrences | hardcoded paths | high | certain | navigation/redirects | static scan | verify active consumers and builders | yes | yes | yes |
| RR-003 | Constant aliases across groups | `constants/routes.js` | 9 alias values | duplicate constants/compatibility | medium | certain | imports/migration | grouped export scan | document canonical key and compatibility use | yes | yes | yes |
| RR-004 | Undeclared route constant | same | `/offers` | stale/base constant | medium | certain | public links/fallback | only unique constant not declared | decide base-only vs missing index | yes | yes | yes |
| RR-005 | Route metadata treated as complete | layouts/access utilities | metadata-less paths | guard bypass risk | critical | medium | authorization | layout checks skip when metadata null | verify intended roles | yes | yes | yes |
| RR-006 | Parent-auth-only route ambiguity | AppRoutes dashboard group | 16 routes | protected role gap | high | high | private features | no explicit role wrapper | classify public-to-auth role contract | yes | yes | yes |
| RR-007 | Sensitive metadata-less routes | payments/leads/provider-services/scraper/projects | listed paths | role/security | critical | medium | financial/admin/data | parent auth only | owner/security review | yes | yes | yes |
| RR-008 | Legacy unreferenced route logic | `pages/Auth.jsx`, `pages/Admin.jsx` | auth/admin paths | stale hardcoded routes | high | medium | future accidental reuse | no importers found | prove reachability; do not delete | yes | yes | yes |
| RR-009 | Duplicate guard implementations | `RoleRoute`, `RequireRole`, `AdminGate`, layouts | protected routes | guard duplication | critical | medium | authorization | multiple mechanisms; two appear unused | establish active guard authority | yes | yes | yes |
| RR-010 | Role landing policy repetition | Dashboard pages, accessPolicy, auth helpers | dashboard/admin/client/support | redirect duplication | high | high | login/authorization | repeated role branches | parity matrix/tests | yes | yes | yes |
| RR-011 | Unauthorized route aliases | `/403`, `/not-authorized` | system routes | ambiguous paths | medium | high | UX/support | two pages/aliases | define compatibility policy | no | yes | yes |
| RR-012 | Legacy profile routes | `/profile/:username`, `/u/:username`, `/providers/:username` | public profiles | module route conflicts | high | high | inbound links/SEO | three profile shapes | identify canonical plus redirect plan | yes | yes | yes |
| RR-013 | Marketplace service parameter mismatch | Saved/Marketplace/route constant | `:serviceId` vs slug consumers | dynamic builder drift | high | medium | broken links/data lookup | hardcoded slug-shaped links | verify accepted identifier | yes | yes | yes |
| RR-014 | Navigation config omissions | admin/provider/dashboard nav | declared routes not surfaced | declaration/nav mismatch | medium | high | discoverability | all configured links resolve, not all routes linked | classify intentional hidden routes | no | yes | yes |
| RR-015 | Navigation bypasses constants | marketing/pages/dashboard content | many paths | hardcoded nav | high | high | user flows | HN-001..016 | inventory and migration plan | yes | yes | no for public, yes for role paths |
| RR-016 | Route docs may be stale | `ROUTE_MAP.md`, `NAVIGATION_SYSTEM.md` | route catalog | docs drift | medium | medium | governance | existing canonical claims predate this audit | compare Prompt 2 | no | yes | no |
| RR-017 | Browser/API route namespace confusion | client vs server route registries | `/api`, `/api/v1` | parallel route domain | high | medium | backend/frontend | two server registries plus browser constants | preserve separate governance | yes if mixed | yes | yes |
| RR-018 | No route regression baseline recorded | repository | all routes | testing gap | critical | high | whole application | Stage 3 carryforward | define route/nav/guard/redirect tests | yes | yes | yes |
| RR-019 | Wildcard behavior untested | AppRoutes | `*` | 404 behavior | high | medium | all invalid URLs | catch-all exists; no audit test evidence | define 404 cases | no | yes | no |
| RR-020 | Separate ProofArena routing future risk | architecture | all routes | duplicate route tree | critical | low/currently absent | entire SaaS | no duplicate found; ADR prohibits | stop any proposal | yes if proposed | yes | yes |

## Risk Result

No current duplicate browser route declaration or separate ProofArena router was found. Centralization is blocked by `RR-001` through `RR-010`, `RR-012`, `RR-013`, `RR-015`, `RR-018`, and any triggered stop-ship risk.

