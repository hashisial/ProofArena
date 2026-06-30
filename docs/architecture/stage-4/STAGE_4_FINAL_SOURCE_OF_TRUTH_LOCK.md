# Stage 4 Final Source-of-Truth Lock

| ID | System | File | Final authority status | Required before Stage 5 | Required before production edits | Human review | Stop condition |
|---|---|---|---|---|---|---|---|
| STL-001 | Router mount | client/src/main.jsx | final runtime authority | yes | yes | no | Second router proposed |
| STL-002 | Route declarations/wildcard | client/src/routes/AppRoutes.jsx | final runtime authority with caution | yes | yes | yes for edits | Inventory mismatch |
| STL-003 | Route values | client/src/constants/routes.js | final current runtime authority; centralization candidate only | yes | yes | yes | Alias/dynamic intent unclear |
| STL-004 | Route metadata | client/src/config/routeMetadata.js | supporting evidence | yes | yes | yes | Missing coverage affects edit |
| STL-005 | Navigation | client/src/constants/navigation.js and config/navigation | final current runtime authority with caution | yes | yes | yes for policy changes | Guard parity unknown |
| STL-006 | Auth guard | client/src/routes/ProtectedRoute.jsx | final current runtime authority | yes | yes | no | Parallel guard proposed |
| STL-007 | Role guard | client/src/routes/RoleRoute.jsx | final current runtime authority with caution | yes | yes | yes | Role policy unclear |
| STL-008 | Verification/guest guards | EmailVerifiedRoute.jsx and PublicOnlyRoute.jsx | final current runtime authority with caution | yes | yes | yes | Flow intent unclear |
| STL-009 | Access/auth policy | client/src/utils/accessPolicy.js and authRouteUtils.js | supporting authority with caution | yes | yes | yes | Caller fallbacks conflict |
| STL-010 | Browser NotFound | AppRoutes.jsx and pages/NotFound.jsx | final current runtime authority | yes | yes | no | Module fallback proposed |
| STL-011 | Redirect governance | active guards, layouts, policy, and pages | candidate authority set | yes | yes | yes | Single authority claimed prematurely |
| STL-012 | Validation | final validation plans and gate reports | final documentation authority with caution | no | yes | no | Runtime batch lacks baseline |
| STL-013 | Rollback | final rollback plans and lock | final documentation authority with caution | no | yes | yes for security changes | Exact batch undefined |
| STL-014 | Tracker/manifest | STAGE_4_MASTER_TRACKER.md and manifest | final administrative authority | yes | yes | no | Runtime flags contradict evidence |

Candidate authority is not final authority. Earlier inventories and plans are supporting evidence unless listed above.

