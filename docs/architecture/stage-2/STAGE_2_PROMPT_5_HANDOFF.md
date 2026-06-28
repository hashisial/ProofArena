# Stage 2 Prompt 5 Handoff

## Prompt 5 Must Verify

1. Trace all Prompt 4 feature surfaces to concrete pages, routes, services, endpoints, models, layouts, and guards.
2. Separate shared platform ownership from ProofArena feature ownership.
3. Verify the integration contract for routing, API, auth/roles, data, layouts, and shared code.
4. Measure the blast radius of every `SD-*` drift risk.
5. Re-score module readiness using verified dependencies.

## Protected ScaleOps Systems

`client/src/routes/AppRoutes.jsx`, `client/src/constants`, all shared layouts, `client/src/services/apiClient.js`, auth stores/guards, `server/src/app.js`, server middleware, DB/config, package/build/deployment files.

## Required Reading

Read the Stage 2.1 final package and every Prompt 4 Stage 2.2 document, plus Stage 1 route/API/model/ownership maps as needed.

## Restrictions

Prompt 5 remains documentation-only. It must not change routes, layouts, services, models, auth, packages, config, or deployment state.

**ProofArena is a flagship module inside ScaleOps, not a separate app.**

