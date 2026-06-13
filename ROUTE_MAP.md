# ScaleOps / ProofArena Route Map

## Canonical Route System

Frontend route constants are centralized in:

`client/src/constants/routes.js`

The existing `ROUTES` export remains the compatibility facade used throughout
the application. New code may import focused groups and helpers:

- `PUBLIC_ROUTES`
- `AUTH_ROUTES`
- `DASHBOARD_ROUTES`
- `ADMIN_ROUTES`
- `DYNAMIC_ROUTES`
- `ROUTE_GROUPS`
- `getProfileRoute(username)`
- `isPublicRoute(pathname)`
- `isAuthRoute(pathname)`
- `isDashboardRoute(pathname)`
- `isAdminRoute(pathname)`

`client/src/constants/index.js` re-exports the complete route API.

## Public Routes

| Route | Current owner | Status |
| --- | --- | --- |
| `/` | `Home.jsx` | Full page |
| `/how-it-works` | `RouteShells.jsx` | Foundation shell |
| `/challenges` | `Challenges.jsx` | Full page |
| `/providers` | `Providers.jsx` | Full page |
| `/providers/compare` | `ProviderCompare.jsx` | Full page |
| `/proof-ledger` | `RouteShells.jsx` | Foundation shell |
| `/leaderboard` | `RouteShells.jsx` | Foundation shell |
| `/offers` | Public offer route base | Base only; no index page or visible navigation link |
| `/blog` | `RouteShells.jsx` | Foundation shell |
| `/contact` | `RouteShells.jsx` | Foundation shell |
| `/resources` | `RouteShells.jsx` | Foundation shell |
| `/case-studies` | `RouteShells.jsx` | Foundation shell |
| `/help` | `RouteShells.jsx` | Foundation shell |
| `/pricing` | `RouteShells.jsx` | Foundation shell |
| `/privacy` | `RouteShells.jsx` | Foundation shell; legal review required |
| `/terms` | `RouteShells.jsx` | Foundation shell; legal review required |
| `/trust-safety` | `RouteShells.jsx` | Foundation shell |
| `/marketplace` | `Marketplace.jsx` | Full page |
| `/portfolio` | `Portfolio.jsx` | Full page |
| `/services` | `Services.jsx` | Full page |

Public error routes `/403` and `/500` also resolve through the public layout.

## Auth Routes

| Route | Current owner | Status |
| --- | --- | --- |
| `/login` | `Login.jsx` | Full page |
| `/register` | `Register.jsx` | Full page |
| `/forgot-password` | `ForgotPassword.jsx` | Full page |
| `/reset-password` | `ResetPassword.jsx` | Full page |
| `/verify-email` | `VerifyEmail.jsx` | Full page |
| `/resend-verification` | `VerifyEmail.jsx` | Compatibility route |

## Dashboard Routes

Required dashboard routes:

| Route | Current owner | Status |
| --- | --- | --- |
| `/dashboard` | `Dashboard.jsx` | Role-aware dashboard |
| `/profile` | `Profile.jsx` | Owner profile |
| `/messages` | `Messages.jsx` | Full page |
| `/notifications` | `Notifications.jsx` | Full page |
| `/settings` | `Settings.jsx` | Full page |
| `/proof` | `RouteShells.jsx` | Foundation shell |
| `/saved` | `Saved.jsx` | Full page |
| `/billing` | `RouteShells.jsx` | Foundation shell |

Additional protected routes are retained for client challenges, provider
offers, plans, matches, opportunities, proof vault, saved providers,
first-client mode, workspace, account, network, payments, projects, leads,
scraper, and provider services.

## Admin Routes

| Route | Current owner | Status |
| --- | --- | --- |
| `/admin` | `AdminDashboard.jsx` | Full page |
| `/admin/users` | `AdminUsers.jsx` | Full page |
| `/admin/providers` | `AdminProviders.jsx` | Full page |
| `/admin/challenges` | `AdminChallenges.jsx` | Full page |
| `/admin/proof-review` | `RouteShells.jsx` | Foundation shell |
| `/admin/reports` | `AdminReports.jsx` | Full page |
| `/admin/disputes` | `RouteShells.jsx` | Foundation shell |
| `/admin/settings` | `RouteShells.jsx` | Foundation shell |

Existing admin routes for outcome offers, proof assets, and verification are
also retained.

## Dynamic Routes

| Pattern | Purpose |
| --- | --- |
| `/profile/:username` | Canonical public profile |
| `/u/:username` | Legacy public-profile compatibility |
| `/providers/:username` | Legacy provider-profile compatibility |
| `/challenges/:username/:slug` | Public challenge detail |
| `/offers/:username/:slug` | Public outcome-offer detail |
| `/marketplace/category/:categorySlug` | Marketplace category |
| `/marketplace/service/:serviceId` | Marketplace service detail |
| `/dashboard/challenges/:challengeId` | Client challenge control panel |
| `/dashboard/challenges/:challengeId/edit` | Challenge editor |
| `/dashboard/challenges/:challengeId/providers` | Challenge provider selection |
| `/dashboard/challenges/:challengeId/providers/shortlisted` | Challenge shortlist |
| `/dashboard/challenges/:challengeId/provider-selection` | Selection workflow |
| `/dashboard/challenges/:challengeId/recommended-providers` | Legacy recommendation route |
| `/dashboard/challenges/:challengeId/plans` | Challenge execution plans |
| `/dashboard/challenges/:challengeId/plans/:planId` | Client plan review |
| `/dashboard/offers/:offerId` | Provider-owned offer detail |
| `/dashboard/offers/:offerId/edit` | Provider-owned offer editor |
| `/dashboard/plans/:planId` | Provider execution-plan detail |
| `/dashboard/plans/:planId/edit` | Provider execution-plan editor |
| `/dashboard/opportunities/:opportunityId` | Provider opportunity detail |
| `/dashboard/proof-vault/:assetId` | Proof-asset detail |

## Shell and Future-Content Notes

No required route currently falls through to the generic 404 page.

The following routes intentionally use professional foundation shells and
still need complete product, content, or legal experiences later:

- `/how-it-works`
- `/proof-ledger`
- `/leaderboard`
- `/blog`
- `/contact`
- `/resources`
- `/case-studies`
- `/help`
- `/pricing`
- `/privacy`
- `/terms`
- `/trust-safety`
- `/proof`
- `/billing`
- `/admin/proof-review`
- `/admin/disputes`
- `/admin/settings`

Route shells should be replaced only when their complete pages are ready.
Visible navigation links remain valid during that migration.

`/offers` is retained as the canonical base for
`/offers/:username/:slug`, but it does not currently have an index page or
shell. It is not exposed by visible navigation.

## Route Ownership Rules

1. Add or change frontend paths only in `client/src/constants/routes.js`.
2. Preserve `ROUTES.*` compatibility keys until all consumers are migrated.
3. Use `DYNAMIC_ROUTES` patterns in React Router declarations.
4. Use builder functions such as `ROUTES.OWNER_CHALLENGE(id)` and
   `getProfileRoute(username)` when generating links.
5. Keep public `/challenges` distinct from protected
   `/dashboard/challenges`.
6. Keep owner `/profile` distinct from public `/profile/:username`.
7. Do not remove legacy dynamic routes until inbound links and consumers are
   verified.
