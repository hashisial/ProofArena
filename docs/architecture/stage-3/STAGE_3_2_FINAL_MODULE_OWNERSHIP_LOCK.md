# Final Stage 3.2 Module Ownership Lock

All ownership is future-facing; current files remain in place.

| Module | Owns components/hooks/services/API/types/validation/constants | Must not own | Platform dependencies | Shared dependencies | Migration rule | Human |
|---|---|---|---|---|---|---|
| auth | Auth-specific UI, approved hooks/use cases/adapters/contracts | Router, global client, session clone, role system, config | Auth provider/store/guards/API/middleware/users | UI, pure helpers, approved validation | Existing auth authorities resolved first | Yes |
| profile | Profile UI/state/operations/adapters/contracts | Credentials/session/storage infrastructure/router | Auth, API, routes, storage | UI/types/validation after approval | Resolve users/profile variants; vertical tests | Yes |
| offers | Offer UI/hooks/operations/adapters/contracts | Payments/auth/router/shell | API, auth, routes | UI/utils/types | One tested offer slice; no copies | Yes |
| challenges | Challenge UI/hooks/operations/adapters/contracts | Matching/plans internals/router | API, auth, routes | UI/utils/types | Explicit contracts with plans/matching | Yes |
| plans | Plan UI/hooks/operations/adapters/contracts | Challenge/proof internals/shell | API, auth, routes | UI/utils/types | Tested plan slice after contracts | Yes |
| proof | Proof UI/hooks/operations/adapters/contracts | Storage client/auth/global errors | API, auth, storage, routes | UI/utils/types | Resolve split features and security | Yes |
| matching | Match UI/hooks/operations/adapters/contracts | Identity/session/route policy | API, auth, routes | UI/utils/types | Algorithm/role tests first | Yes |
| messages | Message/conversation UI/hooks/operations/adapters/contracts | Auth identity/socket platform/notifications | API, auth, realtime, routes | UI/types | Realtime/auth contract first | Yes |
| payments | Payment-domain UI/hooks/operations/adapters/contracts | Stripe/env/webhook/global billing/auth | API, auth, payment platform | UI/types | Security/webhook approval first | Yes |
| admin | Moderation UI/hooks/operations/adapters/contracts | Role system/admin shell/router/global audit | API, auth/roles, admin shell | UI/types | Negative-access/policy tests first | Yes |

Allowed internal folders after explicit migration approval: `components`, `hooks`, `services`, `api`, `types`, `validation`, `constants`, `tests`, and `README.md`. No folder creation is authorized by this lock.

