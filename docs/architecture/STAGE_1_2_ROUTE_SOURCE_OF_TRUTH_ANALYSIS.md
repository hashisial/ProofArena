# Stage 1.2 Route Source-of-Truth Analysis

Generated: 2026-06-27

## Verified Route Authorities

| Concern | Current source | Supporting files | Verified conclusion |
| --- | --- | --- | --- |
| Route declaration | `client/src/routes/AppRoutes.jsx` | `client/src/main.jsx` | AppRoutes is the executable frontend route tree: 108 entries including index and catch-all. |
| Browser path constants | `client/src/constants/routes.js` | `client/src/constants/index.js` | This is the path source-of-truth candidate. Grouped constants are canonical; flattened `ROUTES` aliases remain compatibility surface. |
| Route metadata | `client/src/config/routeMetadata.js` | `client/src/utils/routeMetadata.js` | Metadata describes known routes but does not declare them. Thirty-four named router patterns remain without matching metadata. |
| Public navigation | `client/src/config/navigation/publicNavigation.js` | `client/src/components/Header.jsx` | Navigation is metadata-derived except for CTA query-string construction and local active matching. |
| Provider navigation | `client/src/config/navigation/providerNavigation.js` | `client/src/components/navigation/DashboardSidebar.jsx` | Config owns provider item intent; the sidebar adapts items to SidebarCore. |
| Client navigation | `client/src/config/navigation/clientNavigation.js` | `client/src/components/client/ClientSidebar.jsx` | Config owns buyer navigation and uses metadata paths. |
| Admin navigation | `client/src/config/navigation/adminNavigation.js` | `client/src/components/navigation/AdminSidebar.jsx` | Config owns admin navigation; proof routes retain three compatibility names. |
| Auth redirects | `client/src/routes/authRouteUtils.js` | `client/src/routes/ProtectedRoute.jsx`, `RoleRoute.jsx`, `PublicOnlyRoute.jsx` | Guard components and authRouteUtils own route-level authentication redirects. |
| Role/dashboard fallback | `client/src/utils/accessPolicy.js` | `client/src/utils/getDashboardPathForRole.js` | accessPolicy is canonical; getDashboardPathForRole is a compatibility wrapper. |
| Active-route matching | `client/src/utils/navigationActive.js` | `client/src/utils/routeHelpers.js`, `client/src/components/Header.jsx` | Shared helpers exist, but Header retains a local implementation. |
| Route-group validation | `client/src/utils/routeValidation.js` | `client/src/constants/routes.js`, `client/src/utils/accessPolicy.js` | Responsibility is fragmented; no deletion or consolidation is safe without behavior tests. |
| Unknown-route handling | `client/src/routes/AppRoutes.jsx` | `client/src/pages/NotFound.jsx`, `client/src/utils/routeValidation.js` | The explicit `/not-found` route and terminal `*` catch-all both render NotFound. |
| API-relative paths | `client/src/constants/apiEndpoints.js` | `client/src/services/apiClient.js` | API paths are a separate namespace and must not be merged with browser route constants. |

## Verified Route/Path Systems

