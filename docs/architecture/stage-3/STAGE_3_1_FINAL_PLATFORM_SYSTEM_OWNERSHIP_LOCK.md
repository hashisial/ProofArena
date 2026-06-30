# Stage 3.1 Final Platform System Ownership Lock

| ID | System | Current paths | Platform owner | May use | Must not own | Forbidden duplicate | Risk | Required docs | Validation | Stop condition | Human |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FPS-01 | Router | `client/src/routes/AppRoutes.jsx` | ScaleOps | All modules | All modules | Module router/tree | Critical | Stage 2 route lock, ADR-0001 | Routes/redirects/404/build | Second route authority | Yes |
| FPS-02 | Route constants | `constants/routes.js`, `config/routeMetadata.js` | ScaleOps | All frontend modules | All modules | Module route registry/hardcoded governed paths | Critical | Route inventory/lock | Reference scan | Conflicting source | Yes |
| FPS-03 | Public navigation | Public navigation config/navbar | ScaleOps | Public/module pages | All modules | Module public nav stack | High | Navigation lock | Link/active/mobile tests | Parallel nav | Yes |
| FPS-04 | Dashboard shell | Dashboard layout/shell components | ScaleOps | Dashboard modules | All modules | Module shell | Critical | Dashboard lock | Role/responsive/render tests | Second shell | Yes |
| FPS-05 | Sidebar | Dashboard/Admin sidebars, SidebarCore, mobile sidebar | ScaleOps | Dashboard/admin modules | All modules | Sidebar engine/config clone | Critical | Sidebar lock | Role/mobile/active tests | Duplicate behavior | Yes |
| FPS-06 | Layouts | `client/src/layouts/*` | ScaleOps | Routeable modules | All modules | Public/auth/client/admin/provider layout | Critical | Layout lock | Nesting/guard/visual tests | Parallel layout | Yes |
| FPS-07 | Auth provider/context | AuthProvider, auth hooks/store/session | ScaleOps | All protected modules | All modules | Provider/store/session/token clone | Critical | Auth lock | Hydration/login/logout/expiry | Second identity source | Yes |
| FPS-08 | Protected guards | Protected/PublicOnly/EmailVerified routes | ScaleOps | All protected modules | All modules | Module guard/UI-only security | Critical | Route/auth locks | Positive/negative access | Guard bypass | Yes |
| FPS-09 | Role guards/middleware | RoleRoute, RequireRole, server role/auth middleware | ScaleOps | Role-aware modules | All modules | Role registry/middleware clone | Critical | Permission docs | Permission matrix/denials | Divergent role decision | Yes |
| FPS-10 | API client | `services/apiClient.js`, contracts/errors/endpoints | ScaleOps | All frontend modules | All modules | Fetch/axios/base/token/error client | Critical | API lock | Network/auth/error/envelope | Alternate transport | Yes |
| FPS-11 | Backend API versioning | `server/src/app.js`, route registries | ScaleOps | Backend modules via registration | All modules | API root/version/server | Critical | API inventory/lock | Mount/compatibility/API tests | New version root | Yes |
| FPS-12 | Response/error format | Server errors, API response, error middleware | ScaleOps | All backend modules | All modules | Module error/response stack | High | API contract docs | Envelope/status/logging | Divergent semantics | Yes |
| FPS-13 | Database connection | `server/src/config/db.js` | ScaleOps | Persistence modules | All modules | Module DB/client | Critical | Backend flow map | Startup/connection/index tests | Second DB authority | Yes |
| FPS-14 | Config/env | Client/server config and root env/package/build/deploy | ScaleOps | Modules through approved readers | All modules | Module env/package/deploy boundary | Critical | Config protection docs | Env/build/start checks | Product/platform split | Yes |
| FPS-15 | Shared UI | `components/ui`, governed common components | ScaleOps shared governance | All frontend modules | Individual modules | Module design-system copy/feature logic in shared | High | Shared approval gate | Consumer/accessibility/visual tests | Owner/reuse absent | Conditional |
| FPS-16 | Shared utilities | Root shared-like client/server helpers | ScaleOps shared/platform by file | Approved consumers | Individual modules | Feature dumping/reverse imports/platform helper copies | High | Shared import policy | Consumers/cycles/purity | Unknown owner assumed | Yes |
| FPS-17 | Design tokens | `constants/designTokens.js`, styles/tokens/typography | ScaleOps design system | All frontend modules | All modules | Module theme/token source | High | Design-system docs | Usage/contrast/responsive | Competing token source | Yes |
| FPS-18 | Documentation governance | `docs/architecture`, ADR index/manifests | Project architecture | All prompts | Modules | Contradictory authority doc | High | Final source indexes/ADR | Links/status/manifest consistency | Final lock contradiction | Yes |

All modules may consume approved platform interfaces. No module may own or duplicate these systems without an explicit later architecture decision and human approval.

