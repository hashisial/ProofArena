# Stage 1.1 API Inventory

Generated: 2026-06-27T11:17:05.9368044+05:00

## Counting Method

- **537 exposed endpoint variants**: unique HTTP method plus full mounted path.
- **304 underlying route operations**: controller operations before compatibility mounts are expanded.
- **233 route operations are mounted twice**, once below `/api` and once below `/api/v1`.

The dual mount is implemented by `server/src/routes/index.js` and `server/src/routes/v1/index.js`. Compatibility exports also make the same auth and profile routers available through both versions.

## Application-Level Endpoints

| Method | Endpoint | File | Controller | Middleware | Request | Frontend usage | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GET | `/api` | `server/src/app.js` | Inline API status response | Global security/sanitize/logging | None | Manual health/discovery | Active |
| POST | `/api/billing/webhook` | `server/src/app.js` | `stripeWebhook` | Raw JSON body before normal body parser | Stripe webhook payload | Stripe, not browser client | Active |

## Router Mount Registry

### Unversioned `/api`

| Mount | Route file | Operations |
| --- | --- | ---: |
| `/api/account` | `server/src/routes/accountRoutes.js` | 37 |
| `/api/admin` | `server/src/routes/adminRoutes.js` | 50 |
| `/api/analytics` | `server/src/routes/analyticsRoutes.js` | 3 |
| `/api/auth` | `server/src/modules/auth/auth.routes.js` via `routes/authRoutes.js` | 14 |
| `/api/billing` | `server/src/routes/billingRoutes.js` | 5 |
| `/api/blogs` | `server/src/routes/blogRoutes.js` | 2 |
| `/api/connections` | `server/src/routes/connectionRoutes.js` | 16 |
| `/api/contact` | `server/src/routes/contactRoutes.js` | 1 |
| `/api/conversations` | `server/src/routes/conversationRoutes.js` | 6 |
| `/api/follows` | `server/src/routes/followRoutes.js` | 3 |
| `/api/health` | `server/src/routes/healthRoutes.js` | 1 |
| `/api/leads` | `server/src/routes/leadRoutes.js` | 2 |
| `/api/marketplace` | `server/src/routes/marketplacePaymentRoutes.js` | 15 |
| `/api/messages` | `server/src/routes/messageRoutes.js` | 11 |
| `/api/network` | `server/src/routes/networkRoutes.js` | 6 |
| `/api/notifications` | `server/src/routes/notificationRoutes.js` | 5 |
| `/api/portfolio` | `server/src/routes/portfolioRoutes.js` | 3 |
| `/api/profile` | `server/src/routes/v1/profile.routes.js` via compatibility export | 33 |
| `/api/providers` | `server/src/routes/providerRoutes.js` | 6 |
| `/api/reviews` | `server/src/routes/reviewRoutes.js` | 3 |
| `/api/saved` | `server/src/routes/savedItemRoutes.js` | 3 |
| `/api/services` | `server/src/routes/serviceRoutes.js` | 7 |
| `/api/users` | `server/src/routes/userRoutes.js` | 2 |

### Versioned `/api/v1`

The v1 registry remounts all applicable shared routers and adds ProofArena-specific routers.

