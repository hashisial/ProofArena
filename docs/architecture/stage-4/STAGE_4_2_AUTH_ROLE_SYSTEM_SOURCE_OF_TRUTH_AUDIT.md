# Stage 4.2 Auth And Role System Source-of-Truth Audit

## Audit Result

The active frontend authority is a composed platform system, not a single file: `AuthProvider` and `useAuthStore` own session state; `ProtectedRoute`, `RoleRoute`, `PublicOnlyRoute`, and `EmailVerifiedRoute` own route gating; `accessPolicy`, role constants, metadata, and layouts support policy decisions. Backend authorization is independent and currently has two active middleware generations for different API route families. No consolidation is approved.

| Source ID | File path | System type | Owner | Current purpose | Routes affected | Dependencies | Duplicate risk | Security | Future status | Confidence | Review |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AR-001 | client/src/App.jsx | auth provider mount | platform auth | Mounts the single active AuthProvider | all browser routes | AuthProvider, router app | high | critical | source-of-truth | high | no |
| AR-002 | client/src/features/auth/AuthProvider.jsx | auth provider | platform auth | Hydrates, refreshes, signs in/out, exposes auth context | all guarded and auth routes | useAuthStore, authService, roleAccess | high | critical | source-of-truth | high | no |
| AR-003 | client/src/features/auth/useAuth.js | auth hook | platform auth | Defines AuthContext and useAuth | layouts, pages, navigation | AuthProvider | low | high | supporting system | high | no |
| AR-004 | client/src/hooks/useAuth.js | auth hook | platform auth | Compatibility re-export of feature auth hook | legacy consumers | features/auth/useAuth | medium if forked | medium | supporting system | high | no |
| AR-005 | client/src/store/useAuthStore.js | session state | platform auth | Zustand session state and cross-tab logout event | all active guards | AuthProvider | high if duplicated | critical | source-of-truth | high | no |
| AR-006 | client/src/store/authSession.js | storage logic | platform auth | In-memory user/admin token compatibility with legacy storage cleanup | AdminGate only in current import scan | browser storage | high; isolated legacy path | critical | suspicious | high | yes |
| AR-007 | client/src/features/auth/authService.js | token logic | platform auth | Auth calls and refresh/logout contract through platform API client | AuthProvider/auth pages | apiClient | high if bypassed | critical | source-of-truth | high | no |
| AR-008 | client/src/routes/AuthHydration.jsx | guard | platform auth | Blocks child rendering while auth state hydrates | client/dashboard/admin parents | useAuthStore | low | high | supporting system | high | no |
| AR-009 | client/src/routes/ProtectedRoute.jsx | guard | platform auth | Requires authenticated active browser principal | dashboard parent | useAuthStore, accessPolicy, ROUTES | high if duplicated | critical | source-of-truth | high | no |
| AR-010 | client/src/routes/RoleRoute.jsx | guard | platform role | Requires authentication plus allowed role | client/admin parents and 37 dashboard children | useAuthStore, accessPolicy, ROUTES | high if duplicated | critical | source-of-truth | high | no |
| AR-011 | client/src/routes/PublicOnlyRoute.jsx | guard | platform auth | Redirects authenticated users away from login/register | login, register | useAuthStore, authRouteUtils | medium | high | source-of-truth | high | no |
| AR-012 | client/src/routes/EmailVerifiedRoute.jsx | guard | platform auth | Requires one of three verification field aliases | client/dashboard/admin parents | useAuthStore, ROUTES | medium contract drift | high | source-of-truth with caution | high | yes |
| AR-013 | client/src/routes/authRouteUtils.js | redirect logic | platform routing/auth | Computes role landing and validates intended destination | auth flows and navigation | accessPolicy, ROUTES | medium | high | supporting system | high | yes |
| AR-014 | client/src/utils/accessPolicy.js | permission helper | platform role | Role normalization, route/nav access, denial fallback | guards, layouts, navigation | statuses, metadata, routes | high if forked | critical | source-of-truth with caution | high | yes |
| AR-015 | client/src/constants/statuses.js | role definition | platform role | Browser role catalog: admin/client/provider/support | route tree, metadata, access policy | none | high if duplicated | critical | source-of-truth | high | yes |
| AR-016 | client/src/config/routeMetadata.js | permission helper | platform routing | Declarative route roles/protection for 73 metadata entries | layouts and navigation | role constants, route constants | high drift against router | high | supporting system | high | yes |
| AR-017 | client/src/layouts/DashboardLayout.jsx; ClientLayout.jsx; AdminLayout.jsx | guard | dashboard/admin | Metadata-level canAccessRoute checks inside platform shells | protected layout children | useAuth, accessPolicy, metadata | medium; distributed denial | high | supporting system | high | yes |
| AR-018 | client/src/features/auth/roleAccess.js | permission helper | platform role candidate | Feature permission map used by AuthProvider and Payments | auth context and page permissions | parallel role/permission catalog | high drift risk | critical | supporting system with caution | high | yes |
| AR-019 | client/src/features/auth/RequireRole.jsx | guard | module-specific candidate | Alternative role UI wrapper | no importer found | useAuth, roleAccess | high duplicate-guard risk | high | duplicate candidate | high | yes |
| AR-020 | client/src/components/AdminGate.jsx | guard/storage logic | admin candidate | Alternative admin gate with manual token/session path | no importer found | authSession | high duplicate-auth risk | critical | duplicate candidate | high | yes |
| AR-021 | server/src/middleware/auth.middleware.js | middleware | backend | v1/module auth, optional auth, verified email, ownership checks | v1 and module API routes | token utils, User, role.middleware | medium parallel-generation risk | critical | source-of-truth for v1/module routes | high | yes |
| AR-022 | server/src/middleware/authMiddleware.js | middleware | backend | unversioned user auth/optional auth | unversioned API routes | token/cookie/user systems | medium parallel-generation risk | critical | source-of-truth for unversioned routes | high | yes |
| AR-023 | server/src/middleware/role.middleware.js | middleware | backend | v1/module role and permission enforcement | v1/module routes and admin permission export | server role constants | medium parallel-generation risk | critical | source-of-truth for v1/module routes | high | yes |
| AR-024 | server/src/middleware/roleMiddleware.js | middleware | backend | unversioned role and permission enforcement | unversioned routes | parallel permission map | medium parallel-generation risk | critical | source-of-truth for unversioned routes | high | yes |
| AR-025 | server/src/middleware/adminMiddleware.js | middleware | backend | Admin token/account validation; re-exports permission gate | admin API routes | role.middleware, User, token/cookie | low within admin API | critical | source-of-truth | high | yes |
| AR-026 | server/src/middleware/messagingAuthMiddleware.js | middleware | backend | Messaging-specific principal extraction | messaging API only | messagingAuthService | medium specialized stack | high | supporting system | high | yes |
| AR-027 | server/src/constants/roles.js | role definition | backend | Backend role catalog and public registration roles | backend auth/role systems | none | high cross-tier drift | critical | source-of-truth | high | yes |

## Findings

1. No new auth provider, role catalog, token store, or guard stack is permitted.
2. `RequireRole.jsx` and `AdminGate.jsx` have no importer in the current static scan; they remain evidence-preserved duplicate candidates, not deletion targets.
3. Both backend auth/role middleware generations are actively imported. Their policy parity must be tested before any consolidation claim.
4. Frontend `accessPolicy` recognizes `super_admin` as an admin override; backend `protectAdmin` accepts only literal `admin`. This is a human/security decision.
5. Browser guards do not prove endpoint authorization, record ownership, or tenant isolation.
6. Token and session behavior was inspected only; no auth/role logic was changed.
