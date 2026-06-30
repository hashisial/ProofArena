# File-to-Module Classification Ledger

Path patterns denote all files under the named domain directory; they are not permission to move the group together.

| ID | File/path | Purpose | Classification | Dependencies/dependents | Relation | Readiness | Risk | Human |
|---|---|---|---|---|---|---|---|---|
| FL-01 | `client/src/features/auth/*` | Auth context/service/hooks/forms | auth/platform | store, API client, routes; all protected UI | auth | Do not move | Critical | Yes |
| FL-02 | `server/src/modules/auth/*` | Backend auth module | auth/platform | app routes, users, middleware | API/security | Do not move | Critical | Yes |
| FL-03 | Server auth route/controller/service/middleware variants | Compatibility auth paths | auth/platform | route registries, users | API/security | Blocked | Critical | Yes |
| FL-04 | `client/src/features/profile/*` | Profile service/hooks/onboarding | profile | auth/API/routes/pages | hook/service | Safe after tests | High | Yes |
| FL-05 | `client/src/components/profile/*`; `pages/profile/*`; `pages/Profile.jsx`; `PublicProfile.jsx` | Profile UI/pages | profile | layouts/routes/shared UI | component/page | Future candidate | High | Yes |
| FL-06 | Client profile config/types/utils | Profile rules/contracts | profile/shared candidate | profile UI/services | config/type/util | Future candidate | Medium | Yes |
| FL-07 | Server profile routes/controllers/services/validators/models | Profile API/data | profile/users | auth/users/storage | full backend chain | Blocked | Critical | Yes |
| FL-08 | `client/src/features/outcomeOffers/*`; `components/outcomeOffers/*`; offer pages | Offer UI/service/hooks | offers | auth/API/profile/proof/routes | domain | Safe after tests | High | Yes |
| FL-09 | Server outcome-offer chain and model | Offer API/data | offers | auth/profile/challenge/proof | full backend chain | Safe after tests | High | Yes |
| FL-10 | `client/src/features/challenges/*`; `components/challenges/*`; challenge pages | Challenge UI/service/hooks | challenges | auth/API/profile/plans/matching | domain | Safe after tests | High | Yes |
| FL-11 | Server challenge chain/model/validator | Challenge API/data | challenges | auth/profile/plans | full backend chain | Safe after tests | High | Yes |
| FL-12 | `client/src/features/executionPlans/*`; `components/executionPlans/*`; plan pages | Plan UI/service/hooks | plans | challenge/proof/profile/API | domain | Safe after tests | High | Yes |
| FL-13 | Server execution-plan chain/model | Plan API/data | plans | challenge/proof/profile | full backend chain | Safe after tests | High | Yes |
| FL-14 | `client/src/features/proof/*`; `features/proofAssets/*`; `components/proof/*`; proof pages | Proof UI/service/hooks | proof | auth/storage/profile/plans | domain | Blocked | Critical | Yes |
| FL-15 | Server proof-asset chain/model/validator | Proof API/data | proof | auth/storage/profile | full backend chain | Blocked | Critical | Yes |
| FL-16 | `client/src/features/matches/*`; `components/matches/*`; matched pages | Match UI/service/hooks | matching | challenges/profile/auth/API | domain | Safe after tests | High | Yes |
| FL-17 | Server match chain/model | Match API/data | matching | challenge/profile | full backend chain | Safe after tests | High | Yes |
| FL-18 | `client/src/pages/Messages.jsx` | Messaging page | messages | route/layout/auth/services | page | Blocked | Critical | Yes |
| FL-19 | Server message route/controller/model/socket files | Messaging backend/realtime | messages/platform | auth/users/socket | API/realtime | Blocked | Critical | Yes |
| FL-20 | `client/src/pages/Payments.jsx`; billing calls | Payment UI | payments/platform | auth/API/billing | page/service | Blocked | Critical | Yes |
| FL-21 | Billing/payment routes/controllers/services/models | Payments/Stripe | payments/platform | auth/env/webhook | API/payment | Blocked | Critical | Yes |
| FL-22 | `client/src/features/admin/*`; `components/admin/*`; `pages/Admin*` | Admin UI/moderation | admin/platform | admin layout/guard/API/all domains | domain/security | Blocked | Critical | Yes |
| FL-23 | Server admin chain | Admin API | admin/platform | auth/roles/all domains | API/security | Blocked | Critical | Yes |
| FL-24 | `client/src/routes/*`; route constants/metadata | Routing | platform | all pages/nav/auth | route | Do not move | Critical | Yes |
| FL-25 | `client/src/config/navigation/*`; navigation components | Navigation | platform | routes/roles/layouts | nav | Do not move | Critical | Yes |
| FL-26 | `client/src/layouts/*`; dashboard/client/admin sidebars/topbars | Shells | dashboard shell/platform | routes/auth/nav | layout | Do not move | Critical | Yes |
| FL-27 | `client/src/services/apiClient.js`; API contracts/errors | HTTP platform | platform | all services/auth/env | API client | Do not move | Critical | Yes |
| FL-28 | `client/src/store/useAuthStore.js`; auth session | Identity state | platform | provider/guards/client | auth | Do not move | Critical | Yes |
| FL-29 | `server/src/app.js`; `server.js`; middleware/config/errors | Backend runtime | platform | all APIs | runtime | Do not move | Critical | Yes |
| FL-30 | `client/src/components/ui/*` | Generic visual primitives | shared-governed | many pages/features | UI | Do not move pending audit | High | No |
| FL-31 | `client/src/components/common/*` | Common components | shared/unknown | mixed consumers | UI | Blocked | High | Yes |
| FL-32 | `client/src/hooks/*` | Mixed cross-cutting/domain hooks | shared/platform/unknown | services/pages | hooks | Blocked | High | Yes |
| FL-33 | `client/src/utils/*` | Mixed helpers/fallbacks | shared/platform/unknown | many consumers | utilities | Blocked | High | Yes |
| FL-34 | `client/src/types/*`; `constants/*` | Contracts/constants | shared/platform/mixed | routes/API/features | types/constants | Do not move | High | Yes |
| FL-35 | `client/src/services/*` except canonical client | Service facades/platform features | shared/platform/mixed | hooks/pages/API | service | Blocked | High | Yes |
| FL-36 | `server/src/utils/*`; constants/config/errors | Backend shared/platform | platform/shared | all backend | utilities/config | Do not move | Critical | Yes |
| FL-37 | `server/src/services/*` not target-specific | Mixed platform/domain services | shared/platform/unknown | controllers/models/adapters | service | Blocked | High | Yes |
| FL-38 | `client/src/sections/home/*`; public route-shell pages | Marketing/public UI | public marketing | public layout/nav/API | page/section | Keep in place | Medium | No |
| FL-39 | `client/src/modules/proofarena/*`; `server/src/modules/proofarena/*` | Product composition boundary | ProofArena composition | store/shared platform | module | Do not duplicate | High | Yes |
| FL-40 | `server/src/modules/users/*` | User identity/account domain | platform/profile overlap | auth/profile/models | module | Blocked | Critical | Yes |

