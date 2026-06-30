# Stage 3.1 Final Module Interdependency Lock

| Module | Allowed dependencies | Forbidden dependencies | Platform dependencies | Shared dependencies | Cross-module rule | Circular risk | Sensitive risk | Required validation |
|---|---|---|---|---|---|---|---|---|
| auth | Users/identity public contracts and platform auth services | Module reimplementation of auth/session/tokens/roles | Provider/store/guards/API/middleware/routes | Shared UI and neutral validation/types | Auth remains platform-governed | Critical if modules depend on auth internals | Credentials/session | Auth graph and security tests |
| profile | Platform auth plus public proof summary | Auth internals, proof models/services, storage client | Auth/API/routes/storage/roles | Shared UI/types/validation | Expose a profile public contract | High with users/auth | Privacy/identity | Consumer/model/privacy tests |
| offers | Public profile/proof/payment contracts | Private profile/proof services/models; payment execution | Auth/API/routes | Shared UI/types/utils | Own offer lifecycle only | High with proof/payments | Offer/payment/proof visibility | Contract and vertical tests |
| challenges | Public profile/offers/matching/proof/messages contracts | Other module models/private services, route/shell ownership | Auth/API/routes/shell | Shared UI/types/utils | Use IDs and public commands/queries | High across plans/matching | Permissions/proof visibility | Dependency/cycle/role tests |
| plans | Public challenge/proof/payment contracts | Direct models/private services; payment processing | Auth/API/routes/shell | Shared UI/types/utils | Payments may be called only through approved contract | High with challenge/proof | Financial/package state | Contract/cycle/payment tests |
| proof | Public profile/plan context | Auth/storage internals; leaking private proof | Auth/API/routes/storage/guards | Shared UI/types/validation | Offers/challenges may reference redacted public proof contract | High with profile/plans | Private evidence/data | Access/redaction/storage tests |
| matching | Public challenge/profile inputs | Auth/permission bypass, direct models/private services | Auth/roles/API/routes | Shared UI/types/utils | Typed/scoped inputs only | High with challenges/profile | Role/scoring decisions | Algorithm/permission/cycle tests |
| messages | Public user/challenge context | Auth/session/socket/notification platform internals | Auth/users/API/routes/realtime/guards | Shared UI/types | Messaging commands/events use platform identity | Critical with auth/realtime | Conversation access | Realtime/auth/event tests |
| payments | Authenticated actors and approved offer/plan identifiers | Private offer/plan models, fake state, secrets/env/Stripe direct imports | Auth/API/config/payment provider/errors | Shared UI/types/validation | Plans/offers call payment contract, never import payment internals casually | Critical | Money, secrets, webhooks | Security/idempotency/contract tests |
| admin | Public moderation/query commands from all modules | Private models/services and unrelated business logic | Admin routes/roles/shell/API/audit | Shared UI/types | Admin manages through domain contracts; domains retain rules | Critical across all modules | Privilege and data access | Permission/negative-access/contract tests |

## Global Lock

- Module-to-module access uses public interfaces or API adapters only.
- No direct cross-module model access, private service imports, API-client bypass, auth/role bypass, frontend/backend cross-import, or cycle.
- Shared utilities require real multi-module reuse and cannot become a dumping ground.
- Unknown ownership or a detected cycle is an immediate stop condition.

