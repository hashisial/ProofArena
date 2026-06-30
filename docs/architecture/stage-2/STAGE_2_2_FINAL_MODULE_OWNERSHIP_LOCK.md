# Final Module Ownership Lock

| Group | Items | Final class | Reason / allowed future change | ProofArena must not own | Required docs | Risk / review / future owner |
|---|---|---|---|---|---|---|
| Product logic | OW-01..OW-07: feature domains and versioned domain chains | ProofArena-owned product logic | May evolve tested domain behavior and contracts. | Router, shells, transport, global auth/security/DB connection | Ownership/dependency/backend maps | High-critical / human / Stage 3-5 |
| Platform logic | OW-08..OW-14: router, layouts, navigation, API client, auth, guards, API runtime | ScaleOps-owned platform logic | May accept module registrations through governed interfaces. | ProofArena-specific copies or bypasses | Authority lock, ADR, critical list | Critical / human / Stages 4-6, 22-26, 36 |
| Shared governed | OW-15..OW-18: UI, constants, utilities, module orchestration boundary | Shared but governed | May receive proven reusable contributions or cross-domain orchestration. | Feature dumping, copied services, deep private imports | Reuse map, module README, boundary report | Medium-high / mixed / Stages 3, 7 |
| Unknown | OW-19..OW-21: route shells, fallback records, external topology | Unknown/mixed ownership | Only evidence gathering or isolated replacement after verification. | Architecture authority or production truth | Placeholder reports, Stage 2 risk docs | High-critical / human / Stage 8/release owner |
| Human review | Naming, sensitive data/payment/admin ownership, final source selections | Human-review ownership | Approve explicit decisions. | Silent defaults | Human decision log | Critical / required / product-architecture owner |

The detailed OW item paths and purposes remain authoritative in `STAGE_2_2_MODULE_OWNERSHIP_BOUNDARY_TABLE.md`; this lock supplies the final disposition.

## Item-by-Item Ownership Lock

This table is the authoritative row-level lock. It preserves every Prompt 5 ownership item.

| Item ID | File path or system | Final ownership class | Reason | ProofArena may change later | ProofArena must not own | Required docs | Risk | Human review | Future stage owner |
|---|---|---|---|---|---|---|---|---|---|
| `OW-01` | `client/src/features/challenges` | ProofArena product | Challenge domain behavior. | Tested feature behavior. | Router, auth, API transport. | Ownership/dependency maps | High | Yes | Stage 3/4/5 |
| `OW-02` | `client/src/features/executionPlans` | ProofArena product | Execution-plan domain. | Tested plan workflow. | Dashboard shell and guards. | Ownership/dependency maps | High | Yes | Stage 3/36 |
| `OW-03` | `client/src/features/outcomeOffers` | ProofArena product | Offer domain. | Tested offer workflow. | Shared request transport. | API/ownership maps | High | Yes | Stage 3/5 |
| `OW-04` | `client/src/features/matches` | ProofArena product | Matching domain. | Tested matching behavior. | Auth and role policy. | Auth/ownership maps | High | Yes | Stage 3/26 |
| `OW-05` | `client/src/features/proofAssets` | ProofArena product | Proof domain. | Tested proof workflows. | Storage/auth primitives. | Model/API maps | Critical | Yes | Stage 3/5 |
| `OW-06` | `client/src/features/providers`; `savedProviders`; `firstClient`; `opportunities` | ProofArena product | Marketplace domains. | Tested domain behavior. | Platform shells and API client. | Ownership map | High | Yes | Stage 3 |
| `OW-07` | `server/src/routes/v1/*` module-domain chains | ProofArena product | Backend product contracts. | Tested endpoint behavior. | Express app, security, DB connection. | Backend flow/model maps | Critical | Yes | Stage 3/5 |
| `OW-08` | `client/src/routes/AppRoutes.jsx` | ScaleOps platform | Single route composition. | Register approved module pages. | Parallel route tree. | Route authority lock | Critical | Yes | Stage 4 |
| `OW-09` | `client/src/layouts` | ScaleOps platform | Shared route shells. | Supply page content only. | New module shell framework. | Layout/critical-file docs | Critical | Yes | Stage 7/36 |
| `OW-10` | `client/src/config/navigation` | ScaleOps platform | Shared navigation governance. | Add governed entries. | Module navigation stack. | Navigation audits | High | Yes | Stage 22 |
| `OW-11` | `client/src/services/apiClient.js` | ScaleOps platform | Canonical HTTP transport. | Consume through services. | Module API client. | API client lock | Critical | Yes | Stage 5 |
| `OW-12` | `client/src/features/auth`; `client/src/store/useAuthStore.js` | ScaleOps platform | Shared identity/session. | Consume identity state. | Module auth provider/store. | Auth architecture | Critical | Yes | Stage 23 |
| `OW-13` | `client/src/routes/ProtectedRoute.jsx`; `RoleRoute.jsx` | ScaleOps platform | Shared route authorization. | Declare access requirements. | UI-only bypass or clone. | ADR/auth rules | Critical | Yes | Stage 23/26 |
| `OW-14` | `server/src/app.js`; middleware/config | ScaleOps platform | Unified API/security runtime. | Mount approved domain routes. | Module app/middleware stack. | API/control docs | Critical | Yes | Stage 5/6 |
| `OW-15` | `client/src/components/ui` | Shared governed | Generic UI primitives. | Consume or contribute proven primitives. | Feature business logic. | Reuse map | Medium | No | Stage 7 |
| `OW-16` | `client/src/constants/routes.js`; `apiEndpoints.js`; aggregators | Shared governed | Shared route/API contracts. | Add governed module entries. | Forked catalogs. | Stage 1.2/2 locks | High | Yes | Stage 4/5 |
| `OW-17` | `client/src/utils`; `server/src/utils` | Shared governed | Cross-cutting helpers. | Reuse or contribute pure helpers. | Feature-logic dumping. | Boundary/reuse docs | Medium | No | Stage 3 |
| `OW-18` | `client/src/modules/proofarena` | Shared governed module boundary | Cross-domain module orchestration. | Add real orchestration/public exports. | Domain copies or platform systems. | Module README/contract | High | Yes | Stage 3 |
| `OW-19` | `client/src/pages/RouteShells.jsx` | Unknown/mixed | Aggregates partial surfaces. | Replace one verified route at a time. | Architecture authority. | Placeholder/surface maps | High | Yes | Stage 8/feature stages |
| `OW-20` | `client/src/utils/constants.js` fallback records | Unknown/mixed | Product fallback data in shared utility. | Retire with real API/empty states. | Production source of truth. | Placeholder reports | High | Yes | Stage 8 |
| `OW-21` | External GitHub/Vercel/domain topology | Human-review/unknown | Not fully represented locally. | Verify external state only. | Assume or create deployment boundary. | Stage 2 risk docs | Critical | Yes | Release owner |