| Mount | Route file | Operations |
| --- | --- | ---: |
| `/api/v1/health` | `server/src/routes/v1/health.routes.js` | 2 |
| `/api/v1/auth` | `server/src/modules/auth/auth.routes.js` via compatibility export | 14 |
| `/api/v1/users` | `server/src/routes/v1/user.routes.js` plus nested `userRoutes.js` | 3 |
| `/api/v1/account` | `accountRoutes.js` | 37 |
| `/api/v1/admin` | `adminRoutes.js` | 50 |
| `/api/v1/analytics` | `analyticsRoutes.js` | 3 |
| `/api/v1/billing` | `billingRoutes.js` | 5 |
| `/api/v1/blogs` | `blogRoutes.js` | 2 |
| `/api/v1/challenges` | `server/src/routes/v1/challenge.routes.js` | 11 |
| `/api/v1/connections` | `connectionRoutes.js` | 16 |
| `/api/v1/conversations` | `conversationRoutes.js` | 6 |
| `/api/v1/contact` | `contactRoutes.js` | 1 |
| `/api/v1/execution-plans` | `server/src/routes/v1/executionPlan.routes.js` | 10 |
| `/api/v1/first-client` | `server/src/routes/v1/firstClient.routes.js` | 4 |
| `/api/v1/follows` | `followRoutes.js` | 3 |
| `/api/v1/leads` | `leadRoutes.js` | 2 |
| `/api/v1/messages` | `messageRoutes.js` | 11 |
| `/api/v1/marketplace` | `marketplacePaymentRoutes.js` | 15 |
| `/api/v1/matches` | `server/src/routes/v1/match.routes.js` | 8 |
| `/api/v1/network` | `networkRoutes.js` | 6 |
| `/api/v1/notifications` | `notificationRoutes.js` | 5 |
| `/api/v1/opportunities` | `server/src/routes/v1/opportunityPipeline.routes.js` | 10 |
| `/api/v1/outcome-offers` | `server/src/routes/v1/outcomeOffer.routes.js` | 10 |
| `/api/v1/portfolio` | `portfolioRoutes.js` | 3 |
| `/api/v1/proof-assets` | `server/src/routes/v1/proofAsset.routes.js` | 7 |
| `/api/v1/providers` | `providerRoutes.js` | 6 |
| `/api/v1/profile` | `server/src/routes/v1/profile.routes.js` | 33 |
| `/api/v1/reviews` | `reviewRoutes.js` | 3 |
| `/api/v1/saved-providers` | `server/src/routes/v1/savedProvider.routes.js` | 5 |
| `/api/v1/saved` | `savedItemRoutes.js` | 3 |
| `/api/v1/services` | `serviceRoutes.js` | 7 |

## Complete Underlying Operation Catalog

For shared routers, prepend either listed mount (`/api/...` and `/api/v1/...`) to the relative path. Controller names are the final handlers registered in the route file.

### Auth

Mounts: `/api/auth`, `/api/v1/auth`

File: `server/src/modules/auth/auth.routes.js`

Global middleware: `authGeneralRateLimiter`. Route middleware adds login/password/reset rate limits, Zod body validation, optional auth, `protect`, and admin role authorization.

Frontend caller: `client/src/features/auth/authService.js`.

| Method/path | Controller |
| --- | --- |
| GET `/status` | `authStatus` |
| POST `/register` | `register` |
| POST `/login` | `login` |
| POST `/logout` | `logout` |
| POST `/refresh` | `refreshToken` |
| POST `/refresh-token` | `refreshToken` |
| GET `/me` | `getMe` |
| POST `/forgot-password` | `forgotPassword` |
| POST `/reset-password` | `resetPassword` |
| POST `/verify-email` | `verifyEmail` |
| POST `/resend-verification` | `resendVerificationEmail` |
| POST `/change-password` | `changePassword` |
| GET `/protected-status` | Inline protected status |
| GET `/admin-status` | Inline admin status |

Request schemas are in `server/src/modules/auth/auth.validators.js`. Responses use `successResponse`/auth response helpers. Status: active.

### Account

Mounts: `/api/account`, `/api/v1/account`

File: `server/src/routes/accountRoutes.js`

Global middleware: `protectUser`, client/provider role, API usage enforcement. Per-route permission and upload/rate-limit middleware is used.

Frontend callers: `client/src/features/dashboard/dashboardService.js`, `client/src/services/api.js`.

| Area | Operations |
| --- | --- |
| Dashboard/profile | GET `/activity-feed`; GET `/dashboard`; GET/PATCH `/profile`; POST `/profile/media` |
| Leads | GET/POST `/leads`; GET/PATCH/DELETE `/leads/:id`; POST `/leads/import`; GET `/lead-activities` |
| Scraping | GET/POST `/lead-scrapes`; GET `/lead-scrapes/:id` |
| Campaigns/outreach | GET/POST `/campaigns`; PATCH `/campaigns/:id`; POST `/campaigns/:id/start`; GET/POST `/email-templates`; PATCH/DELETE `/email-templates/:id`; GET/POST `/outreach-emails`; GET/POST `/outreach-jobs` |
| Portfolio/services/projects/reviews | GET `/portfolio`; GET/POST `/services`; PUT/DELETE `/services/:id`; POST `/services/images`; GET/POST `/projects`; PATCH `/projects/:id`; GET/POST `/reviews` |

