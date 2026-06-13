# ScaleOps Architecture

## Project Overview

ScaleOps is the parent MERN platform. ProofArena is the flagship product
module inside ScaleOps. The repository contains one React/Vite client and one
Express/Mongoose server:

```text
ScaleOps/
  client/                     React 19 and Vite application
  server/                     Express 5 and Mongoose API
  scripts/                    Repository architecture checks
  docs/                       Long-term product strategy documents
```

ProofArena must not become a separate project, router, API client, design
system, authentication system, or server. It composes established ScaleOps
capabilities and domain features through explicit module boundaries.

The architecture is an incremental modular monolith. Existing feature code
remains in place until a complete, tested vertical slice can move safely.

## Frontend Structure

```text
client/src/
  app/                        Application-composition documentation boundary
  assets/                     Imported source-controlled assets
  components/
    ui/                       Canonical reusable UI primitives
    common/                   Product-neutral composed components
    <domain>/                 Existing domain-owned UI
  config/                     Validated public runtime configuration
  constants/                  Routes, API endpoints, navigation, tokens, keys
  errors/                     Normalized client error model
  features/                   Domain services, React Query hooks, and helpers
  hooks/                      Product-neutral reusable hooks and compatibility hooks
  layouts/                    Route-level layout owners
  lib/                        Shared vendor/framework adapters
  modules/
    proofarena/               ProofArena product-composition boundary
  pages/                      Route-level composition
  routes/                     Route definitions and guards
  sections/                   Page and marketing section composition
  services/                   API/query clients and compatibility facade
  store/                      Small Zustand client-state stores
  styles/                     Design-token and global style foundations
  types/                      Reserved shared/generated contracts
  utils/                      Product-neutral pure helpers
```

Canonical frontend request flow:

```text
Page or component
  -> Feature React Query hook
    -> Feature service
      -> Central API client
        -> Backend API
```

New domain behavior belongs in the owning `features/<domain>/` and
`components/<domain>/` boundaries. Cross-feature ProofArena composition
belongs in `modules/proofarena/`.

## Backend Structure

```text
server/src/
  config/                     Environment, database, and integration config
  constants/                  Shared roles, statuses, and permissions
  controllers/                HTTP translation adapters
  errors/                     Canonical backend error system
  jobs/                       Background job definitions
  middleware/                 Auth, validation, security, upload, and request middleware
  models/                     Mongoose persistence models
  modules/
    auth/                     Future tested auth vertical slice
    users/                    Future tested user vertical slice
    proofarena/               ProofArena product-composition boundary
  routes/                     Legacy and versioned route composition
  services/                   Business logic and data shaping
  socket/                     Realtime infrastructure
  utils/                      Shared backend helpers
  validators/                 Request validation contracts
  workers/                    Background worker entry points
  app.js                      Express application composition
  server.js                   Runtime startup and graceful shutdown
```

Canonical backend request flow:

```text
Route
  -> Middleware and validator
    -> Controller
      -> Service
        -> Model or external adapter
```

Controllers translate HTTP input/output. Services own business logic,
authorization-aware data access, and public/private data shaping. Models own
persistence definitions and narrowly scoped persistence behavior.

## Module Rules

The enforceable rules are defined in [MODULE_BOUNDARIES.md](MODULE_BOUNDARIES.md).

Core rules:

- Shared/global foundations cannot depend on feature or module implementations.
- Features cannot depend upward on ProofArena product composition.
- External consumers import ProofArena from its public `index.js`.
- Backend models cannot import services, controllers, or routes.
- Backend services cannot import controllers or routes.
- Shared backend infrastructure cannot import product modules.
- Backend code cannot import frontend code.

Run:

```powershell
cd client
npm run check:boundaries

cd ..\server
npm run check:boundaries
```

## API Pattern

The canonical frontend API client is `client/src/services/apiClient.js`.
Endpoints are centralized in `client/src/constants/apiEndpoints.js`.

The expected response envelope is:

```js
{
  success: true,
  message: "Operation completed",
  data: {},
  meta: {}
}
```

Errors use:

```js
{
  success: false,
  message: "Request failed",
  code: "ERROR_CODE",
  errors: []
}
```

Backend response helpers live in `server/src/utils/apiResponse.js`. New API
routes should use `/api/v1` unless preserving a documented legacy contract.
See [API_ARCHITECTURE.md](API_ARCHITECTURE.md) and
[API_ENDPOINTS.md](API_ENDPOINTS.md).

## Service Pattern

Frontend services perform API communication, request construction, and
response mapping. They do not own component state or UI decisions.

Backend services own business rules and data shaping. Controllers delegate to
services rather than importing models directly.

Do not call raw `fetch` or Axios from components. Do not add new domain
methods to the legacy `client/src/services/api.js` compatibility facade.

