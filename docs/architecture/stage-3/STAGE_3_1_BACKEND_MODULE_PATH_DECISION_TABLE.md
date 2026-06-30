# Stage 3.1 Backend Module Path Decision Table

## Convention Evidence

- Governing runtime pattern: `server/src/routes`, `controllers`, `services`, `models`, `validators`, and `middleware`.
- Existing modules: auth is executable; users is limited; ProofArena is documentation-only.
- API registration uses both `/api/v1` and compatibility `/api` registries from `server/src/app.js`.
- Most target domains have registered layered vertical chains, not sibling module folders.
- Creating nine new backend module directories now would introduce a parallel organization without moving the active chains.

| Module | Recommended backend path now | Existing module folder | Related active files | Safe to create path now | Reason | Runtime impact if created | Duplicate risk | Validation required | Human |
|---|---|---|---|---|---|---|---|---|---|
| auth | Preserve `server/src/modules/auth`; reconcile compatibility variants | Yes | Module plus legacy/versioned auth chains | No new path | Existing module already owns a public boundary | Duplicate auth authority | Critical | Registrations, imports, auth suite | Yes |
| profile | Retain layered chain pending users/model decision | No | Profile routes/controllers/services/validators/models | No | Layered active chain and model variants | Parallel profile backend | Critical | Model consumers and API compatibility | Yes |
| offers | Retain layered outcome-offer chain | No | V1 route/controller/service/model/validator | No | Full registered chain exists | Duplicate handlers/services | High | Registration and vertical tests | Yes |
| challenges | Retain layered challenge chain | No | V1 route/controller/service/model/validator | No | Full registered chain exists | Duplicate handlers/services | High | Registration and vertical tests | Yes |
| plans | Retain layered execution-plan chain | No | V1 route/controller/service/model/validator | No | Full registered chain exists | Duplicate handlers/services | High | Registration and vertical tests | Yes |
| proof | Retain layered proof-asset chain | No | V1 route/controller/service/model/validator | No | Sensitive full chain exists | Duplicate data/security logic | Critical | Access/storage/redaction tests | Yes |
| matching | Retain layered match chain | No | V1 route/controller/service/model/validator | No | Full registered chain exists | Duplicate algorithm/handlers | High | Role/algorithm/API tests | Yes |
| messages | Retain layered message/socket chain | No | Routes/controller/model/socket/auth service | No | Realtime/platform ownership unresolved | Duplicate socket/security layer | Critical | Realtime/auth/event tests | Yes |
| payments | Retain billing/marketplace chains | No | Routes/controllers/services/models/webhook concerns | No | Multiple protected payment contexts exist | Duplicate Stripe/webhook behavior | Critical | Security, idempotency and raw-body tests | Yes |
| admin | Retain layered admin chain | No | Route/controller/service/validator/middleware | No | Cross-domain privileged chain exists | Duplicate admin authority | Critical | Permission/negative-access tests | Yes |

Decision: create no backend module paths or READMEs in Prompt 2.

