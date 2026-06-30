# Final Integration Contract Lock

The twenty `IC-*` rules in `STAGE_2_2_PROOFARENA_INTEGRATION_CONTRACT.md` are final Stage 2.2 guidance.

| Contract area | IDs | Final rule | Allowed | Forbidden | Required validation | Stop condition | Owner |
|---|---|---|---|---|---|---|---|
| Product identity | IC-01, IC-02, IC-20 | One repository; ProofArena module; reversal only by ADR. | Module features | Separate app/repo | Package/entry/ADR scan | New runtime boundary | Architecture |
| Routing | IC-03 | Existing router/constants govern. | Governed registrations | Parallel tree/catalog | Route/link/guard/404 QA | Unknown owner/conflict | Stage 4 |
| Layout/dashboard | IC-04, IC-05 | Shared public/provider/client/admin shells govern. | Page composition | Module shell | Responsive/role QA | Duplicate shell | Stages 7/36 |
| Navigation | IC-06 | Existing nav/sidebar governance. | Governed entries | Parallel nav | Link/mobile/access QA | Duplicate config | Stage 22 |
| API client | IC-07, IC-08 | Shared transport and endpoints govern. | Feature services | Raw isolated client/catalog | Base/auth/error/contract QA | Divergent transport | Stage 5 |
| Auth/roles | IC-09, IC-10 | Shared client guards and server middleware enforce access. | Declare requirements | Bypass/UI-only security | Positive/negative tests | Unauthorized path | Stages 23/26 |
| Backend | IC-11, IC-12, IC-13 | Existing app/layers and public module boundary govern. | Domain use cases | Second stack/private imports/copies | Tests/boundary check | Boundary failure | Stages 3/5 |
| Shared code | IC-14 | Generic reusable code only. | Reviewed contributions | Feature dumping | Dependency review | Ownership unclear | Stages 3/7 |
| Placeholder/mock | IC-15 | Temporary data stays explicit. | Honest fallback/empty state | Fake sensitive production data | Data-source QA | Sensitive fake state | Stage 8 |
| Naming/branding | IC-16, IC-17 | Branding may vary; config/package/deploy ownership stays platform. | Approved branding | Architecture fork/rename | Diff/build/external review | Approval absent | Product/release |
| Safe future features | IC-18, IC-19 | Test by blast radius; delete only with proof. | Tested vertical work | Broad untested change/casual deletion | Test and safe-delete gates | Evidence missing | Every stage |

Required docs before edits: ADR adoption/rulebook, Stage 1 authority/critical/safe-delete docs, this lock, relevant route/API/model/layout maps, and the Stage 2.2 ownership/surface locks.

## Contract-by-Contract Final Lock

| Contract ID | Final rule | Allowed action | Forbidden action | Required docs | Required validation | Stop condition | Future stage owner |
|---|---|---|---|---|---|---|---|
| `IC-01` | ProofArena remains the flagship module inside ScaleOps. | Product-specific features and branding. | Standalone runtime. | ADR adoption; Stage 2.1 lock | Entry/package scan | Second app/repo proposed | Architecture |
| `IC-02` | Current repository is the implementation boundary. | Add files in approved owners. | New product repo/package/workspace. | Stage 1 handoff; app lock | Git/package/workspace scan | New product boundary | Architecture |
| `IC-03` | Routes use `AppRoutes.jsx` and governed constants. | Register approved route and constant together. | Parallel router/tree/catalog. | Route inventory/locks | Link, guard, redirect, 404 QA | Unknown/conflicting route owner | Stage 4 |
| `IC-04` | Public pages use the shared public layout. | Branded page composition. | ProofArena public shell. | Layout ownership | Public responsive QA | Duplicate public shell | Stage 7/22 |
| `IC-05` | Provider/client/admin pages use current role shells. | Compose module pages. | Module dashboard shell. | Critical/layout docs | Role, dashboard, responsive QA | Shell or guard divergence | Stage 36 |
| `IC-06` | Navigation plugs into existing configs. | Add governed entry. | Parallel nav/sidebar stack. | Navigation audits/locks | Link, mobile, access QA | Duplicate nav authority | Stage 22 |
| `IC-07` | Frontend requests use `apiClient.js` through services. | Feature-service calls. | Isolated Axios/fetch client. | API client lock | Base URL, token, error QA | Divergent request behavior | Stage 5 |
| `IC-08` | Endpoint paths use shared endpoint governance. | Add approved endpoint constant. | Module endpoint registry. | API inventory/lock | Frontend/backend contract comparison | Conflicting endpoint | Stage 5 |
| `IC-09` | Protected UI uses shared guards. | Declare auth/role needs. | UI-only access checks or bypass. | Auth/role docs | Negative route tests | Unauthorized route reachable | Stage 23/26 |
| `IC-10` | Backend protection uses shared middleware. | Apply existing middleware. | Module auth/role middleware. | Backend flow/auth docs | Protected endpoint tests | Middleware bypass | Stage 23/26 |
| `IC-11` | Backend domains follow route/controller/service/model/validator layers. | Domain-specific implementation. | Second Express/layer stack. | Backend architecture | Boundary checks and tests | Cross-layer/second-app violation | Stage 3/5 |
| `IC-12` | Shared infrastructure cannot import private module files. | Use approved public module entry. | Deep private import. | Module README/boundary docs | Boundary script | Boundary check failure | Stage 3 |
| `IC-13` | Feature logic stays feature-owned; module folder coordinates cross-domain cases only. | Real tested orchestration. | Copies of current feature services. | Ownership lock | Import/duplicate scan | Compatibility copy proposed | Stage 3 |
| `IC-14` | Generic UI/utilities remain shared and feature-neutral. | Reviewed reusable contribution. | Product business logic in shared. | Reuse/ownership docs | Dependency review | Ownership unclear | Stage 3/7 |
| `IC-15` | Mock/static/fallback data stays explicit. | Honest temporary fallback or empty state. | Fake auth/payment/proof/admin truth. | Placeholder/surface locks | Data-source and empty-state QA | Sensitive fake state | Stage 8 |
| `IC-16` | ProofArena branding does not grant architecture ownership. | Approved public product naming. | Infer app/package/deploy boundary from copy. | Identity audit | Runtime/package review | Branding drives duplicate system | Product/architecture |
| `IC-17` | Config/env/package/deploy changes require explicit approval. | Approved platform-level change. | Product-specific config/deploy fork. | Governance/config docs | Diff, build, external topology review | Approval absent | Stage 6/release owner |
| `IC-18` | Production changes require blast-radius tests. | Tested vertical work. | Broad untested migration. | QA/test-gap docs | Lint/build/tests/manual QA | Required validation unavailable | Every production stage |
| `IC-19` | Deletion requires safe-delete proof and isolated execution. | Verified candidate removal. | Unused-looking deletion. | Safe-delete policy | Import, route, runtime, fallback proof | Evidence incomplete | Dedicated cleanup stage |
| `IC-20` | Separation requires a superseding ADR and human approval. | Formal reviewed reversal. | Informal separation. | ADR index/adoption package | Approved ADR check | No approved reversal | Architecture owner |
