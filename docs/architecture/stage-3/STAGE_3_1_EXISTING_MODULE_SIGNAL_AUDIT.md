# Existing Module Signal Audit

| ID | File path | Current purpose | Likely module | Confidence | Dependencies | Early-move risk | Recommendation |
|---|---|---|---|---|---|---|---|
| MS-01 | `client/src/features/auth` | Auth provider, service, hooks, forms | auth/platform | High | auth store, API client, routes | Critical | Platform-owned; map only. |
| MS-02 | `server/src/modules/auth` | Existing backend auth module | auth/platform | High | app routes, middleware, users | Critical | Keep in place. |
| MS-03 | `server/src/routes/authRoutes.js`; `routes/v1/auth.routes.js` | Legacy/versioned auth routes | auth/platform | Medium | controllers/services/middleware | Critical | Human review; do not move. |
| MS-04 | `client/src/features/profile`; `components/profile`; `pages/profile` | Profile workflows | profile | High | auth, API, routes, shared UI | High | Future module candidate. |
| MS-05 | `server/src/routes/profileRoutes.js`; `routes/v1/profile.routes.js` and peers | Profile API layers | profile | Medium | users/auth/models | Critical | Map variants before migration. |
| MS-06 | `client/src/features/outcomeOffers`; `components/outcomeOffers` | Offer lifecycle | offers | High | routes, API, auth | High | Future candidate after tests. |
| MS-07 | `server/src/*/outcomeOffer*`; `models/OutcomeOffer.model.js` | Offer backend | offers | High | challenge/profile/proof | High | Vertical migration candidate. |
| MS-08 | `client/src/features/challenges`; `components/challenges` | Challenge lifecycle | challenges | High | profile, plans, matching | High | Future candidate after tests. |
| MS-09 | `server/src/*/challenge*`; `models/Challenge.model.js` | Challenge backend | challenges | High | auth/profile/plans | High | Vertical migration candidate. |
| MS-10 | `client/src/features/executionPlans`; `components/executionPlans` | Plan lifecycle | plans | High | challenges/proof/auth | High | Future candidate after tests. |
| MS-11 | `server/src/*/executionPlan*`; `ExecutionPlan.model.js` | Plan backend | plans | High | challenge/profile/proof | High | Vertical migration candidate. |
| MS-12 | `client/src/features/proof`; `features/proofAssets`; `components/proof` | Proof assets/readiness | proof | High | profile/plans/storage | Critical | Consolidate ownership first. |
| MS-13 | `server/src/*/proofAsset*`; `ProofAsset.model.js` | Proof backend | proof | High | storage/auth/profile | Critical | Security/data tests first. |
| MS-14 | `client/src/features/matches`; `components/matches` | Matching workflows | matching | High | challenges/profile | High | Future candidate after tests. |
| MS-15 | `server/src/*/match*`; `MatchRecord.model.js` | Matching backend | matching | High | challenge/profile | High | Vertical migration candidate. |
| MS-16 | `client/src/pages/Messages.jsx`; server message files | Messaging UI/API/socket | messages/platform | Medium | auth/users/socket | Critical | Clarify platform ownership. |
| MS-17 | `server/src/services/messagingAuthService.js` | Messaging authorization | messages/auth shared | Medium | auth/middleware | Critical | Human review. |
| MS-18 | `client/src/pages/Payments.jsx`; billing service calls | Billing/payment UI | payments/platform | Medium | auth/API/billing | Critical | Platform-sensitive. |
| MS-19 | `server/src/routes/billingRoutes.js`; `marketplacePaymentRoutes.js` and peers | Billing/marketplace payments | payments/platform | Medium | Stripe/auth/webhook | Critical | Human/security review. |
| MS-20 | `client/src/features/admin`; `components/admin`; `pages/Admin*` | Moderation/admin UI | admin/platform | High | roles, API, layouts | Critical | Platform role boundary. |
| MS-21 | `server/src/routes/adminRoutes.js`; admin controller/service/validator | Admin backend | admin/platform | High | auth/roles/all domains | Critical | Keep security boundary. |
| MS-22 | `client/src/routes/AppRoutes.jsx`; constants/navigation | Route/navigation platform | platform | High | all modules | Critical | Never module-owned. |
| MS-23 | `client/src/layouts`; navigation sidebars | Shell/layout platform | dashboard shell | High | routes/auth | Critical | Never module-owned. |
| MS-24 | `client/src/services/apiClient.js` | Global HTTP transport | platform | High | env/auth/contracts | Critical | Never duplicate. |
| MS-25 | `client/src/components/ui`; `components/common` | Shared UI candidates | shared-governed | Medium | many consumers | High | Audit in Stage 3.3. |
| MS-26 | `client/src/hooks`; `utils`; `types`; `constants`; `services` | Mixed shared/platform helpers | shared/platform/unknown | Medium | cross-module | High | Classify before moving. |
| MS-27 | `server/src/utils`; `constants`; `config`; middleware | Shared backend platform | platform/shared | High | all endpoints | Critical | Do not module-copy. |
| MS-28 | `client/src/sections/home`; public pages | Marketing/flagship composition | public marketing | High | public layout/nav | Medium | Outside target modules. |
| MS-29 | `client/src/modules/proofarena`; `server/src/modules/proofarena` | Product module boundary docs/hook | ProofArena composition | High | shared store/platform | High | Preserve; no domain copies. |
| MS-30 | `server/src/modules/users` | Existing users module | platform/profile overlap | Medium | auth/profile | Critical | Human ownership review. |

