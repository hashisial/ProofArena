# Stage 4.3 Redirect Loop and Priority Verification

No static cycle is proven in the current parent composition. The intended evaluation order is hydration, authentication/role parent, email verification, child role guard, layout metadata policy, page validation, then wildcard.

Unverified loop cases:
- unknown-role role-default destination;
- saved attempted location that denies after login;
- resend-verification reachability for authenticated unverified users;
- layout fallback disagreeing with child guard;
- page-level full reload losing state and re-triggering guard logic.

Status: verified as risk, not validated as behavior. Implementation remains blocked until browser tests prove termination and history semantics.

