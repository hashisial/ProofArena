# Stage 1.1 Frontend Route Inventory

Source of truth inspected:

- Paths: `client/src/constants/routes.js`
- Route declarations: `client/src/routes/AppRoutes.jsx`
- Metadata: `client/src/config/routeMetadata.js`
- Guards: `client/src/routes/*.jsx`

Count: 108 route entries, including the home index and `*` catch-all.

Status definitions:

- **Active**: route renders a substantive page or workflow.
- **Placeholder**: route is intentionally registered but renders shared placeholder/state UI.
- **Compatibility**: retained legacy/alias route.
- **System**: route-safety/error page.
- **Unknown**: registration is clear but feature completeness/ownership is not.

## Public and System Routes

All rows use `PublicLayout` and have no auth guard unless stated.

| Path | Type | Component/file | Guard/role | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | public | `Home` — `client/src/pages/Home.jsx` | None | Active | Index route |
| `/about` | public | `About` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Public placeholder shell |
| `/how-it-works` | public | `HowItWorks` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Public placeholder shell |
| `/challenges` | public | `Challenges` — `client/src/pages/Challenges.jsx` | None | Active | Public challenge listing |
| `/challenges/:username/:slug` | public/dynamic | `PublicChallenge` — `client/src/pages/PublicChallenge.jsx` | None | Active | Public challenge detail |
| `/providers` | public | `Providers` — `client/src/pages/Providers.jsx` | None | Active | Provider discovery |
| `/providers/compare` | public | `ProviderCompare` — `client/src/pages/ProviderCompare.jsx` | None | Active | Missing route metadata |
| `/providers/:username` | public/dynamic | `ProviderProfileRoute` — `client/src/pages/RouteShells.jsx` | None | Active | Delegates to `PublicProfile` |
| `/proof-ledger` | public | `ProofLedger` — `client/src/pages/RouteShells.jsx` | None | Placeholder | No backend proof-ledger API found |
| `/leaderboard` | public | `Leaderboard` — `client/src/pages/RouteShells.jsx` | None | Placeholder | No backend leaderboard API found |
| `/offers/:username/:slug` | public/dynamic | `PublicOutcomeOffer` — `client/src/pages/PublicOutcomeOffer.jsx` | None | Active | Missing route metadata |
| `/blog` | public | `Blog` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Backend blog APIs exist |
| `/contact` | public | `ContactPlaceholder` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Backend contact POST exists |
| `/resources` | public | `Resources` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Marketing shell |
| `/case-studies` | public | `CaseStudies` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Marketing shell |
| `/help` | public | `HelpCenter` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Support shell |
| `/pricing` | public | `Pricing` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Billing APIs exist |
| `/privacy` | public | `PrivacyPolicy` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Copy explicitly requires production review |
| `/terms` | public | `TermsOfService` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Copy explicitly requires production review |
| `/trust-safety` | public | `TrustSafety` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Marketing shell |
| `/profile/:username` | public/dynamic | `PublicProfileRoute` — `client/src/pages/RouteShells.jsx` | None | Active | Public profile |
| `/u/:username` | public/dynamic | `PublicProfileRoute` — `client/src/pages/RouteShells.jsx` | None | Compatibility | Legacy public-profile alias; missing metadata |
| `/marketplace` | public | `Marketplace` — `client/src/pages/Marketplace.jsx` | None | Active | Missing metadata |
| `/marketplace/category/:categorySlug` | public/dynamic | `MarketplaceCategoryRoute` — `client/src/pages/RouteShells.jsx` | None | Active | Missing metadata |
| `/marketplace/service/:serviceId` | public/dynamic | `ServiceDetailRoute` — `client/src/pages/RouteShells.jsx` | None | Active | Parameter is named `serviceId` but service supports slug/id |
| `/portfolio` | public | `Portfolio` — `client/src/pages/Portfolio.jsx` | None | Active | Missing metadata |
| `/services` | public | `Services` — `client/src/pages/Services.jsx` | None | Active | Missing metadata |
| `/403` | system/legacy | `Forbidden` — `client/src/pages/Forbidden.jsx` | None | Compatibility | Duplicates `/not-authorized` intent; missing metadata |
| `/not-authorized` | system | `NotAuthorized` — `client/src/pages/NotAuthorized.jsx` | None | System | Role-safe actions |
| `/not-found` | system | `NotFound` — `client/src/pages/NotFound.jsx` | None | System | Explicit not-found route |
| `/500` | system | `ServerError` — `client/src/pages/ServerError.jsx` | None | System | Server error page |
| `*` | system/catch-all | `NotFound` — `client/src/pages/NotFound.jsx` | None | System | Final catch-all inside `PublicLayout` |

