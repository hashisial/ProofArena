# Stage 2.1 Final Boundary-Sensitive System Protection Table

Generated: 2026-06-28

| ID | System | Current files | Boundary rule | Forbidden duplicate | Required docs | Validation | Human review | Stop condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FP-01 | Root repository/workspace | Root `.git`, `client`, `server` | One ScaleOps repository. | ProofArena root/package/repo | Authority lock; repo inventory | Git/root/package scan | yes | New root/package proposed. |
| FP-02 | Frontend app entry | `main.jsx`, `App.jsx` | One client composition. | ProofArena bootstrap/app entry | Critical files | Import/provider/runtime checks | yes | Parallel entry appears. |
| FP-03 | Backend app entry | `app.js`, `server.js` | One API/server. | ProofArena server/startup | Backend flow | Mount/middleware/startup checks | yes | Parallel server appears. |
| FP-04 | Router | `routes/AppRoutes.jsx` | Central route tree. | Module router | Route lock | Direct loads/guards/aliases | yes | Duplicate tree/path. |
| FP-05 | Route constants | `constants/routes.js` | One path governance source. | ProofArena constants tree | Route docs | Reference/alias scan | no | Unregistered path. |
| FP-06 | Public navigation | `config/navigation/publicNavigation.js` | Central navigation. | Module public nav | Navigation docs | Link/route/keyboard checks | no | Duplicate source. |
| FP-07 | Dashboard shell | Role layouts/components | ScaleOps role shells. | ProofArena dashboard shell | Layout lock | Role/mobile/focus/overflow | yes | Role owner bypassed. |
| FP-08 | Sidebar | Shared sidebar engine | One sidebar system. | ProofArena sidebar engine | Critical files | Collapse/drawer/nav QA | no | New engine/config. |
| FP-09 | Layouts | `client/src/layouts/*` | Central layout owners. | Module layout system | Layout ownership | Nesting/access/responsive QA | yes | Parallel layout. |
| FP-10 | Auth provider/context | Auth provider/context/store | Platform session owner. | ProofArena auth provider | Auth/critical docs | Session/logout/refresh QA | yes | Second session owner. |
| FP-11 | Protected route guards | `client/src/routes/*Route.jsx` | Reuse ScaleOps guards. | Module guard bypass | Route/auth docs | Protected-load tests | yes | Guard bypass. |
| FP-12 | Role guards/middleware | Frontend role access; server middleware | Backend security authority. | Module role fork/UI-only security | Auth/role docs | Role/API matrix | yes | Authorization absent. |
| FP-13 | API client | `services/apiClient.js` | One transport contract. | ProofArena HTTP client | API lock | Base URL/auth/error/response QA | yes | Second transport. |
| FP-14 | Backend flow | Routes/controllers/services/models | Governed shared/domain flow. | Parallel module backend stack | Backend/model maps | Contract/security/data tests | yes | New server/data stack. |
| FP-15 | Shared UI | `components/ui`, `common` | Product-neutral primitives. | ProofArena UI library | Reusable map | Boundary/import/accessibility checks | no | Shared imports product implementation. |
| FP-16 | Shared utilities | Client/server shared foundations | Product-neutral helpers. | ProofArena global utility fork | Boundary report | Import/purity checks | no | Upward dependency. |
| FP-17 | Config/env | Client/server config/env helpers | Platform runtime config. | ProofArena env/config layer | Critical/env docs | Env/build/deploy validation | yes | Separate secrets/config. |
| FP-18 | Build/deployment | Package scripts, Vite, Vercel | Runtime tiers remain one platform. | Independent ProofArena target | Start conditions | Build/project/domain/rollback proof | yes | Separate deployment proposed. |
| FP-19 | Documentation authority | Final index, ADR, Stage 2.1 lock | One governance hierarchy. | Parallel rulebook/ADR bypass | Final source index | Citation/status check | yes | Authority conflict. |

All production edits remain separately gated. This table only defines protection requirements.
