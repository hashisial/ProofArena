# Stage 3.1 Final Backend Module Path Lock

The current backend combines an existing auth module with registered layer-oriented domain chains. No new backend module path is authorized.

| Module | Final recommended path | Existing match | Status | Created | Documentation-only | Runtime/API impact | Model impact | Middleware impact | Duplicate risk | Future validation | Human |
|---|---|---|---|---|---|---|---|---|---|---|---|
| auth | Preserve `server/src/modules/auth`; reconcile registered variants | Yes | confirmed with caution | No | No; existing runtime path | None | None | None | Critical if another auth path appears | Registry/import/auth compatibility tests | Yes |
| profile | Retain layered profile chain pending users/model decision | No module folder | blocked | No | N/A | None | None | None | Critical parallel backend/model | Model/API/privacy tests | Yes |
| offers | Retain layered outcome-offer chain | No module folder | confirmed with caution | No | N/A | None | None | None | High duplicate handlers/services | Registered vertical tests | Yes |
| challenges | Retain layered challenge chain | No module folder | confirmed with caution | No | N/A | None | None | None | High duplicate handlers/services | Registered vertical/role tests | Yes |
| plans | Retain layered execution-plan chain | No module folder | confirmed with caution | No | N/A | None | None | None | High duplicate handlers/services | Registered vertical/contract tests | Yes |
| proof | Retain layered proof-asset chain | No module folder | blocked | No | N/A | None | None | None | Critical data/security duplicate | Access/storage/redaction tests | Yes |
| matching | Retain layered match chain | No module folder | confirmed with caution | No | N/A | None | None | None | High algorithm/handler duplicate | Algorithm/role/API tests | Yes |
| messages | Retain layered message/socket chain | No module folder | blocked | No | N/A | None | None | None | Critical socket/security duplicate | Realtime/auth/event tests | Yes |
| payments | Retain billing and marketplace-payment chains | No module folder | blocked | No | N/A | None | None | None | Critical Stripe/webhook duplicate | Security/idempotency/raw-body tests | Yes |
| admin | Retain layered admin chain under platform security | No module folder | confirmed with caution | No | N/A | None | None | None | Critical privileged duplicate | Permission/negative-access tests | Yes |

Backend routes, controllers, services, models, validators, middleware, API registries and imports remain unchanged.

