# Stage 1.2 Cleanup Dependency Order

Generated: 2026-06-27

This is a planning order only. It does not authorize production changes.

## Must Verify Before Cleanup

| Gate | Required evidence | Primary files |
| --- | --- | --- |
| Baseline behavior | Maintained route, auth, API-contract, and browser tests; current suite is not sufficient | `client/src/routes/AppRoutes.jsx`, protected layouts, `client/src/services/apiClient.js`, server route indexes |
| Runtime ownership | Whether RootLayout/legacy Layout and six unmapped pages are loaded by any entry, lazy import, build alias, or external consumer | `client/src/layouts/RootLayout.jsx`, `client/src/components/Layout.jsx`, WPH-042..047 files |
| Compatibility usage | Production/bookmark/consumer use of client aliases, admin proof aliases, and dual API mounts | `routes.js`, AppRoutes, `server/src/routes/index.js`, `server/src/routes/v1/index.js` |
| Method contracts | Exact callers, HTTP methods, params, response shapes, and fallback behavior for every api.js export | `client/src/services/api.js`, `apiEndpoints.js`, backend route/controller maps |
| Role matrix | Guest/provider/client/admin/unknown behavior for every protected shell and fallback | Guards, accessPolicy, route metadata, Dashboard/Client/Admin layouts |
| Data ownership | Model/service usage before changing backend endpoints or fallback semantics | Stage 1.1 model usage/backend flow maps |

## Safest Cleanup Order

| Order | Cleanup area | Why this order is safest | Files affected | Main risks | Required checks before change | Rollback notes | Recommended future prompt |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 0 | Establish regression baseline | Every later step depends on proving route, auth, layout, and API behavior did not change. | AppRoutes, layouts, apiClient, server route indexes | Hidden runtime ownership and compatibility consumers | Route matrix; role matrix; API contract tests; mobile keyboard/browser checks | No cleanup should begin if baseline cannot be reproduced. | Build a read-only/test-only Stage 1.2 regression evidence pack. |
| 1 | Route constants and alias policy | Navigation/layout cleanup cannot be safe while canonical and compatibility paths are undecided. | `client/src/constants/routes.js`, AppRoutes, routeMetadata | Broken bookmarks, redirects, active state, breadcrumbs | Decide RTE-011/RTE-012; verify 108 route entries; telemetry for aliases | Keep aliases and add reversible redirects; never delete first. | Formalize route source and compatibility ADR/test plan. |
| 2 | Auth guards and role fallbacks | Protected route/layout changes must preserve the security UX boundary. | ProtectedRoute, RoleRoute, authRouteUtils, accessPolicy, auth store/provider | Protected-content flash, loops, wrong-role access | Guest/provider/client/admin/unknown direct-load tests | Preserve old guards behind small commits; revert policy atomically. | Verify route guard precedence and auth-loading matrix. |
| 3 | Layout ownership and shared shell primitives | Once routes/guards are stable, repeated grid/content/drawer code can be characterized safely. | DashboardLayout, ClientLayout, AdminLayout, content shells, mobile drawers | Role-policy leakage, focus regressions, sidebar gaps | Desktop/mobile screenshots; keyboard Escape/focus; sidebar persistence | Extract one primitive at a time while retaining wrappers. | Design a shell-primitive migration with no role-policy merge. |
| 4 | API client and facade source of truth | Services cannot be cleaned while transport, version, and compatibility ownership are unresolved. | apiClient, api.js, apiEndpoints, feature services/utils | Auth refresh, fallback changes, endpoint prefix errors | Method-level caller map; backend endpoint match; error/envelope/upload tests | Keep facade shims until zero callers and telemetry confirmation. | Produce api.js export-to-caller-to-endpoint matrix. |
| 5 | Placeholder/mock retirement | Classification prevents disclosed previews from being deleted while dangerous fallbacks survive. | WPH files and RouteShells | Misleading data, broken empty states, premature feature implementation | Product owner confirms copy; backend contract exists for replacement | Retain explicit empty/coming-soon state as rollback. | Remove only product-risk fallback behavior with real contracts. |
| 6 | Backend API/service cleanup | Frontend callers and mounts must be known before changing server contracts. | `server/src/routes/index.js`, `server/src/routes/v1/index.js`, services/controllers | 537 mounted variants, auth/payment/data regressions | Endpoint inventory, contract tests, mount telemetry, model usage map | Deprecate with telemetry and compatibility windows. | Select API version policy and dual-mount migration plan. |
| 7 | Model usage verification | Models are persistent contracts and must follow API/service decisions, not lead them. | Stage 1.1 high-risk model list | Data loss, index/query regressions, auth/payment corruption | Migration plan, backups, production-like data/query tests | Schema migrations must be reversible and staged. | No model cleanup in Stage 1.2 without a separate data plan. |
| 8 | Shared utility/import normalization | Lowest-level moves come last because route/API/layout behavior must already be stable. | route helpers, navigationActive, WorkspaceLayout alias, error builders | Circular imports, behavior drift, broad import churn | Dependency graph and focused unit tests | Keep compatibility exports for one release window. | Normalize one utility family at a time. |

## Why This Order Is Mandatory

- Route constants precede navigation because navigation correctness depends on path ownership.
- Auth verification precedes protected layout cleanup because shell rendering is role-sensitive.
- Layout ownership precedes abstraction because visual similarity does not prove policy equivalence.
- API transport/version ownership precedes service cleanup because endpoint strings and envelopes differ.
- Placeholder classification precedes removal because disclosed marketing previews are not equivalent to business fallback data.
- Model usage precedes backend cleanup because persistent contracts have the highest rollback cost.
- Shared utility ownership comes last because moving low-level helpers can create broad, hard-to-review churn.

## Stop Conditions

Stop cleanup if any of the following is unresolved for the target:

- No automated or reproducible behavior baseline.
- Unknown runtime owner or external consumer.
- Auth/role behavior cannot be enumerated.
- API method has no verified backend contract.
- Compatibility route/mount lacks telemetry or deprecation policy.
- Replacement would introduce fake feature logic.
- Rollback requires destructive database or route removal.

