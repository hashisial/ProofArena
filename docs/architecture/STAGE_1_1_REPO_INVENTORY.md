# Stage 1.1 Repository Inventory

Generated: 2026-06-27T11:17:05.9368044+05:00

Project: ScaleOps / ProofArena

Audit mode: read-only architecture inventory. No production code, dependencies, configuration, or runtime behavior were changed.

## Executive Summary

| Area | Finding |
| --- | --- |
| Repository | One Git repository containing separate Vite/React client and Express/Mongoose server applications |
| Frontend route entries | 108 entries in `client/src/routes/AppRoutes.jsx` (107 named/index patterns plus one catch-all) |
| Route metadata | 73 entries in `client/src/config/routeMetadata.js`; 34 active named route patterns have no metadata entry |
| Backend API surface | 537 exposed HTTP method/path variants representing 304 underlying route operations |
| Models | 45 registered Mongoose models in 50 model-layer files |
| Services | 73 service-layer files: 23 frontend and 50 backend |
| Custom hooks | 44 hook files: 29 shared, 13 feature, one layout-shell hook, one ProofArena module hook |
| Frontend source | 571 total files under `client/src`; 558 code files |
| Backend source | 254 total files under `server/src`; 250 code files |
| Tests | No `test`, `tests`, `__tests__`, or equivalent application test directories found |
| Current architecture | ScaleOps is the parent application; ProofArena capabilities are distributed across shared dashboard code, feature folders, and `modules/proofarena` scaffolding |

## Repository Baseline

The audit started from branch `codex/outcome-os-platform-update` at commit `88633fe`. `git status --short --branch` was clean before documentation was added.

The repository root does not contain an application `package.json`. The client and server have independent packages and commands.

## Root Structure

| Path | Purpose | Notes |
| --- | --- | --- |
| `client/` | Vite/React frontend | React 19, React Router 7, TanStack Query, Zustand, Axios, Tailwind CSS 4 |
| `server/` | Express/Mongoose backend | Express 5, Mongoose 9, JWT, Stripe, Nodemailer, Socket.IO, BullMQ |
| `scripts/` | Repository maintenance scripts | Contains `scripts/check-module-boundaries.mjs` |
| `docs/` | Existing product and architecture documentation | Stage 1.1 inventory is stored in `docs/architecture/` |
| `node_modules/` | Root installed dependencies/cache | Generated; not architecture source |
| `.next/`, `client/dist/` | Generated build output | Not source; `.next` appears unrelated to the active Vite client |
| `uploads/`, `server/uploads/`, `server/tmp/` | Local runtime upload/temp storage | Generated or mutable runtime data |
| `.chrome-*`, `responsive-shots/`, `.codex-logs/` | Browser verification and agent artifacts | Generated; ignored by Git |
| `.vercel/`, `client/.vercel/`, `server/.vercel/` | Local Vercel linkage metadata | Deployment metadata, not application source |
| Root `*.md` files | Historical architecture/stage documentation | Includes route, auth, service, state, and layout documents from earlier stages |
| Root/client/server `.env*` | Environment configuration | Files exist; values were not copied into this audit |

## Build and Tooling

### Client

Source: `client/package.json`

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build production Vite bundle |
| `npm run preview` | Preview the production bundle |
| `npm run lint` | Run ESLint |
| `npm run check:boundaries` | Run `scripts/check-module-boundaries.mjs client` |

Important tooling:

- `client/vite.config.js`: Vite setup, aliases `@` and `@proofarena`, default development port 5173.
- `client/eslint.config.js`: frontend lint configuration.
- `client/jsconfig.json`: editor/module resolution.
- `client/vercel.json`, `client/netlify.toml`: deployment routing/configuration.
- `client/src/styles/`, `client/src/styles.css`: global styling and token application.

No client `test` or `typecheck` script was found.

### Server

Source: `server/package.json`

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start server with Nodemon |
| `npm run start` | Start Node server |
| `npm run check:boundaries` | Run `scripts/check-module-boundaries.mjs server` |

Important tooling:

- `server/nodemon.json`: development process configuration.
- `server/vercel.json`, `server/api/index.js`: Vercel serverless entry.
- `server/src/server.js`: long-running Node process entry.

No server lint, test, or typecheck command was found.

