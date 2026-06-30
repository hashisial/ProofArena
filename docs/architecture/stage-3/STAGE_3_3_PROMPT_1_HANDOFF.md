# Stage 3.3 Prompt 1 Handoff

## Objective

Audit existing shared-like client/server locations, classify each item as platform/shared/module/unknown, identify reverse imports and feature leakage, and propose approved shared-library categories without moving code.

## Mandatory Reading

- All Stage 3.2 final ownership/category/scaffold/violation/risk/acceptance/human/readiness/handoff documents.
- Stage 3.1 final module/platform/path/scaffold/interdependency locks and available closeout evidence.
- Stage 2 duplicate-prevention locks and final handoff.
- ADR-0001 adoption/governance docs and Stage 1 shared/critical/safe-delete controls.

## Forbidden Work

Do not move, rename, delete, import, export, refactor or create shared/module runtime files, folders, barrels, clients, auth, routes, navigation, shells, config, packages, tests or dependencies. Do not duplicate platform or module behavior.

Prompt 1 remains documentation-only.

## Required Final Response

Report files created/updated, shared inventory size, misuse findings, proposed shared categories, high-risk issues, human items, unknowns, next focus and exact no-production-code confirmation.

**Shared code only goes into approved shared libraries, and shared libraries must not become dumping grounds for module-specific business logic.**