## Authentication Routes

All rows use `AuthLayout`.

| Path | Type | Component/file | Guard/role | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `/login` | auth | `Login` — `client/src/pages/Login.jsx` | `PublicOnlyRoute` | Active | Authenticated users redirected |
| `/register` | auth | `Register` — `client/src/pages/Register.jsx` | `PublicOnlyRoute` | Active | Client/provider registration |
| `/forgot-password` | auth | `ForgotPassword` — `client/src/pages/ForgotPassword.jsx` | None | Active | Public auth action |
| `/reset-password` | auth | `ResetPassword` — `client/src/pages/ResetPassword.jsx` | None | Active | Token supplied through URL/input flow |
| `/verify-email` | auth | `VerifyEmail` — `client/src/pages/VerifyEmail.jsx` | None | Active | Verification token flow |
| `/resend-verification` | auth | `ResendVerification` — `client/src/pages/VerifyEmail.jsx` | None | Active | Same file, alternate route mode |

## Client Routes

Layout and guard for every row: `ClientLayout` inside `AuthHydration` → `RoleRoute([client])` → `EmailVerifiedRoute`.

| Path | Type | Component/file | Role | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `/client` | client | `ClientOverview` — `client/src/pages/client/ClientOverview.jsx` | client | Placeholder | Uses `ClientPagePlaceholder` |
| `/client/challenges` | client | `ClientChallenges` — `client/src/pages/client/ClientChallenges.jsx` | client | Placeholder | Uses `ClientPagePlaceholder` |
| `/client/providers` | client | `ClientProviders` — `client/src/pages/client/ClientProviders.jsx` | client | Placeholder | Uses `ClientPagePlaceholder` |
| `/client/active` | client | `ClientActiveWork` — `client/src/pages/client/ClientActiveWork.jsx` | client | Placeholder | Uses `ClientPagePlaceholder` |
| `/client/settings` | client | `ClientSettings` — `client/src/pages/client/ClientSettings.jsx` | client | Placeholder | Uses `ClientPagePlaceholder` |

## Shared and Provider Dashboard Routes

Layout and base guard for every row: `DashboardLayout` inside `AuthHydration` → `ProtectedRoute` → `EmailVerifiedRoute`. Child role guards are listed separately.

