# Stage 3.2 Internal Boundary Violation Register

Confirmed findings describe current coupling; potential findings remain review items. Nothing here authorizes refactoring.

| ID | Path | Violation | Module | Risk | Severity | Future action | Blocks scaffolding | Human |
|---|---|---|---|---|---|---|---|---|
| IV-01 | `client/src/hooks/useMyProfile.js`, `useMyDashboard.js` | Root shared-like hooks import feature services/contracts | profile/dashboard/shared | Reverse dependency and cycles | High | Assign owner/public contract before migration | Yes | Yes |
| IV-02 | `client/src/hooks/useAuth.js` | Root hook re-exports feature auth | auth/platform | Hidden compatibility authority | High | Keep frozen; trace consumers | Yes | Yes |
| IV-03 | `client/src/services/api.js` | Root API facade imports feature services | API/auth/profile/dashboard | Shared-to-feature inversion | High | Preserve compatibility only; do not copy | Yes | Yes |
| IV-04 | Challenge/offer/plan `*Utils.js` | Endpoint building, validation, constants and transforms mixed in utils | challenges/offers/plans | Adapter/service/type boundaries blurred | High | Split only during tested migration | Yes | Yes |
| IV-05 | `useExecutionPlans.js` -> challenge query keys | Hook imports another feature hook internals | plans/challenges | Private cross-module coupling/cycle | High | Expose approved public query-key contract | Yes | Yes |
| IV-06 | `useOutcomeOffers.js` -> profile query keys | Hook imports another feature hook internals | offers/profile | Private cross-module coupling | High | Public invalidation contract | Yes | Yes |
| IV-07 | Dashboard components importing many feature hooks | Platform composition depends on feature internals | dashboard/all | Migration blast radius | High | Preserve composition; define public module APIs later | Yes | Yes |
| IV-08 | First-client components importing multiple features | Cross-domain orchestration inside component layer | first-client/multiple | Business orchestration/cycle risk | High | Assign orchestration owner and services later | Yes | Yes |
| IV-09 | Domain folders under `client/src/components` | Module components dispersed outside features | Multiple | Duplicate copies during module creation | High | Move only complete tested slices | Yes | Yes |
| IV-10 | `components/ui` and `components/common` | Shared boundary ambiguity | shared UI | Feature leakage/duplicate primitives | Medium-high | Consumer audit and shared approval gate | Yes | Yes |
| IV-11 | Profile image components importing `getRealtimeBaseUrl` | Component directly consumes platform client helper | profile | UI/platform transport coupling | Medium | Provide approved module/platform helper later | No for docs | Yes |
| IV-12 | Auth module plus legacy/versioned variants | Duplicate/ambiguous service/controller/middleware authority | auth | Security divergence | Critical | Select runtime authority before internal migration | Yes | Yes |
| IV-13 | Backend domain services importing several models | Cross-domain model/service coupling | challenges and others | Tight coupling and partial-move risk | High | Define public backend contracts/transactions | Yes | Yes |
| IV-14 | Feature services acting as both domain service and endpoint adapter | Service/adapter role ambiguity | offers/challenges/plans/proof/matching | Duplicate adapters if new folders are added | High | Document responsibility before splitting | Yes | Yes |
| IV-15 | Payments/admin/message internal ownership | Sensitive behavior lacks approved internal module base | payments/admin/messages | Financial, privilege and security risk | Critical | Human architecture/security review | Yes | Yes |
| IV-16 | Potential duplicate module types | Existing root auth/profile/platform contracts overlap future module types | auth/profile/payments/admin | Contract drift | High | Inventory every type before creation | Yes | Yes |
| IV-17 | Potential raw API calls in components | Broad component tree may hide direct requests; targeted scan found no confirmed raw client creation | Multiple | Transport bypass if introduced | Medium | Repeat repository-wide AST/lint audit before migration | Unknown | Yes |
| IV-18 | Circular dependencies | Current cross-feature hook/util imports can form future module cycles | plans/challenges/offers/profile/matching | Build/runtime coupling | High | Generate dependency graph before any move | Yes | Yes |

Internal scaffolding blockers: 17 confirmed/potential high-control items plus one unknown scan item. Runtime remediation is deferred.