## Frontend Architecture Map

### Entry and Providers

| Path | Responsibility |
| --- | --- |
| `client/src/main.jsx` | Creates the React root; installs `QueryClientProvider` and `BrowserRouter` |
| `client/src/App.jsx` | Installs `AuthProvider`, `ToastProvider`, `ProviderComparisonProvider`, route analytics, and `AppRoutes` |
| `client/src/routes/AppRoutes.jsx` | Single active React Router route tree and lazy page imports |
| `client/src/services/queryClient.js` | TanStack Query defaults, retry policy, and shared query client |
| `client/src/features/auth/AuthProvider.jsx` | Auth initialization, refresh, context facade, session synchronization |
| `client/src/store/useAuthStore.js` | Zustand auth state and persisted/session state integration |

### Frontend Folder Inventory

| Path | Files | Purpose |
| --- | ---: | --- |
| `client/src/app/` | 1 | App-level support |
| `client/src/assets/` | 1 | Bundled frontend assets |
| `client/src/components/` | 273 | Shared and feature UI components |
| `client/src/config/` | 12 | Environment, route metadata, navigation, profile configuration |
| `client/src/constants/` | 7 | Routes, API endpoints, statuses, query keys, navigation, design tokens |
| `client/src/errors/` | 4 | Frontend error abstractions/boundaries |
| `client/src/features/` | 47 | Feature services, hooks, utilities, and query logic |
| `client/src/hooks/` | 30 | Shared hook directory, including one barrel |
| `client/src/layouts/` | 9 | Public, auth, provider/shared dashboard, client, and admin layouts |
| `client/src/lib/` | 1 | Library support |
| `client/src/modules/` | 5 | Module scaffolding, including ProofArena |
| `client/src/pages/` | 78 | Route-rendered page components |
| `client/src/routes/` | 7 | Router, guards, hydration, and role protection |
| `client/src/sections/` | 42 | Public/home compositional sections |
| `client/src/services/` | 9 | API client, legacy facade, contracts, errors, sockets, query client, shared helpers |
| `client/src/store/` | 7 | Zustand stores and auth session helpers |
| `client/src/styles/` | 3 | Global/theme style modules |
| `client/src/types/` | 6 | JSDoc/TypeScript-checking shape constants and documentation |
| `client/src/utils/` | 26 | Route, navigation, formatting, storage, validation, and domain helpers |

### Component Areas

| Path | Files | Ownership |
| --- | ---: | --- |
| `client/src/components/admin/` | 8 | Admin shell/resource UI |
| `client/src/components/challenges/` | 15 | Challenge forms, cards, and details |
| `client/src/components/client/` | 5 | Client shell and placeholders |
| `client/src/components/common/` | 5 | Cross-feature placeholder/footer/header support |
| `client/src/components/dashboard/` | 23 | Provider/shared dashboard shell and dashboard content |
| `client/src/components/executionPlans/` | 21 | Execution-plan UI |
| `client/src/components/firstClient/` | 14 | First-client workflow UI |
| `client/src/components/matches/` | 15 | Match and provider recommendation UI |
| `client/src/components/navigation/` | 14 | Breadcrumbs, back button, public nav, universal sidebar |
| `client/src/components/opportunities/` | 10 | Opportunity pipeline UI |
| `client/src/components/outcomeOffers/` | 10 | Outcome-offer UI |
| `client/src/components/profile/` | 29 | Profile and onboarding UI |
| `client/src/components/proof/` | 13 | Proof vault/readiness UI |
| `client/src/components/providers/` | 26 | Provider directory/profile/compare UI |
| `client/src/components/states/` | 8 | Universal loading, empty, error, and placeholder states |
| `client/src/components/system/` | 1 | Shared system state page |
| `client/src/components/ui/` | 26 | Shared UI primitives |
| `client/src/components/workspace/` | 6 | Client/provider workspace widgets |
| `client/src/components/sections/`, `settings/` | 2 | Small section/settings support |

Top-level files also exist directly under `client/src/components/`, including legacy/shared `Button.jsx`, `Container.jsx`, `Footer.jsx`, `Layout.jsx`, and `SaaSLayout.jsx`. These coexist with newer `components/ui`, `components/common`, and `layouts` systems.

### Layouts

