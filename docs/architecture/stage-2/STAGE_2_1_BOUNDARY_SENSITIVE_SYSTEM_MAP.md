# Stage 2.1 Boundary-Sensitive System Map

Generated: 2026-06-28

| System ID | System | Existing paths | Current ownership | Boundary rule | Forbidden duplicate | Risk | Required docs before edit | Human review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BS-01 | Root repository/workspace | `.git`, root, `client`, `server` | ScaleOps platform | One repository source of truth. | ProofArena root/repository/package | critical | Final handoff; ADR; repo inventory | yes |
| BS-02 | Frontend app entry | `client/src/main.jsx`, `client/src/App.jsx` | ScaleOps client | One application composition root. | ProofArena app entry/bootstrap | critical | Critical-file list; architecture docs | yes |
| BS-03 | Backend app entry | `server/src/app.js`, `server/src/server.js` | ScaleOps API | One Express app/server. | ProofArena server/app bootstrap | critical | Backend flow; critical-file list | yes |
| BS-04 | Router | `client/src/routes/AppRoutes.jsx` | ScaleOps client routing | All routes use central tree. | ProofArena router/tree | high | Route inventory/lock; ADR rules | yes |
| BS-05 | Route constants | `client/src/constants/routes.js` | ScaleOps route governance | One governed path source. | ProofArena route constants facade | high | Route lock; count/authority docs | no |
| BS-06 | Public navigation | `client/src/config/navigation/publicNavigation.js` | ScaleOps navigation | Product links integrate centrally. | ProofArena top-level nav stack | high | Navigation/route docs | no |
| BS-07 | Dashboard shell | Role layouts and dashboard components | ScaleOps dashboard governance | Preserve role shells. | ProofArena-only dashboard shell | high | Layout lock; control board | yes |
| BS-08 | Sidebar | `client/src/components/navigation/sidebar/*` | Shared ScaleOps UI | One sidebar engine. | ProofArena sidebar engine | high | Critical files; layout QA | no |
| BS-09 | Layouts | `client/src/layouts/*` | ScaleOps route/layout owners | Module composes, never replaces. | ProofArena layout system | high | Layout ownership/lock | yes |
| BS-10 | Auth provider/context | `client/src/features/auth/AuthProvider.jsx`, `useAuth.js` | ScaleOps identity | Shared session owner. | ProofArena auth provider/store | critical | Auth docs; critical files | yes |
| BS-11 | Protected route guards | `client/src/routes/*Route.jsx` | ScaleOps route security UX | Reuse existing guards. | ProofArena guard bypass | critical | Route/auth governance | yes |
| BS-12 | Role guards/middleware | Frontend role access; server middleware | ScaleOps authorization | Backend remains security authority. | ProofArena UI-only roles/middleware fork | critical | Auth/role docs; ADR | yes |
| BS-13 | API client | `client/src/services/apiClient.js` | ScaleOps transport | One base URL/auth/error contract. | ProofArena Axios/fetch client | critical | API lock/inventory | yes |
| BS-14 | API endpoints/services | Endpoint constants and feature services | ScaleOps API governance + domain owners | Feature calls use central transport. | Module-local duplicate services/contracts | high | API analysis; service map | no |
| BS-15 | Backend layering | Routes/controllers/services/models | ScaleOps API and domain owners | Route-to-model layering remains governed. | Parallel ProofArena backend stack | high | Backend flow/model usage | yes |
| BS-16 | Shared UI | `client/src/components/ui`, `common` | ScaleOps design/shared layer | Product-neutral primitives only. | ProofArena UI library | high | Reusable map; module boundaries | no |
| BS-17 | Shared utilities | Client/server `utils`, constants, config | ScaleOps shared foundations | No product implementation dependency. | ProofArena global utility fork | high | Boundary report; rulebook | no |
| BS-18 | Config/env | Client/server config/env helpers | ScaleOps runtime configuration | Module reads approved platform config. | ProofArena env/config layer | critical | Critical files; env docs | yes |
| BS-19 | Deployment/build | Package scripts, Vite, Vercel configs | ScaleOps runtime tiers | Client/server deploy as one platform boundary. | Independent ProofArena deployment without ADR | critical | Stage 2 start conditions; release docs | yes |
| BS-20 | Documentation authority | Final Stage 1 index; ADR; Stage 2 docs | Architecture governance | Final authority order applies. | Parallel architecture rulebook | high | Final source index; ADR index | yes |

## Enforcement Notes

- `BS-01` through `BS-20` are protected from duplicate ProofArena ownership.
- Existing ProofArena module folders may contain product orchestration only; they do not acquire platform ownership by location or naming.
- The client/server boundary checker is mandatory evidence for import-direction changes.
- External deployment/project identity remains unverified and requires human-approved access.
