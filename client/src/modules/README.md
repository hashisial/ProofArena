# Frontend Modules

`modules/` defines product-level ownership inside the existing ScaleOps client.
It does not replace `features/`, `pages/`, `components/`, or `routes/` yet.

Use a module boundary when a product area coordinates several features and
needs an explicit public surface. Feature-specific server state and workflows
remain in `features/<domain>/` until they can be migrated safely.

Rules:

- ScaleOps remains the application root.
- ProofArena remains a module inside ScaleOps.
- New module code must reuse `components/ui`, `services/apiClient.js`,
  centralized constants, and React Query feature hooks.
- Do not import another module's private implementation.
- Do not move active files into a module without updating all consumers and
  passing lint, build, and runtime checks.

