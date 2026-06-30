# Stage 4.3 Redirect and 404 System Source-of-Truth Audit

| System | Current source | Authority status | Notes |
|---|---|---|---|
| Anonymous protected redirect | routes/ProtectedRoute.jsx and RoleRoute.jsx | active authority | Login with attempted-location state |
| Wrong-role redirect | routes/RoleRoute.jsx | active authority | Not-authorized |
| Verification redirect | routes/EmailVerifiedRoute.jsx | active authority | Resend verification with reason |
| Guest-only redirect | routes/PublicOnlyRoute.jsx and authRouteUtils.js | active authority | Role default |
| Layout denial fallback | layouts/*Layout.jsx plus accessPolicy.js | active supporting authority | Metadata-dependent |
| Role default/unknown fallback | utils/accessPolicy.js | active policy authority with caution | Caller options differ |
| Explicit 404 | AppRoutes plus pages/NotFound.jsx | active authority | /not-found |
| Wildcard fallback | terminal AppRoutes route | active authority | Same NotFound component |
| Page-level navigation | individual pages/components | distributed supporting behavior | Some hardcoded internal paths |
| Server API 404 | server middleware/routes | separate backend domain | Not browser routing |

No single redirect source-of-truth exists. Existing distributed ownership is documented; consolidation is not approved.

