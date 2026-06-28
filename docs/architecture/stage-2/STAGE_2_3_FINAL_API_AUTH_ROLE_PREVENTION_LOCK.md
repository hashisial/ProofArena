# Final API, Auth, and Role Prevention Lock

| ID | Area/files | ScaleOps ownership | Forbidden duplicate | Required docs/validation | Security risk | Stop condition | Human |
|---|---|---|---|---|---|---|---|
| AA-01 | API client: `services/apiClient.js` | Base URL, credentials, refresh, normalization | New client/instance | API locks; network/auth/error QA | Critical | Alternate transport | Yes |
| AA-02 | Frontend services: feature services/`services/api.js` | Domain calls through canonical client | Copied module service facade | Service/import/contract tests | High | New request path | Yes |
| AA-03 | Raw requests | Exceptions require explicit review | Component `fetch`/axios instance | Request scan; error/auth QA | High | Duplicated base/token logic | Yes |
| AA-04 | Backend routes: existing registries | One Express app and versioned contracts | Module API router/server | API inventory; endpoint tests | Critical | Second server/registry authority | Yes |
| AA-05 | Controllers | HTTP translation in existing layer | Module controller stack copy | Backend flow/tests | High | Layer duplication | Yes |
| AA-06 | Services | Domain use cases in current owners | Compatibility service copies | Ownership/boundary/tests | High | Duplicate business logic | Yes |
| AA-07 | Models | Existing DB connection and model ownership | Product DB/model namespace | Model map/migration tests | Critical | Separate connection/schema clone | Yes |
| AA-08 | Auth provider/context: `features/auth` | One frontend identity context | ProofArena AuthProvider | Auth architecture/session tests | Critical | Second auth provider | Yes |
| AA-09 | Protected guards: route guards | One auth route policy | Module protected wrapper | Negative route tests | Critical | Guard bypass | Yes |
| AA-10 | Role guards/access helpers | Shared role policy | UI-only module role policy | Role matrix/access tests | Critical | Sole hardcoded UI enforcement | Yes |
| AA-11 | Backend auth middleware variants | Existing overlap to be traced, not copied | New auth middleware variant | Import/route/security tests | Critical | New variant or bypass | Yes |
| AA-12 | Backend role/admin middleware | Shared backend enforcement | Module role middleware | Permission/negative API tests | Critical | Missing backend enforcement | Yes |
| AA-13 | Hardcoded role assumptions | Presentation hints only | Security decision in component | Guard/middleware trace | High | UI check is sole protection | Yes |
| AA-14 | Token handling | Auth store + canonical interceptor | Module token/localStorage scheme | Refresh/logout/session tests | Critical | Competing token source | Yes |
| AA-15 | Error/base/response contracts | `apiClient.js`, API errors/contracts, server response/errors | Module normalization/error stack | Error/timeout/401/500 QA | High | Divergent response semantics | Yes |

