# Stage 1.1 Critical File Protection List

Generated: 2026-06-27T16:22:15.6507021+05:00

All files in this registry are **document only** during Stage 1.1. “Known dependents” lists representative importers or runtime consumers; consult `stage-1-1-architecture-graph.json` for the complete edge set.

## 1. Route-Critical Files

| ID | File | Why critical | Known dependents | Now | Future action | Required pre-checks | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CFR-001 | `client/src/routes/AppRoutes.jsx` | Owns 108 registered frontend routes and guard/layout composition. | `client/src/App.jsx` | Document only | Refactor only after route tests | Route inventory, route matrix, guards, aliases, catch-all | EV-F0464 |
| CFR-002 | `client/src/constants/routes.js` | Supplies route constants to at least 13 direct importers. | Navigation, workspace, challenge components | Document only | Modify with migration caution | Import graph, metadata, hardcoded-path scan | EV-F0291 |
| CFR-003 | `client/src/config/routeMetadata.js` | Drives navigation/breadcrumb/access metadata and has 34 known gaps. | Four navigation configs and route helpers | Document only | Complete under route governance | Route inventory, missing-metadata list, breadcrumb tests | EV-X010 |
| CFR-004 | `server/src/routes/index.js` | Active unversioned API registry. | `server/src/app.js` | Document only | Refactor only after compatibility tests | API inventory, mount matrix, client callers | EV-X005 |
| CFR-005 | `server/src/routes/v1/index.js` | Active versioned registry and ProofArena route surface. | `server/src/app.js` | Document only | Refactor only after API-version ADR | 233 dual mounts, endpoint tests, migration telemetry | EV-X006 |
| CFR-006 | `client/src/config/navigation/publicNavigation.js` | Public navigation source consumed through constants/header rendering. | `client/src/constants/navigation.js` | Document only | Modify with route/access review | Public routes, disabled links, auth CTA behavior | EV-F0280 |

## 2. Auth-Critical Files

| ID | File | Why critical | Known dependents | Now | Future action | Required pre-checks | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CFR-007 | `client/src/App.jsx` | Composes auth and application providers before routes. | `client/src/main.jsx` | Document only | Refactor only after app integration tests | Provider order, hydration, error boundaries | EV-X002 |
| CFR-008 | `client/src/features/auth/AuthProvider.jsx` | Hydrates and exposes frontend auth state. | `client/src/App.jsx` | Document only | Stage 23 with regression tests | Login/logout/refresh/verification flows | EV-F0299 |
| CFR-009 | `client/src/features/auth/authService.js` | Frontend auth API behavior used by provider and legacy facade. | `AuthProvider.jsx`; `services/api.js` | Document only | Consolidate only after caller migration | Endpoint contracts, token/cookie behavior | EV-F0302 |
| CFR-010 | `client/src/store/useAuthStore.js` | Shared auth state used by guards and system pages. | Ten direct importers | Document only | Modify with state migration plan | Store selectors, hydration flags, role normalization | EV-F0524 |
| CFR-011 | `client/src/routes/AuthHydration.jsx` | Prevents guard decisions before session hydration. | `AppRoutes.jsx` | Document only | Modify only with auth-loading tests | Loading state, refresh, redirect loops | EV-F0465 |
| CFR-012 | `client/src/routes/ProtectedRoute.jsx` | Blocks guest access to protected routes. | `AppRoutes.jsx` | Document only | Modify only with route matrix tests | Guest/provider/client/admin cases | EV-F0467 |
| CFR-013 | `client/src/routes/RoleRoute.jsx` | Enforces role-specific route access. | `AppRoutes.jsx` | Document only | Stage 26 permission matrix | Allowed roles, admin override, unknown role | EV-F0469 |
| CFR-014 | `server/src/modules/auth/auth.routes.js` | Registers current modular auth endpoints and middleware. | `server/src/modules/auth/index.js` | Document only | Refactor after auth contract suite | Route inventory, validation, rate limits | Path verified |
| CFR-015 | `server/src/modules/auth/auth.service.js` | Implements current modular login/session/verification behavior. | `auth.controller.js` | Document only | Stage 23 after canonical-auth ADR | Legacy service callers, email/token behavior | EV-F0688 |
| CFR-016 | `server/src/middleware/auth.middleware.js` | Authenticates modular/v1 and compatibility routes. | Eleven direct importers | Document only | Consolidate route-by-route after tests | Token sources, request user shape, error codes | EV-F0618 |
| CFR-017 | `server/src/middleware/authMiddleware.js` | Active compatibility authentication middleware. | Ten route importers | Document only | Remove only after zero-import proof | All route imports and compatibility exports | EV-F0619 |
| CFR-018 | `server/src/middleware/role.middleware.js` | Role enforcement used directly and through aliases. | Nine direct importers | Document only | Stage 26 with permission tests | Role names, admin/moderator policy | EV-F0627 |
| CFR-019 | `server/src/middleware/roleMiddleware.js` | Active compatibility role middleware. | Twelve route importers | Document only | Remove only after route migration | Permission matrix and route imports | EV-F0628 |

