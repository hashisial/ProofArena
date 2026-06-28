# Stage 2.2 ProofArena Feature Surface Map

The rows map logical surfaces; a row may represent a domain folder plus its route/page composition. `AppRoutes.jsx`, shared layouts, and `server/src/app.js` remain platform owners.

| ID | Surface | File path(s) | Purpose | Parent ScaleOps dependency | Ownership | Data | Auth/role | Standalone risk |
|---|---|---|---|---|---|---|---|---|
| FS-01 | Public home | `client/src/pages/Home.jsx`; `client/src/sections/home` | Flagship marketplace story and discovery | `PublicLayout`, shared router | ProofArena composition | API/static/mixed | Public | No |
| FS-02 | Marketplace | `client/src/pages/Marketplace.jsx` | Marketplace discovery | Shared router/API client | ProofArena/provider domain | Real API/fallback | Public | Partial |
| FS-03 | Providers | `client/src/pages/Providers.jsx`; `client/src/features/providers` | Provider discovery | Shared routes, API, query client | Providers | Real API | Public | No |
| FS-04 | Provider compare | `client/src/pages/ProviderCompare.jsx`; `client/src/features/providers/ProviderComparisonProvider.jsx` | Compare providers | Shared router/state | Providers | Client state/API | Public | Partial |
| FS-05 | Public provider/profile | `client/src/pages/PublicProfile.jsx`; `client/src/pages/RouteShells.jsx` | Public provider identity | Public layout/profile API | Profile/providers | Real API/route shell | Public | Partial |
| FS-06 | Public challenges | `client/src/pages/Challenges.jsx`; `client/src/pages/PublicChallenge.jsx` | Browse/view challenges | Public layout/routes | Challenges | Real API | Public | No |
| FS-07 | Challenge management | `client/src/pages/ChallengeBuilder.jsx`; `client/src/pages/MyChallenges.jsx`; `client/src/features/challenges` | Create/manage challenges | Dashboard/client layouts, guards, API | Challenges | Real API | Protected/role | No |
| FS-08 | Execution plans | `client/src/pages/ExecutionPlans.jsx`; `client/src/features/executionPlans` | Provider plan workflow | Dashboard layout/guards/API | Execution plans | Real API | Protected/role | No |
| FS-09 | Client plan review | `client/src/pages/ClientExecutionPlanDetail.jsx`; `client/src/pages/ChallengePlans.jsx` | Review plans for a challenge | Client layout/role guard/API | Execution plans | Real API | Client | No |
| FS-10 | Outcome offers | `client/src/pages/OutcomeOffers.jsx`; `client/src/features/outcomeOffers` | Outcome offer lifecycle | Shared router/layout/API | Offers | Real API | Mixed | No |
| FS-11 | Opportunities | `client/src/pages/OpportunityPipeline.jsx`; `client/src/features/opportunities` | Provider opportunity pipeline | Dashboard shell/API | Opportunities | Real API | Provider | No |
| FS-12 | Matching | `client/src/pages/MatchedChallenges.jsx`; `client/src/features/matches` | Client/provider matching | Shared API/guards | Matching | Real API | Protected/role | No |
| FS-13 | Proof Vault | `client/src/pages/ProofVault.jsx`; `client/src/features/proofAssets` | Proof asset management | Dashboard/API/uploads/auth | Proof | Real API | Protected | No |
| FS-14 | Proof detail | `client/src/pages/ProofAssetDetail.jsx` | View one proof asset | Router/API/auth | Proof | Real API | Protected | No |
| FS-15 | Public proof ledger | `client/src/pages/RouteShells.jsx` | Public proof trust surface | Public layout | Proof | Placeholder/unknown | Public | Partial |
| FS-16 | Leaderboard | `client/src/pages/RouteShells.jsx`; `client/src/sections/home/LeaderboardPreview.jsx` | Public ranking surface | Public layout | ProofArena composition | Static/placeholder | Public | Partial |
| FS-17 | First-client mode | `client/src/pages/FirstClientMode.jsx`; `client/src/features/firstClient` | Provider onboarding workflow | Dashboard/auth/API | First client | Real API/mixed | Provider | No |
| FS-18 | Starter challenges | `client/src/pages/StarterChallenges.jsx` | First-client discovery | Dashboard/API | First client | Real API | Provider | No |
| FS-19 | Saved providers | `client/src/pages/SavedProviders.jsx`; `client/src/features/savedProviders` | Client shortlist | Client shell/API | Saved providers | Real API | Client | No |
| FS-20 | Client workspace | `client/src/pages/ClientWorkspace.jsx`; `client/src/pages/client` | Client dashboard workflows | `ClientLayout`, role guard | Client workspace | Real API/mixed | Client | No |
| FS-21 | Provider dashboard | `client/src/pages/Dashboard.jsx`; `client/src/pages/DashboardChallenges.jsx` | Provider dashboard workflows | `DashboardLayout`, guards | Dashboard composition | Real API/mixed | Provider | No |
| FS-22 | Admin moderation | `client/src/pages/Admin*.jsx`; `client/src/features/admin` | Moderate users, offers, proof, challenges | `AdminLayout`, admin guard/API | Admin/platform | Real API/partial | Admin | No |
| FS-23 | Messages | `client/src/pages/Messages.jsx` | Marketplace communication | Shared API/socket/auth | Shared platform | Real API | Protected | No |
| FS-24 | Payments | `client/src/pages/Payments.jsx` | Billing/payment surface | Shared billing API/auth | Shared platform | Real API/partial | Protected | No |
| FS-25 | Public marketing resources | `client/src/pages/RouteShells.jsx` | Pricing, trust, resources, case studies | Public layout | Public marketing | Static/placeholder | Public | Partial |
| FS-26 | Public navigation | `client/src/config/navigation/publicNavigation.js` | Shared product navigation | Public layout/router | ScaleOps platform | Static config | Public | No |
| FS-27 | Route constants | `client/src/constants/index.js` | Canonical UI paths and role routes | Router/navigation | ScaleOps platform | Static config | Shared | No |
| FS-28 | API endpoint constants | `client/src/constants/apiEndpoints.js` | Shared endpoint catalog | API client/services | ScaleOps platform | Static config | Shared | No |
| FS-29 | Module identity hook | `client/src/modules/proofarena/hooks/useProofArenaModule.js` | Module metadata and role preference | Shared Zustand store | ProofArena orchestration | Local state | Shared | No |
| FS-30 | Challenge API | `server/src/routes/v1/challenge.routes.js`; controller/service/model/validator peers | Challenge contract | Express app, auth, errors, DB | Challenges | MongoDB | Mixed | No |
| FS-31 | Plan API | `server/src/routes/v1/executionPlan.routes.js`; peers | Execution-plan contract | Express/auth/DB | Execution plans | MongoDB | Protected/role | No |
| FS-32 | Matching API | `server/src/routes/v1/match.routes.js`; peers | Matching contract | Express/auth/DB | Matching | MongoDB | Protected/role | No |
| FS-33 | Offer API | `server/src/routes/v1/outcomeOffer.routes.js`; peers | Offer contract | Express/auth/DB | Offers | MongoDB | Mixed | No |
| FS-34 | Proof API | `server/src/routes/v1/proofAsset.routes.js`; peers | Proof asset contract | Express/auth/storage/DB | Proof | MongoDB/storage | Protected | No |
| FS-35 | Provider APIs | `server/src/routes/providerRoutes.js`; provider services/models | Provider discovery and profile | Express/auth/DB | Providers/profile | MongoDB | Mixed | No |
| FS-36 | Opportunity API | `server/src/routes/v1/opportunityPipeline.routes.js`; peers | Opportunity pipeline | Express/auth/DB | Opportunities | MongoDB | Provider | No |
| FS-37 | Saved-provider API | `server/src/routes/v1/savedProvider.routes.js`; peers | Saved provider workflow | Express/auth/DB | Saved providers | MongoDB | Client | No |
| FS-38 | First-client API | `server/src/routes/v1/firstClient.routes.js`; peers | First-client workflow | Express/auth/DB | First client | MongoDB | Provider | No |
| FS-39 | Backend module boundary | `server/src/modules/proofarena/README.md` | Future cross-domain composition contract | Existing Express layers | ProofArena orchestration | None | N/A | No |
| FS-40 | Placeholder/fallback data | `client/src/pages/RouteShells.jsx`; `client/src/utils/constants.js` | Incomplete routes and resilient public data | Shared UI/API | Mixed | Static/fallback | Mixed | Partial |

## Mapping Limit

This is an architecture surface map, not a claim that each surface is production-complete. Prompt 5 must trace runtime dependencies and classify the partial rows.

