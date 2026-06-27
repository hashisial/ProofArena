# Stage 1.1 Architecture Risk Map

Generated: 2026-06-27T11:17:05.9368044+05:00

This file records discovered risks only. It does not prescribe or implement fixes.

## Risk Register

| ID | Severity | Risk | Evidence | Potential impact |
| --- | --- | --- | --- | --- |
| R-01 | High | Dual API version mounts create a very large alias surface | `server/src/routes/index.js`, `server/src/routes/v1/index.js`; 233 operations mounted under both `/api` and `/api/v1` | Contract drift, duplicate documentation, inconsistent middleware/version behavior, difficult deprecation |
| R-02 | High | Active frontend routes exceed route metadata coverage | 108 router entries; 73 metadata records; 34 named patterns missing metadata | Broken/partial breadcrumbs, labels, access checks, navigation analytics, or fallback classification |
| R-03 | High | Multiple frontend API abstraction layers coexist | `client/src/services/apiClient.js`, `client/src/services/api.js`, 14 feature services, endpoint constants, feature v1 prefix utilities | Divergent endpoints, error handling, auth behavior, response mapping, and fallback behavior |
| R-04 | High | Three backend auth service/controller generations coexist | `server/src/services/auth.service.js`, `authService.js`, `modules/auth/auth.service.js`; duplicate `auth.controller.js`/`authController.js` | Security-sensitive logic may be changed in the wrong layer or behave differently by caller |
| R-05 | High | Duplicate model concepts and compatibility files obscure canonical ownership | `Challenge.model.js` vs `OutcomeChallenge.model.js`; `Settings.js` vs `UserSettings.js`; `SavedItem.js` vs `SavedProvider.model.js`; model aliases | Data divergence, incorrect collection use, migration ambiguity |
| R-06 | High | Profile domain is concentrated and duplicated across several layers | `UserProfile.js` (1,054 lines), `ProviderProfile.js`, `userProfileService.js` (3,000+ lines), `profile.service.js`, `profileController.js`, `profile.controller.js` | High regression blast radius for Stage 4 profile work |
| R-07 | High | Frontend API constants advertise backend endpoints that do not exist | `/applications`, `/milestones`, `/proofs`, `/proof-ledger`, `/leaderboard`, several `/admin/*` constants | Runtime 404s if future/placeholder UI begins calling these contracts |
| R-08 | High | No maintained automated test suite was found | No application test directories or test scripts in client/server packages | Route, auth, API, model, and layout regressions have no automated safety net |
| R-09 | High | Shared dashboard routes have inconsistent role specificity | `/provider-services`, `/payments`, `/projects`, `/scraper`, and other shared routes inherit auth/email verification but no child role guard | Wrong-role UI exposure or unclear product ownership |
| R-10 | High | Security/error/middleware compatibility generations coexist | `auth.middleware.js`/`authMiddleware.js`, `role.middleware.js`/`roleMiddleware.js`, `error.middleware.js`/`errorMiddleware.js`, rate-limit/sanitize/validate pairs | Inconsistent protection or error behavior depending on imported filename |
| R-11 | High | Legacy API facade can substitute fallback business data on failures | `client/src/services/api.js`, `client/src/utils/constants.js` | Production failures may appear as valid-looking fallback content; observability and contract errors can be hidden |
| R-12 | High | ProviderProfile references an undiscovered model | `server/src/models/ProviderProfile.js` contains ref `"VerifiedOutcome"`; no corresponding model file found | Populate/runtime failures or stale schema relationship |
| R-13 | High | `OutcomeChallenge` appears unowned/unused | `server/src/models/OutcomeChallenge.model.js` has no discovered controller/service import | Dead collection or parallel challenge data model |
| R-14 | High | Legal pages are explicit product placeholders | `client/src/pages/RouteShells.jsx` privacy and terms copy says review is required before production | Compliance and launch-readiness risk |
| R-15 | Medium | Duplicate/legacy layout systems coexist | `client/src/layouts/*`, top-level `components/Layout.jsx`, `components/SaaSLayout.jsx`, `RootLayout.jsx`, `WorkspaceLayout.jsx` | New pages may select the wrong shell or bypass current navigation/access behavior |
| R-16 | Medium | Duplicate UI/state component names exist in different folders | Top-level vs `components/ui` Button/Container; `common` vs `states` ModulePlaceholder; multiple PageHeader/Breadcrumb/BackButton/Empty/Error/Loading files | Visual, accessibility, and behavior inconsistency; wrong imports |
| R-17 | Medium | Route constants contain nested groups plus flattened compatibility aliases | `client/src/constants/routes.js` | Multiple constant names can refer to the same path; ownership is less obvious |
| R-18 | Medium | Multiple client dashboard generations coexist | `/client`, `/dashboard/client`, `/dashboard/workspace` | Navigation/fallback ambiguity and duplicated buyer experience |
| R-19 | Medium | Multiple provider dashboard entry patterns coexist | `/dashboard`, `/dashboard/provider`, provider child routes | Dashboard entry and role routing ambiguity |
| R-20 | Medium | Duplicate not-authorized routes coexist | `/403` and `/not-authorized` | Inconsistent system-page behavior and analytics |
| R-21 | Medium | Duplicate proof-review admin routes render the same placeholder | `/admin/proofs`, `/admin/proof-review` | Ambiguous canonical route and future backend contract |
| R-22 | Medium | Large services combine multiple responsibilities | `providerSearchService.js`, `serviceService.js`, `match.service.js`, `executionPlan.service.js`, `userProfileService.js` | High coupling and difficult isolated testing |
| R-23 | Medium | Messaging has two HTTP route surfaces | `/messages/conversations*` and `/conversations*` | Duplicate client calls and behavioral drift |
| R-24 | Medium | Connection requests have overlapping route forms | POST `/connections`, `/connections/request`, `/connections/request/:userId` | Ambiguous contract and duplicate client behavior |
| R-25 | Medium | Settings are split between two models and multiple frontend routes | `Settings.js`, `UserSettings.js`, `/settings`, `/dashboard/settings`, `/client/settings`, `/admin/settings` | Ownership and persistence mismatch |
| R-26 | Medium | Some v1 ownership routes authenticate without an explicit domain role | Opportunity, proof-asset, and saved-provider route files | Service-layer ownership becomes the only visible domain boundary |
| R-27 | Medium | Backend response formats are mixed | `server/src/utils/apiResponse.js`; legacy direct controller responses; `client/src/services/apiContracts.js` | Frontend mapping complexity and inconsistent error/pagination handling |
| R-28 | Medium | Root contains generated artifacts and logs beside source documentation | `.next`, `.chrome-*`, logs, uploads, responsive shots | Repository navigation noise and accidental reliance on generated state |
| R-29 | Medium | Root `AGENTS.md` mentions Next.js although the active client is Vite | `AGENTS.md`, `client/vite.config.js` | Tooling/agent confusion |
| R-30 | Medium | Environment configuration is split across root, client, server, Vercel, and Netlify files | `.env*`, client/server deployment files | Deployment drift and API/CORS mismatch |
| R-31 | Medium | Public and dashboard placeholder routes are active production routes | `RouteShells.jsx`, client placeholder pages, provider/admin placeholders | Feature completeness may be mistaken from route availability |
| R-32 | Medium | A public static route depends on ordering before a dynamic route | `/providers/compare` before `/providers/:username` | Router reordering could shadow compare as a username |
| R-33 | Medium | Marketplace service parameter vocabulary is inconsistent | Frontend route `:serviceId`; backend supports `:slug`, `:serviceId`, and slug-or-id service lookup | Incorrect links/cache keys or ambiguous identifiers |
| R-34 | Medium | Auth role vocabulary differs slightly between layers | Frontend roles exclude legacy `user`; backend constants include it as an alias; `support` is present but less represented in route metadata | Incorrect normalization or access checks in new code |
| R-35 | Medium | Hardcoded route and API strings remain outside central constants | `client/src/pages/Auth.jsx`, `client/src/pages/Admin.jsx`, `client/src/services/api.js`, feature utility builders | Central route/API changes may not update all callers |
| R-36 | Medium | TODOs remain in security-sensitive auth paths | Auth route/controller TODOs for rate limiting and production email provider | Known security/operational assumptions remain embedded |
| R-37 | Medium | Local database startup can continue without MongoDB in development | `server/src/config/db.js` | Public/fallback behavior can mask backend data unavailability during development |
| R-38 | Medium | File storage has Cloudinary and local upload modes | `uploadMiddleware.js`, `cloudinaryService.js`, `/uploads`, Vercel `/tmp` selection | Environment-dependent URLs, persistence, and cleanup behavior |
| R-39 | Medium | Queue behavior is optional/environment-dependent | BullMQ/Redis services and worker entries | Scraper/outreach operations may be accepted without durable processing |
| R-40 | Medium | Compatibility barrels/re-exports can hide import direction | Route/model/service aliases and `index.js` barrels | Circular imports or edits to non-canonical files |
| R-41 | Low | Client and server each implement slugify | `client/src/utils/slugify.js`, `server/src/utils/slugify.js` | Minor slug divergence |
| R-42 | Low | Public marketing routes use a shared placeholder configuration object | `client/src/pages/RouteShells.jsx` | Copy/status changes have broad shared impact |
| R-43 | Low | No explicit form framework boundary exists | Component-local forms and validators | Validation patterns can diverge |
| R-44 | Low | No separately versioned shared package exists | Client/server duplicate constants/helpers | Cross-application contract types are manually synchronized |

## Top 10 Risks by Release Impact

1. R-01: Dual `/api` and `/api/v1` mounts.
2. R-04: Multiple backend auth generations.
3. R-06: Profile domain concentration and duplication.
4. R-08: No automated test suite.
5. R-03: Multiple frontend API layers.
6. R-02: Incomplete route metadata coverage.
7. R-05: Duplicate model concepts.
8. R-07: Frontend endpoint constants without backend routes.
9. R-09: Inconsistent role specificity on shared routes.
10. R-10: Duplicate security/error middleware generations.

## Prompt 2 Verification Update

- All 44 Prompt 1 risks remain supported by source evidence.
- Eighteen boundary violations were classified: eleven direct page-to-service dependencies and seven systemic contract/ownership gaps.
- No direct frontend/backend source import, raw browser network call outside service files, or backend route-to-model/service import was found.
- The highest-risk verified connections remain dual API mounts, authentication-generation overlap, incomplete route metadata, profile-domain concentration, legacy API fallback data, and duplicate model ownership.
- Detailed boundary evidence is in `STAGE_1_1_BOUNDARY_VIOLATION_REPORT.md`.
