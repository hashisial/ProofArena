# ADR-0001 Risk and Mitigation Table

Generated: 2026-06-27

| Risk | Decision | Files/docs | Severity | Likelihood | Mitigation/detection | Rollback/fallback | Future owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Separate ProofArena architecture | D-01/D-02 | Invariants, ADR | Critical | Low | Preflight/repository scan | Stop/revert duplicate system | Architecture |
| Duplicate route tree/constants | D-03 | AppRoutes/routes.js/route docs | High | Medium | Route source lock and matrix | Restore central callers/aliases | Stage 4 |
| Role-shell policy merge | D-04 | Three layouts/SidebarCore | High | Medium | Preserve wrappers; role/browser tests | Revert primitive extraction | Stage 3/36 |
| Second/bypassed API transport | D-05 | apiClient/api.js/services | Critical | Medium | One-client rule; interceptor tests | Restore apiClient/facade shim | Stage 5 |
| API version drift | D-05 | Server indexes/feature utils | High | High | ADR, telemetry, contract tests | Restore mounts/builders | Stage 5 |
| Auth/role bypass | D-06 | Guards/middleware/services | Critical | Medium | Backend authorization tests | Revert and disable unsafe path | Stage 23/26 |
| Business fallback shown as truth | D-09 | constants/api.js/reviews | High | High | Empty/error tests and disclosure | Explicit planned/empty state | Stage 8/features |
| Email/throttling incomplete | D-06/D-09 | auth routes/controller | High | High | Security gate/E2E | Disable affected production flow | Stage 23 |
| Unsafe deletion | D-10 | Legacy wrappers/pages/facades | High | Medium | Safe-delete proof/human approval | Restore exact file/export/alias | Cleanup stage |
| Missing regression baseline | D-10 | Package/test gap docs | High | High | Add target tests before edit | Do not execute cleanup | Stage 9 |
| Shared-code overreach | D-07/D-08 | Utilities/components | Medium | Medium | Dependency/equivalence tests | Restore feature ownership | Stage 7 |
| Frontend/backend contract drift | D-05/D-07 | Endpoints/routes/services/models | High | Medium | Method/path/schema contract map | Preserve compatibility contract | Stage 5 |

