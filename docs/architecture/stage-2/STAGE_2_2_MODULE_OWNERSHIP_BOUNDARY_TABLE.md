# Module Ownership Boundary Table

| ID | Path/item | Purpose | Class | Why | ProofArena may later change | Must not own | Required docs | Risk | Human review |
|---|---|---|---|---|---|---|---|---|---|
| OW-01 | `client/src/features/challenges` | Challenge UI/data behavior | A: ProofArena product logic | Domain-specific workflow | Tested feature behavior | Router/auth/API transport | Route/API maps | High | Yes |
| OW-02 | `client/src/features/executionPlans` | Plan workflow | A | Module domain | Tested plan behavior | Dashboard shell/guards | Dependency map | High | Yes |
| OW-03 | `client/src/features/outcomeOffers` | Offer workflow | A | Module domain | Tested offer behavior | Shared transport | API lock | High | Yes |
| OW-04 | `client/src/features/matches` | Matching | A | Module domain | Matching behavior | Auth/roles | Role docs | High | Yes |
| OW-05 | `client/src/features/proofAssets` | Proof assets | A | Module domain | Proof workflows | Storage/auth primitives | Model/API maps | Critical | Yes |
| OW-06 | `client/src/features/providers`; `savedProviders`; `firstClient`; `opportunities` | Marketplace domains | A | Product-specific | Domain features | Platform shells/client | Ownership map | High | Yes |
| OW-07 | `server/src/routes/v1/*` domain routes and peers | ProofArena API domains | A | Domain contracts | Tested endpoints | Express app/security/DB connection | Backend flow map | Critical | Yes |
| OW-08 | `client/src/routes/AppRoutes.jsx` | App route composition | B: ScaleOps platform | Single router | Register approved module routes | Parallel route tree | Route authority lock | Critical | Yes |
| OW-09 | `client/src/layouts` | Public/role shells | B | Shared shells | Supply page content | New module shell | Critical file list | Critical | Yes |
| OW-10 | `client/src/config/navigation` | Public navigation | B | One navigation system | Add governed entries | Module nav stack | Navigation audit | High | Yes |
| OW-11 | `client/src/services/apiClient.js` | HTTP transport | B | Global base/auth/errors | Call through feature services | Module HTTP client | API lock | Critical | Yes |
| OW-12 | `client/src/features/auth`; `client/src/store/useAuthStore.js` | Session/auth | B | Global identity | Consume auth state | Module auth provider | Auth architecture | Critical | Yes |
| OW-13 | `client/src/routes/ProtectedRoute.jsx`; `RoleRoute.jsx` | Route authorization | B | Global guard policy | Declare requirements | UI-only bypass | ADR rulebook | Critical | Yes |
| OW-14 | `server/src/app.js`; middleware/config | API/security runtime | B | One backend runtime | Mount approved routes | Module app/middleware stack | API/control docs | Critical | Yes |
| OW-15 | `client/src/components/ui` | Generic UI primitives | C: Shared governed | Cross-product reuse | Consume/extend with shared criteria | Feature business logic | Reuse map | Medium | No |
| OW-16 | `client/src/constants/index.js`; `apiEndpoints.js` | Route/API constants | C | Shared contracts | Add governed module entries | Forked catalogs | Stage 1.2 lock | High | Yes |
| OW-17 | `client/src/utils`; `server/src/utils` | Cross-cutting helpers | C | Shared pure behavior | Reuse approved helpers | Dump feature logic | Boundary report | Medium | No |
| OW-18 | `client/src/modules/proofarena` | Module public boundary/orchestration | C | Cross-domain product composition | Add real orchestration | Duplicate domain copies/platform systems | Module README | High | Yes |
| OW-19 | `client/src/pages/RouteShells.jsx` | Multiple partial public/admin shells | D: Unknown/mixed | Aggregates several owners | Replace only per verified route | New architecture authority | Placeholder report | High | Yes |
| OW-20 | `client/src/utils/constants.js` fallback records | Public fallbacks | D: Unknown/mixed | Shared fallback location carries product data | Retire with real empty states | Production truth | Placeholder report | High | Yes |
| OW-21 | External Vercel/GitHub/domain topology | Release ownership | D | Not fully represented locally | Verify only | Assume deployment boundaries | Stage 2.1 unknowns | Critical | Yes |