See [SERVICE_ARCHITECTURE.md](SERVICE_ARCHITECTURE.md).

## Hooks Pattern

Global reusable hooks live in `client/src/hooks/`. Feature-specific query and
mutation hooks live in the owning feature. ProofArena-only orchestration hooks
live in `client/src/modules/proofarena/hooks/`.

Hooks call services rather than raw network APIs. Server state remains in
React Query. See [HOOKS_ARCHITECTURE.md](HOOKS_ARCHITECTURE.md) and
[SERVER_STATE_SYSTEM.md](SERVER_STATE_SYSTEM.md).

## Utility Pattern

Product-neutral pure frontend helpers live in `client/src/utils/`. Shared
backend helpers live in `server/src/utils/`. Product/domain business logic
does not belong in generic utilities.

Domain-specific helpers stay with their owning feature until they have proven
cross-domain reuse. See [UTILS_ARCHITECTURE.md](UTILS_ARCHITECTURE.md).

## Error Handling Pattern

The frontend normalizes API, network, and validation failures through
`client/src/errors/`. UI components receive safe messages rather than raw
backend internals.

The backend uses `server/src/errors/AppError.js`,
`server/src/errors/notFoundHandler.js`, and
`server/src/errors/errorHandler.js`. Production responses do not expose stack
traces or secrets. Compatibility exports remain temporarily under middleware
and utils.

See [ERROR_HANDLING_ARCHITECTURE.md](ERROR_HANDLING_ARCHITECTURE.md).

## State Pattern

React Query owns API/server state, including profiles, challenges, offers,
proof assets, matches, messages, billing records, and admin tables.

Zustand owns small shared client state only:

- UI shell and theme preference placeholder
- Lightweight authenticated-session coordination
- ProofArena active workspace-role preference
- Realtime connection coordination
- Transient notification/toast coordination

Component-specific state remains local. See
[STATE_ARCHITECTURE.md](STATE_ARCHITECTURE.md) and
[CLIENT_STATE_SYSTEM.md](CLIENT_STATE_SYSTEM.md).

## Environment Setup

Runtime configuration is validated and centralized:

- Frontend: `client/src/config/env.js`
- Backend: `server/src/config/env.js`
- Safe examples: `client/.env.example`, `server/.env.example`

Production secrets must never be placed in frontend variables or committed to
Git. Development loopback defaults are allowed only inside validated config
and API-client fallback logic. See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

## Design System Rules

The canonical design system uses the approved Option 11 Olive + Cream tokens.
Design tokens are centralized in client constants and global styles. Reusable
primitives live in `client/src/components/ui/` and are exported from its
`index.js`.

Do not create a second component library, theme system, or page-local token
system. Existing top-level component wrappers are compatibility imports and
should be retired incrementally after consumers migrate.

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and
[UI_COMPONENTS.md](UI_COMPONENTS.md).

## Where Future Stages Add Code

| Future work | Canonical location |
| --- | --- |
| Authentication workflow changes | Existing auth feature/service, then tested `modules/auth` migration |
| Reusable UI primitive | `client/src/components/ui/` |
| Domain component | `client/src/components/<domain>/` |
| Domain service/query hook | `client/src/features/<domain>/` |
| Cross-feature ProofArena composition | `client/src/modules/proofarena/` |
| New public route/page | Central route constants, `routes/`, then `pages/` |
| New API endpoint | `server/src/routes/v1/` with controller/service/model flow |
| New backend vertical domain | `server/src/modules/<domain>/` after tests protect migration |
| AI integration adapter | Shared backend integration service/config; domain orchestration stays in owning module |
| Payments | Existing shared billing/payment infrastructure with domain-specific service orchestration |

Do not create speculative placeholders. Add a folder or public API when real,
owned code exists.

## Verification

Minimum structural verification:

```powershell
cd client
npm run check:boundaries
npm run lint
npm run build

cd ..\server
npm run check:boundaries
node -e "import('./src/app.js')"
npm run start
```

The server runtime requires valid local environment values and a reachable
MongoDB instance.

## Known Architecture Debt

- No automated test suite or CI workflow currently protects critical flows.
- Several frontend UI primitives still have top-level compatibility wrappers.
- Legacy and `/api/v1` backend route surfaces coexist.
- Backend naming mixes camel/Pascal filenames and dot/lowercase domain files.
- `server/src/controllers/adminController.js` directly imports three models.
- Thousands of generated browser/runtime artifacts remain tracked in Git even
  though ignore rules now prevent new untracked copies.
- The 3D homepage scene creates a large production chunk and needs a later
  performance pass.

These are migration and production-hardening tasks, not reasons to create a
separate ProofArena project.