| Path | Responsibility | Used by |
| --- | --- | --- |
| `client/src/layouts/PublicLayout.jsx` | Public header/main/footer shell | Public and system routes |
| `client/src/layouts/AuthLayout.jsx` | Authentication shell | Login/register/reset/verification routes |
| `client/src/layouts/DashboardLayout.jsx` | Shared/provider dashboard grid, topbar, collapsible sidebar, mobile drawer | General authenticated and provider routes |
| `client/src/layouts/ClientLayout.jsx` | Client-specific dashboard shell | `/client/*` |
| `client/src/layouts/AdminLayout.jsx` | Admin dashboard shell | `/admin/*` |
| `client/src/layouts/RootLayout.jsx` | Compatibility re-export of `client/src/components/Layout.jsx` | Legacy/unknown |
| `client/src/layouts/WorkspaceLayout.jsx` | Compatibility re-export of `client/src/components/SaaSLayout.jsx` | Legacy/unknown |
| `client/src/layouts/useSidebarShell.js` | Shared dashboard shell state adapter | Dashboard layouts |

### Routing and Guards

| Path | Responsibility |
| --- | --- |
| `client/src/constants/routes.js` | Central route path constants and dynamic route builders |
| `client/src/config/routeMetadata.js` | Route labels, descriptions, groups, roles, breadcrumbs, navigation metadata |
| `client/src/routes/AppRoutes.jsx` | Active route declarations |
| `client/src/routes/AuthHydration.jsx` | Waits for auth initialization before protected route decisions |
| `client/src/routes/ProtectedRoute.jsx` | Requires authenticated user |
| `client/src/routes/RoleRoute.jsx` | Requires allowed normalized role |
| `client/src/routes/EmailVerifiedRoute.jsx` | Requires verified email |
| `client/src/routes/PublicOnlyRoute.jsx` | Prevents authenticated access to public-only auth pages |
| `client/src/utils/accessPolicy.js` | Central frontend access decisions and dashboard fallback |
| `client/src/utils/routeValidation.js` | Known-route and safe-fallback checks |
| `client/src/utils/navigationActive.js` | Active route matching |
| `client/src/utils/navigationFilter.js` | Role/surface/feature visibility filtering |

Current normalized frontend roles are `admin`, `client`, `provider`, and `support`. The backend additionally accepts legacy `"user"` and normalizes it to client behavior.

### State Management

| Path | Responsibility |
| --- | --- |
| `client/src/store/useAuthStore.js` | Auth user, token, role, checking state |
| `client/src/store/authSession.js` | Auth session persistence/events |
| `client/src/store/useNotificationStore.js` | Notification state |
| `client/src/store/useProofArenaStore.js` | ProofArena module state |
| `client/src/store/useSocketStore.js` | Realtime/socket state |
| `client/src/store/useUIStore.js` | Shared UI state |
| `client/src/services/queryClient.js` | Server-state cache |

### Forms and Validation

No single form library abstraction was found. Forms are generally component-local and use:

- Feature utility validators such as `client/src/features/challenges/challengeUtils.js`.
- Shared validators in `client/src/utils/validators.js`.
- Profile onboarding rules in `client/src/config/profile/`.
- Backend Zod and Express validation as the authoritative request validation layer.

## Backend Architecture Map

### Entry and Request Flow

| Path | Responsibility |
| --- | --- |
| `server/src/server.js` | Connects MongoDB, starts workers/socket server, listens, handles shutdown |
| `server/api/index.js` | Vercel serverless handler and database readiness |
| `server/src/app.js` | Express app, security middleware, Stripe raw webhook, static uploads, API mounts, errors |
| `server/src/routes/index.js` | Unversioned `/api` registry |
| `server/src/routes/v1/index.js` | `/api/v1` registry |
| `server/src/config/db.js` | Mongoose connection and ProviderProfile index repair |
| `server/src/config/env.js` | Environment parsing/validation; secret values not included here |

Request order in `server/src/app.js`:

1. Security headers, CORS, rate limiting, body parsers, cookies, compression.
2. Raw-body Stripe webhook at `POST /api/billing/webhook`.
3. Request sanitization.
4. Static `/uploads`.
5. Request logging.
6. API status response at `GET /api`.
7. `/api/v1` router.
8. `/api` router.
9. Not-found handler.
10. Error handler.

