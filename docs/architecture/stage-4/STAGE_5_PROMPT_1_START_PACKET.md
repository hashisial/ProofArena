# Stage 5 Prompt 1 Start Packet

## Objective

Perform a documentation-only API contract source-of-truth audit.

## First Action

Read Stage 4 final authority and handoff documents, Stage 3 module/API adapter locks, ADR/upstream platform locks, then inventory existing backend routes, controllers, services, middleware, API clients, frontend adapters, response/error helpers, validation helpers, auth errors, and pagination/meta handling.

## Systems Not to Change

All runtime API, backend, frontend adapter, auth, route, response, error, validation, database, package, config, env, build, and deployment systems.

## Required Outputs

- Stage 5 tracker and preflight verification.
- API route/controller/service contract inventory.
- Response and error shape inventory.
- Platform API client and frontend adapter inventory.
- Auth/validation/pagination contract baseline.
- Duplication and inconsistency risk register.
- Source-of-truth candidate analysis.
- Governance rulebook draft.
- Machine-readable manifest and Prompt 2 handoff.
- Final response listing files, audit results, risks, unknowns, and exact no-production-change confirmation.

Do not standardize API responses, edit controllers, edit services, edit frontend API adapters, create response wrappers, create error helpers, or modify auth/API behavior until Stage 5 Prompt 1 completes a full API contract source-of-truth audit and explicitly proves the safe implementation path.

