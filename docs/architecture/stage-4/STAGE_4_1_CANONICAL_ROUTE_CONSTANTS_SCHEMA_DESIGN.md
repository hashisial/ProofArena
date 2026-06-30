# Stage 4.1 Canonical Route Constants Schema Design

The planned schema reuses the existing file and exports; it creates no new runtime structure.

- PUBLIC_ROUTES: public/static browser paths.
- AUTH_ROUTES: login/register/recovery/verification.
- DASHBOARD_ROUTES: shared authenticated workspace paths.
- PROVIDER_ROUTES and CLIENT_ROUTES: semantic role views that may alias shared paths.
- ADMIN_ROUTES: admin browser paths.
- SYSTEM_ROUTES: explicit status pages.
- DYNAMIC_ROUTES: parameterized patterns only.
- ROUTES: compatibility facade retained throughout migration.
- Builders: named functions using buildRoute; no ad hoc interpolation after approved migration.
- Excluded: wildcard *, API routes, redirect policy, metadata, navigation labels, auth decisions.

Compatibility aliases must be marked and retained until consumer/test evidence supports removal.

## Detailed Design Contract

| Concern | Recommended design |
|---|---|
| Ownership | ScaleOps platform routing |
| File | Reuse client/src/constants/routes.js |
| Keys | Stable UPPER_SNAKE_CASE semantic names |
| Values | Absolute browser paths; no trailing slash except root |
| Groups | PUBLIC, AUTH, DASHBOARD, CLIENT, PROVIDER, ADMIN, SYSTEM, DYNAMIC |
| Compatibility | Preserve ROUTES facade and aliases until tests permit deprecation |
| Dynamic paths | Pattern constants plus named existing buildRoute-based builders |
| Metadata | Keep labels, roles, visibility, and protection outside string constants |
| Role/auth | Keep guards and access policy outside constants |
| Redirects | Constants provide targets; policy stays in guards/accessPolicy/Stage 4.3 |
| Wildcard | Keep terminal literal in AppRoutes |
| API paths | Excluded; API endpoint registries remain separate |

### Documentation-Only Pseudocode

```text
PUBLIC_ROUTES = {
  HOME: "/",
  CHALLENGES: "/challenges"
}

DYNAMIC_ROUTES = {
  PUBLIC_CHALLENGE: "/challenges/:username/:slug"
}

builder PUBLIC_CHALLENGE(username, slug):
  buildRoute(DYNAMIC_ROUTES.PUBLIC_CHALLENGE, { username, slug })

ROUTES = compatibility facade preserving the current public API
```

The design covers public/auth/dashboard/admin/provider/client routes and the profile, offers, challenges, plans, proof, matching, messages, payments, settings, dynamic detail, redirect, and 404/fallback domains. Modules remain inside platform groups; no module route tree is created.

### Deprecation Sequence

1. Freeze exports and record consumers.
2. Approve canonical keys without deleting aliases.
3. Add consumer/deep-link tests.
4. Migrate one exact approved batch.
5. Validate compatibility and inbound links.
6. Mark deprecated keys in documentation.
7. Remove only in a separate approved prompt with rollback proof.
