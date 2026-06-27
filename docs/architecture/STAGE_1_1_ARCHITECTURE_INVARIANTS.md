# Stage 1.1 Architecture Invariants

Generated: 2026-06-27T16:22:15.6507021+05:00

These invariants describe the verified current architecture. They are preservation rules, not claims that every current design is ideal. A later stage may change an invariant only with the listed precondition, regression coverage, and an explicit migration decision.

## A. Product Boundary Invariants

| ID | Rule | Source evidence | Risk if violated | Future change gate | Confidence |
| --- | --- | --- | --- | --- | --- |
| INV-P01 | ScaleOps remains the parent SaaS application; ProofArena remains a module inside the existing client and server. | `client/src/modules/proofarena/README.md`; `server/src/modules/proofarena/README.md` | A second app would duplicate auth, routing, deployment, and persistence boundaries. | Stage 2 boundary ADR plus migration plan | high |
| INV-P02 | ProofArena composes existing challenge, offer, execution-plan, proof, matching, provider, and opportunity domains instead of copying them. | Both ProofArena README files; `STAGE_1_1_REUSABLE_CODE_MAP.md` | Parallel implementations would create incompatible contracts and data ownership. | Stage 3 module-boundary work after tests | high |
| INV-P03 | Code outside the frontend ProofArena module uses its public entry point; feature domains must not depend on product composition. | `client/src/modules/proofarena/index.js`; `scripts/check-module-boundaries.mjs`, EV-F0561 | Private imports would make migration order and ownership unstable. | Stage 3 with boundary-check updates | high |

## B. Frontend Invariants

| ID | Rule | Source evidence | Risk if violated | Future change gate | Confidence |
| --- | --- | --- | --- | --- | --- |
| INV-F01 | `client/src/main.jsx` remains the browser entry and mounts the query client and router. | EV-X001 | Provider ordering or router initialization can fail globally. | Framework/bootstrap change with app smoke tests | high |
| INV-F02 | `client/src/App.jsx` owns top-level provider composition. | EV-X002 | Auth and route hydration can render in the wrong order. | Auth/platform ADR plus integration tests | high |
| INV-F03 | `client/src/routes/AppRoutes.jsx` remains the frontend route registration authority. | EV-F0464; 108 routes in `STAGE_1_1_TRACEABILITY_MATRIX.md` | Duplicate routers or route drift can create inaccessible pages and guard bypasses. | Stage 4 route governance | high |
| INV-F04 | `client/src/constants/routes.js` remains the route-path constant source used by features and navigation. | EV-F0291 | Scattered path strings would break aliases, breadcrumbs, and role fallbacks. | Stage 4 route governance with import migration | high |
| INV-F05 | `client/src/config/routeMetadata.js` remains metadata, not a second router; its 34 known coverage gaps must not be treated as absent routes. | EV-X010 | Consumers can incorrectly hide or reject active routes. | Stage 4 metadata completion | high |
| INV-F06 | `client/src/layouts/PublicLayout.jsx` owns the active public shell; `client/src/layouts/RootLayout.jsx` remains a compatibility concern until proven removable. | EV-F0377, EV-F0378 | Public header/footer nesting and auth pages can regress. | Stage 1.2 investigation plus route tests | high |
| INV-F07 | `client/src/layouts/DashboardLayout.jsx` owns the provider/shared dashboard shell. | EV-F0376 | Sidebar sizing, auth loading, and provider content can break. | Stage 36 provider dashboard work after shell tests | high |
| INV-F08 | `client/src/layouts/ClientLayout.jsx` and `client/src/layouts/AdminLayout.jsx` retain distinct role-specific shells. | EV-F0375, EV-F0373 | Client/admin navigation or access boundaries can leak across roles. | Explicit role-dashboard migration with tests | high |
| INV-F09 | `client/src/layouts/useSidebarShell.js` and `client/src/hooks/useSidebarState.js` coordinate dashboard shell state; mobile state is not a second persistent desktop state. | EV-F0381, EV-F0368 | Empty layout gaps, stale drawers, or localStorage regressions can occur. | Dashboard shell refactor after responsive tests | high |
| INV-F10 | `client/src/components/navigation/sidebar/SidebarCore.jsx` remains the shared sidebar renderer used by provider, client, and admin wrappers. | EV-F0140 | Manual sidebar copies would diverge in active-state, filtering, and accessibility behavior. | Shared navigation ADR | high |
| INV-F11 | Public, provider, client, and admin navigation remain configuration-driven from `client/src/config/navigation/`. | EV-F0277 through EV-F0280 | Hardcoded navigation would bypass route/access helpers. | Stage 22 or role-navigation migration | high |
| INV-F12 | `client/src/features/auth/AuthProvider.jsx`, `client/src/store/useAuthStore.js`, and `client/src/routes/` guards remain the current frontend auth/session boundary. | EV-F0299, EV-F0524, EV-F0465 through EV-F0469 | Protected content can flash, redirect loops can form, or roles can leak. | Stage 23 auth/security with regression coverage | high |
| INV-F13 | `client/src/services/apiClient.js` remains the shared HTTP transport boundary; components should not create another Axios/fetch client. | EV-X007 | Token refresh, credentials, error translation, and base URL behavior would diverge. | Stage 5 API-contract standardization | high |
| INV-F14 | `client/src/components/ui/Button.jsx`, `client/src/components/ui/PageHeader.jsx`, and `client/src/components/states/AppStateShell.jsx` are shared UI foundations; compatibility wrappers must be audited before removal. | EV-F0246, EV-F0257, EV-F0234 | Visual, semantic, and accessibility behavior would fragment. | Stage 7 shared UI consolidation | high |
| INV-F15 | `client/src/utils/accessPolicy.js`, `client/src/utils/navigationFilter.js`, `client/src/utils/navigationActive.js`, and `client/src/utils/routeValidation.js` remain centralized policy/helpers rather than duplicated component logic. | EV-F0534, EV-F0548, EV-F0547, EV-F0555 | Role checks, active states, and route safety would become inconsistent. | Stages 4, 23, and 26 with tests | high |

