# Stage 4 Prompt 11 Source-of-Truth Candidate Index

| System | File | Status | Reason |
|---|---|---|---|
| Router mount | client/src/main.jsx | current runtime authority | Single BrowserRouter |
| Route declarations/wildcard | client/src/routes/AppRoutes.jsx | current runtime authority | Single active route tree |
| Route values | client/src/constants/routes.js | current runtime authority; governance candidate | Broad router use, unresolved aliases |
| Route metadata | client/src/config/routeMetadata.js | supporting candidate | Incomplete coverage |
| Navigation | client/src/constants/navigation.js and config/navigation | supporting authority | Role/menu configuration |
| Auth guard | client/src/routes/ProtectedRoute.jsx | current runtime authority | Active parent use |
| Role guard | client/src/routes/RoleRoute.jsx | current runtime authority | Active parent/child use |
| Verification/guest guards | client/src/routes/EmailVerifiedRoute.jsx, PublicOnlyRoute.jsx | current runtime authority | Active route use |
| Access policy | client/src/utils/accessPolicy.js | supporting authority with caution | Shared decisions, caller options |
| Browser 404 | AppRoutes.jsx plus pages/NotFound.jsx | current runtime authority | Explicit and wildcard |
| Redirect governance | distributed active sources | candidate set only | No single approved authority |
| Stage 4 governance | final locks and final freeze docs | candidate primary documentation | Prompt 12 must freeze |

Candidate status does not authorize centralization or runtime edits.

