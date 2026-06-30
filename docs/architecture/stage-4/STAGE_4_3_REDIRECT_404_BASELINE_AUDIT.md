# Stage 4.3 Redirect and 404 Baseline Audit

| ID | File | Type | Source | Target | Constant | Hardcoded | Auth/role dependency | Current/duplicate/missing risk | Future action | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| B-001 | `AppRoutes.jsx` | wildcard/404 | `*` | NotFound page | wildcard no | yes, intentional | none | low; catches all browser paths | retain until behavior tests | high |
| B-002 | same | explicit 404 | `/not-found` | NotFound page | yes | no | none | low; duplicates component, not path | document explicit vs wildcard semantics | high |
| B-003 | same | forbidden/system | `/403`, `/not-authorized` | Forbidden/NotAuthorized | yes | no | role context in page | medium two unauthorized paths | decide compatibility later | high |
| B-004 | same | server error | `/500` | ServerError | yes | no | none | low | retain | high |
| B-005 | `ProtectedRoute.jsx` | unauthenticated redirect | protected attempted route | `/login` with `state.from` | yes | no | auth | low | preserve intended destination tests | high |
| B-006 | `RoleRoute.jsx` | unauthenticated/unauthorized | role route | `/login` or `/not-authorized` | yes | no | auth/role | low | test all roles | high |
| B-007 | `EmailVerifiedRoute.jsx` | verification redirect | unverified protected route | `/resend-verification` with state | yes | no | email state | medium multi-field verification check | confirm canonical field | high |
| B-008 | `PublicOnlyRoute.jsx` + `authRouteUtils.js` | authenticated landing | login/register | role dashboard | yes | no | role | medium must match access policy | verify parity | high |
| B-009 | `DashboardLayout.jsx` | unauthorized fallback | dashboard path | access-policy fallback | yes | no | auth/metadata | high when metadata missing | verify 16 generic routes | high |
| B-010 | `ClientLayout.jsx` | unauthorized fallback | client path | client/login/not-authorized | yes | no | client | low | retain/test | high |
| B-011 | `AdminLayout.jsx` | unauthorized fallback | admin path | admin/login/not-authorized | yes | no | admin | medium metadata missing for proof-review | verify alias metadata | high |
| B-012 | `Dashboard.jsx` | role landing | `/dashboard` | support/admin/not-authorized or rendered dashboard | yes | no | role | medium duplicated role policy | compare with accessPolicy | high |
| B-013 | `DashboardChallenges.jsx` | role dispatch | `/dashboard/challenges` | admin/not-authorized or role page | yes | no | role | medium component policy | compare with metadata/guard | high |
| B-014 | Login/Register/Forgot/Reset pages | authenticated redirect | auth pages | default role dashboard | yes | no | auth/role | medium multiple component checks | verify common helper use | high |
| B-015 | `ProfileOnboardingStepPage.jsx` | invalid-step redirect | invalid step | `/not-found` | yes | no | provider | low | test invalid values | high |
| B-016 | Header/ClientTopbar/DashboardTopbar/AdminTopbar | logout redirect | logout | `/login` | yes | no | auth | medium repeated behavior | consolidate only after behavior map | high |
| B-017 | `ServiceDetail.jsx` | login/messages redirect | service actions | `/login`, `/messages?...` | no | yes | auth/conversation | critical hardcoded behavior | Prompt 2 verify exact flows | high |
| B-018 | `Marketplace.jsx` | login/action redirect | marketplace actions | `/login`, projects/provider services | no | yes | auth | high | inventory flows | high |
| B-019 | `Connections.jsx`, `Profile.jsx`, `Account.jsx` | hardcoded redirect | actions | messages/settings/home | no | yes | authenticated | high | verify before migration | high |
| B-020 | `pages/Auth.jsx` | legacy role redirect | auth actions | dashboard/admin/login/home | no | yes | auth/role | critical if reachable; no importer found | prove reachability | high |
| B-021 | `utils/accessPolicy.js` | central fallback policy | unknown/forbidden paths | login/home/not-authorized/role dashboard | yes | no | auth/role/metadata | high dependency on metadata completeness | primary policy candidate | high |
| B-022 | `utils/routeValidation.js`, `utils/routeMetadata.js` | safe fallback/grouping | route path | group fallback | mostly yes; two literals | partial | metadata/role | high with 34 metadata gaps | reconcile in Prompt 2 | high |
| B-023 | `server/src/app.js` + `errors/notFoundHandler.js` | API 404 | unmatched API request | structured API error | n/a | API path layer | API | separate domain; must not merge with browser 404 | preserve boundary | high |

## Baseline Result

- Browser 404 coverage exists through both explicit `/not-found` and wildcard `*` routes.
- Redirect policy is partly centralized in guards/access policy and partly repeated in pages/components.
- No redirect or 404 behavior was modified.
- Centralization is blocked until Prompt 2 proves reachability, intended-destination behavior, role landing parity, and metadata coverage.

