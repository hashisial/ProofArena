# ProofArena Integration Contract

| ID | Contract rule | Allowed | Forbidden | Required docs | Validation | Stop condition |
|---|---|---|---|---|---|---|
| IC-01 | ProofArena is the flagship module inside ScaleOps. | Product-specific branding/features | Standalone product runtime | ADR adoption; Stage 2.1 lock | Package/entry scan | Second app/repo proposed |
| IC-02 | The current repository is the implementation boundary. | Add module files in approved owners | New repo/package/workspace | Final Stage 1 handoff | Git/package scan | New package boundary |
| IC-03 | Routes register through `AppRoutes.jsx` and governed constants. | Add approved route/constants together | Parallel router/tree | Route inventory/lock | Link/guard/404 QA | Route owner unknown |
| IC-04 | Public pages render in shared public layout. | Branded page content | ProofArena public shell | Layout ownership | Responsive route QA | Duplicate shell |
| IC-05 | Provider/client/admin pages use their existing role shells. | Compose module pages | Module dashboard shell | Critical file list | Role/dashboard QA | Guard/shell divergence |
| IC-06 | Navigation plugs into existing public/sidebar configs. | Add governed nav entry | Parallel nav/sidebar | Navigation maps | Link/mobile/access QA | Duplicate config |
| IC-07 | Frontend requests use `services/apiClient.js` via owned services. | Feature service calls | Raw isolated axios/fetch client | API client lock | Base URL/token/error QA | Different token/base path |
| IC-08 | Endpoint paths remain under shared endpoint governance. | Add approved endpoint constant | Module endpoint catalog | API inventory | Contract comparison | Conflicting endpoint |
| IC-09 | Protected UI routes use shared guards. | Declare auth/role requirement | UI-only role checks/bypass | Auth/role docs | Negative access QA | Unauthorized access |
| IC-10 | Backend protection uses shared middleware. | Apply existing auth/role middleware | Module auth middleware | Backend flow map | Protected endpoint tests | Middleware bypass |
| IC-11 | Backend domain logic follows route/controller/service/model/validator layers. | Domain-specific implementation | Second Express app/layer stack | Backend architecture | Boundary check/tests | Cross-layer violation |
| IC-12 | Shared infrastructure does not import private ProofArena module files. | Import module public entry only where allowed | Deep private import | Module README | Boundary script | Boundary check failure |
| IC-13 | Feature logic stays feature-owned; module folder coordinates cross-domain cases only. | Real orchestration | Copying current feature services | Ownership table | Import/duplicate scan | Compatibility copy proposed |
| IC-14 | Generic UI/utilities stay shared; feature logic does not leak there. | Reusable primitives/pure helpers | Product business logic in shared | Reuse/boundary docs | Dependency review | Ownership unclear |
| IC-15 | Mock/static/fallback data remains labeled. | Temporary explicit fallback | Fake production auth/payment/proof/admin state | Placeholder reports | Data-source/empty-state QA | Sensitive fake state |
| IC-16 | ProofArena branding does not imply app/package/deployment ownership. | Public product naming | Architecture inferred from copy | Identity audit | Package/runtime review | Naming drives duplicate system |
| IC-17 | Config/env/package/deploy changes require explicit stage and human approval. | Approved platform change | Module-specific config/deploy fork | Governance rulebook | Diff/build/deploy checks | Approval absent |
| IC-18 | Production edits require tests proportional to route/auth/API/data blast radius. | Tested vertical slice | Broad untested migration | Test gap/QA docs | Lint/build/tests/manual QA | Required checks unavailable |
| IC-19 | Deletion requires safe-delete proof and isolated execution. | Verified candidate removal | “Unused-looking” deletion | Safe-delete policy | Imports/routes/runtime/fallback | Proof incomplete |
| IC-20 | Separation requires a superseding ADR and explicit human approval. | Formal reviewed reversal | Informal drift | ADR index | Approved ADR check | No approved reversal |

This contract is enforceable for future feature prompts. It does not authorize production changes.

