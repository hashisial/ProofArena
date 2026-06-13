# ScaleOps / ProofArena Foundation Plan

## Purpose

This plan defines an incremental architecture target for the existing ScaleOps repository. ProofArena remains the flagship product domain inside ScaleOps. The plan avoids a rewrite, preserves current functionality, and converts compatibility-driven architecture into explicit, maintainable boundaries.

## Guiding Principles

1. **Preserve working behavior**

   Structural changes must be protected by tests and made in small, reversible steps.

2. **One product, clear domains**

   ScaleOps remains the parent application. ProofArena capabilities remain first-class domains inside the same client and server.

3. **Canonical paths with temporary compatibility**

   Every shared capability must have one documented import path. Compatibility aliases may remain during migration but must not be used by new code.

4. **Feature ownership over technical dumping grounds**

   Domain-specific API calls, query hooks, logic, and UI should live with the owning feature. Truly shared primitives should remain shared.

5. **Contracts before refactors**

   API response envelopes, error shapes, route ownership, query keys, and design tokens must be defined before large migrations.

6. **No speculative abstraction**

   Extract shared systems only when multiple real consumers require them.

## Target Architecture Blueprint

### Frontend Request Flow

```text
Page / Route Component
  -> Feature React Query Hook
    -> Feature Service
      -> Central API Client
        -> Backend API
```

Zustand should remain limited to:

- Authentication/session state
- Socket state
- Notifications requiring local coordination
- Small UI preferences

React Query should own:

- Remote collections and records
- Loading and error state
- Mutations
- Cache invalidation
- Pagination and filtering

### Backend Request Flow

```text
Route
  -> Validation / Auth / Permission Middleware
    -> Controller
      -> Service
        -> Model / External Adapter
```

Controllers should translate HTTP concerns only. Services should own business logic and public/private data shaping. Models should own persistence concerns and narrowly scoped model behavior.

## Target Frontend Structure

```text
client/src/
  app/
    providers/            React Query and application providers
    routes/               Route composition and route guards
  components/
    ui/                   Stable visual primitives
    layout/               Shared shell primitives
    shared/               Cross-domain composed components
  constants/
    apiEndpoints.js
    designTokens.js
    navigation.js
    queryKeys.js
    routes.js
  features/
    auth/
    challenges/
    executionPlans/
    firstClient/
    matches/
    opportunities/
    outcomeOffers/
    profile/
    proofAssets/
    providers/
    savedProviders/
    social/
    workspace/
  layouts/
    PublicLayout.jsx
    AuthLayout.jsx
    DashboardLayout.jsx
    AdminLayout.jsx
  pages/                  Thin route-level composition
  services/
    apiClient.js          Only generic HTTP client
  store/                  Auth/session and small UI state only
  styles/
    tokens.css
    globals.css
  utils/                  Truly cross-domain pure helpers
```

This is a target, not a request to move every file immediately.

## Target Backend Structure

```text
server/src/
  app.js
  config/
  constants/
  middleware/
  modules/
    auth/
      auth.routes.js
      auth.controller.js
      auth.service.js
      auth.validator.js
    challenges/
    executionPlans/
    matches/
    opportunities/
    outcomeOffers/
    profiles/
    proofAssets/
    providers/
    savedProviders/
    workspace/
  models/                 Shared persistence models during migration
  routes/
    v1/
      index.js
  socket/
  utils/
```

The current layer-oriented backend can remain operational while modules migrate one at a time. Do not perform a bulk folder move.

## Feature Boundaries

| Domain | Owns | Does not own |
| --- | --- | --- |
| Auth | Session, login, registration, verification, permissions facade | Profile content |
| Profile | Owner/public profile data and privacy | Provider discovery ranking |
| Providers | Public discovery, provider summaries, filter options | Private owner profile editing |
| Challenges | Challenge lifecycle and client challenge management | Provider execution-plan internals |
| Execution Plans | Plan creation, review, status, plan-specific scoring | Challenge publishing |
| Matches | Match generation, ranking, challenge-provider relationship | Provider public-profile source data |
| Proof Assets | Provider proof records and visibility | Verified outcome adjudication unless explicitly merged |
| Outcome Offers | Provider offer lifecycle and public offer summaries | Challenge lifecycle |
| Opportunities | Provider pipeline state | Match generation |
| Saved Providers | Client-owned save/shortlist records | Provider public data source of truth |
| Workspace | Cross-domain read models and operational summaries | Domain mutation logic |

