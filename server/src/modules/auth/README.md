# Auth Module Boundary

This directory marks the future ownership boundary for authentication,
sessions, authorization policies, verification, and password recovery.

Active auth routes, controllers, services, models, and middleware remain in
their existing locations until contract and permission tests protect a
vertical migration.

Current module-boundary exports:

- `index.js` is the public import boundary for code outside this module.
- `auth.constants.js` re-exports canonical shared auth roles/statuses.
- `auth.controller.js` owns thin auth HTTP/cookie orchestration.
- `auth.routes.js` owns validated auth route registration.
- `auth.service.js` re-exports the canonical auth service.
- `auth.utils.js` re-exports the canonical access/refresh token utilities.
- `auth.validators.js` re-exports the canonical auth validation schemas.

These files do not duplicate auth logic. New code may import through this
module boundary while existing imports remain stable.
