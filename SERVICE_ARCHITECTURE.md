# ScaleOps / ProofArena Service Architecture

## Purpose

ScaleOps uses services to isolate API communication and business rules from UI
and HTTP concerns. ProofArena remains part of the same application and reuses
these service foundations.

## Standard Request Flows

Frontend:

```text
Page or component
  -> React Query hook
  -> feature service
  -> shared API client
  -> backend API
```

Backend:

```text
Route
  -> middleware and validator
  -> controller
  -> service
  -> model or external adapter
```

## Frontend Service Responsibilities

Canonical domain services live beside their owning features:

```text
client/src/features/<domain>/<domain>Service.js
```

They may:

- Build requests from centralized endpoint constants.
- Call `client/src/services/apiClient.js`.
- Map transport data into stable feature-facing data.
- Normalize compatibility differences owned by that domain.

They must not:

- Own React state, routing, rendering, or notifications.
- Call Axios or `fetch` directly.
- Store server data.
- expose raw backend internals to components.

Shared service infrastructure lives under:

```text
client/src/services/
  apiClient.js
  apiContracts.js
  apiErrors.js
  shared/
    serviceUtils.js
```

`serviceUtils.js` owns reusable query-string construction and collection
mapping. Domain-specific mapping remains in the owning feature service.

### Frontend Response Mapping

```text
Raw HTTP envelope
  -> apiClient unwraps transport envelope or throws ApiError
  -> feature service maps domain response
  -> React Query hook exposes stable data to UI
```

`ApiError` is the standard frontend service error. A feature service should
only catch it when adding meaningful domain context; otherwise it should allow
the normalized error to propagate.

### Existing Frontend Service Ownership

| Capability | Canonical service |
| --- | --- |
| Authentication | `client/src/features/auth/authService.js` |
| Profiles | `client/src/features/profile/profileService.js` |
| Notifications and legacy account APIs | `client/src/services/api.js` compatibility facade |
| Providers | `client/src/features/providers/providerService.js` |
| Challenges | `client/src/features/challenges/challengeService.js` |
| Outcome offers | `client/src/features/outcomeOffers/outcomeOfferService.js` |
| Execution plans | `client/src/features/executionPlans/executionPlanService.js` |
| Proof Vault assets | `client/src/features/proofAssets/proofAssetService.js` |
| Matching | `client/src/features/matches/matchService.js` |
| Saved providers | `client/src/features/savedProviders/savedProviderService.js` |
| Opportunity pipeline | `client/src/features/opportunities/opportunityService.js` |
| Dashboard reads | `client/src/features/dashboard/dashboardService.js` |

The requested ProofArena placeholder services were not created because live
services already own those contracts. The architecture-ready mappings are:

- `offerService` -> `outcomeOfferService`
- `challengeService` -> `challengeService`
- `executionPlanService` -> `executionPlanService`
- `proofVaultService` -> `proofAssetService`
- `matchingService` -> `matchService`

Adding empty alternatives would create two service systems for the same
domains.

## Backend Service Responsibilities

Canonical backend services currently live at:

```text
server/src/services/<domain>Service.js
server/src/services/<domain>.service.js
```

The mixed filename convention is compatibility debt. New work must follow the
convention already used by the touched domain until a tested vertical migration
moves that domain into `server/src/modules/<domain>/`.

Backend services may:

- Enforce business rules and permissions.
- Coordinate models and external adapters.
- Shape public, owner, or admin-safe results.
- Throw `AppError` for expected operational failures.

Backend services must not:

- Read from Express request or response objects.
- Send HTTP responses.
- Depend on controllers.
- Leak private persistence fields.

Controllers receive HTTP input, call one or more services, and return a
standard response through `server/src/utils/apiResponse.js`. Models define
persistence and narrowly scoped model behavior.

### Existing Backend ProofArena Services

```text
server/src/services/
  challenge.service.js
  executionPlan.service.js
  match.service.js
  opportunityPipeline.service.js
  outcomeOffer.service.js
  proofAsset.service.js
  providerPublicService.js
  providerSearchService.js
  savedProvider.service.js
```

These are live services, not placeholders. They remain in place to preserve
working routes and imports.

## Standard Patterns

Frontend service:

```js
import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";

export const exampleService = Object.freeze({
  getById(id) {
    return api.get(API_ENDPOINTS.EXAMPLE.DETAIL(id));
  },
});
```

Backend service:

```js
export async function getExampleForUser(userId, exampleId) {
  // Validate ownership, coordinate models, and return a safe result.
}
```

Controller:

```js
export const getExample = asyncHandler(async (request, response) => {
  const result = await getExampleForUser(request.user.id, request.params.exampleId);
  return successResponse(response, 200, "Example fetched successfully", result);
});
```

## Base Service Decision

No BaseService class was created.

`client/src/services/apiClient.js` already supplies reusable GET, POST, PUT,
PATCH, DELETE, and upload methods. A BaseService wrapper would add inheritance
without removing complexity or enforcing domain ownership. Prefer small
feature-service objects composed from the shared API client.

The backend also does not use a BaseService. Mongo queries and business rules
vary by domain, so a generic CRUD parent would encourage controllers and
services to bypass explicit permissions and sanitization.

## Expansion Rules

1. Confirm the endpoint and owning domain before creating a service.
2. Add endpoint constants before service calls.
3. Keep frontend services beside their owning feature.
4. Keep React Query lifecycle behavior in hooks.
5. Keep backend HTTP concerns in controllers.
6. Keep backend business rules, permissions, and result shaping in services.
7. Use shared service utilities only for genuinely repeated transport-adjacent
   behavior.
8. Do not create empty services for future endpoints.
9. Move a backend domain into `modules/` only as a complete tested vertical
   slice.
10. Preserve compatibility exports until repository-wide usage reaches zero.

## Current Risks

- `client/src/services/api.js` remains a large compatibility facade. Migrate
  one live domain at a time.
- Backend service filenames mix plain and dotted conventions.
- `server/src/controllers/adminController.js` still imports three models
  directly and should later delegate those queries to an admin service.
- Automated service contract tests are limited; add them before moving service
  files or retiring compatibility aliases.
