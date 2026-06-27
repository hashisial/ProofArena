# Stage 1.2 Source-of-Truth Decision Tables

Generated: 2026-06-27

These are cleanup-planning candidates, not authorization to refactor.

## A. Layout Source of Truth

| Layout type | Current files | Recommended source | Keep temporarily | Investigate/removal candidates later | Confidence | Risk if wrong | Required validation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Public shell | `PublicLayout.jsx`, `RootLayout.jsx`, `components/Layout.jsx` | `client/src/layouts/PublicLayout.jsx` | RootLayout and Layout | RootLayout/Layout only after runtime proof | High for PublicLayout; low for legacy ownership | Header/footer or public routes render under wrong shell | Entry/import scan, all public routes, auth/system route QA |
| Auth shell | `client/src/layouts/AuthLayout.jsx` | AuthLayout | None | None | High | Login/recovery/verification UX breaks | Guest/auth direct-load and redirect QA |
| Provider/shared shell | `DashboardLayout.jsx` | DashboardLayout role wrapper | Content/topbar/drawer files | Repeated low-level primitives | High | Protected data/role UI exposure | Provider/guest/client/admin matrix, mobile/sidebar QA |
| Client shell | `ClientLayout.jsx` | ClientLayout role wrapper | Client wrappers | Repeated low-level primitives | High | Buyer routes render provider shell or wrong access | Client role/direct-load/mobile QA |
| Admin shell | `AdminLayout.jsx` | AdminLayout role wrapper | Inline admin lifecycle | Repeated grid/content/drawer primitives | High | Admin confidentiality/focus behavior breaks | Admin/non-admin/auth-loading/keyboard QA |
| Sidebar engine | Role wrappers plus `SidebarCore.jsx` | SidebarCore for rendering; wrappers for policy | All role wrappers | Generic footer/brand repetition | High | All dashboard navigation breaks | Active/disabled/collapsed/mobile accessibility tests |
| Page content wrapper | DashboardContentShell, ClientContentShell, admin inline, SaaSLayout | Shared primitive only after tests; SaaSLayout stays inner page wrapper | Existing files | Dashboard/Client content wrappers | Medium | Width/spacing/back header regressions | Screenshot and overflow tests |
| Workspace alias | WorkspaceLayout and SaaSLayout | SaaSLayout semantics | WorkspaceLayout compatibility export | WorkspaceLayout import alias | High | Saved page import breaks | Import search/build before normalization |

## B. Route Constants Source of Truth

| Route group | Current files | Hardcoded locations | Recommended source | Align later | Must not change | Stale candidate | Confidence | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Executable tree | `client/src/routes/AppRoutes.jsx` | N/A | AppRoutes | Metadata and configs | Registered behavior/guard nesting | None without route decision | High | 108-entry route matrix |
| Browser paths | `client/src/constants/routes.js` | Public/auth/marketplace/legacy pages listed in RTE-003..010 | Grouped route exports | Literal callers and flattened aliases | Public/auth/protected URLs pending deprecation policy | Flattened aliases only after zero callers | High | Link, redirect, direct-load tests |
| Client aliases | routes.js/AppRoutes/clientNavigation | `/client`, `/dashboard/client`, `/dashboard/workspace` | Human/ADR decision; prefer dedicated ClientLayout path as planning candidate | Redirects/bookmarks/navigation | All aliases until telemetry | None yet | Medium | Client role/legacy bookmark telemetry |
| Admin proof aliases | routes.js/AppRoutes/adminNavigation/RouteShells | Three proof route names | Human/ADR decision | Admin nav and pages | All aliases until workflow owner selected | None yet | Low | Admin proof page/API ownership |
| Route metadata | `routeMetadata.js` | 34 missing patterns | Metadata remains descriptive source | Add after alias decisions | Existing IDs/paths | Missing records, not routes | High with gap | Breadcrumb/title/access tests |
| Active matching | Header, navigationActive, routeHelpers | Header local matcher | navigationActive after equivalence | Header | Exact root/nested behavior | Local helper later | Medium | Public/nav nested active tests |
| API-relative paths | apiEndpoints/api.js/feature utils | Legacy literals and conditional /v1 builders | Keep separate from browser routes | api.js and feature utils | HTTP methods/paths until API ADR | Literals after contract map | High for separation | Backend operation match |

## C. API Client Source of Truth

| Mechanism | Current files | Raw calls | Recommended source | Token source | Base URL source | Error source | Response source | Confidence | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Browser HTTP | `services/apiClient.js`, `services/api.js`, feature services | Only apiClient Axios instance; three profile components call it directly | apiClient transport plus domain feature services | `useAuthStore` through apiClient interceptor | `client/src/config/env.js` through `resolveApiBaseUrl` | `apiErrors.js`/apiClient | `apiContracts.js`/apiClient | High | Refresh, credentials, error, envelope, upload tests |
| Endpoint registry | `constants/apiEndpoints.js`, api.js literals | Legacy literals | apiEndpoints | N/A | Relative to apiClient /api base | N/A | N/A | High with backend gaps | Method/path/backend match |
| Legacy aggregate | `services/api.js` | apiGet/apiPost wrappers | Temporary compatibility only | apiClient | apiClient | Mixed normalized errors and fallbacks | Collection adapters/fallbacks | High | 29-importer method map before migration |
| Realtime | `services/messagingSocket.js` | Socket.IO | Keep distinct | Auth store/handshake | Realtime env/derived origin | Event-specific | Event payloads | High | Connect/reconnect/auth tests |
| Server outbound fetch | `server/src/services/leadScraperService.js` | Server fetch | Keep distinct backend service | Server context | External target/config | Service-specific | External data | High | SSRF/outbound URL/security review |
| API version | server route indexes and seven feature builders | Conditional /v1 | Human/ADR decision | N/A | /api and /api/v1 coexist | N/A | Contract-specific | Low | Telemetry and contract suite |

## D. Placeholder Source of Truth

| Category | Current files | Temporary allowed source | Dangerous source | Future real owner | Required stage | Confidence | Validation |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Public planned pages | `RouteShells.jsx` | Shared PublicPlaceholderPage/ModulePlaceholder with explicit copy | Legal/commercial/proof claims presented as final | Public content/legal/product modules | Owning feature/legal stage | High | Copy/disclosure and route QA |
| Marketing previews | FeaturedProviders/Challenges, ProofLedger previews, home workflow rows | Current files because disclosure is explicit | Unlabeled business-looking records | Public marketing plus real APIs later | Public data stage | High | Disclosure remains visible |
| Business fallbacks | `utils/constants.js`, `services/api.js`, `ReviewsSection.jsx` | Explicit empty/error states | FALLBACK_SERVICES, FALLBACK_PORTFOLIO, fallbackReviews after failures | Marketplace/profile/reviews APIs | API/feature cleanup | High | Empty, error, outage tests |
| Dashboard placeholders | Client pages, ProviderSettings, RouteShells modules | Shared placeholder components | Duplicate fake dashboard shell/data | Owning provider/client/admin feature | Feature stages | High | Correct shell/role and no fake API |
| Auth/security placeholders | VerifyEmail and backend auth TODOs | Development-only messaging | Production claim without delivery/throttling | Auth/email/security | Dedicated security stage | High | Provider delivery, rate limit, E2E auth |
| Unknown pages | Auth, Blogs, Contact, MyChallenges, PublicProfile, ServiceDetail | None selected | Accidental revival/deletion | Human ownership decision | Before cleanup | Low | Runtime/import/build/owner proof |

