# Backend Architecture

## Scope

ScaleOps has one Node/Express/MongoDB backend under `server/`. ProofArena is a
set of domains inside that backend, not a separate server.

This foundation pass preserves all existing route contracts and standardizes
shared roles, workflow statuses, and response helpers. It does not add
challenge, application, milestone, or proof business features.

## Folder Structure

```text
server/src/
  app.js             Express application composition and route mounts
  server.js          Database connection, workers, sockets, and HTTP startup
  config/            Environment, database, CORS, and external-service config
  constants/         Shared roles, statuses, limits, and domain constants
  controllers/       HTTP request and response adapters
  middleware/        Authentication, authorization, validation, errors, security
  models/            Mongoose schemas and persistence behavior
  routes/            Legacy route modules and the canonical v1 route composer
  services/          Business logic, authorization rules, and data shaping
  socket/            Realtime server and event handlers
  utils/             Response, error, logging, ownership, token, and slug helpers
  validators/        Zod validators and legacy validation compatibility
  workers/           Background worker registration
```

All required backend foundation folders already existed. No duplicate server or
parallel root was created.

## Request Flow

New and upgraded backend domains must follow:

```text
Route
  -> authentication / authorization / validation middleware
  -> Controller
  -> Service
  -> Model or external adapter
```

Responsibilities:

- **Routes** declare HTTP methods, paths, and middleware order. Routes must not
  import services or models.
- **Controllers** translate HTTP inputs to service calls and return response
  envelopes. Controllers should not contain persistence or domain logic.
- **Services** own business rules, authorization checks that require data,
  persistence orchestration, and public/private response shaping.
- **Models** own Mongoose schemas, indexes, persistence constraints, and
  narrowly scoped model behavior.
- **Middleware** owns cross-cutting request concerns such as authentication,
  permissions, validation, sanitization, rate limiting, and errors.

The current dependency audit found:

- 36 route files; none import services or models.
- 35 controller files; 33 reference `asyncHandler`.
- 31 controller files import services.
- One controller, `adminController.js`, imports models directly.
- No service imports routes or controllers.
- No model imports routes, controllers, or services.

## Existing Patterns

The newer v1 ProofArena domains already follow the intended flow:

- `routes/v1/challenge.routes.js`
- `controllers/challenge.controller.js`
- `services/challenge.service.js`
- `models/Challenge.model.js`

The same pattern is established for execution plans, matches, outcome offers,
opportunity pipeline, proof assets, saved providers, first-client mode, auth,
and profiles.

The backend is JavaScript with ES modules. New backend files must use JavaScript
and existing ES module conventions.

## Roles

Canonical role constants live in:

`server/src/constants/roles.js`

Available role names:

- `ADMIN`
- `CLIENT`
- `PROVIDER`
- `USER`

`USER` is a legacy compatibility alias that normalizes to `CLIENT`. It is not a
persisted account role. `USER_ROLE_VALUES` deliberately remains:

```text
admin, client, provider
```

Public registration remains limited to client and provider roles.

The existing constants barrel, `constants/index.js`, re-exports these constants
so current imports continue to work.

## Workflow Statuses

Canonical cross-domain workflow statuses live in:

`server/src/constants/statuses.js`

It owns:

- `CHALLENGE_STATUS`
- `ENTRY_STATUS`
- `EXECUTION_PLAN_STATUS`
- `APPLICATION_STATUS`
- `MILESTONE_STATUS`
- `PROOF_STATUS`
- Corresponding frozen value arrays

Applications currently use the execution-plan workflow, so
`APPLICATION_STATUS` intentionally aliases `EXECUTION_PLAN_STATUS`. A distinct
application status contract should be created only when a real application
model and route domain exists.

The constants barrel re-exports all status constants to preserve existing
imports.

## Response Strategy

Shared response helpers live in:

`server/src/utils/apiResponse.js`

Route registration is centralized in:

- `server/src/routes/index.js` for `/api/*`
- `server/src/routes/v1/index.js` for `/api/v1/*`

The canonical success envelope is:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": null
}
```

The canonical error envelope is:

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

`successResponse` remains the established helper for current controllers.
`sendCreated`, `sendNoContent`, `sendError`, their response-name aliases, and
`paginatedResponse` provide focused variants.

`sendSuccess` remains as a legacy compatibility signature and now delegates to
`successResponse`, ensuring both controller generations produce the same
envelope.

## Error Handling

Shared error foundations:

- `utils/AppError.js`: operational errors with status codes and optional
  structured errors.
- `utils/asyncHandler.js`: forwards rejected async controller work to Express.
- `middleware/errorMiddleware.js`: canonical `notFound` and `errorHandler`
  implementation.
- `middleware/error.middleware.js`: compatibility export for `errorHandler`.
- `middleware/notFound.middleware.js`: compatibility export for `notFound`.

`app.js` mounts `notFound` and `errorHandler` after all routes. New controllers
must use `asyncHandler` or explicitly forward errors to `next`.

The error middleware logs server-side details and returns only the standard
error envelope. Sensitive stack traces, tokens, and persistence internals are
not returned.

## Route Ownership

`app.js` mounts:

- The v1 API at `/api/v1`
- The centralized legacy API composer at `/api`

`routes/v1/index.js` is the canonical composer for newer ProofArena routes.
Many legacy route modules are intentionally available from both surfaces for
compatibility.

Do not rename or remove either route surface without:

1. Auditing frontend and external consumers.
2. Defining a deprecation period.
3. Adding contract tests.
4. Updating endpoint documentation.

## Compatibility Files

The repository intentionally contains compatibility aliases, including:

- Plain and dotted controller names
- Plain and dotted service names
- Plain and `.model.js` model names
- Plain and dotted middleware names

Examples include `authController.js`, `auth.service.js`, `User.model.js`,
`error.middleware.js`, and `roleMiddleware.js`.

New code should use the canonical implementation path already used by its
domain. Compatibility aliases must not be deleted until all imports and runtime
consumers are verified.

## Technical Debt and Warnings

1. `adminController.js` imports `Connection`, `Conversation`, and `Message`
   models directly. This is the measured exception to the
   Route -> Controller -> Service -> Model rule and should migrate to an admin
   service in a dedicated change.
2. Legacy `/api/*` routes and `/api/v1/*` routes overlap. The project needs a
   versioning and deprecation policy before routes can be consolidated.
3. The backend mixes Zod validators and legacy validation middleware. Use Zod
   for new route contracts and migrate legacy routes only when touched.
4. Plain filenames and dotted filenames coexist as compatibility paths. Pick
   one convention per domain and migrate incrementally.
5. `constants/index.js` remains large. Roles and core workflow statuses are now
   extracted; split additional domains only when there is a clear owner and
   safe migration.
6. Several controllers and services are large. Decompose by real business
   boundary, not by arbitrary file size.
7. `errorMiddleware.js` now redacts unexpected internal error messages in
   production. Add contract tests before expanding the set of operational
   errors that may be returned to public clients.

## Rules for Future Backend Work

1. Reuse the existing server, app, middleware, and v1 route composer.
2. Put new business rules in a service, not a controller.
3. Use `asyncHandler` for async controllers.
4. Use `AppError` for operational failures.
5. Use `successResponse` or its focused variants for new responses.
6. Use canonical role and status constants rather than local string arrays.
7. Validate all externally supplied params, queries, and bodies.
8. Sanitize public responses in services and never expose sensitive fields.
9. Preserve existing route contracts unless a migration is explicitly planned.
10. Do not create a second ProofArena backend.
