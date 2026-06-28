# Stage 2.2 to Stage 2.3 Handoff Brief

## Established Boundaries

- Stage 2.1: ScaleOps is the parent SaaS and one repository/runtime boundary is preserved.
- Stage 2.2: ProofArena is the flagship product module and reuses platform routing, layouts, navigation, API, auth/roles, backend runtime, data connection, shared code, config, and deployment governance.

## Stage 2.3 Must Prevent

A separate ProofArena app/repo/package, parallel navigation or route tree, duplicate dashboard/sidebar/layout shell, alternate API client/server, alternate auth/role system, separate config/deploy/data boundary, or private module imports that reverse dependency direction.

## Mandatory Reading

Stage 1 final handoff/control/critical/safe-delete docs; ADR-0001 adoption/rulebook; Stage 2.1 final authority/protection/compliance docs; all Stage 2.2 final locks, risk table, checklist, and manifest.

## Inherited Risks and Human Questions

Stage 2.3 inherits `SD-01` through `SD-06` and `SD-11`. It must consider naming, external topology, source-file selections, sensitive ownership, and production authorization without attempting to decide them silently.

## Recommended First Prompt

Run a documentation-only duplicate-prevention audit across app/package boundaries, navigation, routes, layouts/dashboard shells, API clients, auth/roles, config/deploy, and module import direction. Create detection and stop-ship rules.

**Do not create a separate ProofArena app or duplicate navigation stack.**

