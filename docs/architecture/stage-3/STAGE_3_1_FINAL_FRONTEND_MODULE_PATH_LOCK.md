# Stage 3.1 Final Frontend Module Path Lock

No new frontend path is safe or authorized. Existing runtime paths remain in place.

| Module | Final recommended path | Existing match | Status | Created | Documentation-only | Runtime/import impact | Route impact | Navigation impact | Duplicate risk | Future validation | Human |
|---|---|---|---|---|---|---|---|---|---|---|---|
| auth | Retain `client/src/features/auth` under platform security | Yes | confirmed with caution | No | No; existing runtime path | None from this prompt | None | None | Critical if copied | Auth authority/import/session tests | Yes |
| profile | Retain current profile feature/components/pages pending one migration plan | Partial/dispersed | blocked | No | N/A | None | None | None | High if a third owner appears | Consumer/model/privacy/storage tests | Yes |
| offers | Retain `client/src/features/outcomeOffers` | Yes | confirmed with caution | No | No; existing runtime path | None | None | None | High if copied to modules | Offer vertical/build/import tests | Yes |
| challenges | Retain `client/src/features/challenges` | Yes | confirmed with caution | No | No; existing runtime path | None | None | None | High if copied | Challenge/role/contract tests | Yes |
| plans | Retain `client/src/features/executionPlans` | Yes | confirmed with caution | No | No; existing runtime path | None | None | None | High if copied | Plan/cross-module/build tests | Yes |
| proof | Retain proof and proofAssets until one owner is approved | Two partial matches | blocked | No | N/A | None | None | None | Critical if third boundary created | Security/storage/visibility/consumer tests | Yes |
| matching | Retain `client/src/features/matches` | Yes | confirmed with caution | No | No; existing runtime path | None | None | None | High if copied | Algorithm/role/build tests | Yes |
| messages | Retain current page/service locations | No feature/module path | blocked | No | N/A | None | None | None | Critical premature boundary | Realtime/auth/consumer tests | Yes |
| payments | Retain current page/service locations | No feature/module path | blocked | No | N/A | None | None | None | Critical premature payment boundary | Payment/security tests | Yes |
| admin | Retain `client/src/features/admin` under platform admin shell | Yes | confirmed with caution | No | No; existing runtime path | None | None | None | Critical if shell/security copied | Role/shell/negative-access tests | Yes |

Frontend creation, README creation, imports, barrels, routes, navigation and runtime registration remain prohibited.

