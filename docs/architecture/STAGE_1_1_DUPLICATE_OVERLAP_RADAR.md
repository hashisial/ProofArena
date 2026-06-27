# Stage 1.1 Duplicate and Overlap Radar

Generated: 2026-06-27T09:38:25.230298+00:00

These are suspected or confirmed overlaps. No deletion or merge is authorized by this report.

| ID | Type | File A | File B/related | Similarity | Risk if retained | Risk if merged early | Recommendation | Evidence IDs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DUP-01 | Route constant aliases | `client/src/constants/routes.js` | Nested groups and flattened aliases | Possible overlap | Path ownership ambiguity | Removing aliases can break imports | Investigate later | EV-F0291 |
| DUP-02 | Route metadata coverage | `client/src/config/routeMetadata.js` | client/src/routes/AppRoutes.jsx | Coverage overlap/gap | Incomplete metadata consumers | Bulk changes affect guards/breadcrumbs | Refactor later | EV-F0285 |
| DUP-03 | Public layouts | `client/src/layouts/PublicLayout.jsx` | client/src/layouts/RootLayout.jsx | Compatibility overlap | Stale shell selection | Merging can alter nesting | Investigate later | EV-F0377 |
| DUP-04 | Dashboard layouts | `client/src/layouts/DashboardLayout.jsx` | client/src/layouts/WorkspaceLayout.jsx | Compatibility overlap | Shell ambiguity | Collapse/mobile/auth regression | Investigate later | EV-F0376 |
| DUP-05 | Legacy layouts | `client/src/components/Layout.jsx` | client/src/components/SaaSLayout.jsx | Possible overlap | Visual/navigation inconsistency | Unknown older callers | Document only | EV-F0013 |
| DUP-06 | Public navigation | `client/src/components/navigation/PublicNavbar.jsx` | client/src/components/public/PublicHeader.jsx | Generation overlap | Auth/nav drift | Legacy import breakage | Investigate later | EV-F0136 |
| DUP-07 | Sidebar wrapper/core | `client/src/components/navigation/DashboardSidebar.jsx` | client/src/components/navigation/sidebar/SidebarCore.jsx | Intentional overlap | Filtering duplication | Context slots may be lost | Document only | EV-F0134 |
| DUP-08 | API layers | `client/src/services/api.js` | apiClient.js and feature services | Actual layering overlap | Contract/error/fallback drift | Large page regression surface | Refactor later | EV-F0513 |
| DUP-09 | Auth services | `server/src/services/auth.service.js` | authService.js and modules/auth/auth.service.js | Actual compatibility overlap | Wrong security owner | Critical auth regression | Refactor later | EV-F0732 |
| DUP-10 | Auth controllers | `server/src/controllers/auth.controller.js` | authController.js and modules/auth/auth.controller.js | Compatibility overlap | Endpoint owner unclear | Export compatibility break | Refactor later | EV-F0578 |
| DUP-11 | Auth middleware | `server/src/middleware/auth.middleware.js` | server/src/middleware/authMiddleware.js | Compatibility overlap | Protection drift | Endpoint exposure risk | Refactor later | EV-F0618 |
| DUP-12 | Role middleware | `server/src/middleware/role.middleware.js` | server/src/middleware/roleMiddleware.js | Compatibility overlap | Permission drift | Access regression | Refactor later | EV-F0627 |
| DUP-13 | Error middleware | `server/src/middleware/error.middleware.js` | errorMiddleware.js and errors/errorHandler.js | Possible overlap | Envelope drift | Frontend contract break | Investigate later | EV-F0620 |
| DUP-14 | Rate limiting | `server/src/middleware/rateLimit.middleware.js` | server/src/middleware/rateLimitMiddleware.js | Possible overlap | Protection differs by route | Security regression | Investigate later | EV-F0624 |
| DUP-15 | Sanitization | `server/src/middleware/sanitize.middleware.js` | server/src/middleware/sanitizeMiddleware.js | Possible overlap | Input treatment drift | Security regression | Investigate later | EV-F0629 |
| DUP-16 | Validation | `server/src/middleware/validate.middleware.js` | server/src/middleware/validationMiddleware.js | Possible overlap | Request contract drift | Behavior break | Investigate later | EV-F0633 |
| DUP-17 | Auth hooks | `client/src/hooks/useAuth.js` | client/src/features/auth/useAuth.js | Actual purpose overlap | Different auth sources | Session drift | Refactor later | EV-F0349 |
| DUP-18 | Profile hooks | `client/src/hooks/useMyProfile.js` | client/src/features/profile/useProfile.js | Old/new overlap | Cache/payload drift | Stage 4 regression | Investigate later | EV-F0361 |
| DUP-19 | Challenge models | `server/src/models/Challenge.model.js` | server/src/models/OutcomeChallenge.model.js | Domain overlap | Parallel collections | Data migration risk | Document only | EV-F0640 |
| DUP-20 | Settings models | `server/src/models/Settings.js` | server/src/models/UserSettings.js | Domain overlap | Preference ownership | Data loss risk | Investigate later | EV-F0673 |
| DUP-21 | Saved models | `server/src/models/SavedItem.js` | server/src/models/SavedProvider.model.js | General/domain overlap | Wrong collection use | Domain fields could be lost | Document only | EV-F0669 |
| DUP-22 | Profile models | `server/src/models/UserProfile.js` | server/src/models/ProviderProfile.js | Ownership overlap | Source of truth unclear | Stage 4 migration risk | Investigate later | EV-F0681 |
| DUP-23 | Model aliases | `server/src/models/User.model.js` | User.js and other model aliases | Compatibility aliases | Canonical file obscured | Import breakage | Delete only after confirmation | EV-F0678 |
| DUP-24 | Module placeholders | `client/src/components/common/ModulePlaceholder.jsx` | client/src/components/states/ModulePlaceholder.jsx | Wrapper/core overlap | State APIs may drift | Caller behavior change | Document only | EV-F0055 |
| DUP-25 | Buttons | `client/src/components/Button.jsx` | client/src/components/ui/Button.jsx | UI generation overlap | Styling/semantics drift | Visual regression | Refactor later | EV-F0005 |
| DUP-26 | Empty states | `client/src/components/EmptyState.jsx` | ui/EmptyState and states/EmptyState | UI generation overlap | State behavior drift | Route-state regression | Refactor later | EV-F0008 |
| DUP-27 | Unauthorized pages | `client/src/pages/Forbidden.jsx` | client/src/pages/NotAuthorized.jsx | System route overlap | /403 and /not-authorized coexist | Redirect compatibility | Investigate later | EV-F0412 |
| DUP-28 | Client dashboards | `client/src/layouts/ClientLayout.jsx` | /client, /dashboard/client, /dashboard/workspace | Route generation overlap | Multiple buyer entry points | Bookmark/navigation break | Investigate later | EV-F0375 |
