# ADR-0001 Source-of-Truth Confidence Matrix

Generated: 2026-06-27

| System | Candidate source | Evidence | Confidence | Reason/risk | Validation before edit | Human review |
| --- | --- | --- | --- | --- | --- | --- |
| Product/repository boundary | Current ScaleOps repository with ProofArena inside | Stage 1.1 inventory/invariants | High | Static evidence cannot prove organizational intent | Owner ratification | Yes |
| Route declarations | `client/src/routes/AppRoutes.jsx` | 108 mapped entries | High | Executable ownership is clear | Route matrix | No |
| Browser constants | Grouped exports in `routes.js` | Router/nav/caller maps | High | Flattened aliases/literals remain | Import/link tests | No |
| Route metadata | `routeMetadata.js` | 73 records/34 gaps | Medium-high | Descriptive only; incomplete | Coverage tests | No |
| Public/auth layouts | PublicLayout/AuthLayout | AppRoutes layout branches | High | Legacy RootLayout ownership unknown | Public/auth QA | RootLayout only |
| Protected layouts | Dashboard/Client/Admin role wrappers | AppRoutes/layout analysis | High | Shared primitive scope untested | Role/browser/mobile tests | Yes for consolidation |
| Sidebar engine | SidebarCore plus role wrappers | All three wrappers reuse it | High | Wrapper policy must remain | Active/collapse/mobile tests | No |
| HTTP transport | `apiClient.js` | Sole Axios instance/27 references | High | Auth-critical | Transport tests | No |
| Endpoint registry | `apiEndpoints.js` | Feature services and API audit | Medium-high | Legacy literals/backend gaps | Method/path contract map | No |
| Domain requests | Feature `*Service.js` files | Feature/hook import maps | High for modern domains | Legacy SaaS modules remain in api.js | Caller tests | No |
| API version | Unknown | Dual mounts/seven builders | Low | Wrong decision breaks broad contracts | Telemetry/ADR/tests | Yes |
| Auth UX | AuthProvider/store/hooks/guards | Dependency/route maps | High | Multiple surfaces require coordinated tests | Full auth E2E | Yes for changes |
| Backend auth security | Existing middleware/services | Backend flow/critical list | Medium-high | Generations and email/throttle gaps | Security review/E2E | Yes |
| Models/data | Existing registered models | Model usage map | High ownership; medium runtime | Production indexes/data unknown | Migration/query tests | Yes |
| Shared UI/utils | Existing shared locations | Reusable/dependency maps | Medium-high | Equivalence differs by helper | Import/equivalence tests | No |
| Placeholder states | Existing shared state components/classification | 60-item classification | High | Product replacement decisions remain | State/disclosure QA | Yes for product/security |