## C. Backend Invariants

| ID | Rule | Source evidence | Risk if violated | Future change gate | Confidence |
| --- | --- | --- | --- | --- | --- |
| INV-B01 | `server/src/server.js` remains the process entry for database, HTTP, sockets, and workers. | EV-X004 | Startup order and process lifecycle can fail. | Runtime architecture ADR | high |
| INV-B02 | `server/src/app.js` remains the Express composition root for global middleware, webhooks, routes, and errors. | EV-X003 | Middleware ordering, webhook parsing, and error responses can break. | Stage 5 or 6 with endpoint tests | high |
| INV-B03 | Both `server/src/routes/index.js` and `server/src/routes/v1/index.js` are active; their 233 dual-mounted operations cannot be removed casually. | EV-X005, EV-X006 | Existing clients can receive 404s or different middleware behavior. | Stage 1.3 API-version ADR and migration telemetry | high |
| INV-B04 | The normal backend dependency direction remains route to controller to service to model; known inline and partial flows are exceptions documented in the traceability matrix. | `STAGE_1_1_BACKEND_FLOW_MAP.md`; `STAGE_1_1_TRACEABILITY_MATRIX.md` | Business logic can become untestable or bypass validation/security. | Stage 3 module migration one vertical slice at a time | high |
| INV-B05 | `server/src/modules/auth/` is an active auth implementation, but legacy auth controller/service generations remain compatibility risks, not deletion candidates. | EV-F0686, EV-F0688; `STAGE_1_1_DUPLICATE_OVERLAP_RADAR.md` | Removing the wrong generation can break login, refresh, or verification flows. | Stage 23 after caller and endpoint contract tests | high |
| INV-B06 | Both auth and role middleware naming generations remain active until route-by-route migration proves otherwise. | EV-F0618, EV-F0619, EV-F0627, EV-F0628 | Authorization can weaken or legitimate requests can be rejected. | Stages 23/26 with route permission matrix | high |
| INV-B07 | `server/src/utils/apiResponse.js`, `server/src/utils/AppError.js`, `server/src/utils/asyncHandler.js`, and global error middleware define response/error behavior. | EV-F0784, EV-F0783, EV-F0785, EV-F0620, EV-F0621 | Frontend contracts can receive inconsistent status and payload shapes. | Stage 5 error-contract ADR | high |
| INV-B08 | `server/src/config/db.js` owns database connection initialization and model registration side effects. | EV-F0565 | Startup, indexes, or registered models can change unexpectedly. | Database migration with rollback and model tests | high |
| INV-B09 | `server/src/config/loadEnv.js` and `server/src/config/env.js` own server environment loading/validation; secrets remain outside documentation and source. | EV-F0567, EV-F0566 | Deployments can start with missing or unsafe configuration. | Stage 6 environment/config layer | high |
| INV-B10 | Request validation remains route-bound through existing validators and validation middleware; duplicate validators must be mapped before consolidation. | EV-F0633, EV-F0634; `server/src/validators/` | Invalid or unauthorized payloads can reach business logic. | Stage 5 contract layer after endpoint tests | high |