Controllers are the corresponding `getMy*`, `createMy*`, `updateMy*`, `deleteMy*`, import/start/upload functions from `server/src/controllers/accountController.js`. Status: active.

### Admin

Mounts: `/api/admin`, `/api/v1/admin`

File: `server/src/routes/adminRoutes.js`

Global middleware: `protectAdmin`; each operation requires an admin permission category. Admin list/moderation endpoints also use `admin.validator.js`.

Frontend callers: `client/src/features/admin/adminService.js`, legacy `client/src/services/api.js`.

| Area | Operations |
| --- | --- |
| Overview | GET `/overview`; GET `/saas`; GET `/plans`; PATCH `/plans/:planKey`; PATCH `/me/password` |
| Users | GET/POST `/users`; PATCH/DELETE `/users/:id`; PATCH `/users/:id/password`; PATCH `/users/:id/profile`; PATCH `/users/:id/settings`; DELETE `/users/:id/media/:type`; PATCH `/users/:userId/status` |
| ProofArena moderation | GET `/providers`; PATCH `/providers/:providerId/moderation`; GET `/challenges`; PATCH `/challenges/:challengeId/moderation`; GET `/outcome-offers`; PATCH `/outcome-offers/:offerId/moderation`; GET `/proof-assets`; PATCH `/proof-assets/:assetId/moderation` |
| Content | GET/POST `/blogs`; PATCH/DELETE `/blogs/:id`; GET/POST `/reviews`; PATCH/DELETE `/reviews/:id` |
| Marketplace | GET/POST `/marketplace/categories`; PATCH/DELETE `/marketplace/categories/:categoryId`; GET `/marketplace/providers`; PATCH `/marketplace/providers/:userId`; GET `/marketplace/services`; PATCH/DELETE `/marketplace/services/:serviceId`; PATCH `/marketplace/services/:serviceId/approve`; PATCH `/marketplace/services/:serviceId/reject`; GET `/marketplace/transactions`; POST `/marketplace/transactions/:transactionId/release` |
| Support/operations | GET `/conversations`; GET `/reported-messages`; GET `/connections/overview`; GET `/support/conversations`; PATCH `/support/conversations/:conversationId`; GET/POST `/support/conversations/:conversationId/messages` |

Controllers are in `server/src/controllers/adminController.js`. Status: active, but frontend constants also advertise admin disputes, proof-review, reports, and settings API paths that are not registered.

### Analytics

Mounts: `/api/analytics`, `/api/v1/analytics`

| Method/path | Controller | Access |
| --- | --- | --- |
| POST `/visits` | `trackPageVisit` | Optional user |
| POST `/events` | `trackMarketplaceEvent` | Optional user |
| GET `/summary` | `getAdminAnalyticsSummary` | Admin analytics/overview permission |

Files: `server/src/routes/analyticsRoutes.js`, `controllers/analyticsController.js`. Frontend: `client/src/services/api.js`.

### Billing

Mounts: `/api/billing`, `/api/v1/billing`

| Method/path | Controller | Access |
| --- | --- | --- |
| GET `/plans` | `getPlans` | Public |
| GET `/subscription` | `getMySubscription` | Authenticated client/provider, billing permission |
| POST `/checkout-session` | `startCheckout` | Authenticated client/provider, billing permission |
| POST `/portal-session` | `openCustomerPortal` | Authenticated client/provider, billing permission |
| POST `/select-free` | `selectFreePlan` | Authenticated client/provider, billing permission |

Files: `billingRoutes.js`, `billingController.js`, `subscriptionService.js`, `stripeService.js`. Frontend: `client/src/services/api.js`, billing constants. Status: active.

### Blogs

