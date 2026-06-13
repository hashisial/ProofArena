# ProofArena Backend Module

This directory is the backend product boundary for ProofArena inside the
existing ScaleOps API. It is not a second server and must not duplicate
existing routes, controllers, services, models, middleware, validators, or
platform adapters.

## Current Ownership

ProofArena currently spans established domains including challenges,
execution plans, matching, opportunities, outcome offers, proof assets,
providers, saved providers, first-client workflows, and workspace read
models. Active files remain in the current layer-oriented directories.

## Target Boundary

```text
modules/proofarena/
  routes/       Module route registration and composition
  controllers/  HTTP translation only
  services/     Cross-domain ProofArena use cases only
  models/       ProofArena-owned persistence aggregates
  validators/   Request and contract validation
  constants/    Module-wide domain constants
  utils/        Module-wide pure helpers
```

Feature-specific domains should become sibling modules when they require
independent ownership. ProofArena must reuse shared ScaleOps authentication,
database, security, payments, storage, realtime, queue, and error systems.

## Service Ownership

Current live ProofArena services remain in `server/src/services`:

- `challenge.service.js`
- `executionPlan.service.js`
- `match.service.js`
- `opportunityPipeline.service.js`
- `outcomeOffer.service.js`
- `proofAsset.service.js`
- provider public/search services
- `savedProvider.service.js`

Do not create empty copies under this module. A service belongs here only when
it coordinates multiple ProofArena domains as one tested use case.

## Migration Rule

Move one complete vertical slice at a time. Preserve `/api/v1` contracts,
update all imports, and verify permissions and public/private data behavior
before retiring compatibility paths.
