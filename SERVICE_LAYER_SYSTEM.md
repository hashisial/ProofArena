# Feature Service Layer System

## Purpose

Feature services are the only domain-aware layer that should call the shared
HTTP client. They isolate endpoint selection, request construction, response
normalization, and compatibility behavior from React Query hooks and UI
components.

The canonical frontend data flow is:

```text
API client -> feature service -> React Query hook -> UI component
```

## Canonical Locations

The existing ScaleOps client is JavaScript, and its established feature
services live directly inside their owning feature:

```text
client/src/features/<feature>/<feature>Service.js
```

Do not create a parallel TypeScript service tree under
`features/*/services/`. Do not create a second ProofArena umbrella feature.

Shared foundations:

- HTTP transport: `client/src/services/apiClient.js`
- API response parsing: `client/src/services/apiContracts.js`
- Normalized API errors: `client/src/services/apiErrors.js`
- Shared request/list mapping: `client/src/services/shared/serviceUtils.js`
- Endpoint constants: `client/src/constants/apiEndpoints.js`
- Endpoint compatibility exports: `client/src/constants/index.js`
- Server-state hooks: `client/src/features/<feature>/use<Feature>.js`
- Legacy compatibility facade: `client/src/services/api.js`

`client/src/lib/apiClient.ts` and `client/src/constants/api.ts` were not
created because they would duplicate the active JavaScript systems.

## Existing Services

| Domain | Canonical service |
| --- | --- |
| Authentication | `features/auth/authService.js` |
| Profile | `features/profile/profileService.js` |
| Challenges | `features/challenges/challengeService.js` |
| Execution plans | `features/executionPlans/executionPlanService.js` |
| Matches | `features/matches/matchService.js` |
| Outcome offers | `features/outcomeOffers/outcomeOfferService.js` |
| Opportunities | `features/opportunities/opportunityService.js` |
| Proof assets | `features/proofAssets/proofAssetService.js` |
| Providers | `features/providers/providerService.js` |
| Saved providers | `features/savedProviders/savedProviderService.js` |
| First-client mode | `features/firstClient/firstClientService.js` |
| Social actions | `features/social/socialService.js` |
| Admin | `features/admin/adminService.js` |
| Account dashboard | `features/dashboard/dashboardService.js` |

## Dashboard Service Extraction

`features/dashboard/dashboardService.js` now owns the live account dashboard
and activity-feed endpoints:

- `dashboardService.getMyDashboard()`
- `dashboardService.getMyActivityFeed()`

The existing React Query hooks call this feature service directly. The legacy
`services/api.js` exports remain available as compatibility delegates and no
longer hardcode these account endpoint strings.

## Application and Proof Boundaries

No standalone `applicationService` was created. The backend has no mounted
`/applications` route, and providers currently apply to challenges by
submitting execution plans. `executionPlanService.js` is therefore the
canonical live application/submission service.

No standalone `proofService` was created. The backend has no mounted
`/proofs` or `/proof-ledger` route. `proofAssetService.js` remains the
canonical live proof-data service until a distinct proof-submission or ledger
contract is implemented.

Creating services for planned but unavailable endpoints would imply working
behavior that does not exist and would duplicate current domain ownership.

Likewise, no empty ProofArena service placeholders were added. The live
challenge, outcome-offer, execution-plan, proof-asset, and match services are
the architecture-ready implementations for those domains.

## Shared Service Utilities

`services/shared/serviceUtils.js` centralizes transport-adjacent behavior that
was previously repeated across feature services:

- `buildQueryString(params, options)`
- `mapItemsResponse(result, fallback)`
- `mapCollectionItems(result)`

Domain-specific normalization remains in the owning feature service.

## Base Service Decision

No BaseService class was created. The shared `api` object already supplies GET,
POST, PUT, PATCH, DELETE, and upload operations. Adding an inheritance wrapper
would duplicate the API client without improving domain ownership.

## API Client Rules

Every feature service must:

1. Use `api` or the focused helpers from `services/apiClient.js`.
2. Use constants or endpoint builders from `constants/apiEndpoints.js`.
3. Keep endpoints API-relative.
4. Normalize only data owned by its domain.
5. Avoid React state, React Query, routing, and UI concerns.

The API client and centralized client environment config own:

- `VITE_API_BASE_URL` resolution
- `/api` base-path handling
- Credentials and default headers
- Access-token attachment
- Auth refresh compatibility
- API error normalization

## Endpoint Rules

- Do not hardcode localhost or production origins in feature services.
- Do not place `/api` in feature endpoint constants.
- Use established `/v1` endpoint builders for ProofArena-only routes.
- Do not consume planned endpoint constants until corresponding backend routes
  are mounted.
- Add a centralized endpoint constant before adding a new live service call.

## React Query Relationship

React Query hooks own:

- Request lifecycle state
- Caching and query keys
- Mutation state
- Cache updates and invalidation

Feature services own only requests and response normalization. UI components
should consume hooks rather than call services directly when a hook exists.

## Legacy Facade Migration

`client/src/services/api.js` is an active compatibility facade for older
ScaleOps domains. It must not receive new domain behavior.

Migrate it incrementally:

1. Confirm the backend route is live.
2. Add or improve the owning feature service.
3. Move React Query hooks to the feature service.
4. Keep the old facade export as a delegate while consumers remain.
5. Remove the delegate only after a repository-wide usage audit.

The account dashboard and activity-feed calls are the first completed
extraction under this rule.

## Audit Result

- Existing feature services already reuse the shared API client and centralized
  endpoint constants.
- No direct API request methods were found in pages or UI components. Three
  profile media components import the shared `getRealtimeBaseUrl` helper from
  the API client to resolve uploaded media URLs; they do not perform requests.
- No hardcoded localhost URLs were found in feature services.
- Several legacy aggregate-facade functions still contain relative endpoint
  strings and should be migrated feature by feature.