| ID | Route/path system | Declared where | Referenced where | Source-of-truth candidate | Status | Risk | Later cleanup recommendation | Must not touch before |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RTE-001 | Grouped constants plus flattened `ROUTES` aliases | `client/src/constants/routes.js` | Most client route/navigation files | Grouped exports in `routes.js` | Confirmed compatibility overlap | S2 | Document canonical names, then migrate aliases by importer. | Full import map and route regression tests |
| RTE-002 | Legacy local `appRoutes` shell set | `client/src/components/Layout.jsx` | `client/src/layouts/RootLayout.jsx` | AppRoutes plus centralized route groups | Confirmed duplicate route grouping; runtime ownership partial | S1 | Prove RootLayout has no runtime owner before replacing/removing the set. | Runtime entry/import evidence |
| RTE-003 | `/contact`, `/services`, `/portfolio`, `/marketplace` literals | Central constants and six public page/section files | Public CTAs and previews | `PUBLIC_ROUTES` | Confirmed hardcoded reference overlap | S2 | Replace per caller after link tests. | CTA destination inventory |
| RTE-004 | Home/auth literals | `routes.js`; literals in `Auth.jsx`, `Account.jsx`, `routeValidation.js` | Legacy auth/fallback behavior | `AUTH_ROUTES`, `PUBLIC_ROUTES` | Confirmed; Auth.jsx ownership unknown | S1 | Resolve legacy Auth page ownership before migration. | Login/register/recovery redirect tests |
| RTE-005 | Marketplace/dashboard literals | `routes.js`; literals in Marketplace and preview files | Marketplace cards, auth fallbacks | `PUBLIC_ROUTES`, `DASHBOARD_ROUTES` | Confirmed hardcoded reference overlap | S2 | Move callers to builders/constants after ID-vs-slug checks. | Marketplace navigation contract tests |
| RTE-006 | Legacy admin page paths | `routes.js`; `client/src/pages/Admin.jsx` | Unmapped legacy admin actions | `ADMIN_ROUTES` | Confirmed, page ownership unknown | S1 | Keep the page isolated until ownership is established. | Admin.jsx runtime/dead-code proof |
| RTE-007 | `/dashboard` fallback literal | `routes.js`; `SaaSLayout.jsx`, `Auth.jsx`, `Profile.jsx` | Back/fallback behavior | `getPrimaryDashboardPath` where role-aware, otherwise `DASHBOARD_ROUTES.DASHBOARD` | Confirmed contextual overlap | S2 | Classify each fallback before replacing. | Direct-load and browser-history tests |
| RTE-008 | Public profile pattern/builders | `DYNAMIC_ROUTES.PUBLIC_PROFILE` | Five provider/profile components and `PublicProfile.jsx` | A single `buildRoute`-based profile helper | Confirmed duplicate string construction | S1 | Introduce one builder only after username encoding behavior is tested. | Public profile link and encoding tests |
| RTE-009 | Public challenge pattern/builders | `DYNAMIC_ROUTES.PUBLIC_CHALLENGE` | ChallengeCard, firstClientUtils, matchUtils | A single `buildRoute`-based challenge helper | Confirmed duplicate string construction | S1 | Migrate callers incrementally. | Username/slug encoding tests |
| RTE-010 | Marketplace category/service patterns | `DYNAMIC_ROUTES.MARKETPLACE_CATEGORY`, `MARKETPLACE_SERVICE` | Marketplace, Saved, MarketplacePreview | Existing dynamic constants plus builders | Confirmed duplicate construction | S2 | Verify slug and service ID semantics first. | Marketplace API/page identifier contract |
| RTE-011 | `/client`, `/dashboard/client`, `/dashboard/workspace` | `routes.js`, AppRoutes | Client nav and compatibility entries | `CLIENT_ROUTES.DASHBOARD` for the dedicated client shell | Confirmed alias system | S1 | Formalize compatibility/deprecation policy before any removal. | Usage telemetry, bookmarks, redirect tests |
| RTE-012 | `/admin/proofs`, `/admin/proof-assets`, `/admin/proof-review` | `routes.js`, AppRoutes | Admin nav, RouteShells, legacy Admin page | Unknown pending proof-workflow ownership decision | Confirmed alias/overlap system | S1 | Select canonical UX route only after page/API ownership is mapped. | Admin proof route and endpoint contract tests |
| RTE-013 | Browser/API strings with similar values | `routes.js`, `apiEndpoints.js` | UI navigation and HTTP services | Keep separate typed namespaces | Corrected: namespace collision, not duplicate route ownership | S3 | Improve naming/documentation; do not merge registries. | No merge should be attempted |
| RTE-014 | Seven conditional `/v1` endpoint builders | Seven feature utility files | Feature service request helpers | API version policy plus one shared endpoint builder | Confirmed request-path duplication | S2 | Decide canonical API mount first. | API version ADR and contract tests |
| RTE-015 | Header-local active matching | `client/src/components/Header.jsx` | Public navigation | `client/src/utils/navigationActive.js` after equivalence tests | Confirmed helper overlap | S2 | Reuse shared helper only after exact/root/nested behavior comparison. | Navigation active-state tests |
| RTE-016 | Route grouping and fallback decisions | `routes.js`, routeValidation, routeMetadata, accessPolicy | NotFound/NotAuthorized/guards | Policy decision required; no single safe winner yet | Confirmed fragmented responsibility | S1 | Define responsibilities in route governance ADR before code changes. | Full guest/provider/client/admin matrix |
| RTE-017 | Dashboard-path compatibility wrapper | `getDashboardPathForRole.js` | Public header/system pages | `accessPolicy.getPrimaryDashboardPath` | Verified intentional wrapper | S3 | Keep until all imports are migrated. | Import map |
| RTE-018 | Endpoint constants versus facade literals | `apiEndpoints.js`, `services/api.js` | 29 facade importers | `apiEndpoints.js` plus feature services | Confirmed request-path duplication | S1 | Create method-level migration map; no bulk replacement. | Caller, method, backend-contract tests |
| RTE-019 | Router/metadata gap | AppRoutes and routeMetadata | PageHeader, breadcrumbs, access policy | AppRoutes declares; metadata describes | Confirmed 34-pattern coverage gap | S1 | Resolve alias policy, then add metadata deliberately. | Duplicate/alias route decision |
| RTE-020 | Static `/offers` constant | `routes.js`, disabled public nav | No matching static AppRoutes entry | Unknown future ownership; dynamic public offers already exist | Confirmed stale/future reference, not active duplicate | S2 | Keep disabled and document until a product route is approved. | Route ownership/product decision |

## Route Cleanup Gate

Route cleanup is not safe as a bulk operation. The minimum gate is:

1. Lock AppRoutes route count and role/guard matrix in tests.
2. Decide compatibility policy for client and admin-proof aliases.
3. Resolve the six unmapped pages and RootLayout ownership.
4. Add metadata coverage without changing routing.
5. Migrate literal links and builders one family at a time.
6. Keep browser routes and API paths as separate namespaces.

