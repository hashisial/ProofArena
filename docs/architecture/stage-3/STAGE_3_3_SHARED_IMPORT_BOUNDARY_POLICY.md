# Shared Import Boundary Policy

1. Modules may import approved shared public APIs.
2. Shared libraries must never import feature/module implementation files.
3. Shared UI cannot import module business logic, services, API adapters, auth state, routes, navigation, or shells.
4. Shared utilities must be pure unless an explicitly platform-owned side effect is approved.
5. Shared hooks must be generic and cannot own module state, auth/session, routing, or API clients.
6. Shared types require genuine cross-module use and cannot re-declare route/auth/API/platform contracts.
7. Shared constants cannot replace route, role, endpoint, status, env, or config governance.
8. Shared validation cannot weaken backend enforcement or become an auth/security bypass.
9. Platform code may import shared; shared may import only lower-level shared/platform-neutral contracts, never modules.
10. Circular dependencies are forbidden. Any cycle is a stop condition.
11. Deep imports into shared internals are restricted; stable public exports require owner approval.
12. Existing violations are frozen for migration planning, not copied into new code.

Required validation: import graph/search, consumer count, boundary script, lint/build/tests where available, and owner review for high-risk auth/API/route/config code.