| Path | Type | Component/file | Child role requirement | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `/dashboard` | dashboard/provider | `Dashboard` — `client/src/pages/Dashboard.jsx` | None | Active | Role-sensitive dashboard content |
| `/dashboard/client` | client/legacy | `Dashboard` | client | Compatibility | Legacy client dashboard |
| `/dashboard/provider` | provider/legacy | `Dashboard` | provider | Compatibility | Provider dashboard alias |
| `/dashboard/support` | dashboard | `SupportDashboard` | support | Active | Support role exists in role constants |
| `/dashboard/workspace` | client/legacy | `ClientWorkspace` | client | Compatibility | Separate from `/client` shell |
| `/account` | shared | `Account` | None | Active | Missing metadata |
| `/connections` | shared | `Connections` | None | Active | Missing metadata |
| `/leads` | shared | `LeadManagement` | None | Active | Missing metadata |
| `/messages` | shared | `Messages` | None | Active | Metadata present |
| `/network` | shared | `Network` | None | Active | Missing metadata |
| `/notifications` | shared | `Notifications` | None | Active | Metadata present |
| `/dashboard/challenges` | provider/client | `DashboardChallenges` | client or provider | Active | Same path also used by provider navigation; metadata describes provider intent |
| `/dashboard/challenges/new` | client | `ChallengeBuilder` | client | Active | Missing metadata |
| `/dashboard/challenges/:challengeId/edit` | client/dynamic | `ChallengeBuilder` | client | Active | Missing metadata |
| `/dashboard/challenges/:challengeId/providers/shortlisted` | client/dynamic | `RecommendedProviders` | client | Active | Missing metadata |
| `/dashboard/challenges/:challengeId/providers` | client/dynamic | `RecommendedProviders` | client | Active | Metadata present |
| `/dashboard/challenges/:challengeId/provider-selection` | client/dynamic | `RecommendedProviders` | client | Active | Missing metadata |
| `/dashboard/challenges/:challengeId/recommended-providers` | client/legacy | `RecommendedProviders` | client | Compatibility | Missing metadata |
| `/dashboard/challenges/:challengeId/plans` | client/dynamic | `ChallengePlans` | client | Active | Metadata present |
| `/dashboard/challenges/:challengeId/plans/:planId` | client/dynamic | `ClientExecutionPlanDetail` | client | Active | Missing metadata |
| `/dashboard/challenges/:challengeId` | client/dynamic | `ChallengeDetail` | client | Active | Metadata present |
| `/dashboard/saved-providers` | client | `SavedProviders` | client | Active | Missing metadata |
| `/dashboard/matches/saved` | provider | `MatchedChallenges` | provider | Active | Missing metadata |
| `/dashboard/matches/applied` | provider | `MatchedChallenges` | provider | Active | Missing metadata |
| `/dashboard/matches` | provider | `MatchedChallenges` | provider | Active | Metadata present |
| `/dashboard/profile` | provider | `ProfileHubPage` | provider | Active | Enhanced profile route |
| `/dashboard/profile/onboarding` | provider | `ProfileOnboardingPage` | provider | Active | Profile onboarding |
| `/dashboard/profile/onboarding/:stepSegment` | provider/dynamic | `ProfileOnboardingStepPage` | provider | Active | Dynamic onboarding step |
| `/dashboard/first-client` | provider | `FirstClientMode` | provider | Active | Metadata present |
| `/dashboard/starter-challenges` | provider | `StarterChallenges` | provider | Active | Missing metadata |
| `/dashboard/opportunities` | provider | `OpportunityPipeline` | provider | Active | Metadata present |
| `/dashboard/opportunities/:opportunityId` | provider/dynamic | `OpportunityPipeline` | provider | Active | Same component handles list/detail; missing metadata |
| `/dashboard/proof-readiness` | provider | `ProofVault` | provider | Active | Opens readiness tab; missing metadata |
| `/dashboard/proof-vault` | provider | `ProofVault` | provider | Active | Metadata present |
| `/dashboard/proof-vault/:assetId` | provider/dynamic | `ProofAssetDetail` | provider | Active | Metadata present |
| `/dashboard/plans` | provider | `ExecutionPlans` | provider | Active | Metadata present |
| `/dashboard/plans/new` | provider | `ExecutionPlanBuilder` | provider | Active | Missing metadata |
| `/dashboard/plans/:planId/edit` | provider/dynamic | `ExecutionPlanBuilder` | provider | Active | Missing metadata |
| `/dashboard/plans/:planId` | provider/dynamic | `ExecutionPlanDetail` | provider | Active | Metadata present |
| `/dashboard/offers` | provider | `OutcomeOffers` | provider | Active | Metadata present |
| `/dashboard/offers/new` | provider | `OutcomeOfferBuilder` | provider | Active | Missing metadata |
| `/dashboard/offers/:offerId/edit` | provider/dynamic | `OutcomeOfferBuilder` | provider | Active | Missing metadata |
| `/dashboard/offers/:offerId` | provider/dynamic | `OutcomeOfferDetail` | provider | Active | Metadata present |
| `/payments` | shared | `Payments` | None | Active/unknown | Protected but no route metadata; business ownership unclear |
| `/profile` | shared | `Profile` | None | Active | Protected legacy/shared profile route |
| `/projects` | shared | `Projects` | None | Active | Missing metadata |
| `/proof` | shared | `ProofWorkspace` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Shared `ModulePlaceholder` |
| `/provider-services` | provider/shared | `ProviderServices` | None | Active | No explicit provider child guard; missing metadata |
| `/saved` | shared | `Saved` | None | Active | Metadata present |
| `/scraper` | shared | `Scraper` | None | Active | Missing metadata |
| `/settings` | shared | `Settings` | None | Active | Metadata present |
| `/dashboard/settings` | provider | `ProviderSettingsPlaceholder` | provider | Placeholder | Uses `DashboardPagePlaceholder` |
| `/billing` | shared | `Billing` — `client/src/pages/RouteShells.jsx` | None | Placeholder | Shared `ModulePlaceholder` |

## Admin Routes

Layout and guard for every row: `AdminLayout` inside `AuthHydration` → `RoleRoute([admin])` → `EmailVerifiedRoute`.