## D. Data and Model Invariants

| ID | Rule | Source evidence | Risk if violated | Future change gate | Confidence |
| --- | --- | --- | --- | --- | --- |
| INV-D01 | `server/src/models/User.js` is security-critical identity persistence used by auth, admin, and user services. | EV-M043 | Schema changes can invalidate credentials, roles, sessions, and user ownership. | Stage 23 with migration and rollback plan | high |
| INV-D02 | `server/src/models/UserProfile.js` and `server/src/models/ProviderProfile.js` are active profile persistence; model aliases and the unresolved `VerifiedOutcome` reference must be preserved until ownership is decided. | EV-M047, EV-X009 | Profile reads/population can fail or data can split across collections. | Profile stage after model/ref audit and tests | high |
| INV-D03 | `server/src/models/MarketplaceTransaction.js`, `server/src/models/Invoice.js`, and `server/src/models/Subscription.js` are financial records and must not change without contract, migration, and webhook tests. | EV-M017, EV-M013, EV-M040 | Money, invoices, subscriptions, and reconciliation can be corrupted. | Payments stage with Stripe regression suite | high |
| INV-D04 | `server/src/models/Challenge.model.js` and `server/src/models/OutcomeChallenge.model.js` are overlapping concepts; neither is canonical by audit evidence alone. | EV-M006, EV-M024 | Premature merging can orphan data or break service queries. | Stage 1.3 ADR plus data inspection | medium |
| INV-D05 | `server/src/models/OutcomeOffer.model.js`, `server/src/models/ExecutionPlan.model.js`, `server/src/models/ProofAsset.model.js`, and `server/src/models/MatchRecord.model.js` form connected ProofArena workflows. | EV-M025, EV-M010, EV-M030, EV-M018 | Cross-domain lifecycle and ownership references can break. | Feature-stage vertical migrations with tests | high |
| INV-D06 | `server/src/models/Settings.js` and `server/src/models/UserSettings.js` overlap; collection ownership and read/write callers must be established before consolidation. | EV-M039, EV-M049 | Settings can diverge or be silently lost. | Stage 1.3 ownership ADR and migration | medium |

## E. Shared Code Invariants

| ID | Rule | Source evidence | Risk if violated | Future change gate | Confidence |
| --- | --- | --- | --- | --- | --- |
| INV-S01 | `scripts/check-module-boundaries.mjs` is the executable boundary policy for client/server module dependency direction. | EV-F0561 | Shared foundations can start importing product modules and create cycles. | Stage 3 boundary ADR with script updates | high |
| INV-S02 | `client/src/styles/tokens.css` remains the shared design-token source. | EV-X011 | Hardcoded values and incompatible themes can spread across layouts. | Stage 7 token migration | high |
| INV-S03 | Shared config, constants, errors, stores, and utilities must not depend on feature/page/route implementations. | `scripts/check-module-boundaries.mjs`; `STAGE_1_1_BOUNDARY_VIOLATION_REPORT.md` | Dependency inversion and circular ownership can result. | Stage 3 module-boundary work | high |
| INV-S04 | Frontend and backend source remain physically and import-wise separated; no source-level cross-boundary import was found. | `STAGE_1_1_DEPENDENCY_MAP.md`; `STAGE_1_1_CONSISTENCY_CHECK.md` | Browser/server bundling and secret boundaries would be compromised. | Only through an explicit shared-contract package ADR | high |

## Change Protocol

Before intentionally changing an invariant, the future prompt must:

1. Read `STAGE_1_1_SOURCE_OF_TRUTH_SUMMARY.md` and the relevant detailed map.
2. Identify every current importer and endpoint/route/model trace.
3. Add regression coverage before changing high-risk behavior.
4. Define compatibility and rollback behavior.
5. Update the invariant and guardrail manifests in the same reviewed change.
