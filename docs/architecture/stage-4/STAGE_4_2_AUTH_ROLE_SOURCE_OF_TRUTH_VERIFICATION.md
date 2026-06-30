# Stage 4.2 Auth And Role Source-of-Truth Verification

## Verification Decision

No new authority is created. The frontend authority is composed and verified. Backend auth/role authority is intentionally family-specific because both middleware generations are actively imported.

| Source ID | File | Prompt 5 classification | Verified classification | Evidence | Routes affected | Session dependency | Token dependency | Role/permission dependency | Security | Duplicate risk | Safe in plan | Review |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AR-001 | client/src/App.jsx | source-of-truth | suspicious | Mounts the single active AuthProvider; import evidence retained | all browser routes | yes | indirect/none | indirect/none | critical | high | yes | no |
| AR-002 | client/src/features/auth/AuthProvider.jsx | source-of-truth | platform auth source-of-truth | Hydrates, refreshes, signs in/out, exposes auth context; import evidence retained | all guarded and auth routes | yes | indirect/none | indirect/none | critical | high | yes | no |
| AR-003 | client/src/features/auth/useAuth.js | supporting system | supporting auth helper | Defines AuthContext and useAuth; import evidence retained | layouts, pages, navigation | yes | indirect/none | indirect/none | high | low | yes | no |
| AR-004 | client/src/hooks/useAuth.js | supporting system | supporting auth helper | Compatibility re-export of feature auth hook; import evidence retained | legacy consumers | yes | indirect/none | indirect/none | medium | medium if forked | yes | no |
| AR-005 | client/src/store/useAuthStore.js | source-of-truth | platform auth source-of-truth | Zustand session state and cross-tab logout event; import evidence retained | all active guards | yes | indirect/none | indirect/none | critical | high if duplicated | yes | no |
| AR-006 | client/src/store/authSession.js | suspicious | supporting auth helper | In-memory user/admin token compatibility with legacy storage cleanup; import evidence retained | AdminGate only in current import scan | indirect | yes | yes | critical | high; isolated legacy path | unknown | yes |
| AR-007 | client/src/features/auth/authService.js | source-of-truth | supporting auth helper | Auth calls and refresh/logout contract through platform API client; import evidence retained | AuthProvider/auth pages | yes | yes | indirect/none | critical | high if bypassed | yes | no |
| AR-008 | client/src/routes/AuthHydration.jsx | supporting system | supporting auth helper | Blocks child rendering while auth state hydrates; import evidence retained | client/dashboard/admin parents | yes | indirect/none | yes | high | low | yes | no |
| AR-009 | client/src/routes/ProtectedRoute.jsx | source-of-truth | route guard | Requires authenticated active browser principal; import evidence retained | dashboard parent | yes | indirect/none | yes | critical | high if duplicated | yes | no |
| AR-010 | client/src/routes/RoleRoute.jsx | source-of-truth | route guard | Requires authentication plus allowed role; import evidence retained | client/admin parents and 37 dashboard children | yes | indirect/none | yes | critical | high if duplicated | yes | no |
| AR-011 | client/src/routes/PublicOnlyRoute.jsx | source-of-truth | route guard | Redirects authenticated users away from login/register; import evidence retained | login, register | yes | indirect/none | yes | high | medium | yes | no |
| AR-012 | client/src/routes/EmailVerifiedRoute.jsx | source-of-truth with caution | route guard | Requires one of three verification field aliases; import evidence retained | client/dashboard/admin parents | yes | indirect/none | yes | high | medium contract drift | yes | yes |
| AR-013 | client/src/routes/authRouteUtils.js | supporting system | supporting auth helper | Computes role landing and validates intended destination; import evidence retained | auth flows and navigation | indirect | indirect/none | yes | high | medium | yes | yes |
| AR-014 | client/src/utils/accessPolicy.js | source-of-truth with caution | platform role source-of-truth | Role normalization, route/nav access, denial fallback; import evidence retained | guards, layouts, navigation | indirect | indirect/none | yes | critical | high if forked | yes | yes |
| AR-015 | client/src/constants/statuses.js | source-of-truth | platform role source-of-truth | Browser role catalog: admin/client/provider/support; import evidence retained | route tree, metadata, access policy | yes | yes | yes | critical | high if duplicated | yes | yes |
| AR-016 | client/src/config/routeMetadata.js | supporting system | supporting role helper | Declarative route roles/protection for 73 metadata entries; import evidence retained | layouts and navigation | indirect | indirect/none | yes | high | high drift against router | yes | yes |
| AR-017 | client/src/layouts/DashboardLayout.jsx; ClientLayout.jsx; AdminLayout.jsx | supporting system | supporting role helper | Metadata-level canAccessRoute checks inside platform shells; import evidence retained | protected layout children | yes | indirect/none | yes | high | medium; distributed denial | yes | yes |
| AR-018 | client/src/features/auth/roleAccess.js | supporting system with caution | supporting role helper | Feature permission map used by AuthProvider and Payments; import evidence retained | auth context and page permissions | yes | indirect/none | yes | critical | high drift risk | yes | yes |
| AR-019 | client/src/features/auth/RequireRole.jsx | duplicate candidate | duplicate candidate | Alternative role UI wrapper; import evidence retained | no importer found | yes | indirect/none | yes | high | high duplicate-guard risk | no | yes |
| AR-020 | client/src/components/AdminGate.jsx | duplicate candidate | duplicate candidate | Alternative admin gate with manual token/session path; import evidence retained | no importer found | yes | yes | yes | critical | high duplicate-auth risk | no | yes |
| AR-021 | server/src/middleware/auth.middleware.js | source-of-truth for v1/module routes | middleware | v1/module auth, optional auth, verified email, ownership checks; import evidence retained | v1 and module API routes | yes | yes | indirect/none | critical | medium parallel-generation risk | yes; current API family only | yes |
| AR-022 | server/src/middleware/authMiddleware.js | source-of-truth for unversioned routes | middleware | unversioned user auth/optional auth; import evidence retained | unversioned API routes | yes | yes | indirect/none | critical | medium parallel-generation risk | yes; current API family only | yes |
| AR-023 | server/src/middleware/role.middleware.js | source-of-truth for v1/module routes | middleware | v1/module role and permission enforcement; import evidence retained | v1/module routes and admin permission export | indirect | yes | yes | critical | medium parallel-generation risk | yes; current API family only | yes |
| AR-024 | server/src/middleware/roleMiddleware.js | source-of-truth for unversioned routes | middleware | unversioned role and permission enforcement; import evidence retained | unversioned routes | indirect | yes | yes | critical | medium parallel-generation risk | yes; current API family only | yes |
| AR-025 | server/src/middleware/adminMiddleware.js | source-of-truth | middleware | Admin token/account validation; re-exports permission gate; import evidence retained | admin API routes | indirect | yes | yes | critical | low within admin API | yes | yes |
| AR-026 | server/src/middleware/messagingAuthMiddleware.js | supporting system | middleware | Messaging-specific principal extraction; import evidence retained | messaging API only | indirect | yes | indirect/none | high | medium specialized stack | yes | yes |
| AR-027 | server/src/constants/roles.js | source-of-truth | platform role source-of-truth | Backend role catalog and public registration roles; import evidence retained | backend auth/role systems | indirect | indirect/none | yes | critical | high cross-tier drift | yes | yes |

## Blocking Conclusions

- `AuthProvider` plus `useAuthStore` is the browser session authority.
- `accessPolicy`, browser role constants, and route metadata form the browser role-policy authority; `roleAccess` is supporting and drift-prone.
- Both backend middleware generations remain in use and may be reused only within their existing API families.
- `RequireRole` and `AdminGate` must not be expanded.
- Frontend `super_admin` behavior, backend literal-admin behavior, and cross-tier permission parity require human approval.
