# Stage 4 Prompt 4 Pre-Implementation Route Snapshot

No implementation is authorized; this is the retained baseline.

| Area | Current source | Baseline |
|---|---|---|
| Router mount | `client/src/main.jsx` | One `BrowserRouter` |
| Route declarations | `client/src/routes/AppRoutes.jsx` | 108 unique leaf routes; no duplicate declared paths |
| Route constants | `client/src/constants/routes.js` | 117 entries, 108 unique values, 9 aliases; `/offers` undeclared |
| Policy metadata | `client/src/config/routeMetadata.js` | 73 paths; 34 declaration gaps |
| Navigation | `client/src/constants/navigation.js` and consumers | 42 unique enabled targets; configured targets resolve |
| Guards | `ProtectedRoute`, `RoleRoute`, `EmailVerifiedRoute`, `PublicOnlyRoute`, `accessPolicy` | Client/admin parent guards exist; 16 dashboard routes are parent-auth-only |
| Redirect/404 | guards, pages, `AppRoutes.jsx` | Explicit `/not-found`, wildcard, distributed redirects |

Risks: 72 hardcoded route-context occurrences in 28 files, two apparently unused guard alternatives, dynamic ID/slug ambiguity, and missing regression coverage. Known scripts are `npm run lint`, `npm run build`, and `npm run check:boundaries`; no route-specific test script exists.

## Detailed Snapshot

| Area | Files | Prompt 4 disposition |
|---|---|---|
| Browser router | client/src/main.jsx | One BrowserRouter; unchanged |
| Route tree | client/src/routes/AppRoutes.jsx | 106 constant-backed path declarations, one index, one wildcard; unchanged |
| Route registry | client/src/constants/routes.js | Existing grouped registry/facade; no final authority promotion |
| Navigation | constants/navigation.js; config/navigation/public, client, provider, admin; sidebar/header/footer consumers | No link or visibility changes |
| Guards | ProtectedRoute, RoleRoute, PublicOnlyRoute, EmailVerifiedRoute, AuthHydration, protected layouts, accessPolicy | No auth/role/redirect changes |
| Redirect/404 | Active guards, layouts, authRouteUtils, relevant pages, AppRoutes wildcard, NotFound | No target, state, history, order, or component changes |
| Duplicate risk | ROUTE_TREE naming alias; semantic route aliases; unreferenced RequireRole/AdminGate | Existing risks only; no duplicate created |
| Hardcoded risk | 72 verified baseline; 83 broader lexical candidates requiring classification | No migration authorized |

Available non-mutating scripts: `npm run lint` and `npm run check:boundaries`. Build exists but writes output and was not needed for a no-change gate. No typecheck, test, or route-specific test script is declared.

Baseline risk: high for any runtime migration, low for B0 read-only validation.
