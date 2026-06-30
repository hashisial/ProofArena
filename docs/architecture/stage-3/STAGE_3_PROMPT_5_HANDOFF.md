# Stage 3 Prompt 5 Handoff

## Prompt 5 Objective

Verify existing components, hooks, services, contract/type files and request logic against the Stage 3.2 ownership contracts. Produce file-level ownership and migration-readiness evidence without moving or creating runtime files.

## Contracts Requiring Deeper Verification

- Domain components dispersed under the broad component root.
- Root hooks/services importing feature implementations.
- Feature hooks importing another feature's private query keys.
- Feature services combining business operations and API-adapter behavior.
- Domain utils combining endpoint construction, constants, validation and transformations.
- Platform/dashboard composition importing feature internals.
- Backend services importing multiple domain models.
- Auth/profile/proof/messages/payments/admin sensitive ownership.

## Scaffold Status

- Documentation-only internal README scaffolds currently safe: none.
- Blocked modules: all ten until missing Stage 3.1 review/handoff documents, module base authority, tests and human approvals are resolved.

## Required Reading

Read the available Stage 3.1 final locks, Stage 3.2 tracker/audit/matrix/contracts/decisions/violations/manifest, Stage 2 prevention locks, ADR-0001, and Stage 1 critical-file/do-not-duplicate controls.

## Forbidden Changes

Do not create folders, READMEs, components, hooks, services, types, adapters, API clients, barrels, imports, routes, auth, models, layouts, config, package, build/deployment or dependencies. Do not move, rename or delete files.

Prompt 5 remains documentation-only. It may recommend a future README only when every prerequisite is explicitly satisfied; it may not create one under the current evidence.

**Module API adapters must not become duplicate API clients.**

