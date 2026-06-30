# Stage 3.2 Final Internal Boundary Violation Lock

| ID | Source/path | Type | System | Severity | Status | Future action | Blocks 3.3 | Blocks production | Human |
|---|---|---|---|---|---|---|---|---|---|
| FV-01 | Component/API scans | Components instantiate raw API clients | Components | High | false positive: refetch matched text; no raw fetch/axios creation found | Add automated boundary rule later | No | No currently | No |
| FV-02 | FirstClientDashboard/dashboard components | Components own cross-module orchestration | Dashboard/first-client | High | confirmed | Public orchestration service/contracts later | No | Yes | Yes |
| FV-03 | `client/src/hooks` | Hooks create API clients | Hooks | Critical | false positive/not found | Keep prohibited and scan later | No | No currently | No |
| FV-04 | Auth/root hooks | Hooks bypass or obscure auth authority | auth/platform | Critical | suspected/confirmed compatibility ambiguity | Select public auth hook and trace consumers | No | Yes | Yes |
| FV-05 | Feature services | Services bypass client | API | Critical | false positive: feature services use platform client | Preserve; no parallel adapters | No | No currently | No |
| FV-06 | Root `services/api.js` | Compatibility service imports features/normalizes payloads | API/shared | High | confirmed | Freeze, trace and migrate with tests later | No | Yes | Yes |
| FV-07 | Root/module contracts and model variants | Types duplicated/drift | auth/profile/payment | Critical | confirmed/suspected | Inventory canonical contracts/models | No | Yes | Yes |
| FV-08 | Future adapter risk | Adapter becomes API client | API | Critical | deferred prevention risk | Enforce final adapter lock | No | Yes | Yes |
| FV-09 | Feature utils using `API_BASE_URL` | Module internals handle platform endpoint composition | Several modules | High | confirmed | Move only to approved adapter during tested migration | No | Yes | Yes |
| FV-10 | Cross-feature hook imports | Module imports another module private hook/key | plans/offers/profile/challenges | High | confirmed | Public invalidation contracts | No | Yes | Yes |
| FV-11 | Shared UI/common | Module-specific logic in shared candidates | UI/shared | High | suspected | Consumer/product-semantics audit in Stage 3.3 | No | Yes | Yes |
| FV-12 | Auth/payment/admin sensitive paths | Sensitive logic duplication risk | Security/payment/admin | Critical | confirmed risk/deferred | Human architecture/security decisions | No | Yes | Yes |
| FV-13 | Client/server scan | Frontend imports backend or inverse | Boundary | Critical | false positive/not found | Keep prohibited; automated scan later | No | No currently | No |
| FV-14 | Current import graph | Circular dependency risk | Multiple modules | High | suspected | Generate dependency graph before moves | No | Yes | Yes |
| FV-15 | Payment placeholder/fake security logic | Fake production behavior | payments/security | Critical | no new violation; prevention lock | Keep classified and server-authoritative | No | Yes | Yes |

Stage 3.3 may audit shared candidates without modifying these files. Every confirmed/suspected item blocks related production migration until resolved.

