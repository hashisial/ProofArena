# Stage 4.1 Route Declaration Inventory

## Runtime Declaration Owners

- Router mount: `client/src/main.jsx` (`BrowserRouter`).
- Sole React route tree found: `client/src/routes/AppRoutes.jsx` (`Routes` plus nested `Route` elements).
- No second `Routes`, `createBrowserRouter`, `RouterProvider`, or separate ProofArena router was found under `client/src`.
- Server Express route registries in `server/src/routes/index.js` and `server/src/routes/v1/index.js` are API routing, not browser routing, and must not be merged with frontend route constants.

## Common Fields

For `RD-001` through `RD-107`, file path is `client/src/routes/AppRoutes.jsx`, route paths come from `client/src/constants/routes.js`, `uses route constant = yes`, `hardcoded path = no`, duplicate declaration risk is low, and confidence is high. `RD-001` is the index route using `/`; `RD-108` is the intentional hardcoded wildcard. Layout parent protection is listed in the guard column.

| ID | Line | Path | Component/page | Type | Layout | Guard/protection | Role | Notes |
|---|---:|---|---|---|---|---|---|---|
| RD-001 | 138 | `/` | Home | public | PublicLayout | none | none | index route |
| RD-002 | 139 | `/about` | About | public | PublicLayout | none | none | route shell |
| RD-003 | 140 | `/how-it-works` | HowItWorks | public | PublicLayout | none | none | route shell |
| RD-004 | 141 | `/challenges` | Challenges | public | PublicLayout | none | none | public discovery |
| RD-005 | 142 | `/challenges/:username/:slug` | PublicChallenge | public/dynamic | PublicLayout | none | none | dynamic detail |
| RD-006 | 143 | `/providers` | Providers | public | PublicLayout | none | none | public discovery |
| RD-007 | 144 | `/providers/compare` | ProviderCompare | public | PublicLayout | none | none | metadata missing |
| RD-008 | 145 | `/providers/:username` | ProviderProfileRoute | public/dynamic | PublicLayout | none | none | compatibility profile |
| RD-009 | 146 | `/proof-ledger` | ProofLedger | public | PublicLayout | none | none | route shell |
| RD-010 | 147 | `/leaderboard` | Leaderboard | public | PublicLayout | none | none | route shell |
| RD-011 | 148 | `/offers/:username/:slug` | PublicOutcomeOffer | public/dynamic | PublicLayout | none | none | metadata missing |
| RD-012 | 149 | `/blog` | Blog | public | PublicLayout | none | none | route shell |
| RD-013 | 150 | `/contact` | ContactPlaceholder | public | PublicLayout | none | none | placeholder shell |
| RD-014 | 151 | `/resources` | Resources | public | PublicLayout | none | none | route shell |
| RD-015 | 152 | `/case-studies` | CaseStudies | public | PublicLayout | none | none | route shell |
| RD-016 | 153 | `/help` | HelpCenter | public | PublicLayout | none | none | route shell |
| RD-017 | 154 | `/pricing` | Pricing | public | PublicLayout | none | none | route shell |
| RD-018 | 155 | `/privacy` | PrivacyPolicy | public | PublicLayout | none | none | route shell |
| RD-019 | 156 | `/terms` | TermsOfService | public | PublicLayout | none | none | route shell |
| RD-020 | 157 | `/trust-safety` | TrustSafety | public | PublicLayout | none | none | route shell |
| RD-021 | 158 | `/profile/:username` | PublicProfileRoute | public/dynamic | PublicLayout | none | none | canonical public profile |
| RD-022 | 159 | `/u/:username` | PublicProfileRoute | public/dynamic | PublicLayout | none | none | legacy; metadata missing |
| RD-023 | 160 | `/marketplace` | Marketplace | public | PublicLayout | none | none | metadata missing |
| RD-024 | 161 | `/marketplace/category/:categorySlug` | MarketplaceCategoryRoute | public/dynamic | PublicLayout | none | none | metadata missing |
| RD-025 | 162 | `/marketplace/service/:serviceId` | ServiceDetailRoute | public/dynamic | PublicLayout | none | none | metadata/ID semantics need review |
| RD-026 | 163 | `/portfolio` | Portfolio | public | PublicLayout | none | none | metadata missing |
| RD-027 | 164 | `/services` | Services | public | PublicLayout | none | none | metadata missing |
| RD-028 | 165 | `/403` | Forbidden | public/system | PublicLayout | none | none | legacy system alias |
| RD-029 | 166 | `/not-authorized` | NotAuthorized | public/system | PublicLayout | none | none | explicit unauthorized page |
| RD-030 | 167 | `/not-found` | NotFound | public/system | PublicLayout | none | none | explicit 404 page |
| RD-031 | 168 | `/500` | ServerError | public/system | PublicLayout | none | none | server-error page |
| RD-032 | 174 | `/login` | Login | auth | AuthLayout | PublicOnlyRoute | guest | redirects authenticated users |
| RD-033 | 178 | `/register` | Register | auth | AuthLayout | PublicOnlyRoute | guest | redirects authenticated users |
| RD-034 | 180 | `/forgot-password` | ForgotPassword | auth | AuthLayout | component redirect | guest | no route wrapper |
| RD-035 | 181 | `/reset-password` | ResetPassword | auth | AuthLayout | component redirect | guest | no route wrapper |
| RD-036 | 182 | `/verify-email` | VerifyEmail | auth | AuthLayout | none | unknown | verify workflow |
| RD-037 | 183 | `/resend-verification` | ResendVerification | auth | AuthLayout | none | unknown | compatibility workflow |
| RD-038 | 197 | `/client` | ClientOverview | client | ClientLayout | AuthHydration + RoleRoute + EmailVerifiedRoute | client | parent protected |
| RD-039 | 198 | `/client/challenges` | ClientChallenges | client | ClientLayout | same parent | client | protected |
| RD-040 | 199 | `/client/providers` | ClientProviders | client | ClientLayout | same parent | client | protected |
| RD-041 | 200 | `/client/active` | ClientActiveWork | client | ClientLayout | same parent | client | protected |
| RD-042 | 201 | `/client/settings` | ClientSettings | client | ClientLayout | same parent | client | protected |
| RD-043 | 215 | `/dashboard` | Dashboard | dashboard | DashboardLayout | ProtectedRoute + EmailVerifiedRoute + component role dispatch | authenticated | root role behavior |
| RD-044 | 218 | `/dashboard/client` | Dashboard | role-specific | DashboardLayout | RoleProtectedRoute | client | legacy client dashboard |
| RD-045 | 222 | `/dashboard/provider` | Dashboard | role-specific | DashboardLayout | RoleProtectedRoute | provider | provider dashboard alias |
| RD-046 | 226 | `/dashboard/support` | SupportDashboard | role-specific | DashboardLayout | RoleProtectedRoute | support | protected |
| RD-047 | 230 | `/dashboard/workspace` | ClientWorkspace | role-specific | DashboardLayout | RoleRoute | client | protected |
| RD-048 | 232 | `/account` | Account | dashboard | DashboardLayout | parent auth/email only | any authenticated | metadata missing |
| RD-049 | 233 | `/connections` | Connections | dashboard | DashboardLayout | parent auth/email only | any authenticated | metadata missing |
| RD-050 | 234 | `/leads` | LeadManagement | dashboard | DashboardLayout | parent auth/email only | unknown | metadata missing; role intent review |
| RD-051 | 235 | `/messages` | Messages | dashboard | DashboardLayout | parent auth/email + metadata | any authenticated | no explicit role |
| RD-052 | 236 | `/network` | Network | dashboard | DashboardLayout | parent auth/email only | any authenticated | metadata missing |
| RD-053 | 237 | `/notifications` | Notifications | dashboard | DashboardLayout | parent auth/email + metadata | any authenticated | no explicit role |
| RD-054 | 240 | `/dashboard/challenges` | DashboardChallenges | role-specific | DashboardLayout | RoleRoute | client/provider | component role dispatch |
| RD-055 | 244 | `/dashboard/challenges/new` | ChallengeBuilder | client | DashboardLayout | RoleRoute | client | metadata missing |
| RD-056 | 248 | `/dashboard/challenges/:challengeId/edit` | ChallengeBuilder | client/dynamic | DashboardLayout | RoleRoute | client | metadata missing |
| RD-057 | 252 | `/dashboard/challenges/:challengeId/providers/shortlisted` | RecommendedProviders | client/dynamic | DashboardLayout | RoleRoute | client | metadata missing |
| RD-058 | 256 | `/dashboard/challenges/:challengeId/providers` | RecommendedProviders | client/dynamic | DashboardLayout | RoleRoute | client | protected |
| RD-059 | 260 | `/dashboard/challenges/:challengeId/provider-selection` | RecommendedProviders | client/dynamic | DashboardLayout | RoleRoute | client | metadata missing |
| RD-060 | 264 | `/dashboard/challenges/:challengeId/recommended-providers` | RecommendedProviders | client/dynamic | DashboardLayout | RoleRoute | client | legacy; metadata missing |
| RD-061 | 268 | `/dashboard/challenges/:challengeId/plans` | ChallengePlans | client/dynamic | DashboardLayout | RoleRoute | client | protected |
| RD-062 | 272 | `/dashboard/challenges/:challengeId/plans/:planId` | ClientExecutionPlanDetail | client/dynamic | DashboardLayout | RoleRoute | client | metadata missing |
| RD-063 | 276 | `/dashboard/challenges/:challengeId` | ChallengeDetail | client/dynamic | DashboardLayout | RoleRoute | client | protected |
| RD-064 | 280 | `/dashboard/saved-providers` | SavedProviders | client | DashboardLayout | RoleRoute | client | metadata missing |
| RD-065 | 284 | `/dashboard/matches/saved` | MatchedChallenges | provider | DashboardLayout | RoleRoute | provider | metadata missing |
| RD-066 | 288 | `/dashboard/matches/applied` | MatchedChallenges | provider | DashboardLayout | RoleRoute | provider | metadata missing |
| RD-067 | 292 | `/dashboard/matches` | MatchedChallenges | provider | DashboardLayout | RoleRoute | provider | protected |
| RD-068 | 296 | `/dashboard/profile` | ProfileHubPage | provider | DashboardLayout | RoleRoute | provider | protected |
| RD-069 | 300 | `/dashboard/profile/onboarding` | ProfileOnboardingPage | provider | DashboardLayout | RoleRoute | provider | protected |
| RD-070 | 304 | `/dashboard/profile/onboarding/:stepSegment` | ProfileOnboardingStepPage | provider/dynamic | DashboardLayout | RoleRoute | provider | alias constant |
| RD-071 | 308 | `/dashboard/first-client` | FirstClientMode | provider | DashboardLayout | RoleRoute | provider | protected |
| RD-072 | 312 | `/dashboard/starter-challenges` | StarterChallenges | provider | DashboardLayout | RoleRoute | provider | metadata missing |
| RD-073 | 316 | `/dashboard/opportunities` | OpportunityPipeline | provider | DashboardLayout | RoleRoute | provider | protected |
| RD-074 | 320 | `/dashboard/opportunities/:opportunityId` | OpportunityPipeline | provider/dynamic | DashboardLayout | RoleRoute | provider | metadata missing |
| RD-075 | 324 | `/dashboard/proof-readiness` | ProofVault | provider | DashboardLayout | RoleRoute | provider | metadata missing |
| RD-076 | 328 | `/dashboard/proof-vault` | ProofVault | provider | DashboardLayout | RoleRoute | provider | protected |
| RD-077 | 332 | `/dashboard/proof-vault/:assetId` | ProofAssetDetail | provider/dynamic | DashboardLayout | RoleRoute | provider | protected |
| RD-078 | 336 | `/dashboard/plans` | ExecutionPlans | provider | DashboardLayout | RoleRoute | provider | protected |
| RD-079 | 340 | `/dashboard/plans/new` | ExecutionPlanBuilder | provider | DashboardLayout | RoleRoute | provider | metadata missing |
| RD-080 | 344 | `/dashboard/plans/:planId/edit` | ExecutionPlanBuilder | provider/dynamic | DashboardLayout | RoleRoute | provider | metadata missing |
| RD-081 | 348 | `/dashboard/plans/:planId` | ExecutionPlanDetail | provider/dynamic | DashboardLayout | RoleRoute | provider | protected |
| RD-082 | 352 | `/dashboard/offers` | OutcomeOffers | provider | DashboardLayout | RoleRoute | provider | protected |
| RD-083 | 356 | `/dashboard/offers/new` | OutcomeOfferBuilder | provider | DashboardLayout | RoleRoute | provider | metadata missing |
| RD-084 | 360 | `/dashboard/offers/:offerId/edit` | OutcomeOfferBuilder | provider/dynamic | DashboardLayout | RoleRoute | provider | metadata missing |
| RD-085 | 364 | `/dashboard/offers/:offerId` | OutcomeOfferDetail | provider/dynamic | DashboardLayout | RoleRoute | provider | protected |
| RD-086 | 366 | `/payments` | Payments | dashboard | DashboardLayout | parent auth/email only | unknown | metadata missing; sensitive role review |
| RD-087 | 367 | `/profile` | Profile | dashboard | DashboardLayout | parent auth/email + metadata | any authenticated | owner profile |
| RD-088 | 368 | `/projects` | Projects | dashboard | DashboardLayout | parent auth/email only | unknown | metadata missing |
| RD-089 | 369 | `/proof` | ProofWorkspace | dashboard | DashboardLayout | parent auth/email + metadata | any authenticated | route shell |
| RD-090 | 370 | `/provider-services` | ProviderServices | dashboard | DashboardLayout | parent auth/email only | unknown | metadata missing; likely provider review |
| RD-091 | 371 | `/saved` | Saved | dashboard | DashboardLayout | parent auth/email + metadata | any authenticated | protected |
| RD-092 | 372 | `/scraper` | Scraper | dashboard | DashboardLayout | parent auth/email only | unknown | metadata missing; role review |
| RD-093 | 373 | `/settings` | Settings | dashboard | DashboardLayout | parent auth/email + metadata | any authenticated | protected |
| RD-094 | 376 | `/dashboard/settings` | ProviderSettingsPlaceholder | provider | DashboardLayout | RoleRoute | provider | protected |
| RD-095 | 378 | `/billing` | Billing | dashboard | DashboardLayout | parent auth/email + metadata | any authenticated | route shell |
| RD-096 | 392 | `/admin` | AdminDashboard | admin | AdminLayout | AuthHydration + RoleRoute + EmailVerifiedRoute | admin | parent protected |
| RD-097 | 393 | `/admin/users` | AdminUsers | admin | AdminLayout | same parent | admin | protected |
| RD-098 | 394 | `/admin/providers` | AdminProviders | admin | AdminLayout | same parent | admin | protected |
| RD-099 | 395 | `/admin/challenges` | AdminChallenges | admin | AdminLayout | same parent | admin | protected |
| RD-100 | 396 | `/admin/offers` | AdminOffers | admin | AdminLayout | same parent | admin | protected |
| RD-101 | 397 | `/admin/proof-assets` | AdminProofAssets | admin | AdminLayout | same parent | admin | protected |
| RD-102 | 398 | `/admin/proofs` | AdminProofReview | admin | AdminLayout | same parent | admin | protected |
| RD-103 | 399 | `/admin/proof-review` | AdminProofReview | admin | AdminLayout | same parent | admin | metadata missing; compatibility path |
| RD-104 | 400 | `/admin/reports` | AdminReports | admin | AdminLayout | same parent | admin | protected |
| RD-105 | 401 | `/admin/verification` | AdminVerification | admin | AdminLayout | same parent | admin | protected |
| RD-106 | 402 | `/admin/disputes` | AdminDisputes | admin | AdminLayout | same parent | admin | protected |
| RD-107 | 403 | `/admin/settings` | AdminSettings | admin | AdminLayout | same parent | admin | protected |
| RD-108 | 407 | `*` | NotFound | fallback | PublicLayout | none | none | hardcoded wildcard; no constant expected |

## Result

- Leaf route declarations: 108 (31 public, 6 auth, 5 client, 53 dashboard, 12 admin, 1 wildcard).
- Duplicate declared paths: none.
- Declarations outside `AppRoutes.jsx`: none found for browser routing.
- ProofArena-specific parallel router: none found.
- Metadata gaps: 34 declared non-wildcard routes.
- Production edits: blocked pending Prompt 2 verification.