Cross-feature dashboards and workspaces should compose feature hooks or backend read models rather than duplicate domain logic.

## Shared Component Strategy

### Canonical Layers

1. `components/ui`
   - Button, Input, Select, Card, Badge, Modal, EmptyState, LoadingState, ErrorState
   - No domain-specific API calls
   - Stable styling and accessibility contracts

2. `components/shared`
   - Reusable composed interfaces used across multiple domains
   - May accept domain-shaped props but should not fetch data directly

3. `features/<feature>/components`
   - Domain-specific components and workflows
   - May use feature hooks

4. `pages`
   - Route-level orchestration only
   - Should become thinner over time

### Compatibility Migration

- Document `components/ui/*` as canonical for UI primitives.
- Keep existing re-export files until all imports are migrated.
- Add a lint rule or import alias only after canonical paths are stable.
- Never delete aliases in the same change that introduces a major feature.

## Constants Strategy

Split constants by concern and ownership:

- `routes.js`: frontend route builders only
- `apiEndpoints.js`: backend endpoint builders only
- `navigation.js`: role-aware navigation metadata
- `queryKeys.js`: query-key factories grouped by feature
- `designTokens.js`: semantic design values
- Backend constants: split permissions, statuses, roles, limits, and domain enums

Recommended query-key shape:

```js
export const providerKeys = {
  all: ["providers"],
  public: (filters) => [...providerKeys.all, "public", filters],
  filters: () => [...providerKeys.all, "filters"],
  detail: (username) => [...providerKeys.all, "detail", username],
};
```

Feature mutations should invalidate through these factories rather than handwritten arrays.

## API Layer Strategy

### Frontend

- Keep `services/apiClient.js` as the only generic HTTP implementation.
- Move each method from legacy `services/api.js` into the owning feature service when that area is next changed.
- Expose server state through React Query hooks.
- Keep components free of direct HTTP calls.
- Remove the legacy aggregate API module only after its import count reaches zero.

### Backend

- Define one success response envelope and one error response envelope.
- Select one canonical response helper signature.
- Keep public-safe sanitization in services, not controllers.
- Keep controllers thin and free of direct model access.
- Prefer Zod for all new or touched request contracts.
- Document pagination, filtering, sorting, and error conventions.

Recommended response envelope:

```json
{
  "success": true,
  "message": "Resource fetched successfully",
  "data": {},
  "meta": {}
}
```

## Route Strategy

### Frontend Routes

- Keep centralized route constants and route builders.
- Document one owning page for every route.
- Remove route-shell placeholders only when a complete page is verified and assigned.
- Keep public and owner dashboard routes distinct.
- Split `AppRoutes.jsx` by route group only after route tests exist.

### Backend Routes

- Treat `/api/v1` as the canonical API target.
- Inventory all consumers of legacy `/api` routes.
- Add deprecation logging or headers to legacy routes before removal.
- Migrate frontend consumers feature by feature.
- Remove duplicate mounts only after usage monitoring and regression tests confirm safety.

## Compatibility and Migration Strategy

Use an incremental strangler approach:

1. Declare the canonical path or contract.
2. Add tests for current behavior.
3. Migrate one feature or import group.
4. Verify build, runtime, and route behavior.
5. Remove compatibility code only when no consumers remain.

Maintain a small migration registry:

| Legacy surface | Canonical target | Remaining consumers | Removal condition |
| --- | --- | ---: | --- |
| `services/api.js` | Feature services/hooks | Track during migration | Zero imports and passing regression tests |
| Root UI aliases | `components/ui/*` | Track during migration | Zero legacy imports |
| `/api/*` routes | `/api/v1/*` | Track through logs/tests | Zero consumers after deprecation window |
| Plain/dotted filename aliases | Selected convention | Track through import scan | Zero legacy imports |

## Testing and CI Strategy

### Minimum Baseline

- Client lint
- Client production build
- Server module import smoke test
- Server health-route smoke test
- Route-contract tests for auth, profiles, providers, challenges, and execution plans
- Public-data sanitization tests

### Next Coverage

