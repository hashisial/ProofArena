# Stage 1.2 Final Source-of-Truth Lock Table

Generated: 2026-06-27

"Locked" means future planning must start here. It does not authorize deletion of compatibility files.

## Layout Locks

| Category | Competing/current files | Recommended source | Preserve temporarily | Investigate/removal candidates | Confidence | Reason/risk if wrong | Validation before edit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Public | PublicLayout, RootLayout, components/Layout | `client/src/layouts/PublicLayout.jsx` | RootLayout/Layout | Legacy pair only after runtime proof | High/low legacy | AppRoutes uses PublicLayout; wrong choice breaks all public chrome | Public route matrix and external/barrel ownership |
| Auth | AuthLayout | `client/src/layouts/AuthLayout.jsx` | N/A | None | High | Owns auth-page shell | Auth redirects/direct loads |
| Provider/shared | DashboardLayout | `client/src/layouts/DashboardLayout.jsx` | Role wrapper and current primitives | Repeated low-level markup only | High | Protects shared/provider content | Full role/mobile/sidebar QA |
| Client | ClientLayout | `client/src/layouts/ClientLayout.jsx` | Role wrapper | Repeated low-level markup only | High | Dedicated buyer shell | Client/legacy alias/role QA |
| Admin | AdminLayout | `client/src/layouts/AdminLayout.jsx` | Role wrapper and inline drawer | Repeated primitive implementation | High | Admin confidentiality | Admin/non-admin/auth-loading/focus QA |
| Sidebar | SidebarCore plus role wrappers | `SidebarCore.jsx` rendering; wrappers policy | All wrappers | Generic-only repetition | High | Universal navigation engine already exists | Active/disabled/collapsed/mobile tests |
| Inner page shell | SaaSLayout/WorkspaceLayout | `SaaSLayout.jsx` semantics | WorkspaceLayout alias | Alias after importer proof | High | Not a protected shell | Import/build/page header QA |

## Route/Path Locks

| Group | Declaration | Constants | Hardcoded locations | Recommended source | Align later | Paths frozen pending policy | Confidence | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Executable routes | AppRoutes | routes.js | N/A | AppRoutes declares behavior | Metadata/configs | All 108 entries | High | Route/guard/catch-all matrix |
| Browser paths | AppRoutes | `client/src/constants/routes.js` grouped exports | RTE-003..010 callers | routes.js | Literals/flattened aliases | Existing public/auth/protected URLs | High | Link/redirect/direct-load |
| Client | AppRoutes | routes.js/clientNavigation | Compatibility links | Human decision; `/client` planning candidate | Aliases via deprecation | All three client/workspace paths | Medium | Telemetry and role QA |
| Admin proof | AppRoutes | routes.js/adminNavigation | RouteShells/Admin.jsx | Human decision | Three proof paths | All three aliases | Low | Page/API/permission ownership |
| Metadata | AppRoutes | routeMetadata | 34 gaps | routeMetadata remains descriptive | Fill after alias ADR | Existing IDs and route behavior | High with gap | Titles/breadcrumb/access |
| API paths | Server route indexes | apiEndpoints | api.js/feature builders | Separate API namespace | Literals after contract map | HTTP contracts | High for separation | Backend method/path match |

## API Locks

| Category | Current files/raw calls | Client source | Token source | Base URL | Error source | Response source | Confidence | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Browser HTTP | apiClient, api.js, feature services, three direct profile callers | `client/src/services/apiClient.js` | `useAuthStore` via interceptor | `config/env.js` via resolver | `apiErrors.js`/apiClient | `apiContracts.js`/apiClient | High | Auth refresh/error/envelope/upload |
| Endpoints | apiEndpoints plus literals/builders | `client/src/constants/apiEndpoints.js` | N/A | Relative to /api base | N/A | N/A | High with gaps | 304-operation match |
| Domain requests | feature services and legacy facade | Feature `*Service.js` files | apiClient | apiClient | apiClient/domain copy | Domain services | High | Per-method caller tests |
| Legacy facade | `services/api.js` | Preserve temporarily only | apiClient | apiClient | Mixed | Mixed/fallbacks | High | 29-importer method map |
| Realtime/outbound | messagingSocket; server leadScraper fetch | Keep distinct | Transport-specific | Transport-specific | Transport-specific | Transport-specific | High | Realtime/security checks |
| Version | /api and /api/v1 plus feature builders | Human/ADR decision | N/A | Undecided | N/A | Contract-specific | Low | Telemetry/deprecation/contract suite |

## Placeholder Locks

| Category | Allowed temporary source | Dangerous source | Future owner | Stage before replacement | Confidence | Validation |
| --- | --- | --- | --- | --- | --- | --- |
| Planned pages | Shared placeholder/state components | Fake module/API implementation | Owning feature | Feature stage | High | Correct shell/copy/no mutation |
| Marketing previews | Explicitly disclosed home preview files | Unlabeled fake accounts/results | Public marketing plus live APIs | Public data stage | High | Disclosure remains visible |
| Business fallbacks | None as production truth | FALLBACK_SERVICES/PORTFOLIO/fallbackReviews | Domain APIs and empty/error states | API/feature cleanup | High | Empty/error/outage behavior |
| Auth placeholders | Development-only notice | Production readiness claim without delivery/throttle | Auth/security | Security stage | High | Provider and rate-limit E2E |
| Unknown pages | None | Accidental reuse/deletion | Human decision | Before cleanup | Low | Runtime/import/owner proof |

