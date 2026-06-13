# Auth Module Boundary

This directory marks the future ownership boundary for authentication,
sessions, authorization policies, verification, and password recovery.

Active auth routes, controllers, services, models, and middleware remain in
their existing locations until contract and permission tests protect a
vertical migration.

Current module-boundary exports:

- `auth.constants.js` re-exports canonical shared auth roles/statuses.
- `auth.validators.js` re-exports the canonical auth validation schemas.

These files do not duplicate auth logic. New code may import through this
module boundary while existing imports remain stable.
