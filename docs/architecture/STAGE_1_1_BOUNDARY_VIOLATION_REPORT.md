# Stage 1.1 Boundary Violation Report

Generated: 2026-06-27

This report separates confirmed dependency-boundary exceptions from review candidates. It does not prescribe or implement fixes.

## Counting Method

- Confirmed direct layer bypasses: 11 page files importing frontend service infrastructure directly.
- Confirmed systemic boundary violations: 7 contract, ownership, or registry boundary gaps.
- Total counted boundary violations: 18.
- Hardcoded role checks that may be valid product behavior are listed separately and are not counted.

## Confirmed Clean Boundaries

| Check | Result | Evidence |
| --- | --- | --- |
| Frontend importing backend source | None found | 3,145 resolved internal import edges |
| Backend importing frontend source | None found | 3,145 resolved internal import edges |
| Backend routes importing models directly | None found | All operation-bearing route files inspected |
| Backend routes importing services directly | None found | Route dependencies resolve through controllers |
| Raw fetch or Axios outside frontend service files | None found | Client source scan |
| Backend operation count | Clean | 304 route operations and 537 mounted variants reconstructed without parser mismatch |

## Confirmed Violations

| ID | Category | Source | Target/boundary | Evidence | Severity |
| --- | --- | --- | --- | --- | --- |
| BV-01 | Page bypasses hook layer | client/src/pages/Auth.jsx | client/src/services/api.js | Direct static import | Medium |
| BV-02 | Page bypasses hook layer | client/src/pages/Connections.jsx | client/src/services/api.js | Direct static import | Medium |
| BV-03 | Page bypasses hook layer | client/src/pages/Marketplace.jsx | client/src/services/api.js | Direct static import | Medium |
| BV-04 | Page bypasses hook layer | client/src/pages/Messages.jsx | client/src/services/api.js and messagingSocket.js | Direct static imports | Medium |
| BV-05 | Page bypasses hook layer | client/src/pages/Network.jsx | client/src/services/api.js | Direct static import | Medium |
| BV-06 | Page bypasses hook layer | client/src/pages/Notifications.jsx | client/src/services/api.js | Direct static import | Medium |
| BV-07 | Page bypasses hook layer | client/src/pages/Payments.jsx | client/src/services/api.js | Direct static import | High |
| BV-08 | Page bypasses hook layer | client/src/pages/Projects.jsx | client/src/services/api.js | Direct static import | Medium |
| BV-09 | Page bypasses hook layer | client/src/pages/ProviderServices.jsx | client/src/services/api.js | Direct static import | Medium |
| BV-10 | Page bypasses hook layer | client/src/pages/Saved.jsx | client/src/services/api.js | Direct static import | Medium |
| BV-11 | Page bypasses hook layer | client/src/pages/ServiceDetail.jsx | client/src/services/api.js | Direct static import | Medium |
| BV-12 | Service/data boundary | client/src/services/api.js | client/src/utils/constants.js | Legacy API facade can return fallback business-looking collections | High |
| BV-13 | Frontend/backend contract boundary | client/src/constants/apiEndpoints.js | server route registries | Endpoint constants exist without registered backend contracts | High |
| BV-14 | Authentication ownership boundary | Three backend auth service generations | Auth controllers/routes | auth.service.js, authService.js, and modules/auth/auth.service.js coexist | High |
| BV-15 | Shared role contract boundary | Client and server role constants | Route/access middleware | Role vocabularies are maintained independently; backend retains a legacy user alias | Medium |
| BV-16 | Router/metadata boundary | client/src/routes/AppRoutes.jsx | client/src/config/routeMetadata.js | 108 route entries, 73 metadata entries, and 34 missing named patterns | High |
| BV-17 | Central path registry boundary | Legacy API facade and older pages | Route/API constants | Hardcoded endpoint and route strings remain outside central registries | Medium |
| BV-18 | Domain ownership boundary | Challenge, Settings, and Saved model pairs | Services/controllers | Parallel concepts exist without one explicit canonical model boundary | High |

## Role Logic Review Candidates

Eighteen page/component files contain literal role names. This is not automatically a violation because several files render role-specific copy or controls. The highest-risk candidates are:

- client/src/pages/Auth.jsx
- client/src/pages/ChallengePlans.jsx
- client/src/pages/Connections.jsx
- client/src/pages/ExecutionPlans.jsx
- client/src/pages/Marketplace.jsx
- client/src/pages/Providers.jsx
- client/src/pages/RouteShells.jsx
- client/src/pages/Saved.jsx
- client/src/pages/ServiceDetail.jsx
- client/src/components/AdminGate.jsx

These files require behavior-level review before centralizing role checks. They remain outside the confirmed violation count.

## Validation Boundary

Frontend form/domain validation and backend validator files are independently implemented. This is a contract-drift risk, but it is not counted as a violation because server-side validation remains the authoritative security boundary and no source-level cross-import is expected.

## Auth Boundary

Frontend route guards, accessPolicy, AuthProvider, and the Zustand auth store all participate in authentication UX. Backend auth middleware and services remain the security boundary. No evidence was found that frontend role checks replace backend middleware on registered protected endpoints.

## Unknowns

- Six endpoints have controller-file-level service evidence rather than handler-level evidence.
- Four status/discovery endpoints use inline route handlers and therefore have no controller/service edge.
- ProviderProfile references VerifiedOutcome, but no registered model file was found.
- Runtime behavior cannot be proven by static imports because no maintained application test suite was found.
