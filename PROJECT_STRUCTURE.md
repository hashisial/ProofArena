# ScaleOps / ProofArena Project Structure

## Purpose

This document defines the current structural foundation and canonical
ownership rules for the existing ScaleOps MERN application. ProofArena remains
the flagship product module inside ScaleOps; it is not a separate project,
client, or server.

This foundation pass intentionally avoids risky runtime-file moves, import
rewrites, pages, and business logic. It establishes explicit module ownership
directories so future domains can migrate safely as tested vertical slices.

## Repository Roots

```text
/
  client/                    React/Vite application
  server/                    Express/Mongoose application
  ARCHITECTURE_AUDIT.md      Current-state architecture findings
  FOUNDATION_PLAN.md         Incremental target architecture
  PROJECT_STRUCTURE.md       Canonical structure and ownership rules
```

There is one client root and one server root. A standalone ProofArena root
must not be created.

## Frontend Structure

```text
client/src/
  app/                       Application-composition boundary
  assets/                    Source-controlled imported assets
  components/
    admin/                   Admin-specific UI
    challenges/              Challenge UI
    common/                  Existing cross-page composed components
    dashboard/               Dashboard UI
    executionPlans/          Execution-plan UI
    firstClient/             First-client workflow UI
    matches/                 Match UI
    navigation/              Navigation components
    opportunities/           Opportunity UI
    outcomeOffers/           Outcome-offer UI
    profile/                 Profile UI
    proof/                   Proof UI
    providers/               Provider UI
    settings/                Settings UI
    ui/                      Canonical reusable UI primitives
    workspace/               Workspace UI
  constants/                 Routes, API endpoints, navigation, tokens, keys
  config/                    Reserved validated client runtime configuration
  features/
    admin/                   Admin server-state integration
    auth/                    Authentication provider, service, and hook
    challenges/              Challenge service, queries, and feature helpers
    dashboard/               Shared dashboard data definitions
    executionPlans/          Execution-plan service and queries
    firstClient/             First-client service and queries
    matches/                 Matching service and queries
    opportunities/           Opportunity service and queries
    outcomeOffers/           Outcome-offer service and queries
    profile/                 Profile service and queries
    proof/                   Reserved documented proof boundary
    proofAssets/             Canonical proof-asset service and queries
    providers/               Provider discovery/service/query integration
    savedProviders/          Saved-provider service and queries
    social/                  Social feature integration
    workspace/               Workspace service and queries
  hooks/                     Existing shared and compatibility hooks
  layouts/                   Canonical route-level application layouts
  lib/                       Shared vendor/framework adapters only
  modules/
    proofarena/              Flagship product boundary inside ScaleOps
  pages/                     Route-level page composition
  routes/                    Route definitions and route guards
  sections/                  Canonical page-level composed sections
  services/                  API client, query client, and legacy API facade
  store/                     Zustand auth/session and small UI state
  styles/                    Design tokens and scoped/global style foundations
  types/                     Reserved shared/generated contracts
  utils/                     Cross-domain pure helpers and formatting
  App.jsx                    Current application provider composition
  main.jsx                   Current client entry point
```

### Frontend Ownership Rules

1. `components/ui/` is canonical for reusable UI primitives.
2. `layouts/` remains canonical for `PublicLayout`, `AuthLayout`,
   `DashboardLayout`, `AdminLayout`, and workspace layouts. A duplicate
   `components/layout/` directory was not created.
3. ProofArena is represented by established domain features such as
   challenges, execution plans, matches, proof assets, providers, outcome
   offers, opportunities, and workspace. `modules/proofarena/` now documents
   the product-level ownership boundary without copying those active features.
4. Feature server state follows:

   ```text
   API client -> feature service -> React Query hook -> UI
   ```

5. Zustand remains limited to authentication/session and small UI or realtime
   coordination concerns.
6. `services/apiClient.js` remains the canonical HTTP client.
7. `services/api.js` is a legacy compatibility facade and must not receive new
   domain APIs.
8. `routes/` remains canonical for route definitions. Future `app/` route
   composition must not duplicate active routes.
9. New section components belong in `sections/` or the owning feature, not the
   empty compatibility directory `components/sections/`.

## Backend Structure

```text
server/src/
  config/                    Environment, database, and runtime configuration
  constants/                 Shared server constants and permissions
  controllers/               HTTP request/response adapters
  jobs/                      Existing background job definitions
  middleware/                Auth, validation, security, upload, and errors
  models/                    Mongoose persistence models
  modules/
    auth/                    Future tested auth vertical slice
    users/                   Future tested account vertical slice
    proofarena/              Flagship product boundary inside ScaleOps
  routes/
    v1/                      Canonical versioned ProofArena routes
  services/                  Domain business logic and data shaping
  socket/                    Realtime server integration
  utils/                     Responses, errors, async handling, and helpers
  validators/                Request validation schemas
  workers/                   Existing background worker entry points
  app.js                     Express application and route mounting
  server.js                  Server startup and graceful shutdown
```

The module directories are migration boundaries only. Existing routes,
controllers, services, models, middleware, validators, and utilities remain
canonical until a complete domain is migrated safely.

### Backend Ownership Rules

Backend request handling follows:

```text
Route -> Middleware/Validator -> Controller -> Service -> Model
```

- Routes own endpoint composition and middleware order.
- Controllers translate HTTP input and output only.
- Services own business rules, authorization-aware data access, and public or
  private data shaping.
- Models own persistence schemas and narrowly scoped persistence behavior.
- New versioned endpoints belong under `/api/v1`.
- Existing legacy `/api` routes remain in place until consumers are migrated
  and regression coverage exists.
- Zod is preferred for new or touched request validation. Existing
  `express-validator` routes remain for compatibility.

## Duplicate Structures Avoided

### `components/layout/`

Not created because `client/src/layouts/` already owns all active route-level
layouts. Creating a second directory would make layout ownership ambiguous.

### `features/proofarena/`

Not created because ProofArena is already implemented through cohesive domain
features. The new `modules/proofarena/` boundary coordinates future
cross-feature ownership without creating duplicate services or hooks.

### Additional Client or Server Roots

No additional client, server, or ProofArena project root was created.

### Backend Foundation Folders

The requested `config`, `constants`, `controllers`, `middleware`, `models`,
`routes`, `services`, `utils`, and `validators` directories already existed
and were retained without moving files.

## Documentation-Only Foundation Folders

- `client/src/app/` documents the future application-composition boundary
  while current runtime composition stays in `main.jsx`, `App.jsx`, and
  `routes/`.
- `client/src/lib/` documents where future shared adapters may live without
  duplicating API clients, query configuration, or feature services.
- `client/src/modules/proofarena/` documents the frontend product boundary and
  its safe migration rules.
- `server/src/modules/auth/`, `server/src/modules/users/`, and
  `server/src/modules/proofarena/` document future tested backend vertical
  slices without moving active code.
- Empty asset, proof, and legacy section boundaries include README files so
  their intended ownership is explicit.

## Safe Change Process

Before moving or consolidating existing files:

1. Confirm the canonical target and all current consumers.
2. Add regression coverage for the affected behavior.
3. Migrate imports incrementally.
4. Run client lint and production build.
5. Run server module-import and health smoke checks.
6. Remove compatibility files only after import scans confirm zero consumers.

See `ARCHITECTURE_AUDIT.md` for current risks and `FOUNDATION_PLAN.md` for the
phased consolidation strategy.
