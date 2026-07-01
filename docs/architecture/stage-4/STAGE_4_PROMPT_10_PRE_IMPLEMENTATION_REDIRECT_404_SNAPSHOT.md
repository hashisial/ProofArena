# Stage 4 Prompt 10 Pre-Implementation Redirect and 404 Snapshot

Snapshot mode: read-only, before any implementation. No implementation was subsequently authorized.

| Snapshot area | Existing source/baseline | Current risk or dependency |
|---|---|---|
| Browser router | client/src/main.jsx mounts one BrowserRouter; client/src/routes/AppRoutes.jsx contains one Routes authority | Must remain singular. |
| Redirect topology | AppRoutes composition; ProtectedRoute; RoleRoute; PublicOnlyRoute; EmailVerifiedRoute; authRouteUtils; accessPolicy; layouts/pages | Distributed evaluators require approved priority. |
| Browser 404 | AppRoutes explicit ROUTES.SYSTEM.NOT_FOUND and client/src/pages/NotFound.jsx | One source; host/SEO behavior unverified. |
| Wildcard/fallback | One terminal path=* in AppRoutes rendering NotFound | Safe only while unique and terminal. |
| API 404 | server/src/app.js terminal use of server/src/errors/notFoundHandler.js | Separate backend scope; must not merge with browser 404. |
| Login success | Login.jsx and Register.jsx restore validated state.from or role default | Wrong-role restoration and unknown-role defaults need tests/approval. |
| Logout | Header.jsx, DashboardTopbar.jsx, AdminTopbar.jsx, ClientTopbar.jsx target ROUTES.LOGIN with replace | Static parity only; no runtime failure/history baseline. |
| Anonymous protected access | ProtectedRoute and RoleRoute target login with state.from | Guard coverage and hydration must remain verified. |
| Wrong-role access | RoleRoute targets not-authorized with state.from | Layout fallbacks may select role defaults without state.from. |
| Forbidden/denial pages | /403 Forbidden and /not-authorized NotAuthorized declarations | Canonical semantics/callers unresolved. |
| Guest-only | PublicOnlyRoute plus page-level authenticated checks | Duplicate evaluation/unknown-role risk. |
| Verification | EmailVerifiedRoute targets resend-verification with state.from and reason | Target must remain reachable outside the same verification guard. |
| Onboarding | ProfileOnboardingStepPage redirects invalid step to NotFound and builds next step | Completion/revisit authority is unknown. |
| Role landing | accessPolicy plus Dashboard and DashboardChallenges | Unknown role and admin/super_admin hierarchy unresolved. |
| Hardcoded internals | Account, Connections, Marketplace, ServiceDetail, Profile, and legacy-looking Auth | Seven risky consumers; no migration authorized. |
| External sessions | Settings and Payments use server-provided full-page URLs | Origin/scheme/failure policy needs security review. |
| Route constants | client/src/constants/routes.js plus existing builders | /offers intent, aliases, and dynamic contracts unresolved. |
| Navigation | Existing public/dashboard/admin/client link registries and component links | No navigation change authorized; metadata gaps remain. |
| Protected-route dependencies | AuthHydration, guards, three layouts, route metadata, auth store/provider | Stage 4.2 implementation was deferred. |
| Duplicate redirect risk | Guest wrapper/page checks; guard/layout denial consumers | Do not consolidate without ordered tests. |
| Duplicate NotFound risk | None found in browser scope; API handler is separate scope | Adding scoped fallback must not create another global authority. |
| Duplicate wildcard risk | None found; one terminal declaration | Any added/moved wildcard blocks release. |
| Loop/priority risk | 16 Prompt 9 risks; no active infinite loop proven | Runtime role/state/history matrix absent. |
| Fallthrough risk | /offers intent, metadata gaps, scoped fallback intent, host deep links | Production hardening remains blocked. |
| Stale target risk | pages/Auth.jsx and /offers are not proven active/intentional | Reachability/product decisions required. |
| Hardcoded redirect risk | 17 window.location assignments overall; Prompt 9 isolates internal/external/reload cases | Do not treat all full-page navigation as one migration class. |
| Available commands | client lint/build/check:boundaries; server check:boundaries | Build creates artifacts and was not run under docs-only gate. |
| Unknown commands | No client route, redirect, test, or typecheck script found; no server test script found | Behavioral implementation gate cannot pass. |

## Static Counts At Prompt 10

- BrowserRouter authority files: 1.
- Routes authority files: 1.
- Terminal wildcard declarations: 1.
- Browser NotFound page files: 1.
- API not-found handler files: 1.
- Navigate usages: 19.
- window.location redirect/reload usages: 17.

## Baseline Risk Summary

The current architecture is singular and unchanged, but behavioral hardening is not ready. The highest risks are policy ambiguity, missing runtime state/history tests, host fallback uncertainty, and cross-stage role/metadata dependencies.
