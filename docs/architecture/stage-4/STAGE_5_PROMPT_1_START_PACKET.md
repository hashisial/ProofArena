# Stage 5 Prompt 1 Start Packet

## Objective And Required First Action

Perform a documentation-only API contract source-of-truth audit. First read the Stage 4 final authority/handoff package, Stage 3 API adapter/shared-service locks, ADR-0001, and Stage 2 API/auth/role locks; then inventory current API behavior before proposing any standard.

## Systems To Inspect

- Backend routes, controllers, services, middleware, and model-facing response paths.
- Existing platform API clients and configuration boundaries.
- Frontend module API adapters and direct API call sites.
- Response, error, not-found, validation, auth-failure, and authorization helpers.
- Pagination, metadata, status-code, and request/response DTO patterns.
- Browser/API 404 separation and route-role/API permission dependencies.

## Systems Not To Change

Runtime backend routes, controllers, services, middleware, models, API clients, frontend adapters, auth, route, response/error, validation, database, package, config, environment, build, and deployment systems.

## Forbidden Actions

- Do not create or replace an API client.
- Do not standardize responses or errors.
- Do not edit controllers, services, middleware, or frontend adapters.
- Do not create response wrappers, error helpers, auth handlers, DTOs, or barrel exports.
- Do not infer endpoint authorization from frontend routes or guards.
- Do not begin implementation when source-of-truth, ownership, or compatibility is unknown.

## Required Output Documents

- Stage 5 master tracker and Prompt 1 preflight.
- API route/controller/service contract inventory.
- Response, status-code, and error-shape inventory.
- Platform API client and frontend adapter inventory.
- Auth/authorization/validation/pagination contract baseline.
- Duplication, drift, and sensitive-data risk register.
- Source-of-truth candidate analysis and governance rulebook draft.
- Machine-readable Stage 5 manifest and Prompt 2 handoff.

## Required Final Response

List files created/updated, preflight result, inventories, source candidates, risks, human-review items, unknowns, Prompt 2 focus, and the exact required no-production-change statement.

Do not standardize API responses, edit controllers, edit services, edit frontend API adapters, create response wrappers, create error helpers, or modify auth/API behavior until Stage 5 Prompt 1 completes a full API contract source-of-truth audit and explicitly proves the safe implementation path.

