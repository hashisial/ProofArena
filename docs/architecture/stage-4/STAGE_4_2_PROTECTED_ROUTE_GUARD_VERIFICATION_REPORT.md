# Stage 4.2 Protected Route Guard Verification Report

| ID | File/guard | Prompt 1 class | Corrected class | Protection/routes/roles | Redirect/constants/auth | Duplicate/bypass/coverage | Action | Confidence | Human review |
|---|---|---|---|---|---|---|---|---|---|
| GV-001 | routes/ProtectedRoute | auth guard | active platform auth guard | dashboard parent; authenticated | login; constants; store/policy | low bypass, no role | retain | high | no |
| GV-002 | routes/RoleRoute | role guard | active canonical route-level role guard candidate | client/provider/support/admin leaves/groups | login/not-authorized; constants; store/policy | alias naming only | retain and test | high | yes |
| GV-003 | PublicOnlyRoute | guest guard | active login/register guest guard | login/register | role landing helper | other auth routes differ | verify coverage intent | high | yes |
| GV-004 | EmailVerifiedRoute | onboarding guard | active email gate | client/dashboard/admin parents | resend verification constant | canonical flag uncertainty | verify user field | high | yes |
| GV-005 | three protected layouts | layout defense | active defense-in-depth | dashboard/client/admin | accessPolicy and metadata | metadata gaps skip role policy | close metadata gaps before edits | high | yes |
| GV-006 | accessPolicy | platform policy | strongest policy candidate | auth, roles, nav visibility, fallback | constants and metadata | incomplete metadata dependency | plan around, do not replace | high | yes |
| GV-007 | RequireRole | role guard | unreferenced alternate | no importer found | constants, alternate auth hook | duplicate future risk | prove reachability | high | yes |
| GV-008 | AdminGate | admin gate | unreferenced alternate | no importer found | hardcoded paths | duplicate/stale risk | prove reachability | high | yes |
| GV-009 | Dashboard/DashboardChallenges | component dispatch | active component-level role behavior | mixed dashboard roots | constants | policy repetition | parity tests | high | yes |

No confirmed active guard bypass exists. Missing metadata and role intent prevent hardening implementation.

