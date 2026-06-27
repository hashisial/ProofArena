# Stage 1.2 API Client Source-of-Truth Analysis

Generated: 2026-06-27

## Verified HTTP Ownership

`client/src/services/apiClient.js` is the only browser Axios instance. It owns base URL resolution, credentials, bearer-token injection, refresh serialization, stale-auth clearing, response unwrapping, and normalized errors.

`client/src/services/api.js` is not a second transport. It is a compatibility/aggregate service facade over apiClient and feature services. It remains high risk because 29 files import it and some methods return business-looking fallback collections.

No raw browser `fetch` call and no second Axios instance were found outside the service boundary. Socket.IO and the server-side scraper fetch are distinct transports.

## Request-System Analysis

| ID | File path(s) | Mechanism | Base URL source | Auth-token behavior | Error behavior | Response behavior | Verified users | Similar/overlap | Source-of-truth candidate | Risk if replaced early | Future recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| API-001 | `client/src/services/apiClient.js`; `client/src/services/api.js` | Axios transport plus custom facade | `client/src/config/env.js` via `resolveApiBaseUrl` | apiClient interceptor reads Zustand access token; refresh uses credentials | apiClient normalizes ApiError; facade adds selected fallbacks | apiClient unwraps API envelope; facade normalizes collections | 27 apiClient references; 29 api.js importers | Aggregate facade overlaps feature services and endpoint constants | apiClient for transport; feature services for domains | Critical auth refresh, error shape, and 29 legacy callers may break | Freeze transport; produce method-level facade migration map. |
| API-002 | `client/src/services/api.js`; `client/src/features/auth/authService.js` | Custom facade over feature service | apiClient | authService/apiClient own token behavior | authService errors normalized by apiClient | auth payloads via feature service | api.js delegates login/register/refresh/logout/recovery; AuthProvider imports authService | Duplicate exported auth surface | authService | Login/recovery/session refresh regressions | Migrate each api.js auth export caller only after auth tests. |
| API-003 | `client/src/services/api.js`; `client/src/features/profile/profileService.js` | Custom facade over feature service | apiClient | apiClient | apiClient/profile service | profile payloads and uploads | api.js delegates profile methods; useProfile and providers use profileService | Duplicate profile surface | profileService | Upload and public/private profile contract regressions | Map facade methods and callers before deprecation. |
| API-004 | `client/src/services/api.js`; `client/src/features/dashboard/dashboardService.js` | Custom facade over feature service | apiClient | apiClient | apiClient | dashboard/activity payloads | useMyDashboard/useMyProfile and api.js | Duplicate dashboard surface | dashboardService | Dashboard response shape and loading behavior | Keep until dashboard contract tests exist. |
| API-005 | `client/src/constants/apiEndpoints.js`; `client/src/services/api.js` | Endpoint registry versus hardcoded facade strings | apiClient's base already includes `/api` | apiClient | Mixed facade fallback and normalized errors | Mixed collection/envelope handling | 29 facade importers | Embedded literals overlap API_ENDPOINTS/DASHBOARD_API | apiEndpoints plus domain services | Bulk replacement can change encoding, query strings, or mount version | Compare every exported method to backend route and constant. |
| API-006 | Seven feature `*Utils.js` files | Repeated custom endpoint builder | apiClient API_BASE_URL and conditional `/v1` logic | Delegates to apiClient | Not applicable | Builds request paths | Challenge, plan, first-client, match, opportunity, offer, proof services | Seven near-identical builders | One shared helper only after API-version decision | Wrong prefix can break all ProofArena feature modules | Decide version ownership in Stage 5 ADR; then extract with contract tests. |
| API-007 | Same seven feature `*Utils.js` files | Repeated error normalizer | Not applicable | Not applicable | Same algorithm with domain-specific fallback copy | Produces user-safe message | Seven feature services/hooks | Algorithm overlap with intentional copy differences | Shared low-level normalization plus domain messages | Shared helper could erase useful domain semantics | Characterize shapes before sharing. |
| API-008 | Three profile components, apiClient, profileService | Direct Axios calls beside feature service | apiClient | apiClient interceptor | apiClient normalization | Components consume upload/header results directly | CoverPhotoModal, ProfileHeader, ProfilePhotoModal | Profile HTTP ownership bypasses profileService | profileService | UI-specific upload behavior can regress | Move only after method/response/loading tests. |
| API-009 | `client/src/services/messagingSocket.js`; apiClient | Socket.IO versus Axios | Shared environment/realtime URL derivation | Socket auth handshake uses current token; HTTP uses interceptor | Socket event errors versus ApiError | Event stream versus HTTP envelopes | Messages page | Shared config/auth concerns only | Keep both; define shared environment contract | Replacing socket with HTTP breaks realtime behavior | Document as distinct transport, not duplicate client. |
| API-010 | `server/src/services/leadScraperService.js`; browser apiClient | Server-side raw fetch versus browser Axios | Server external URL/config | Server-side service context | Server service-specific handling | External HTML/data, not app API envelope | Lead scraper backend | No transport ownership overlap | Keep server fetch isolated | Merging would cross frontend/backend boundary and security model | Keep distinct; audit outbound URL controls separately. |

## Domain Service Ownership

| Domain | Current service source | Compatibility exposure | Cleanup constraint |
| --- | --- | --- | --- |
| Auth | `client/src/features/auth/authService.js` | Re-exported methods in `client/src/services/api.js` | Session, cookie, refresh, and verification tests first |
| Profile | `client/src/features/profile/profileService.js` | Re-exported methods plus three direct component calls | Upload/public-profile contract tests first |
| Dashboard | `client/src/features/dashboard/dashboardService.js` | Re-exported methods in api.js | Dashboard envelope tests first |
| Challenges | `client/src/features/challenges/challengeService.js` | Separate feature API path builder | API version policy first |
| Execution plans | `client/src/features/executionPlans/executionPlanService.js` | Separate feature API path builder | API version policy first |
| First client | `client/src/features/firstClient/firstClientService.js` | Separate feature API path builder | API version policy first |
| Matches | `client/src/features/matches/matchService.js` | Separate feature API path builder | API version policy first |
| Opportunities | `client/src/features/opportunities/opportunityService.js` | Separate feature API path builder | API version policy first |
| Outcome offers | `client/src/features/outcomeOffers/outcomeOfferService.js` | Separate feature API path builder | API version policy first |
| Proof assets | `client/src/features/proofAssets/proofAssetService.js` | Separate feature API path builder | API version policy first |
| Admin | `client/src/features/admin/adminService.js` | Numerous legacy admin methods remain in api.js | Permission and endpoint tests first |
| Legacy SaaS modules | `client/src/services/api.js` | Direct canonical surface for older hooks/pages | Must be split by method/caller, not by file deletion |

## Confirmed Cleanup Candidates

Eight findings (`API-001` through `API-008`) are real overlap/migration candidates. `API-009` and `API-010` are intentionally distinct transports.

## Minimum API Cleanup Gate

1. Record every `api.js` export and all method-level callers.
2. Match each method to API_ENDPOINTS and a registered backend operation.
3. Decide canonical `/api` versus `/api/v1` policy.
4. Add auth refresh, envelope, upload, timeout, fallback, and domain-service tests.
5. Migrate one domain at a time while preserving the compatibility facade.
6. Remove no facade export until import and runtime telemetry prove zero use.

