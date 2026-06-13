# ScaleOps / ProofArena API Endpoints

## Canonical Frontend API System

API endpoint constants are centralized in:

`client/src/constants/apiEndpoints.js`

The existing JavaScript module remains canonical because the client is a
JavaScript Vite application and already imports this file throughout the
feature-service layer. A parallel `src/constants/api.ts` system was not
created.

`client/src/constants/index.js` re-exports the public endpoint API:

- `AUTH_API`
- `PROFILE_API`
- `PROOFARENA_API`
- `DASHBOARD_API`
- `ADMIN_API`
- `API_GROUPS`
- `API_ENDPOINTS` for existing consumers
- `API_ENDPOINT_GROUPS` for compatibility

## Prefix Rules

Endpoint constants are API-relative, for example `/auth/login`, rather than
including `/api`.

`client/src/services/apiClient.js` owns the API base URL:

- Development fallback: `http://<current-host>:5000/api`
- Production fallback: `/api`
- Configured value: `VITE_API_BASE_URL`

ProofArena feature services that use versioned routes add `/v1` before sending
the request only when the configured base does not already end in `/v1`.
Keeping constants API-relative prevents invalid paths such as
`/api/api/auth/login` and supports both `/api` and `/api/v1` base
configurations.

When `VITE_API_BASE_URL` is an origin without a path, such as
`http://localhost:5000`, the API client appends `/api`. Explicit `/api` and
`/api/v1` paths remain unchanged.

`VITE_API_URL` remains a temporary compatibility alias.

## Auth API

| Constant | Endpoint | Backend status |
| --- | --- | --- |
| `AUTH_API.REGISTER` | `/auth/register` | Live |
| `AUTH_API.LOGIN` | `/auth/login` | Live |
| `AUTH_API.LOGOUT` | `/auth/logout` | Live |
| `AUTH_API.REFRESH` | `/auth/refresh-token` | Live, canonical |
| `AUTH_API.REFRESH_ALIAS` | `/auth/refresh` | Live compatibility alias |
| `AUTH_API.ME` | `/auth/me` | Live |
| `AUTH_API.FORGOT_PASSWORD` | `/auth/forgot-password` | Live |
| `AUTH_API.RESET_PASSWORD` | `/auth/reset-password` | Live |
| `AUTH_API.VERIFY_EMAIL` | `/auth/verify-email` | Live |

The API client now uses `AUTH_API` for public-auth path detection and token
refresh requests.

## Profile API

| Constant | Endpoint | Backend status |
| --- | --- | --- |
| `PROFILE_API.OWNER` | `/profile/me` | Live |
| `PROFILE_API.PUBLIC_PROFILE(username)` | `/profile/:username` | Live |
| `PROFILE_API.UPDATE` | `/profile/me` | Live |
| `PROFILE_API.AVATAR_UPLOAD` | `/profile/avatar` | Live |
| `PROFILE_API.COVER_UPLOAD` | `/profile/cover` | Live |
| `PROFILE_API.PRIVACY` | `/profile/privacy` | Live |
| `PROFILE_API.VERIFICATION` | `/profile/verification` | Live |

The public profile endpoint also has a live `/profile/:username/public`
compatibility form. The canonical frontend route remains
`/profile/:username`.

## ProofArena API

| Group | Base endpoint | Backend status |
| --- | --- | --- |
| Challenges | `/v1/challenges` | Live |
| Execution plans | `/v1/execution-plans` | Live |
| Matches | `/v1/matches` | Live |
| Outcome offers | `/v1/outcome-offers` | Live |
| Opportunities | `/v1/opportunities` | Live |
| Proof assets | `/v1/proof-assets` | Live |
| Providers | `/providers` and `/v1/providers` | Live legacy-compatible route |
| Saved providers | `/v1/saved-providers` | Live |
| First client | `/v1/first-client` | Live |
| Applications | `/v1/applications` | Planned; no route mounted |
| Milestones | `/v1/milestones` | Planned; no route mounted |
| Proof submissions | `/v1/proofs` | Planned; no route mounted |
| Proof ledger | `/v1/proof-ledger` | Planned; no route mounted |
| Leaderboard | `/v1/leaderboard` | Planned; no route mounted |

The constants remain API-relative. The `/v1` prefix shown above is added
conditionally by the owning ProofArena feature service.

## Dashboard API

| Group | Live endpoints |
| --- | --- |
| Account dashboard | `/account/dashboard`, `/account/activity-feed` |
| Notifications | `/notifications`, `/notifications/unread-count`, `/notifications/read-all`, `/notifications/:id/read` |
| Messages | `/messages`, `/messages/attachments`, `/messages/presence`, `/messages/conversations/*` |
| Saved | `/saved`, `/saved/:id` |
| Billing | `/billing/plans`, `/billing/subscription`, `/billing/checkout-session`, `/billing/portal-session`, `/billing/select-free` |
| Settings | `/profile/privacy` |

Settings currently combine profile privacy and billing surfaces. There is no
standalone backend `/settings` route.

## Admin API

| Constant | Endpoint | Backend status |
| --- | --- | --- |
| `ADMIN_API.USERS` | `/admin/users` | Live |
| `ADMIN_API.PROVIDERS` | `/admin/providers` | Live |
| `ADMIN_API.CHALLENGES` | `/admin/challenges` | Live |
| `ADMIN_API.PROOF_REVIEW` | `/admin/proof-review` | Planned; current moderation uses `/admin/proof-assets` |
| `ADMIN_API.REPORTS` | `/admin/reports` | Planned; current summary uses `/admin/overview` and `/analytics/summary` |
| `ADMIN_API.DISPUTES` | `/admin/disputes` | Planned; no route mounted |
| `ADMIN_API.SETTINGS` | `/admin/settings` | Planned; user settings and own password routes exist |

Planned admin constants are not consumed by current services. They document
the requested future contract without adding fake backend behavior.

## Dynamic Endpoint Helpers

| Helper | Result |
| --- | --- |
| `getPublicProfileEndpoint(username)` | `/profile/:username` |
| `getChallengeEndpoint(challengeId)` | `/challenges/id/:challengeId` |
| `getApplicationEndpoint(applicationId)` | `/applications/:applicationId` |
| `getProofEndpoint(proofId)` | `/proofs/:proofId` |
| `getAdminUserEndpoint(userId)` | `/admin/users/:userId` |

All helper parameters are URL encoded.

## Usage Rules

1. UI components must not call Axios directly.
2. New feature calls use:

   ```text
   API client -> feature service -> React Query hook -> UI
   ```

3. Add endpoints to the existing constants module rather than creating a
   second endpoint file.
4. Keep constants API-relative and let `apiClient` own the `/api` base.
5. Add `/v1` only in version-aware feature services until the dual API surface
   is consolidated.
6. Do not consume planned endpoints until corresponding backend routes exist.

See `API_ENDPOINT_AUDIT.md` for route mismatches and migration risks.