Mounts: `/api/blogs`, `/api/v1/blogs`

- GET `/` → `getBlogs`
- GET `/:slug` → `getBlogBySlug`

Frontend: `client/src/services/api.js`. Public. Status: active.

### Connections

Mounts: `/api/connections`, `/api/v1/connections`

Global middleware: messaging auth plus `network:use`.

Operations:

GET `/`; POST `/`; GET `/search`; GET `/accepted`; GET `/requests`; GET `/sent`; GET `/suggestions`; GET `/status/:userId`; POST `/request`; POST `/request/:userId`; DELETE `/user/:userId`; POST `/:userId/block`; PATCH `/:connectionId/accept`; PATCH `/:connectionId/reject`; PATCH `/:connectionId`; DELETE `/:connectionId`.

Controllers: `getMyConnections`, `postConnectionRequest`, candidate/status/list handlers, accept/reject/update/delete/block handlers in `connectionController.js`. Frontend: social feature and legacy API facade. Status: active; two request styles overlap.

### Contact

Mounts: `/api/contact`, `/api/v1/contact`

- POST `/` → `submitContactLead`

Middleware: contact rate limiter, optional user, Express validation rules, request validation. Frontend: `submitLead` in `client/src/services/api.js`. Status: active.

### Conversations

Mounts: `/api/conversations`, `/api/v1/conversations`

Global middleware: messaging auth plus `messages:use`.

GET `/`; POST `/direct`; POST `/support`; GET/POST `/:conversationId/messages`; PATCH `/:conversationId/read`.

Controllers: messaging controller conversation functions. Frontend: legacy API/messaging UI. Status: active; overlaps with `/messages/conversations`.

### Follows

Mounts: `/api/follows`, `/api/v1/follows`

Global middleware: messaging auth plus `network:use`.

GET `/status/:userId`; POST `/:userId`; DELETE `/:userId`.

Frontend: `client/src/features/social/socialService.js`. Status: active.

### Health

| Full endpoint | Controller | Status |
| --- | --- | --- |
| GET `/api/health` | `getHealth` | Active legacy health |
| GET `/api/v1/health` | `getHealthStatus` | Active |
| GET `/api/v1/health/status` | `getServiceStatus` | Active |

Frontend: `client/src/hooks/useHealthCheck.js`, `client/src/services/api.js`.

### Leads

Mounts: `/api/leads`, `/api/v1/leads`

Global middleware: admin auth and `leads` permission.

GET `/` → `getLeads`; GET `/:id` → `getLeadById`.

Frontend: legacy admin lead hooks/API facade. Status: active.

### Marketplace and Marketplace Payments

Mounts: `/api/marketplace`, `/api/v1/marketplace`

Public/optional-auth:

- GET `/categories` → `getMarketplaceCategories`
- GET `/categories/:slug` → `getMarketplaceCategoryBySlug`
- GET `/providers` → `getProviders`
- GET `/services` → `getMarketplaceServices`
- GET `/service/:slug` → `getMarketplaceService`
- GET `/services/:serviceId` → `getMarketplaceService`

Authenticated client/provider:

- GET/POST `/favorites`; DELETE `/favorites/:targetType/:targetId`
- GET/POST `/connect/account`
- POST `/connect/onboarding-link`
- POST `/checkout-session`
- GET `/transactions`
- POST `/transactions/:transactionId/complete-work`

Middleware adds marketplace read/hire/payout/complete-work permissions as appropriate. Frontend: `client/src/services/api.js`, marketplace/pages. Status: active.

### Messages

Mounts: `/api/messages`, `/api/v1/messages`

Global middleware: messaging auth plus `messages:use`.

GET/POST `/conversations`; POST `/conversations/direct`; POST `/conversations/admin`; POST `/attachments`; POST `/presence`; GET/POST `/conversations/:conversationId/messages`; PATCH `/conversations/:conversationId/read`; PATCH `/:messageId/read`; DELETE `/:messageId`.

Frontend: `client/src/services/api.js`, `client/src/services/messagingSocket.js`, messaging pages/stores. Status: active.

### Network

Mounts: `/api/network`, `/api/v1/network`

