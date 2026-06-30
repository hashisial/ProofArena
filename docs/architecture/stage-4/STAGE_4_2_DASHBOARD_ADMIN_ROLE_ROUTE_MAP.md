# Stage 4.2 Dashboard, Admin, and Role Route Map

Each path below is declared in `client/src/routes/AppRoutes.jsx` and uses `client/src/constants/routes.js`. Navigation sources are the metadata-derived provider/client/admin/dashboard configs unless stated otherwise.

| Map ID | Paths | Page/components | Layout/owner | Auth | Role | Guard | Navigation | Duplicate risk | Unauthorized/broken risk | Human review | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|
| DRM-001 | `/client`, `/client/challenges`, `/client/providers`, `/client/active`, `/client/settings` | ClientOverview/Challenges/Providers/ActiveWork/Settings | ClientLayout; client module/platform shell | yes | client | parent RoleRoute + EmailVerifiedRoute + layout | CLIENT_NAV_LINKS | low | low | no | preserve parent guard |
| DRM-002 | `/dashboard`, `/dashboard/client`, `/dashboard/provider` | Dashboard role dispatch | DashboardLayout; platform dashboard | yes | mixed/client/provider | ProtectedRoute or RoleProtectedRoute | dashboard/provider configs | medium alias risk | medium if role dispatch diverges | yes | verify alias/landing contract |
| DRM-003 | `/dashboard/support` | SupportDashboard | DashboardLayout; platform/support | yes | support | RoleProtectedRoute | limited | low | medium nav discoverability | yes | verify support navigation |
| DRM-004 | `/dashboard/workspace` | ClientWorkspace | DashboardLayout; client workflow | yes | client | RoleRoute | DASHBOARD_NAV_LINKS | low | low | no | preserve |
| DRM-005 | `/account`, `/connections`, `/leads`, `/messages`, `/network`, `/notifications`, `/payments`, `/profile`, `/projects`, `/proof`, `/provider-services`, `/saved`, `/scraper`, `/settings`, `/billing` | corresponding pages/shells | DashboardLayout; mixed/unknown | yes | not explicit | parent ProtectedRoute + EmailVerifiedRoute; metadata where available | mixed dashboard/hardcoded | high | high for role-sensitive paths | yes | classify intended roles before edits |
| DRM-006 | `/dashboard/challenges`, `/dashboard/challenges/new`, `/:challengeId`, edit, providers, shortlisted, provider-selection, recommended-providers, plans, plan detail | challenge/client workflow pages | DashboardLayout; challenges/client | yes | client or client/provider root | RoleRoute | provider/dashboard plus hardcoded consumers | medium legacy overlap | low guard, medium link drift | yes for legacy paths | verify every dynamic builder |
| DRM-007 | `/dashboard/saved-providers` | SavedProviders | DashboardLayout; client/matching | yes | client | RoleRoute | direct consumers | low | medium nav coverage | yes | verify source nav |
| DRM-008 | `/dashboard/matches`, `/dashboard/matches/saved`, `/dashboard/matches/applied` | MatchedChallenges | DashboardLayout; matching/provider | yes | provider | RoleRoute | dashboard/provider | medium variants | low | no | retain variants; document tabs |
| DRM-009 | `/dashboard/profile`, `/dashboard/profile/onboarding`, `/dashboard/profile/onboarding/:stepSegment` | provider profile/onboarding | DashboardLayout; profile/provider | yes | provider | RoleRoute | provider nav + builders | medium alias/dynamic | medium hardcoded builder | yes | verify builder/step validation |
| DRM-010 | `/dashboard/first-client`, `/dashboard/starter-challenges` | FirstClientMode/StarterChallenges | DashboardLayout; provider | yes | provider | RoleRoute | dashboard nav for first-client only | low | medium missing metadata/nav for starter | yes | classify starter route |
| DRM-011 | `/dashboard/opportunities`, `/dashboard/opportunities/:opportunityId` | OpportunityPipeline | DashboardLayout; matching/provider | yes | provider | RoleRoute | provider nav + builder | low | medium metadata gap for detail | no | add metadata only after plan |
| DRM-012 | `/dashboard/proof-readiness`, `/dashboard/proof-vault`, `/dashboard/proof-vault/:assetId` | ProofVault/ProofAssetDetail | DashboardLayout; proof/provider | yes | provider | RoleRoute | provider/dashboard | medium related routes | medium metadata gap readiness | yes | verify intended canonical entry |
| DRM-013 | `/dashboard/plans`, `/dashboard/plans/new`, `/dashboard/plans/:planId`, edit | execution plan pages | DashboardLayout; plans/provider | yes | provider | RoleRoute | dashboard + builders | low | medium metadata gaps new/edit | no | verify builders |
| DRM-014 | `/dashboard/offers`, `/dashboard/offers/new`, `/dashboard/offers/:offerId`, edit | offer pages | DashboardLayout; offers/provider | yes | provider | RoleRoute | provider/dashboard + builders | low | medium metadata gaps new/edit | no | verify builders |
| DRM-015 | `/dashboard/settings` | ProviderSettingsPlaceholder | DashboardLayout; provider/platform | yes | provider | RoleRoute | provider nav | medium overlap with `/settings` | medium ambiguity | yes | document provider vs generic settings |
| DRM-016 | `/admin`, users, providers, challenges, offers, proof-assets, proofs, proof-review, reports, verification, disputes, settings | admin pages/shells | AdminLayout; platform admin | yes | admin | parent RoleRoute + EmailVerifiedRoute + layout | ADMIN_NAV_LINKS subset | medium nav omissions/aliases | low guard, medium coverage | yes | verify intentional nav omissions and proof aliases |

## Protection Conclusions

- No admin route without an admin parent guard was found.
- No `/client/*` route without a client parent guard was found.
- Provider workflow routes under `/dashboard/*` are explicitly role-wrapped except the mixed/authenticated set in `DRM-005`.
- The dashboard shell is shared; no separate ProofArena dashboard route stack exists.
- `DRM-005` blocks role-protection changes until intended access is confirmed.

