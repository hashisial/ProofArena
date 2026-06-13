# ProofArena Frontend Module

This directory is the product boundary for ProofArena inside the existing
ScaleOps client. It is not a separate application and does not own a second
router, API client, state store, layout system, or UI library.

## Current Ownership

ProofArena is currently implemented through established ScaleOps domains:

- `features/challenges`
- `features/executionPlans`
- `features/matches`
- `features/opportunities`
- `features/outcomeOffers`
- `features/proofAssets`
- `features/providers`
- `features/savedProviders`
- related pages and domain components

These active files remain in place to preserve working imports.

## Target Boundary

```text
modules/proofarena/
  routes/       ProofArena route registration after route migration
  components/   Module-wide composed UI, never generic UI primitives
  pages/        Module-owned route compositions
  services/     Cross-feature ProofArena orchestration only
  hooks/        Cross-feature ProofArena orchestration hooks
  types/        Shared ProofArena contracts when the project adopts them
  constants/    Module-wide constants, not domain-specific enums
  utils/        Module-wide pure helpers only
```

Domain-specific code should continue to live in the owning feature. Generic
components belong in `components/ui` or the existing shared/common boundary.

## Service Ownership

ProofArena service names map to existing live feature services:

- Offers: `features/outcomeOffers/outcomeOfferService.js`
- Challenges: `features/challenges/challengeService.js`
- Execution plans: `features/executionPlans/executionPlanService.js`
- Proof Vault: `features/proofAssets/proofAssetService.js`
- Matching: `features/matches/matchService.js`

Do not create placeholder copies under `modules/proofarena/services`. That
folder is reserved for a real cross-feature orchestration use case that cannot
belong to one domain.

## Hook Ownership

`modules/proofarena/hooks/useProofArenaModule.js` exposes stable module identity
and enabled status only. Future cross-feature module coordination belongs
there only after real consumers exist. Domain queries and mutations remain in
their established feature hooks.

## Migration Rule

Migrate one vertical domain at a time only after its routes, API contracts, and
permissions have regression coverage. Do not create compatibility copies.