Global middleware: authenticated client/provider plus `network:use`.

GET `/feed`; POST `/posts`; POST `/posts/:postId/like`; GET/POST `/posts/:postId/comments`; POST `/posts/:postId/share`.

Frontend: network page and legacy API facade. Status: active.

### Notifications

Mounts: `/api/notifications`, `/api/v1/notifications`

Global middleware: messaging auth plus notification-read permission.

GET `/`; GET `/unread-count`; PATCH `/read-all`; PATCH `/:notificationId/read`; DELETE `/:notificationId`.

Frontend: dashboard API constants, notification store/page, legacy API facade. Status: active.

### Portfolio

Mounts: `/api/portfolio`, `/api/v1/portfolio`

GET `/` and GET `/:id` allow optional user. POST `/` requires admin content permission.

Controllers: portfolio controller. Frontend: `client/src/services/api.js`, public portfolio. Status: active.

### Profiles

Mounts: `/api/profile`, `/api/v1/profile`

File: `server/src/routes/v1/profile.routes.js`.

Public/optional-auth:

- GET `/:username`
- GET `/:username/public`
- GET `/:username/activity`
- GET `/public/:identifier`

Authenticated owner operations:

- GET/PATCH `/me`
- GET `/me/analytics`
- GET `/me/public-preview`
- PATCH `/me/onboarding-progress`
- PATCH `/me/publish-state`
- PATCH `/me/section/:sectionKey`
- PATCH `/intro`, `/about`, `/skills`, `/open-to`
- GET/PATCH `/privacy`
- GET `/verification`
- POST `/verification/request`
- POST/PATCH/DELETE experience, education, and services collections/items
- PATCH `/avatar`, `/cover`
- POST `/upload-avatar`, `/upload-cover`
- PUT `/update`

Middleware uses optional authentication for public reads; owner/provider-owner access, profile/media permissions, Zod params/body schemas, and upload rate limits for private writes.

Frontend: `client/src/features/profile/profileService.js`, `client/src/services/api.js`. Status: active. The same 33 operations are exposed through both API versions.

### Providers

Mounts: `/api/providers`, `/api/v1/providers`

GET `/`; GET `/filters`; GET `/compare`; GET `/:username`; POST `/:username/connect`; POST `/verification`.

Public reads use optional auth and provider validators. Connect requires protected user. Verification requires provider role, media permission, rate limit, and uploaded documents.

Frontend: `client/src/features/providers/providerService.js`, public provider pages, legacy API facade. Status: active.

### Reviews

Mounts: `/api/reviews`, `/api/v1/reviews`

GET `/`; GET `/service/:serviceId`; GET `/provider/:providerId`.

Public read-only routes. Frontend: legacy API facade. Status: active.

### Saved Items

Mounts: `/api/saved`, `/api/v1/saved`

Global middleware: protected client role.

GET `/`; POST `/`; DELETE `/:id`.

Frontend: dashboard saved API constants and legacy API facade. Status: active.

### Services

Mounts: `/api/services`, `/api/v1/services`

Public/optional-auth: GET `/`; GET `/provider/:providerId`; GET `/slug/:slug`; GET `/:slug`.

Provider-protected: POST `/`; PUT/DELETE `/:id`.

Frontend: `client/src/services/api.js`, marketplace/service pages. Status: active. `/:slug` and `/:id` share the same path shape under different methods.

### Users

| Full mount | Operations | Access/status |
| --- | --- | --- |
| `/api/users` | GET `/`, POST `/` | Admin users permission |
| `/api/v1/users` | GET `/`, POST `/` | Same nested legacy router |
| `/api/v1/users/status` | GET | Public planned-module status placeholder |

Frontend: API endpoint constant includes `/users/status`. Status: mixed active/placeholder.

### Challenges

Mount: `/api/v1/challenges`

Public: GET `/`; GET `/:username/:slug`.

Client-only: POST `/`; GET `/me`; GET `/id/:challengeId`; PATCH/DELETE `/:challengeId`; POST `/:challengeId/publish`; POST `/:challengeId/pause`; POST `/:challengeId/close`; POST `/:challengeId/archive`.

