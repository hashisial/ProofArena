# ScaleOps Module Boundaries

## Purpose

ScaleOps is the parent application and runtime. ProofArena is its flagship
product module, not a separate app, router, server, design system, or API
client.

This document defines enforceable import directions and incremental ownership
rules. Existing active domains remain in their current locations until a
complete, tested vertical slice can move safely.

Run the boundary checks with:

```powershell
cd client
npm run check:boundaries

cd ..\server
npm run check:boundaries
```

The checker lives at `scripts/check-module-boundaries.mjs`. It resolves
relative imports and the supported frontend aliases, fails on hard boundary
violations, and reports existing migration debt as warnings.

## Ownership Map

### ScaleOps Core Platform

ScaleOps owns application composition and shared infrastructure:

- Frontend entry points, providers, layouts, routes, authentication session
  coordination, API client, query client, design system, and shared UI.
- Backend startup, configuration, database, security, authentication,
  middleware, errors, queues, storage, email, realtime, and route mounting.

ScaleOps may compose ProofArena through its public module surface.

### Shared Frontend Code

Canonical shared/global locations:

```text
client/src/components/ui/
client/src/components/common/
client/src/config/
client/src/constants/
client/src/errors/
client/src/hooks/
client/src/lib/
client/src/services/
client/src/store/
client/src/utils/
```

Shared foundations must remain product-neutral. In particular,
`components/ui`, `config`, `constants`, `errors`, `lib`, `store`, and `utils`
must not import feature, module, page, route, or domain-component
implementations.

The current top-level `hooks` and `services` folders contain compatibility
facades and older domain integrations. New domain-specific hooks and services
must be placed in the owning feature or module rather than expanding those
legacy exceptions.

### ProofArena Frontend Module

The product-level namespace is:

```text
client/src/modules/proofarena/
  index.js        Public module API
  hooks/          Cross-feature ProofArena orchestration hooks
```

Current ProofArena domains remain in established feature and component
folders, including challenges, execution plans, matches, opportunities,
outcome offers, proof assets, providers, and saved providers.

ProofArena may compose these domains and shared ScaleOps code. A feature domain
must not import the ProofArena product-composition module.

### Shared Backend Code

Shared backend infrastructure stays in:

```text
server/src/config/
server/src/constants/
server/src/errors/
server/src/middleware/
server/src/utils/
```

These folders must not import product modules. They provide infrastructure to
modules, never the reverse dependency.

### Backend Modules

The incremental module namespace is:

```text
server/src/modules/
  auth/
  users/
  proofarena/
```

Active backend code remains layer-oriented until a tested vertical slice is
migrated. A migrated module owns its routes, controllers, services, models,
validators, constants, and private helpers. Cross-module consumers use only a
module's public `index.js`.

## Allowed Import Directions

### Frontend

```text
ScaleOps app/routes/pages
  -> ProofArena public API
  -> feature/domain public APIs
  -> shared services/hooks/components
  -> shared foundations and external packages
```

Allowed examples:

```js
import { useProofArenaModule } from "@proofarena";
import { Button } from "@/components/ui/index.js";
import { useProofArenaStore } from "@/store/useProofArenaStore.js";
```

Inside ProofArena, importing an established feature during migration is
allowed:

```js
import { useMatches } from "@/features/matches/useMatches.js";
```

### Backend

```text
route -> middleware/validator -> controller -> service -> model
module -> shared ScaleOps infrastructure
```

Allowed examples:

```js
import { authenticate } from "../../middleware/auth.middleware.js";
import { getPublicProviders } from "../../services/provider.service.js";
import { ProviderProfile } from "../../models/ProviderProfile.js";
```

## Forbidden Import Directions

### Frontend

Forbidden:

- Shared/global foundations importing ProofArena or another feature.
- A feature importing the ProofArena product-composition module.
- Code outside ProofArena importing a private ProofArena file.
- One product module importing another module's private files.
- Generic UI primitives importing domain-owned components.

Bad examples:

```js
// Shared utility depending on product code.
import { useProofArenaModule } from "../modules/proofarena/hooks/useProofArenaModule.js";

// Feature depending upward on product composition.
import { useProofArenaModule } from "../../modules/proofarena/index.js";

// App reaching into private module code.
import { useProofArenaModule } from "@proofarena/hooks/useProofArenaModule.js";
```

### Backend

Forbidden:

- Models importing services, controllers, or routes.
- Services importing controllers or routes.
- Shared infrastructure importing a product module.
- Backend files importing frontend code.
- One module importing another module's private implementation.

Bad examples:

```js
// Model depending on business orchestration.
import { selectProvider } from "../services/providerSelection.service.js";

// Service depending on HTTP delivery.
import { updateChallenge } from "../controllers/challenge.controller.js";

// Shared middleware depending on a product module.
import { getProofArenaRole } from "../modules/proofarena/internal/roles.js";
```

## Where New Code Belongs

| Code | Location |
| --- | --- |
| Generic UI primitive | `client/src/components/ui/` |
| Cross-page product-neutral component | `client/src/components/common/` |
| Domain UI, hook, or service | Existing owning feature/domain folder |
| Cross-feature ProofArena orchestration | `client/src/modules/proofarena/` |
| Global pure helper | `client/src/utils/` |
| ProofArena-only helper | Owning feature or `modules/proofarena/utils/` |
| Shared backend infrastructure | Existing global backend infrastructure folder |
| New backend domain vertical slice | `server/src/modules/<domain>/` |
| Cross-domain ProofArena backend orchestration | `server/src/modules/proofarena/` |

Do not create an empty placeholder solely to satisfy this table. Add a folder
or public index when real owned code exists.

## Public APIs and Aliases

The frontend supports:

- `@/` for `client/src/`
- `@proofarena` for `client/src/modules/proofarena/index.js`
- `@proofarena/` for module-internal imports only

External consumers must use `@proofarena`. The private `@proofarena/` alias is
intended only for files already inside the module.

Backend imports remain relative because Node ESM does not currently define a
package import map. Adding one before a vertical migration would create more
churn than value.

## Current Migration Debt

- Active ProofArena domains still use top-level layer-oriented feature,
  component, route, service, and model folders.
- Some top-level frontend hooks and the legacy API facade still depend on
  feature services. New code must not extend this compatibility pattern.
- `server/src/controllers/adminController.js` imports models directly. The
  boundary checker reports this as a warning; move the behavior into a service
  only with regression coverage.
- The backend has both legacy and `/api/v1` route composition. Preserve public
  contracts while migrating one domain at a time.

## Review Checklist

Before adding or moving code:

1. Identify the owner: ScaleOps shared infrastructure, a domain feature, or
   ProofArena composition.
2. Import modules through their public index.
3. Keep server data in services and React Query, not global UI stores.
4. Keep controllers thin and models independent of delivery/business layers.
5. Run boundary checks, client lint/build, and server import/start checks.