### Backend Folder Inventory

| Path | Files | Purpose |
| --- | ---: | --- |
| `server/src/config/` | 5 | Environment, CORS, DB, Cloudinary, env loading |
| `server/src/constants/` | 7 | Roles, statuses, plans, queues, categories, profile constants |
| `server/src/controllers/` | 35 | HTTP request controllers |
| `server/src/errors/` | 5 | App errors, error codes, not-found/error handlers |
| `server/src/jobs/` | 1 | Job registration entry |
| `server/src/middleware/` | 19 | Auth, role, validation, upload, security, rate limit, logging |
| `server/src/models/` | 50 | 45 registered models, aliases, and base schema support |
| `server/src/modules/` | 11 | Auth ownership plus ProofArena/users module scaffolding |
| `server/src/routes/` | 37 | API routers and version registries |
| `server/src/services/` | 49 | Domain and infrastructure services |
| `server/src/socket/` | 4 source-counted area | Socket entry/support; active entry is `server/src/socket/index.js` |
| `server/src/utils/` | 13 | Responses, errors, async, query, cookies, tokens, logging, pagination |
| `server/src/validators/` | 15 | Zod and Express validation |
| `server/src/workers/` | 1 | Worker registration entry |

### Backend Cross-Cutting Systems

| Concern | Files |
| --- | --- |
| Authentication | `server/src/modules/auth/*`, `server/src/middleware/auth.middleware.js`, `server/src/services/authService.js` |
| Role/permission checks | `server/src/middleware/adminMiddleware.js`, `role.middleware.js`, `roleMiddleware.js`, `server/src/constants/roles.js` |
| Response envelopes | `server/src/utils/apiResponse.js` |
| Errors | `server/src/errors/*`, plus legacy `server/src/middleware/error*.js` and `server/src/utils/AppError.js` |
| Uploads | `server/src/middleware/uploadMiddleware.js`, `server/src/services/cloudinaryService.js`, local `/uploads` serving |
| Payments | `server/src/controllers/billingController.js`, `marketplacePaymentController.js`, `server/src/services/stripeService.js`, `subscriptionService.js`, `marketplacePaymentService.js` |
| Webhooks | `POST /api/billing/webhook` in `server/src/app.js` |
| Email | `server/src/services/email/*`, `server/src/services/emailService.js`, auth email flows |
| Queues | `server/src/services/queueService.js`, `leadScraperService.js`, `outreachService.js`, `server/src/jobs/index.js`, `workers/index.js` |
| Realtime | `server/src/services/socketService.js`, `messagingAuthService.js`, `server/src/socket/index.js` |

## Shared/Common Architecture

There is no separately versioned shared package. Sharing happens inside each application:

- Frontend cross-feature types/config: `client/src/types`, `constants`, `config`, `utils`, `components/ui`, `components/common`.
- Backend cross-feature support: `server/src/constants`, `config`, `middleware`, `utils`, `errors`.
- Repository boundary policy: `scripts/check-module-boundaries.mjs`, `MODULE_BOUNDARIES.md`.

## Likely Module Ownership

