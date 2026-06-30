# Stage 4.3 Redirect Loop and Priority Risk Audit

Potential cycles and priority conflicts:

- authenticated guest-only route to a role default that may itself deny an unknown role;
- layout fallback and child RoleRoute both evaluating the same path with different destinations;
- unverified users redirected to resend-verification, which is not guest-only and must remain reachable;
- unknown roles receiving dashboard, home, or not-authorized depending on caller options;
- login return state pointing to a route that later denies the user's role;
- full-page hardcoded redirects dropping router state or query intent;
- wildcard ordering changes intercepting explicit system routes.

No active loop was proven. Risk remains high enough to block implementation until a deterministic priority table and browser matrix exist.