- Service-level backend tests for core domain rules
- React component tests for shared UI and route guards
- End-to-end tests for:
  - Authentication
  - Role-aware dashboard routing
  - Provider discovery to public profile
  - Client challenge lifecycle
  - Provider execution-plan submission

### CI Quality Gates

Every pull request should run:

1. Dependency install with lockfile enforcement
2. Client lint
3. Client build
4. Server import/start smoke test
5. Automated tests
6. Secret and tracked-artifact scan

## Repository Hygiene Strategy

The first operational priority is a reviewed cleanup of tracked browser-profile and runtime artifacts.

Required steps:

1. Determine whether tracked browser-profile files contain credentials, cookies, sessions, or personal history.
2. Rotate any potentially exposed credentials or sessions.
3. Remove generated/runtime artifacts from Git tracking.
4. If sensitive data exists, rewrite Git history using an approved procedure.
5. Confirm `.gitignore` covers browser profiles, screenshots, uploads, logs, and local runtime state.
6. Add a CI check preventing those paths from returning.

This cleanup should be handled separately from feature development.

## Design-System Strategy

- Keep white-dominant surfaces, black typography, and purple semantic accents.
- Make design tokens the source of truth.
- Replace hard-coded purple variants and arbitrary colors only when touching related components.
- Reduce broad global selectors in favor of component-level styles.
- Add linting or review checks for new arbitrary color values.
- Preserve accessibility and visible focus states as token contracts evolve.

## Phased Foundation Plan

### Phase 0: Secure and Baseline

- Review and remove tracked browser-profile/runtime artifacts.
- Add CI with lint, build, server import, and smoke checks.
- Capture core route and API contract tests.

Exit condition: the repository is safe to change and regressions are detectable.

### Phase 1: Declare Canonical Contracts

- Document canonical import paths and filename conventions.
- Define API response and error envelopes.
- Adopt query-key factories.
- Document route ownership.
- Record architecture decisions.

Exit condition: new code has one clear path and contract.

### Phase 2: Consolidate Frontend Data Access

- Migrate legacy `services/api.js` consumers feature by feature.
- Move remote state into feature React Query hooks.
- Standardize UI primitive imports.
- Resolve route-shell/full-page ownership drift.

Exit condition: legacy aggregate API usage and import aliases are measurably reduced.

### Phase 3: Consolidate Backend API Surface

- Inventory `/api` and `/api/v1` consumers.
- Migrate consumers to `/api/v1`.
- Standardize validation and response helpers.
- Move direct model usage out of controllers.
- Verify and retire dead parallel models.

Exit condition: one documented versioned API surface remains.

### Phase 4: Reduce Oversized Modules

- Split large pages into orchestration plus feature components.
- Split large services by cohesive use case.
- Separate model schema definition from complex domain/read-model logic where useful.
- Split oversized constants by domain.

Exit condition: high-change modules have clear responsibilities and focused tests.

### Phase 5: Enforce Ownership and Quality

- Add dependency-boundary linting.
- Add bundle and performance budgets.
- Add design-token enforcement.
- Remove verified-unused compatibility aliases and empty boundaries.
- Maintain architecture decision records.

Exit condition: architecture quality is continuously enforced instead of manually remembered.

## Guardrails

- Do not create a separate ProofArena repository or application.
- Do not bulk-move folders without tests.
- Do not delete compatibility exports based only on filename similarity.
- Do not consolidate domain-specific components solely because they share a name.
- Do not remove legacy API routes without consumer evidence and a deprecation window.
- Do not place server state in Zustand.
- Do not add direct HTTP calls to components.
- Do not place business logic in controllers.
- Do not redesign working product surfaces during architecture migrations.

## Definition of Done for Foundation Work

- Client lint and production build pass.
- Server imports and starts successfully.
- Critical route smoke tests pass.
- Canonical contracts are documented.
- Changed behavior has regression coverage.
- No private/public data boundary regresses.
- No duplicate API or import surface is removed without verified zero consumers.
- ScaleOps and ProofArena remain one runnable product.

## Recommended Immediate Next Action

Run a dedicated repository-security cleanup for tracked browser-profile artifacts, then establish the minimum CI and smoke-test baseline. Those two actions reduce the highest current risk and make every later architecture consolidation safer.