## 3. API-Critical Files

| ID | File | Why critical | Known dependents | Now | Future action | Required pre-checks | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CFR-020 | `client/src/services/apiClient.js` | Shared HTTP transport with 27 direct importers, credentials, refresh, and error translation. | Feature services, profile UI, admin services | Document only | Refactor only after contract tests | Base URL, interceptors, retry/refresh, cookies | EV-X007 |
| CFR-021 | `client/src/services/apiContracts.js` | Shared API payload/contract interpretation. | `apiClient.js`; service barrel | Document only | Stage 5 typed-contract work | Existing response shapes and errors | EV-F0515 |
| CFR-022 | `client/src/services/apiErrors.js` | Normalizes transport/server errors. | `apiClient.js`; service barrel | Document only | Stage 5 error-contract work | User-safe messages and status mapping | EV-F0516 |
| CFR-023 | `server/src/app.js` | Orders middleware, raw webhook parsing, API mounts, and terminal errors. | `server/src/server.js` | Document only | Modify only with app-level tests | Middleware order, CORS, webhook body handling | EV-X003 |
| CFR-024 | `server/src/utils/apiResponse.js` | Shared response helper imported by 36 files. | Controllers, app, middleware | Document only | Change only with frontend contract migration | Payload envelope, status semantics | EV-F0784 |
| CFR-025 | `server/src/utils/asyncHandler.js` | Async error propagation imported by 33 controllers/routes. | Controllers and routes | Document only | Modify with full endpoint tests | Express 5 behavior and error middleware | EV-F0785 |

## 4. Database-Critical Files

