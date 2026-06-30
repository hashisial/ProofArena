# Stage 3.3 Shared API Helper and Service Verification

## Canonical Client Decision

`client/src/services/apiClient.js` is the verified platform API client source-of-truth. It is the only client-side `axios.create` found and owns base URL resolution, access-token attachment, refresh handling, error normalization, and response unwrapping.

| ID | Path | Category | Correct owner | Client instance | Manual token | Manual base URL | Response normalization | Sensitive behavior | Approval status | Future action | Human review |
|---|---|---|---|---|---|---|---|---|---|---|---|
| API-001 | `client/src/services/apiClient.js` | platform API client | platform API client | yes, sole verified | yes, centrally | yes, centrally | yes, centrally | auth/error/transport | platform-owned | Protect; never copy or move to shared | yes |
| API-002 | `client/src/services/apiContracts.js`, `apiErrors.js` | response/error helper | platform-owned | no | no | no | yes | global API contract | platform-owned | Keep with canonical client | yes |
| API-003 | `client/src/services/queryClient.js` | platform service | platform-owned | no HTTP client | no | no | query error/cache behavior | cross-app cache/error | platform-owned | Do not repackage as shared service | yes |
| API-004 | `services/shared/buildQueryString` | API helper | approved shared helper | no | no | no | no | none detected | approved with caution | Keep pure; add tests before change | yes |
| API-005 | `services/shared/mapItemsResponse` | response helper | approved shared helper | no | no | no | collection shape only | none detected | approved with caution | Do not add global API/error assumptions | yes |
| API-006 | `services/shared/mapCollectionItems` | response helper | approved shared helper | no | no | no | collection shape only | none detected | approved with caution in existing folder | Keep narrow despite one direct consumer | yes |
| API-007 | `client/src/services/api.js` | shared/global service facade | suspicious platform/module bridge | no new instance; wraps client | accepts tokens via `withAuth` operations | no new base URL | local collection handling | broad admin/auth/domain | blocked as shared | Freeze; no new operations; trace consumers | yes |
| API-008 | Feature `*Service.js` files | module service/API adapter | module-owned | no | generally delegated | endpoints via constants/client | module transforms | module-specific | keep module-owned | Continue using canonical client | yes for sensitive modules |
| API-009 | Seven feature utility files using `API_BASE_URL` | module utility/API-bound helper | module-owned, migration concern | no | no | consumes platform base URL | no | asset URL construction | blocked as shared | Move behind approved adapter/helper only in tested migration | yes |
| API-010 | Three profile components using `getRealtimeBaseUrl` | module UI using platform interface | profile module/platform interface | no | no | consumes platform realtime URL | no | profile media URLs | suspicious | Review component-to-adapter boundary later | yes |
| API-011 | `server/src/utils/apiResponse.js`, server errors | response/error helper | backend platform | no | no | no | canonical server responses/errors | security/error disclosure | platform-owned | Never duplicate as shared module helper | yes |
| API-012 | `server/src/utils/token.utils.js`, `cookie.utils.js` | token helper | backend auth platform | no HTTP client | yes, authoritative | env/cookie config | no | critical auth | platform-owned | Exclude from generic shared | yes |
| API-013 | Infrastructure services: DB, cloudinary, email, queue, Stripe/socket | platform service | backend platform | provider-specific clients may exist | provider-dependent | config-owned | provider-dependent | payment/config/realtime | platform-owned | Modules consume approved interfaces | yes |
| API-014 | Domain services under `server/src/services/` | module service in broad root | module-owned by domain | no generic client conclusion | auth middleware/service context | platform config dependencies | domain-specific | payment/admin/profile/proof | blocked as shared | Classify and migrate vertically only | yes |
| API-015 | `server/src/services/leadScraperService.js` | module/integration service | lead/integration owner | uses server `fetch` | no client auth evidence in scan | URL supplied by integration flow | local | external request | not a shared-client violation | Keep server integration-owned | yes |
| API-016 | Proposed shared API helper/client folder | duplicate API client risk | blocked | unknown | unknown | unknown | unknown | potentially critical | blocked | Do not create | yes |

## Verification Result

- Client API instances: one.
- Shared helper consumers: 11 feature service files.
- Shared helper transport/auth/base URL ownership: none detected.
- Hidden global business layer risk: confirmed in the broad compatibility facade, which is not approved shared code.
- New shared API helper or service approval: none beyond the existing three neutral functions.

