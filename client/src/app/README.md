# Application Composition

This directory is reserved for application-level composition such as global
providers and future route-group assembly.

Current runtime ownership remains unchanged:

- `client/src/main.jsx` mounts React, React Query, and React Router.
- `client/src/App.jsx` composes application-wide providers.
- `client/src/routes/` owns route definitions and route guards.

Do not move those files here without regression coverage and an incremental
import migration.
