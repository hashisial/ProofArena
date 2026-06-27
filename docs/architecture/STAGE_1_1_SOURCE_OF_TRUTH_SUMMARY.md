# Stage 1.1 Source-of-Truth Architecture Summary

Generated: 2026-06-27T09:38:25.230298+00:00

This is the current human-readable master for Stage 1.1.

## 1. Project Identity

- ScaleOps is the parent SaaS ecosystem.
- ProofArena is the flagship module inside ScaleOps.
- The repository contains one Vite/React frontend and one Express/Mongoose backend.
- No separate ProofArena app or repository should be created.

## 2. Current Architecture

| Area | Confirmed architecture | Evidence |
| --- | --- | --- |
| Frontend | React 19, Vite, React Router, TanStack Query, Zustand, Axios | EV-C001, EV-X001 |
| Backend | Express 5, Mongoose, Socket.IO, Stripe, BullMQ | EV-C005, EV-X003, EV-X004 |
| Routing | 108 entries through AppRoutes and central route constants | EV-R001 through EV-R108 |
| API | 304 operations exposed as 537 method/path variants | EV-A001 through EV-A304 |
| Authentication | Frontend hydration/guards plus backend middleware/auth module | EV-X002, EV-X007 |
| Models | 50 model-layer files, 45 registered models | EV-M001 through EV-M050 |
| Dashboard | Public, auth, provider/shared, client, and admin shells | Route and readiness maps |
| Public marketing | Home sections plus route-safe public placeholder exports | Placeholder report |
| Admin | Protected shell, real moderation APIs, and several placeholder modules | Endpoint and placeholder reports |
| Shared code | 44 hooks, 73 service files, 79 utility/validator/error helpers | Reusable code map |

## 3. Confirmed Facts

1. No frontend source imports backend source.
2. No backend source imports frontend source.
3. Backend routes preserve the route-to-controller boundary.
4. All 108 frontend routes have known layouts and guards.
5. All 304 backend operations reconcile exactly.
6. Eleven pages import the legacy service facade directly.
7. Two hundred thirty-three operations are dual mounted.
8. Thirty-four named routes lack metadata.
9. Forty-five registered models exist in 50 model-layer files.
10. Stage 1.1 modified documentation only.

## 4. Unknown or Blocked

| Item | Reason | Status |
| --- | --- | --- |
| VerifiedOutcome model | ProviderProfile references it but no registered model exists. | UNKNOWN |
| Runtime route/API correctness | No maintained automated test suite exists. | BLOCKED |
| Database index adequacy | Requires production-like query plans and cardinality. | UNKNOWN |
| Seven unmapped page files | May be legacy, indirect, or dead; source evidence cannot prove intent. | UNKNOWN |
| Six controller-file-level service flows | Static handler isolation cannot prove the exact service symbol. | PARTIAL |
| Four inline endpoint operations | No controller/service boundary exists by design. | PARTIAL |
| Thirty-four route metadata gaps | Router declarations have no matching metadata record. | KNOWN GAP |
| Production model/index ownership | Static schemas do not prove deployed collection/index state. | UNKNOWN |

## 5. Highest Risks

| Area | Files | Severity |
| --- | --- | --- |
| Dual API mounts | `server/src/routes/index.js`<br>`server/src/routes/v1/index.js` | high |
| Authentication generations | `server/src/modules/auth/auth.service.js`<br>`server/src/services/auth.service.js`<br>`server/src/services/authService.js` | high |
| Central API client | `client/src/services/apiClient.js` | high |
| Legacy API fallback data | `client/src/services/api.js`<br>`client/src/utils/constants.js` | high |
| Route registry and metadata gap | `client/src/routes/AppRoutes.jsx`<br>`client/src/config/routeMetadata.js` | high |
| Profile persistence/service concentration | `server/src/models/UserProfile.js`<br>`server/src/models/ProviderProfile.js`<br>`server/src/services/userProfileService.js`<br>`server/src/services/profile.service.js` | high |
| Auth/role middleware aliases | `server/src/middleware/auth.middleware.js`<br>`server/src/middleware/authMiddleware.js`<br>`server/src/middleware/role.middleware.js`<br>`server/src/middleware/roleMiddleware.js` | high |
| Payment and webhook flow | `server/src/app.js`<br>`server/src/controllers/billingController.js`<br>`server/src/services/stripeService.js`<br>`server/src/services/marketplacePaymentService.js` | high |
| Model ownership overlaps | `server/src/models/Challenge.model.js`<br>`server/src/models/OutcomeChallenge.model.js`<br>`server/src/models/Settings.js`<br>`server/src/models/UserSettings.js` | high |
| Protected dashboard shells | `client/src/layouts/DashboardLayout.jsx`<br>`client/src/layouts/ClientLayout.jsx`<br>`client/src/layouts/AdminLayout.jsx` | high |

## 6. Future Prompts Must Respect

- Existing route constants, route metadata, guard chains, and role policy.
- client/src/services/apiClient.js as the HTTP client boundary.
- Existing public/provider/client/admin shells and universal sidebar state.
- Backend route/controller/service/model contracts.
- User, profile, payment, challenge, execution-plan, offer, and proof persistence.
- Environment secrecy and deployment configuration.
- Tests before auth, route, shared API, payment, or model refactoring.

## 7. Future Prompts Must Not

- Create a separate ProofArena app.
- Duplicate route constants, API clients, layouts, sidebars, state systems, or auth systems.
- Bypass backend authorization with frontend-only checks.
- Treat fallback/mock business data as production truth.
- Merge or delete overlapping models/middleware/auth files without migration evidence.
- Replace working systems without reading callers and compatibility exports.

## Source-of-Truth Order

1. STAGE_1_1_SOURCE_OF_TRUTH_SUMMARY.md
2. stage-1-1-source-of-truth-manifest.json
3. STAGE_1_1_EVIDENCE_INDEX.md
4. STAGE_1_1_TRACEABILITY_MATRIX.md
5. Prompt 2 detailed maps and Prompt 1 inventories
