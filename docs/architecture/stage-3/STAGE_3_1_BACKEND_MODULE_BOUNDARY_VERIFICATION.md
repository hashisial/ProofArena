# Backend Module Boundary Verification

| ID | Path/pattern | Type | Module | Platform/shared dependency | Model/API/auth | Duplicate/move risk | Readiness | Notes |
|---|---|---|---|---|---|---|---|---|
| BE-01 | `modules/auth`; auth route/controller/service/middleware variants | full/security | auth/platform | users, app, middleware, config | User/auth endpoints/critical | High/critical | Blocked | Existing variants. |
| BE-02 | Profile routes/controllers/services/models/validator | full domain | profile/users | auth, storage, API runtime | Profile models/mixed endpoints | High/critical | Blocked | Duplicate model/controller names. |
| BE-03 | Outcome-offer chain | full domain | offers | auth/profile/proof | OutcomeOffer/API | Medium/high | After tests | Clear chain. |
| BE-04 | Challenge chain | full domain | challenges | auth/profile/plans | Challenge/API | Medium/high | After tests | Clear chain. |
| BE-05 | Execution-plan chain | full domain | plans | auth/challenge/proof | ExecutionPlan/API | Medium/high | After tests | Clear chain. |
| BE-06 | Proof-asset chain | full domain | proof | auth/storage/profile | ProofAsset/API | High/critical | Blocked | Sensitive data/storage. |
| BE-07 | Match chain | full domain | matching | auth/challenge/profile | MatchRecord/API | Medium/high | After tests | Clear chain. |
| BE-08 | Message route/controller/model/socket/auth service | full/realtime | messages/platform | auth/users/socket | Message/API/critical | High/critical | Blocked | Mixed security/runtime. |
| BE-09 | Billing/marketplace payment chains/models/webhook | full/payment | payments/platform | auth/env/Stripe/app raw body | billing/payment/critical | High/critical | Blocked | Webhook contract. |
| BE-10 | Admin route/controller/service/validator/middleware | full/security | admin/platform | auth/roles/all domains | admin API/critical | High/critical | Blocked | Cross-domain authority. |
| BE-11 | `app.js`; `server.js`; route registries | runtime | platform | all | all endpoints | Critical/critical | Do not move | One API. |
| BE-12 | config/middleware/errors/response/DB helpers | platform | platform/shared | all | all APIs/models | Critical/critical | Do not move | Cross-cutting. |
| BE-13 | generic services/utils/constants | mixed | shared/platform/unknown | multiple controllers/adapters | mixed | High/high | Blocked | Consumer audit needed. |

