# Stage 4 Prompt 7 Pre-Implementation Access-Control Snapshot

## Authority Files

| Area | Current files | Snapshot result |
|---|---|---|
| Auth mount/provider | client/src/App.jsx; client/src/features/auth/AuthProvider.jsx; client/src/features/auth/useAuth.js | one active provider/context |
| Session state/token support | client/src/store/useAuthStore.js; client/src/store/authSession.js; client/src/features/auth/authService.js | store is active authority; authSession remains isolated legacy support |
| Browser roles/policy | client/src/constants/statuses.js; client/src/utils/accessPolicy.js; client/src/features/auth/roleAccess.js | accessPolicy/statuses active; roleAccess supporting and drift-prone |
| Frontend guards | client/src/routes/AuthHydration.jsx; ProtectedRoute.jsx; RoleRoute.jsx; PublicOnlyRoute.jsx; EmailVerifiedRoute.jsx | one definition of each active guard |
| Supporting layout guards | DashboardLayout.jsx; ClientLayout.jsx; AdminLayout.jsx | existing metadata checks; no duplicate shell |
| Browser route tree | client/src/main.jsx; client/src/routes/AppRoutes.jsx | one BrowserRouter and one Routes tree |
| Route constants/metadata | client/src/constants/routes.js; client/src/config/routeMetadata.js | 117 entries, 108 unique values, 9 aliases; 73 metadata rows |
| Navigation visibility | client/src/constants/navigation.js; client/src/config/navigation/*.js | 42 unique enabled targets |
| Guest/auth/onboarding | AppRoutes plus Login, Register, ForgotPassword, ResetPassword, VerifyEmail, ResendVerification, profile onboarding pages | distributed current flows retained |
| Redirect/recovery | active guards; authRouteUtils.js; accessPolicy.js; NotAuthorized.jsx; NotFound.jsx; logout callers | current targets retained |
| Backend auth | server/src/middleware/auth.middleware.js; authMiddleware.js; adminMiddleware.js; messagingAuthMiddleware.js | active family-specific middleware |
| Backend roles | server/src/middleware/role.middleware.js; roleMiddleware.js; server/src/constants/roles.js | active family-specific role/permission enforcement |
| Duplicate candidates | client/src/features/auth/RequireRole.jsx; client/src/components/AdminGate.jsx | no importer found; not expanded or deleted |

## Route And Risk Baseline

- Browser leaves: **108**.
- Protected leaves: **70**.
- Dashboard leaves: **53**; 37 explicit-role and 16 parent-auth-only.
- Admin leaves: **12**, all under the current admin parent.
- Explicit client/provider/support leaves: **42**.
- Current underprotected routes: none proven; policy evidence is insufficient to label ambiguous routes underprotected.
- Current overprotected routes: none proven.
- Current unknown protection: 16 parent-auth-only dashboard routes plus verify/resend access semantics.
- Admin risks: frontend super_admin override versus backend literal admin; /admin/proof-review metadata gap; endpoint authorization independent.
- Role risks: browser role checks do not prove tenant or record ownership.
- Guest/onboarding risks: recovery/verification access policy and onboarding completion state remain unapproved.
- Navigation mismatch: provider navigation targets roleless /dashboard; 34 route leaves lack metadata.
- Redirect risk: /403, /not-authorized, role fallback, unknown-role landing, and verification precedence remain non-canonical.

## Validation Baseline

| Validation | Availability/result |
|---|---|
| client npm run check:boundaries | available; passed |
| server npm run check:boundaries | available; passed with 3 existing controller-to-model warnings |
| client npm run lint | available; attempted; timed out after 190.3 seconds with no diagnostics |
| client npm run build | available; not run because no implementation occurred |
| typecheck | no package script |
| automated route/role/auth tests | no package script/harness found |
| static duplicate-authority scan | passed: one router, route tree, AuthProvider, and one definition per active frontend guard |
| production diff | zero tracked production-source paths |

Baseline conclusion: no-op safety is established with caution; lint completion and runtime route-role coverage remain required before production edits.
