# Stage 3.1 Backend Module Boundary Blueprint

Authority note: this blueprint describes future ownership without changing the current layered backend.

## Allowed Internal Structure

After explicit approval, a module may own domain `routes/`, `controllers/`, `services/`, `models/` or `schemas/`, module-only `middleware/`, `validators/`, `types/` or `interfaces/` where supported, pure module `utils/`, and `tests/`. Registration, auth/role middleware, error/response contracts, database connections, API versioning, config/env, webhooks, and process entry remain platform-owned unless a later stage explicitly assigns them.

## Forbidden Backend Patterns

- Auth or role bypass/duplication, direct route-to-model business logic, a second DB connection, module API versioning, separate ProofArena server, divergent response/error formats, or unsafe identity/payment storage.
- Partial vertical moves that leave duplicate routes/controllers/services/models active.

| Module | Recommended future path | Existing candidate chain | Safe to create now | Likely owned models/endpoints later | Validation before production changes |
|---|---|---|---|---|---|
| auth | Preserve `server/src/modules/auth`; reconcile variants before any structure change | Existing auth module plus legacy/versioned routes/controllers/services/middleware | No | Auth use cases and credential/session endpoints only after authority decision | Full auth, token, middleware, compatibility and negative-access suite |
| profile | One approved profile module after users/profile contract decision | Profile route/controller/service/validator and duplicate profile models | No | Provider/User profile contract and profile endpoints | Model compatibility, privacy, auth, storage, migration tests |
| offers | Future approved offer module or retained layered chain | Outcome-offer full chain and model | No; later candidate | `OutcomeOffer` and offer lifecycle endpoints | Route/service/model contract, authorization and regression tests |
| challenges | Future approved challenge module or retained layered chain | Challenge full chain and model | No; later candidate | Challenge model and lifecycle endpoints | Role, application, status and cross-module tests |
| plans | Future approved plan module or retained layered chain | Execution-plan full chain and model | No; later candidate | `ExecutionPlan` and plan endpoints | Challenge/proof contracts and lifecycle tests |
| proof | One proof module only after storage/security decision | Proof-asset full chain and model | No | `ProofAsset` and proof/readiness endpoints | Access, redaction, upload/storage and data-security tests |
| matching | Future approved matching module or retained layered chain | Match full chain and model | No; later candidate | `MatchRecord` and recommendation endpoints | Algorithm, role, data and performance tests |
| messages | Domain module only after socket/auth platform contract | Message route/controller/model/socket events and messaging auth service | No | `Message`, conversation endpoints and events | Auth, socket, reconnect, authorization and event tests |
| payments | Domain module only after payment/security architecture approval | Billing and marketplace-payment chains, models and webhook handling | No | Payment/invoice/payout models and protected endpoints | Stripe, webhook signature/raw body, idempotency, secrets and rollback tests |
| admin | Admin domain handlers under existing privileged platform boundary | Admin route/controller/service/validator/middleware | No | Moderation operations; domain models remain domain-owned | Role/permission, negative-access, audit and cross-domain contract tests |

No backend module folder or README scaffold is approved by Prompt 1.

