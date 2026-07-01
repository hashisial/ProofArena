# Stage 4.3 Route Constant Alignment Verification for Redirects and 404

| Alignment ID | File path | Behavior type | Current source path | Current target path | Current route constant | Proposed key if planned | Prompt 8 status | Verified alignment status | Migration dependency | Required future action | Blocks implementation | Human review needed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| AL-001 | ProtectedRoute.jsx | redirect | protected leaf | login | ROUTES.LOGIN | same | aligned | aligned | Stage 4.2 protected routes | retain/test from state | no | no |
| AL-002 | RoleRoute.jsx | redirect | role leaf | login | ROUTES.LOGIN | same | aligned | aligned | Stage 4.2 protected routes | retain order | no | no |
| AL-003 | RoleRoute.jsx | redirect | role leaf | not-authorized | ROUTES.SYSTEM.NOT_AUTHORIZED | same | aligned/policy caution | aligned with caution | human decision | approve denial semantics | yes | yes |
| AL-004 | PublicOnlyRoute.jsx | redirect | guest-only | role default | family constants | existing keys | aligned/caution | aligned with caution | Stage 4.2 protected routes | approve unknown role | yes | yes |
| AL-005 | EmailVerifiedRoute.jsx | redirect | verified-only | resend-verification | ROUTES.RESEND_VERIFICATION | same | aligned/caution | aligned with caution | Stage 4.2 protected routes | lock target reachability | yes | yes |
| AL-006 | Login.jsx | redirect | login | from/default | authRouteUtils | existing keys | aligned/caution | aligned with caution | Stage 4.3 redirect policy | validate permission/history | yes | yes |
| AL-007 | Login.jsx | redirect | login | role default | accessPolicy | existing keys | aligned/caution | aligned with caution | human decision | approve unknown role | yes | yes |
| AL-008 | Register.jsx | redirect | register | from/default | authRouteUtils | existing keys | aligned/caution | aligned with caution | Stage 4.3 redirect policy | validate permission/history | yes | yes |
| AL-009 | Register.jsx | redirect | register | role default | accessPolicy | existing keys | aligned/caution | aligned with caution | human decision | approve unknown role | yes | yes |
| AL-010 | ForgotPassword.jsx | redirect | recovery | role default | accessPolicy | existing keys | aligned | aligned | Stage 4.3 redirect policy | test auth state | no | no |
| AL-011 | ResetPassword.jsx | redirect | reset | role default | accessPolicy | existing keys | aligned | aligned | Stage 4.3 redirect policy | test token/auth order | no | no |
| AL-012 | Dashboard.jsx | redirect | dashboard | support dashboard | ROUTES.SUPPORT_DASHBOARD | same | aligned/caution | aligned with caution | Stage 4.2 protected routes | verify metadata | yes | yes |
| AL-013 | Dashboard.jsx | redirect | dashboard | admin | ROUTES.ADMIN | same | aligned/caution | aligned with caution | Stage 4.2 protected routes | verify hierarchy | yes | yes |
| AL-014 | Dashboard.jsx | redirect | dashboard | not-authorized | ROUTES.SYSTEM.NOT_AUTHORIZED | same | aligned/policy caution | aligned with caution | human decision | approve unknown role | yes | yes |
| AL-015 | DashboardChallenges.jsx | redirect | challenge alias | admin/not-authorized | existing keys | same | aligned/caution | aligned with caution | human decision | approve unsupported roles | yes | yes |
| AL-016 | DashboardLayout.jsx | redirect | attempted path | policy fallback | accessPolicy constants | existing keys | aligned/caution | route constant governance dependency | Stage 4.2 protected routes | reconcile priority | yes | yes |
| AL-017 | ClientLayout.jsx | redirect | attempted path | policy fallback | accessPolicy constants | existing keys | aligned/caution | route constant governance dependency | Stage 4.2 protected routes | reconcile priority | yes | yes |
| AL-018 | AdminLayout.jsx | redirect | attempted path | policy fallback | accessPolicy constants | existing keys | aligned/caution | route constant governance dependency | Stage 4.2 protected routes | reconcile priority | yes | yes |
| AL-019 | onboarding page | redirect | invalid step | not-found | ROUTES.SYSTEM.NOT_FOUND | same | aligned | aligned | Stage 4.3 redirect policy | retain/test | no | no |
| AL-020 | onboarding page | redirect | valid step | next step | getStepPath | existing builder | builder/caution | aligned with caution | human decision | approve completion/revisit | yes | yes |
| AL-021 | Header.jsx | redirect | logout | login | ROUTES.LOGIN | same | aligned | aligned | Stage 4.3 redirect policy | parity test | no | no |
| AL-022 | DashboardTopbar.jsx | redirect | logout | login | ROUTES.LOGIN | same | aligned | aligned | Stage 4.3 redirect policy | parity test | no | no |
| AL-023 | AdminTopbar.jsx | redirect | logout | login | ROUTES.LOGIN | same | aligned | aligned | Stage 4.3 redirect policy | parity test | no | no |
| AL-024 | ClientTopbar.jsx | redirect | logout | login | ROUTES.LOGIN | same | aligned | aligned | Stage 4.3 redirect policy | parity test | no | no |
| AL-025 | Account.jsx | redirect | account | / | none | ROUTES.HOME | hardcoded | hardcoded and risky | Stage 4.1 route constants | verify reload/history first | yes | no |
| AL-026 | Connections.jsx | redirect | connection | /messages | none | ROUTES.MESSAGES | hardcoded | hardcoded and risky | Stage 4.1 route constants | verify workflow | yes | no |
| AL-027 | Marketplace.jsx | redirect | protected action | /login | none | ROUTES.LOGIN | hardcoded | hardcoded and risky | Stage 4.2 protected routes | decide auth action contract | yes | yes |
| AL-028 | ServiceDetail.jsx | redirect | protected action | /login | none | ROUTES.LOGIN | hardcoded | hardcoded and risky | Stage 4.2 protected routes | decide auth action contract | yes | yes |
| AL-029 | ServiceDetail.jsx | redirect | conversation | messages query | none | no approved query key | missing builder | missing constant | Stage 4.3 redirect policy | verify query builder contract | yes | yes |
| AL-030 | Profile.jsx | redirect | profile | dynamic public profile | local helper | dynamic builder candidate | uncertain | route constant governance dependency | Stage 4.1 route constants | compare parameter contract | yes | yes |
| AL-031 | Profile.jsx | redirect | profile | /settings | none | ROUTES.SETTINGS | hardcoded | hardcoded and risky | Stage 4.1 route constants | verify history | yes | no |
| AL-032 | Auth.jsx | redirect | legacy auth | /dashboard | none | ROUTES.DASHBOARD | hardcoded/legacy | hardcoded and risky | human decision | prove reachability | yes | yes |
| AL-033 | Auth.jsx | redirect | legacy auth | /admin | none | ROUTES.ADMIN | hardcoded/legacy | hardcoded and risky | human decision | prove reachability/hierarchy | yes | yes |
| AL-034 | Settings.jsx | redirect | billing | external URL | n/a | none | external | hardcoded but acceptable for now | human decision | validate origin/scheme | yes | yes |
| AL-035 | Payments.jsx | redirect | payment | external URL | n/a | none | external | hardcoded but acceptable for now | human decision | validate origin/scheme | yes | yes |
| AL-036 | AppRoutes.jsx | 404 | /not-found | NotFound | ROUTES.SYSTEM.NOT_FOUND | same | aligned | aligned | Stage 4.3 redirect policy | retain | no | no |
| AL-037 | AppRoutes.jsx | wildcard | * | NotFound | wildcard literal | none | aligned | aligned | Stage 4.3 redirect policy | lock terminal order | no | no |
| AL-038 | NotFound.jsx | 404 | error page | recovery links | ROUTES keys | same | aligned/caution | aligned with caution | Stage 4.3 redirect policy | test role-safe recovery | yes | yes |
| AL-039 | onboarding page | fallback | invalid step | not-found | ROUTES.SYSTEM.NOT_FOUND | same | aligned | aligned | Stage 4.3 redirect policy | retain | no | no |
| AL-040 | accessPolicy.js | fallback | unknown metadata | not-found | SYSTEM_ROUTES.NOT_FOUND | same | aligned/caution | aligned with caution | Stage 4.2 protected routes | verify consumers | yes | yes |
| AL-041 | server/app.js | 404 | unmatched API | structured error | n/a | none | separate scope | aligned | unknown | keep separate | no | no |
| AL-042 | server error aliases | fallback | API alias | same handler | n/a | none | separate scope | aligned | unknown | avoid duplicate implementation | no | no |
| AL-043 | no source | fallback | nested/module invalid | global wildcard | none | none | policy unknown | unknown | human decision | decide scoped need | yes | yes |
| AL-044 | no source | fallback | dashboard/admin invalid | global wildcard | none | none | policy unknown | unknown | human decision | decide shell recovery | yes | yes |

## Verification Result

Twenty-two items are aligned or aligned with caution, seven hardcoded internal items remain risky, two external targets are acceptable only with security policy, and the remaining items depend on route, protected-route, redirect-policy, or human decisions. No migration is authorized.
