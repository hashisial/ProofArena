# ScaleOps / ProofArena API Endpoint Audit

## Scope

This audit compares the centralized frontend endpoint constants with route
mounts in:

- `server/src/app.js`
- `server/src/routes/v1/index.js`
- Auth, profile, provider, admin, dashboard, and ProofArena route modules

No backend route was renamed or added during this endpoint-foundation pass.

## Current API Surfaces

The Express application exposes two API surfaces:

1. Legacy modules mounted directly under `/api/*`
2. Versioned modules mounted under `/api/v1/*`

Many legacy modules are mounted under both surfaces. ProofArena workflow
modules are generally consumed through `/api/v1/*`.

| Domain | Legacy `/api/*` | Versioned `/api/v1/*` | Current frontend use |
| --- | --- | --- | --- |
| Auth | Yes | Yes | Legacy `/api/auth/*` |
| Profile | Yes | Yes | Legacy `/api/profile/*` |
| Providers | Yes | Yes | Legacy `/api/providers/*` |
| Admin | Yes | Yes | Legacy `/api/admin/*` |
| Notifications | Yes | Yes | Legacy `/api/notifications/*` |
| Messages | Yes | Yes | Legacy `/api/messages/*` |
| Billing | Yes | Yes | Legacy `/api/billing/*` |
| Saved items | Yes | Yes | Legacy `/api/saved/*` |
| Challenges | No direct mount | Yes | `/api/v1/challenges/*` |
| Execution plans | No direct mount | Yes | `/api/v1/execution-plans/*` |
| Matches | No direct mount | Yes | `/api/v1/matches/*` |
| Outcome offers | No direct mount | Yes | `/api/v1/outcome-offers/*` |
| Opportunities | No direct mount | Yes | `/api/v1/opportunities/*` |
| Proof assets | No direct mount | Yes | `/api/v1/proof-assets/*` |
| Saved providers | No direct mount | Yes | `/api/v1/saved-providers/*` |
| First client | No direct mount | Yes | `/api/v1/first-client/*` |

## Mismatches Found

### Dual API mounting

Auth, profile, provider, admin, analytics, billing, blogs, connections,
conversations, contact, follows, leads, messages, marketplace, network,
notifications, portfolio, reviews, saved items, services, and users are
mounted under both `/api` and `/api/v1`.

This preserves compatibility but creates two public contracts for the same
handlers. A future migration needs usage evidence, deprecation notices, and
route-contract tests before removing either surface.

### API base ownership

The frontend API client base already includes `/api`. Endpoint constants must
therefore remain relative to that base, such as `/auth/login`. Constants that
include `/api/auth/login` would produce `/api/api/auth/login`.

### Version prefix ownership

ProofArena feature services add `/v1` locally when `API_BASE_URL` does not
already end in `/v1`. Legacy services do not add a version prefix. This
supports both current environment patterns but is inconsistent and should
eventually move to a documented version-aware client or a single versioned
backend contract.

Checked-in environment examples now configure `VITE_API_BASE_URL` as the backend
origin. The API client appends `/api` when no path is supplied, while still
preserving explicit `/api` and `/api/v1` configurations. Current ProofArena
endpoint builders guard against a duplicate `/v1` prefix.

`VITE_API_URL` remains a temporary compatibility alias during migration.

### Planned endpoints without backend routes

The following constants describe requested future contracts but have no
mounted backend route:

- `/applications`
- `/milestones`
- `/proofs`
- `/proof-ledger`
- `/leaderboard`
- `/admin/proof-review`
- `/admin/reports`
- `/admin/disputes`
- `/admin/settings`

Current admin proof moderation uses `/admin/proof-assets`. Current admin
report summaries use `/admin/overview` and `/analytics/summary`.

### Settings endpoint

There is no standalone `/settings` backend route. Current settings behavior
uses:

- `/profile/privacy`
- `/billing/*`
- `/admin/users/:id/settings` for admin-managed user settings
- `/admin/me/password` for an admin's own password

### Billing constant drift corrected

The old billing aliases pointed to unsupported paths:

- `/billing/portal`
- `/billing/status`

They now preserve their alias names while resolving to the live backend
routes:

- `/billing/portal-session`
- `/billing/subscription`

### Profile endpoint aliases

The backend supports:

- `/profile/:username`
- `/profile/:username/public`

The frontend also exposed the same canonical public profile path through both
profile and provider endpoint groups. `PROFILE_API.PUBLIC_PROFILE` is now the
focused canonical group export; existing aliases remain for compatibility.

### Conversation and message split

The backend exposes both `/conversations/*` and `/messages/*` route modules.
The legacy frontend facade uses both. They were not consolidated because they
represent active contracts with different handlers.

## Safe Replacements Completed

- API client auth literals now use `AUTH_API`.
- Legacy billing calls now use `DASHBOARD_API.BILLING`.
- Legacy notification calls now use `DASHBOARD_API.NOTIFICATIONS`.
- Legacy saved-item calls now use `DASHBOARD_API.SAVED`.

Broader replacement inside `client/src/services/api.js` was intentionally
deferred. That file is an active compatibility facade spanning many legacy
domains, and a bulk rewrite would add regression risk without changing the
backend contract.

## Recommended Migration

1. Add route-contract tests for both `/api/*` and `/api/v1/*`.
2. Inventory production consumers and choose one versioned API policy.
3. Move legacy facade functions into owning feature services incrementally.
4. Add backend routes only when applications, milestones, proof submissions,
   proof ledger, leaderboard, disputes, and admin settings are implemented.
5. Remove compatibility aliases only after consumer scans and runtime
   verification confirm zero usage.