| ID | File | Why critical | Known dependents | Now | Future action | Required pre-checks | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CFR-026 | `server/src/config/db.js` | Initializes MongoDB and imports/registers models. | `server/src/server.js` | Document only | Database change with rollback | Startup, connection lifecycle, model registration | EV-F0565 |
| CFR-027 | `server/src/models/User.js` | Identity, credentials, roles, verification, and ownership. | 25 middleware/service/model importers | Document only | Refactor only after migration/tests | Sensitive fields, indexes, auth callers | EV-M043 |
| CFR-028 | `server/src/models/UserProfile.js` | Main user profile persistence used across 17 importers. | Admin, challenge, connection, profile services | Document only | Profile migration after query tests | References, projections, privacy fields | EV-M047 |
| CFR-029 | `server/src/models/ProviderProfile.js` | Provider persistence with unresolved `VerifiedOutcome` reference. | 17 config/model/service importers | Document only | Human review plus model migration | Collection, aliases, unresolved ref, public projection | EV-X009 |
| CFR-030 | `server/src/models/Challenge.model.js` | Active challenge persistence used by eight services. | Challenge, admin, execution-plan, matching flows | Document only | Refactor after ownership ADR | OutcomeChallenge overlap and data inspection | EV-M006 |
| CFR-031 | `server/src/models/OutcomeChallenge.model.js` | Overlapping challenge concept with no discovered service importer. | Unknown | Document only | Human review before any removal | Collection existence and historical data | EV-M024 |
| CFR-032 | `server/src/models/OutcomeOffer.model.js` | Offer lifecycle feeds execution plans, matches, and admin. | Ten service/model importers | Document only | Vertical feature migration with tests | Status transitions, references, indexes | EV-M025 |
| CFR-033 | `server/src/models/ExecutionPlan.model.js` | Plan workflow across first-client, matching, and pipeline services. | Five service importers | Document only | Feature-stage migration with tests | State machine and ownership references | EV-M010 |
| CFR-034 | `server/src/models/ProofAsset.model.js` | Stores proof visibility, review, and ownership data. | Admin, first-client, proof services | Document only | Proof stage with privacy tests | Access control, storage metadata, references | EV-M030 |
| CFR-035 | `server/src/models/MatchRecord.model.js` | Persists matching outcomes used by matching/pipeline. | Three service importers | Document only | Matching stage with reproducibility tests | Scores, state, user/challenge refs | EV-M018 |
| CFR-036 | `server/src/models/MarketplaceTransaction.js` | Marketplace financial ledger. | Payment and user services | Document only | Payments migration with reconciliation | Amounts, currencies, provider/customer IDs | EV-M017 |
| CFR-037 | `server/src/models/Invoice.js` | Invoice persistence. | Subscription and user services | Document only | Billing migration with data plan | Amount/status/customer references | EV-M013 |
| CFR-038 | `server/src/models/Subscription.js` | Subscription state and billing linkage. | Subscription and user services | Document only | Billing migration with webhook tests | Plan/status/provider IDs and indexes | EV-M040 |
| CFR-039 | `server/src/models/Settings.js` | One settings model generation. | `userService.js` | Document only | Consolidate after ownership ADR | UserSettings overlap and collection contents | EV-M039 |
| CFR-040 | `server/src/models/UserSettings.js` | Active settings/preferences used by eight services. | Challenge, plan, matching, first-client services | Document only | Modify with behavioral tests | Availability/preferences and Settings overlap | EV-M049 |

## 5. Dashboard-Critical Files

| ID | File | Why critical | Known dependents | Now | Future action | Required pre-checks | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CFR-041 | `client/src/layouts/DashboardLayout.jsx` | Provider/shared protected shell and responsive grid. | `AppRoutes.jsx` | Document only | Refactor after shell/browser tests | Auth loading, collapse, mobile, overflow | EV-F0376 |
| CFR-042 | `client/src/layouts/ClientLayout.jsx` | Client protected shell. | `AppRoutes.jsx` | Document only | Modify with client-role matrix | Sidebar, topbar, drawer, wrong-role behavior | EV-F0375 |
| CFR-043 | `client/src/layouts/AdminLayout.jsx` | Admin protected shell. | `AppRoutes.jsx`; layout barrel | Document only | Modify with admin security tests | Admin roles, content flash, drawer | EV-F0373 |
| CFR-044 | `client/src/layouts/WorkspaceLayout.jsx` | Compatibility workspace shell still used by saved/workspace views. | `pages/Saved.jsx`; layout barrel | Document only | Investigate before consolidation | Direct callers and route ownership | EV-F0379 |
| CFR-045 | `client/src/layouts/useSidebarShell.js` | Shared layout state bridge across three dashboards. | Admin, Client, Dashboard layouts | Document only | Modify after all-shell tests | State lifecycle, breakpoints, callbacks | EV-F0381 |
| CFR-046 | `client/src/components/navigation/sidebar/SidebarCore.jsx` | Universal sidebar rendering and filtering. | Provider, client, admin sidebar wrappers | Document only | Modify with keyboard/role tests | Nav schema, filters, tooltips, groups | EV-F0140 |
| CFR-047 | `client/src/hooks/useSidebarState.js` | Collapse persistence and mobile open state used by eight components. | Sidebars, topbars, mobile drawers | Document only | Modify with storage/responsive tests | SSR safety, localStorage, mobile independence | EV-F0368 |
| CFR-048 | `client/src/config/navigation/providerNavigation.js` | Provider acquisition workflow navigation. | Navigation constants/sidebar | Document only | Modify with provider route matrix | Paths, order, roles, future items | EV-F0279 |
| CFR-049 | `client/src/config/navigation/clientNavigation.js` | Buyer workflow navigation. | Navigation constants/sidebar | Document only | Modify with client route matrix | Paths, order, roles, future items | EV-F0278 |
| CFR-050 | `client/src/config/navigation/adminNavigation.js` | Admin operational navigation. | Navigation constants/sidebar | Document only | Modify with permission matrix | Admin/moderator visibility and routes | EV-F0277 |