| Future module | Current ownership candidates |
| --- | --- |
| Auth | `client/src/features/auth`, `client/src/routes/*Route.jsx`, `client/src/store/useAuthStore.js`, `server/src/modules/auth`, `server/src/services/authService.js` |
| Profile | `client/src/features/profile`, `components/profile`, `pages/profile`, `server/src/routes/v1/profile.routes.js`, `userProfileService.js`, `UserProfile.js`, `ProviderProfile.js` |
| Offers | `client/src/features/outcomeOffers`, `components/outcomeOffers`, `server/src/routes/v1/outcomeOffer.routes.js`, `OutcomeOffer.model.js` |
| Challenges | `client/src/features/challenges`, `components/challenges`, `server/src/routes/v1/challenge.routes.js`, `Challenge.model.js` |
| Plans | `client/src/features/executionPlans`, `components/executionPlans`, `server/src/routes/v1/executionPlan.routes.js`, `ExecutionPlan.model.js` |
| Proof | `client/src/features/proofAssets`, `components/proof`, `server/src/routes/v1/proofAsset.routes.js`, `ProofAsset.model.js` |
| Matching | `client/src/features/matches`, `components/matches`, `server/src/routes/v1/match.routes.js`, `MatchRecord.model.js` |
| Messages | `client/src/pages/Messages.jsx`, `services/messagingSocket.js`, `server/src/routes/messageRoutes.js`, `conversationRoutes.js`, messaging services/models |
| Payments | Client billing/marketplace calls; backend billing/marketplace routes and Stripe services |
| Admin | `client/src/components/admin`, `features/admin`, `pages/Admin*.jsx`, `server/src/routes/adminRoutes.js`, `admin.service.js` |
| Public marketing | `client/src/sections`, `PublicLayout`, public pages, public navigation |
| Dashboard shell | `client/src/layouts`, dashboard/client/admin shell components, universal sidebar |
| Shared UI | `client/src/components/ui`, with legacy overlap in top-level `components` and `components/common` |
| Shared utilities | `client/src/utils`, `server/src/utils`, constants/config folders |
| Unknown/unassigned | Legacy `components/Layout.jsx`, `SaaSLayout.jsx`, `pages/Auth.jsx`, old duplicate controller/middleware/service names, `OutcomeChallenge.model.js` |

## Environment and Configuration Files

Environment files were identified but secret values were not inspected or recorded.

| Path | Purpose |
| --- | --- |
| `.env.example` | Root environment example |
| `client/.env`, `.env.example`, `.env.production.example` | Client runtime/build variables |
| `client/src/config/env.js` | Validates `VITE_API_BASE_URL`, realtime URL, app metadata |
| `server/.env`, `.env.example` | Server environment variables |
| `server/src/config/env.js` | Validates MongoDB, JWT, URLs, email, Stripe, upload, and runtime settings |
| `server/src/config/cors.js` | CORS allow-list behavior |

## Tests

Not found. The audit checked repository directories and package scripts for:

- `test`, `tests`, `__tests__`
- client/server test scripts
- common Jest, Vitest, Mocha, Cypress, and Playwright application test folders

Browser screenshots/logs exist, but they are generated verification artifacts rather than a maintained automated test suite.

## Inventory Boundaries and Unknowns

- Runtime endpoint activity was inferred from router mounts and source imports; no live database or external provider calls were executed.
- “Active” frontend route means registered and renderable in the router, not necessarily feature-complete.
- Several public/client/admin pages intentionally render shared placeholder components.
- API request/response bodies are documented only where validators and service/controller names make them explicit.
- Dynamic route order was inspected statically; no full browser route matrix was executed because this prompt is audit-only.
- Model ownership was inferred from imports and names. `OutcomeChallenge.model.js` has no discovered controller/service import.

See:

- `STAGE_1_1_ROUTE_INVENTORY.md`
- `STAGE_1_1_API_INVENTORY.md`
- `STAGE_1_1_MODEL_SERVICE_HOOK_UTILITY_INVENTORY.md`
- `STAGE_1_1_RISK_MAP.md`
- `stage-1-1-inventory.json`

## Prompt 2 Verification Update

- Verified 811 repository-owned source/tooling nodes and 3,145 direct internal dependency edges.
- Reconstructed all 304 backend route operations and all 537 mounted method/path variants with zero parser mismatch.
- Confirmed the original totals of 108 frontend routes, 45 registered Mongoose models in 50 model-layer files, 73 service-layer files, and 44 custom hook files.
- Confirmed no frontend-to-backend or backend-to-frontend source import.
- Added deep route, page, endpoint, model, reusable-code, boundary, diagram, checklist, and JSON graph documents under `docs/architecture`.

## Prompt 3 Source-of-Truth Correction

- Reconciled the final architecture-bearing scan to 817 files: 558 frontend code files, 250 backend code files, eight package/editor/build/deployment configuration files, and one root boundary-check script.
- Distinguished those architecture-bearing files from the broader source-directory totals of 571 files under `client/src` and 254 files under `server/src`.
- Consolidated the verified route, endpoint, model, reusable-code, duplicate, placeholder/mock, and risk findings in `STAGE_1_1_SOURCE_OF_TRUTH_SUMMARY.md`.
- Published the final machine-readable authority in `stage-1-1-source-of-truth-manifest.json` with evidence identifiers and cross-document traceability.