| Path | Type | Component/file | Role | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `/admin` | admin | `AdminDashboard` — `client/src/pages/AdminDashboard.jsx` | admin | Active | Operations overview |
| `/admin/users` | admin | `AdminUsers` — `client/src/pages/AdminUsers.jsx` | admin | Active | Resource page |
| `/admin/providers` | admin | `AdminProviders` — `client/src/pages/AdminProviders.jsx` | admin | Active | Resource page |
| `/admin/challenges` | admin | `AdminChallenges` — `client/src/pages/AdminChallenges.jsx` | admin | Active | Resource page |
| `/admin/offers` | admin | `AdminOffers` — `client/src/pages/AdminOffers.jsx` | admin | Active | Resource page |
| `/admin/proof-assets` | admin | `AdminProofAssets` — `client/src/pages/AdminProofAssets.jsx` | admin | Active | Resource page |
| `/admin/proofs` | admin | `AdminProofReview` — `client/src/pages/RouteShells.jsx` | admin | Placeholder | Shared placeholder |
| `/admin/proof-review` | admin/alias | `AdminProofReview` — `client/src/pages/RouteShells.jsx` | admin | Placeholder/duplicate candidate | Missing metadata |
| `/admin/reports` | admin | `AdminReports` — `client/src/pages/AdminReports.jsx` | admin | Active | Uses overview data |
| `/admin/verification` | admin | `AdminVerification` — `client/src/pages/AdminVerification.jsx` | admin | Active | Verification overview |
| `/admin/disputes` | admin | `AdminDisputes` — `client/src/pages/RouteShells.jsx` | admin | Placeholder | No backend admin disputes endpoint found |
| `/admin/settings` | admin | `AdminSettings` — `client/src/pages/RouteShells.jsx` | admin | Placeholder | No backend admin settings endpoint found |

## Metadata Coverage

`client/src/config/routeMetadata.js` contains 73 unique route metadata records. The following 34 active named route patterns are registered in `AppRoutes.jsx` but have no metadata record:

`/403`, `/account`, `/admin/proof-review`, `/connections`, `/dashboard/challenges/:challengeId/edit`, `/dashboard/challenges/:challengeId/plans/:planId`, `/dashboard/challenges/:challengeId/provider-selection`, `/dashboard/challenges/:challengeId/providers/shortlisted`, `/dashboard/challenges/:challengeId/recommended-providers`, `/dashboard/challenges/new`, `/dashboard/matches/applied`, `/dashboard/matches/saved`, `/dashboard/offers/:offerId/edit`, `/dashboard/offers/new`, `/dashboard/opportunities/:opportunityId`, `/dashboard/plans/:planId/edit`, `/dashboard/plans/new`, `/dashboard/proof-readiness`, `/dashboard/saved-providers`, `/dashboard/starter-challenges`, `/leads`, `/marketplace`, `/marketplace/category/:categorySlug`, `/marketplace/service/:serviceId`, `/network`, `/offers/:username/:slug`, `/payments`, `/portfolio`, `/projects`, `/provider-services`, `/providers/compare`, `/scraper`, `/services`, `/u/:username`.

## Route-Level Findings

1. The active route tree is centralized, but metadata coverage is incomplete.
2. `routes.js` exposes nested route groups and flattened aliases for compatibility; consumers can import the same path through multiple constant names.
3. `/403` and `/not-authorized` overlap.
4. `/dashboard/client` and `/client` represent two client dashboard generations.
5. `/dashboard/provider` and `/dashboard` overlap for provider entry.
6. `/admin/proofs` and `/admin/proof-review` render the same placeholder.
7. The public legal pages are explicitly non-final placeholders.
8. Several shared dashboard routes have no child role guard even when their names imply provider ownership, notably `/provider-services`.
9. Route ordering correctly places static routes such as `/providers/compare` before `/providers/:username`.
10. The catch-all is last and does not statically conflict with registered dynamic routes.

## Prompt 2 Verification Update

- All 108 route entries were rechecked against `client/src/routes/AppRoutes.jsx`.
- Every non-index, non-catch-all declaration uses the central `ROUTES` or `DYNAMIC_ROUTES` registry through `routeSegment`.
- Guard redirects were verified from `ProtectedRoute`, `PublicOnlyRoute`, `EmailVerifiedRoute`, `RoleRoute`, and `AuthHydration`.
- Page-file ownership and layout/guard chains are recorded in `STAGE_1_1_ROUTE_DEPENDENCY_MAP.md`.
- The original finding that 34 named route patterns lack metadata remains valid.
