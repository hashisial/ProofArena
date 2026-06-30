# Shared Code Do-Not-Move List

| Path/system | Reason | Risk if moved | Required validation | Stop condition |
|---|---|---|---|---|
| `client/src/components/ui/*` | Established shared primitives with broad consumers | UI breakage | Consumer graph, visual/a11y tests | Incomplete consumer evidence |
| Route/nav/access types/constants/utils | Platform contracts | Routing/security break | Stage 4/23 tests | Platform owner bypassed |
| `client/src/services/apiClient.js`; contracts/errors/query/socket | Global remote-data infrastructure | Auth/network/realtime break | Stage 5/realtime tests | Module ownership proposed |
| Auth hook/store/session bridges | Global identity | Security/session break | Stage 23 tests | Second auth source |
| Layout/sidebar/navigation shared components | Platform shells | Navigation/role break | Visual/role QA | Shell duplication |
| Generic root hooks/utils with unclear consumers | Unknown dependency graph | Hidden regressions | Full import/usage search | Unknown dependent |
| `server/src/utils/apiResponse.js`; errors/async handlers | API semantics | Contract break | Endpoint/error tests | Response drift |
| Server auth/token/cookie/owner-scope helpers | Security | Critical exposure | Security/import tests | Owner unclear |
| Server config/env/DB/CORS/cloudinary | Runtime configuration | Startup/deploy/data break | Startup/build/deploy checks | Config split |
| Infrastructure services: Stripe, email, queue, socket, cloudinary, database | Platform adapters | External integration break | Integration tests | Module copy proposed |
| Roles/status/queue/subscription constants | Cross-cutting contracts | Policy/data drift | Consumer/contract tests | Duplicate constant source |
| Any file with unknown consumer graph | Unproven safety | Unknown | Import/runtime evidence | Evidence incomplete |

