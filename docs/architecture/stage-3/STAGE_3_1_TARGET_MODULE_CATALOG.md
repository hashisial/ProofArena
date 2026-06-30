# Target Module Catalog

All modules may own domain components/hooks/services/types/API adapters/validation, but never platform router, shells, auth transport, config, or shared governance.

| ID | Module | Purpose | Frontend/backend/data scope | Allowed artifacts | Forbidden ownership | Shared/platform dependencies | Route/auth notes | Evidence | Readiness |
|---|---|---|---|---|---|---|---|---|---|
| TM-01 | auth | Identity/session workflows | Auth forms/services; backend auth use cases; user credentials only where approved | Components, hooks, services, validation, types | Global router, API client, role system clone | API client, auth store, middleware, users | Platform-owned security; route registration external | `features/auth`; `server/modules/auth`; auth variants | Blocked |
| TM-02 | profile | Public/private profile lifecycle | Profile UI/API/profile models | Domain artifacts | Credentials/session/router | auth, shared UI, storage | Uses shared guards/routes | profile feature/pages/server variants | Human review |
| TM-03 | offers | Outcome offers | Offer UI/API/model | Domain artifacts | payments/auth/router | profile, proof, shared API | Public/protected routes external | outcomeOffers domains | Ready with caution |
| TM-04 | challenges | Challenge lifecycle | Challenge UI/API/model | Domain artifacts | matching/plans internals | profile, shared API/UI | Role routes external | challenges domains | Ready with caution |
| TM-05 | plans | Execution plans | Plan UI/API/model | Domain artifacts | dashboard shell/router | challenges, proof, profile | Role routes external | executionPlans domains | Ready with caution |
| TM-06 | proof | Proof assets/readiness | Proof UI/API/model/validation | Domain artifacts | storage/auth platform | profile, plans, shared storage | Protected/public routes external | proof/proofAssets domains | Human review |
| TM-07 | matching | Match computation/workflows | Match UI/API/model | Domain artifacts | identity/route platform | challenges, profile | Role enforcement external | matches domains | Ready with caution |
| TM-08 | messages | Conversations/messages | Message UI/API/socket domain | Domain artifacts | auth identity/socket platform | users, shared realtime | Protected routes external | message files/socket events | Human review |
| TM-09 | payments | Billing/marketplace payments | Payment UI/API/Stripe domain | Domain artifacts | global billing config/webhook security | auth, API, env, Stripe | Protected/admin routes external | billing/payment files | Blocked |
| TM-10 | admin | Moderation operations | Admin UI/API policies | Domain artifacts | role system/admin shell/router | all domains, shared auth | Admin guards external | admin feature/pages/server | Blocked |