Validation: `challenge.validator.js`. Frontend: `client/src/features/challenges/challengeService.js`, which adds `/v1` when the API base is `/api`. Status: active.

### Execution Plans

Mount: `/api/v1/execution-plans`

Provider-only: POST `/`; GET `/me`; GET `/id/:planId`; PATCH `/:planId`; POST `/:planId/withdraw`.

Client-only: GET `/challenge/:challengeId`; GET `/client/:planId`; POST `/:planId/shortlist`; POST `/:planId/reject`; POST `/:planId/accept`.

Validation: `executionPlan.validator.js`. Frontend: `executionPlanService.js`. Status: active.

### First Client

Mount: `/api/v1/first-client`

Authenticated provider workflow:

GET `/status`; POST `/refresh`; GET `/starter-challenges`; GET `/badges`.

Frontend: `firstClientService.js`. Status: active.

### Matches

Mount: `/api/v1/matches`

Provider-only: GET `/provider`; POST `/provider/refresh`; GET `/provider/:matchId`; PATCH `/provider/:matchId/status`.

Client-only: GET `/challenge/:challengeId/providers`; POST `/challenge/:challengeId/refresh`; GET `/client/:matchId`; PATCH `/client/:matchId/status`.

Frontend: `matchService.js`. Status: active.

### Opportunity Pipeline

Mount: `/api/v1/opportunities`

Authenticated operations:

GET/POST `/`; GET `/stats`; GET/PATCH `/:opportunityId`; PATCH `/:opportunityId/stage`; PATCH `/:opportunityId/next-action`; POST `/:opportunityId/next-action/complete`; POST `/:opportunityId/notes`; POST `/:opportunityId/archive`.

Validation: `opportunityPipeline.validator.js`. Frontend: `opportunityService.js`. Status: active. Route file does not add an explicit provider role guard; ownership is enforced in service queries.

### Outcome Offers

Mount: `/api/v1/outcome-offers`

Public: GET `/`; GET `/:username/:slug`.

Provider-only: POST `/`; GET `/me`; GET `/id/:offerId`; PATCH/DELETE `/:offerId`; POST `/:offerId/publish`; POST `/:offerId/pause`; POST `/:offerId/archive`.

Frontend: `outcomeOfferService.js`. Status: active.

### Proof Assets

Mount: `/api/v1/proof-assets`

Authenticated operations:

POST `/`; GET `/me`; GET `/id/:assetId`; PATCH/DELETE `/:assetId`; POST `/:assetId/attach`; POST `/:assetId/detach`.

Validation: `proofAsset.validator.js`. Frontend: `proofAssetService.js`. Status: active. Route file authenticates users but does not explicitly require provider role.

### Saved Providers

Mount: `/api/v1/saved-providers`

Authenticated operations:

GET/POST `/`; PATCH `/:savedProviderId`; GET `/provider/:providerId/status`; DELETE `/provider/:providerId`.

Validation: `savedProvider.validator.js`. Frontend: `savedProviderService.js`. Status: active. Route file authenticates but does not explicitly require client role.

## Frontend API Client and Usage Map