## 6. Config-Critical Files

| ID | File | Why critical | Known dependents | Now | Future action | Required pre-checks | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CFR-051 | `client/package.json` | Defines frontend dependencies and scripts. | Build/deploy/CI | Document only | Change only with stage approval | Lockfile, build, lint, browser smoke test | EV-C001 |
| CFR-052 | `server/package.json` | Defines backend dependencies and scripts. | Runtime/deploy/CI | Document only | Change only with stage approval | Lockfile, startup, API smoke test | EV-C005 |
| CFR-053 | `client/vite.config.js` | Controls Vite aliases/build/dev behavior. | Frontend toolchain | Document only | Stage 6/config change with build verification | Aliases, proxy, output, ProofArena alias | EV-F0560 |
| CFR-054 | `client/jsconfig.json` | Defines editor/module path resolution. | Frontend imports/tooling | Document only | Modify with import/build verification | Alias consistency with Vite | EV-C002 |
| CFR-055 | `client/vercel.json` | Frontend deployment routing/configuration. | Vercel deployment | Document only | Modify with deployment approval | SPA rewrites, project root, environment | EV-C004 |
| CFR-056 | `server/vercel.json` | Backend deployment/runtime configuration. | Vercel deployment | Document only | Modify with deployment approval | Function runtime, route mapping, limits | EV-C006 |
| CFR-057 | `server/src/config/env.js` | Validates and exposes server environment to 23 importers. | App, DB, CORS, services | Document only | Stage 6 with deployment matrix | Required variables, defaults, secrecy | EV-F0566 |
| CFR-058 | `server/src/config/loadEnv.js` | Loads environment before validation. | `env.js` | Document only | Stage 6 only | Load order and environment precedence | EV-F0567 |

## 7. Shared-Critical Files

| ID | File | Why critical | Known dependents | Now | Future action | Required pre-checks | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CFR-059 | `client/src/components/ui/Button.jsx` | Shared command/navigation styling used by 155 direct importers. | UI across all domains | Document only | Refactor after visual/a11y regression tests | Variants, link behavior, disabled state | EV-F0246 |
| CFR-060 | `client/src/components/ui/PageHeader.jsx` | Shared page title/actions composition. | Admin, client, common placeholder wrappers | Document only | Stage 7 with layout tests | Heading hierarchy, action wrapping, breadcrumbs | EV-F0257 |
| CFR-061 | `client/src/components/states/AppStateShell.jsx` | Base for loading/empty/error/coming-soon states. | Six state components/exports | Document only | Stage 8 with route-state tests | ARIA, actions, route validation | EV-F0234 |
| CFR-062 | `client/src/styles/tokens.css` | Shared visual/accessibility token source. | Global CSS cascade | Document only | Stage 7 controlled token migration | Contrast, focus, theme, responsive snapshots | EV-X011 |
| CFR-063 | `client/src/utils/accessPolicy.js` | Central route/nav visibility and dashboard fallback policy. | Fourteen layouts/navigation/system consumers | Document only | Stages 23/26 with role tests | Guest/provider/client/admin/unknown matrix | EV-F0534 |
| CFR-064 | `client/src/utils/navigationFilter.js` | Filters public/footer/sidebar navigation by context. | Header, Footer, SidebarCore | Document only | Modify with all-surface navigation tests | Hidden/disabled/future behavior | EV-F0548 |
| CFR-065 | `client/src/utils/routeValidation.js` | Route safety used by system/state pages. | `AppStateShell.jsx`; `NotFound.jsx` | Document only | Stage 4 route governance | Known patterns, fallbacks, dynamic routes | EV-F0555 |
| CFR-066 | `scripts/check-module-boundaries.mjs` | Enforces module dependency direction for client/server. | Governance/CI command | Document only | Update only with boundary ADR | Existing rules, false positives, both scopes | EV-F0561 |

