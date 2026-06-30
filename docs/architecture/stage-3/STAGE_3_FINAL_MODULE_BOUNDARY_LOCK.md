# Final Stage 3 Module Boundary Lock

Allowed folders are future contracts only: `components`, `hooks`, `services`, `api`, `types`, `validation`, `constants`, `tests`, `README.md`. Every module may use only these folders after its gate passes; the list does not authorize creation.

| Module | Ownership | Allowed folders | Forbidden ownership | Platform dependencies | Shared dependencies | Migration readiness | Human | Final rule |
|---|---|---|---|---|---|---|---|---|
| auth | Identity-specific UI/use cases/contracts under platform security | Standard set after approval | Router, API client, duplicate session/roles/config | Auth platform, users | Shared UI, types, validation | Blocked | Yes | Preserve current authorities until security decision. |
| profile | Profile lifecycle | Standard set after approval | Credentials/session/storage platform | Auth, API, storage | Shared UI, types, validation | Dependency cleanup | Yes | Resolve profile/users variants first. |
| offers | Outcome-offer lifecycle | Standard set after approval | Payments/auth/router | API, auth, profile, proof | Shared UI, types, validation | After tests | Yes | Migrate one complete slice only. |
| challenges | Challenge lifecycle | Standard set after approval | Plans/matching internals/router | API, auth, profile | Shared UI, types, validation | After tests | Yes | Use explicit cross-module contracts. |
| plans | Execution-plan lifecycle | Standard set after approval | Challenge/proof internals/shell | API, auth, challenge, proof | Shared UI, types, validation | After tests | Yes | Permit no cycle or partial migration. |
| proof | Proof assets/readiness | Standard set after approval | Storage/auth/global errors | API, auth, storage, profile | Shared UI, types, validation | Blocked | Yes | Resolve split ownership and security first. |
| matching | Matching lifecycle | Standard set after approval | Identity/route policy | API, auth, challenge, profile | Shared UI, types, validation | After tests | Yes | Define algorithm and role contracts first. |
| messages | Message/conversation domain | Standard set after approval | Auth identity/socket platform | API, auth, users, realtime | Shared UI, types, validation | Blocked | Yes | Establish realtime/auth ownership first. |
| payments | Payment domain operations | Standard set after approval | Stripe/env/webhook/global billing | API, auth, payment platform | Shared UI, types, validation | Blocked | Yes | Obtain security and payment approval first. |
| admin | Moderation operations | Standard set after approval | Role system/admin shell/router | API, auth/roles, all domains | Shared UI, types, validation | Blocked | Yes | Keep privileged platform policy external. |

No module folder, file move, import rewrite, route/API wiring, or business implementation is authorized by this lock.