| Frontend path | Purpose | Backend mapping | Status/risk |
| --- | --- | --- | --- |
| `client/src/services/apiClient.js` | Primary Axios client, base URL, auth header, refresh retry, response normalization | All endpoints | Active |
| `client/src/constants/apiEndpoints.js` | Central endpoint constants/builders | Mix of `/api` and v1-feature paths | Active, includes future/unimplemented contracts |
| `client/src/services/api.js` | Large legacy facade and fallback data behavior | Mostly shared `/api` endpoints | Active; duplicates feature services and contains hardcoded endpoint strings |
| `client/src/features/auth/authService.js` | Auth API mapping | `/auth/*` | Active |
| `client/src/features/admin/adminService.js` | Admin list/moderation | `/admin/*` | Active |
| `client/src/features/dashboard/dashboardService.js` | Account dashboard/feed | `/account/*` | Active |
| `client/src/features/challenges/challengeService.js` | Challenges | `/v1/challenges/*` | Active |
| `client/src/features/executionPlans/executionPlanService.js` | Execution plans | `/v1/execution-plans/*` | Active |
| `client/src/features/firstClient/firstClientService.js` | First-client mode | `/v1/first-client/*` | Active |
| `client/src/features/matches/matchService.js` | Matching | `/v1/matches/*` | Active |
| `client/src/features/opportunities/opportunityService.js` | Opportunity pipeline | `/v1/opportunities/*` | Active |
| `client/src/features/outcomeOffers/outcomeOfferService.js` | Outcome offers | `/v1/outcome-offers/*` | Active |
| `client/src/features/profile/profileService.js` | Profile owner/public endpoints | `/profile/*` | Active |
| `client/src/features/proofAssets/proofAssetService.js` | Proof assets | `/v1/proof-assets/*` | Active |
| `client/src/features/providers/providerService.js` | Provider discovery/compare/profile | `/providers/*`, `/profile/*` | Active |
| `client/src/features/savedProviders/savedProviderService.js` | Saved providers | `/v1/saved-providers/*` | Active |
| `client/src/features/social/socialService.js` | Follow/connection actions | `/follows/*`, `/connections/*` | Active |
| `client/src/services/messagingSocket.js` | Socket.IO client factory | Realtime server origin | Active |

Feature utilities such as `challengeUtils.js`, `executionPlanUtils.js`, `matchUtils.js`, `outcomeOfferUtils.js`, `opportunityUtils.js`, `firstClientUtils.js`, and `proofAssetUtils.js` conditionally add `/v1` when `API_BASE_URL` ends at `/api`.

## Frontend/Backend Contract Gaps

The following frontend endpoint constants have no matching backend route registration:

| Frontend contract | Source | Backend finding | Usage |
| --- | --- | --- | --- |
| `/applications*` | `API_ENDPOINTS.APPLICATIONS` | Not found | Constants/query keys only |
| `/milestones*` | `API_ENDPOINTS.MILESTONES` | Not found | Constants/query keys only |
| `/proofs*` | `API_ENDPOINTS.PROOFS` | Not found | Proof submission helper only |
| `/proof-ledger` | `API_ENDPOINTS.PROOF_LEDGER` | Not found | Public route is placeholder |
| `/leaderboard` | `API_ENDPOINTS.LEADERBOARD` | Not found | Public route is placeholder |
| `/admin/disputes` | `API_ENDPOINTS.ADMIN.DISPUTES` | Not found | Admin page is placeholder |
| `/admin/proof-review` | `API_ENDPOINTS.ADMIN.PROOF_REVIEW` | Not found | Admin page is placeholder |
| `/admin/reports` | `API_ENDPOINTS.ADMIN.REPORTS` | Not found as dedicated API | UI currently derives reports from overview |
| `/admin/settings` | `API_ENDPOINTS.ADMIN.SETTINGS` | Not found | Admin page is placeholder |
| `/profile` root | `API_ENDPOINTS.PROFILE` | No GET/POST root route | Used as a grouping/base constant; concrete profile endpoints exist |

## Response Formats

Modern modules use helpers from `server/src/utils/apiResponse.js` (`successResponse`, `sendSuccess`, pagination/error helpers). Legacy controllers are not uniform and some call Express response methods directly. The frontend compensates through `client/src/services/apiContracts.js`, which accepts both envelope and direct payload shapes.

This mixed response contract is active and should be treated as a migration boundary, not silently assumed to be uniform.

## Prompt 2 Verification Update

- Static route parsing reconciled exactly with 304 underlying operations and 537 mounted endpoint variants.
- 300 operations resolve to controller files; four status/discovery operations are inline.
- Service evidence is handler-level for 291 operations, controller-file-level for six, absent by design for three health handlers, and unknown for four inline handlers.
- Route middleware ordering was evaluated by source position, preserving public operations declared before router-level authentication middleware.
- Full middleware, controller, service, direct-model, response-helper, and frontend-caller evidence is in `STAGE_1_1_BACKEND_FLOW_MAP.md`.
