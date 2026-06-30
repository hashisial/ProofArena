# Stage 4.3 Auth and Role Redirect Flow Verification Matrix

| State | Evaluator order | Expected result | Verification |
|---|---|---|---|
| Anonymous client/admin/dashboard | AuthHydration then role/auth parent | login with from | static verified |
| Unverified authenticated client/admin/dashboard | role/auth then email guard | resend verification | static verified |
| Wrong explicit role child | dashboard parent then RoleRoute | not-authorized with from | static verified |
| Authenticated login/register | PublicOnlyRoute | role default | static verified |
| Metadata denial in layout | layout policy | caller-dependent fallback | static verified, policy unclear |
| Unknown role | guard/policy helper | not-authorized, dashboard, or home by caller | inconsistent candidate |
| Invalid onboarding step | page validation | explicit NotFound | static verified |
| Unknown path | terminal wildcard | NotFound | static verified |

Runtime history, back-button, and loop behavior remain unverified.

