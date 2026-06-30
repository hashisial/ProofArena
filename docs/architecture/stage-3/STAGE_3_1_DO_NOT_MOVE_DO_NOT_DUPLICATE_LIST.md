# Do-Not-Move / Do-Not-Duplicate List

| ID | System/path | Reason | Forbidden action | Move/duplicate risk | Required docs | Stop condition |
|---|---|---|---|---|---|---|
| DN-01 | Frontend entries | One app | Move/copy entry | Critical/critical | Stage 2 app lock | Second entry |
| DN-02 | Backend entries/app | One API | Move/copy app/listener | Critical/critical | Stage 2 app/API locks | Second runtime |
| DN-03 | Router/AppRoutes | One route tree | Module router | Critical/critical | Route lock | Parallel tree |
| DN-04 | Route constants/metadata | One catalog | Module route constants | Critical/critical | Route lock | Conflicting paths |
| DN-05 | Public/role navigation | One governance system | Module nav stack | Critical/critical | Nav lock | Second nav authority |
| DN-06 | Dashboard/client/admin/public/auth layouts | Shared shells | Module shell copy | Critical/critical | Layout lock | Parallel shell |
| DN-07 | Sidebar/topbar/state | Shared shell behavior | Module sidebar system | High/critical | Layout/nav locks | Independent state/config |
| DN-08 | Auth provider/store/session | One identity source | Module auth system | Critical/critical | Auth lock | Second session source |
| DN-09 | Protected/role guards and backend middleware | Security policy | Bypass/copy | Critical/critical | Auth/role docs | Unauthorized path |
| DN-10 | `apiClient.js`; contracts/errors | One transport | New API client | Critical/critical | API lock | Alternate base/token/errors |
| DN-11 | Config/env/package/deploy | Platform release config | Module config/deploy | Critical/critical | Stage 2 locks | Product split |
| DN-12 | DB connection/model registry conventions | Data integrity | Module DB connection | Critical/critical | Model maps | Separate data boundary |
| DN-13 | Global error/response handlers | API semantics | Module error stack | High/high | API docs | Divergent response |
| DN-14 | Shared UI governance | Cross-module primitives | Feature copy/dump | High/high | Stage 3.3 gate | Module import in shared UI |
| DN-15 | Shared utilities/types/constants governance | Cross-module contracts | Feature dump/copy | High/high | Stage 3.3 gate | Unknown owner assumed |
| DN-16 | Existing auth/users modules | Live security/user contracts | Duplicate scaffold | Critical/critical | Ownership lock | Same-purpose folder created |
| DN-17 | Payment/webhook platform files | Security/external contract | Move/copy casually | Critical/critical | Payment docs | Webhook/config drift |
| DN-18 | Admin shell/guard/middleware | Privileged access | Feature-owned clone | Critical/critical | Admin/role docs | Guard bypass |

