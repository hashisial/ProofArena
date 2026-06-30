# Stage 4.3 404, NotFound, and Wildcard Correction Matrix

| Concern | Verified state | Status | Required control |
|---|---|---|---|
| Explicit /not-found | Renders platform NotFound | final runtime evidence | Keep constant-backed |
| Wildcard | Terminal and renders same component | final runtime evidence | Ordering regression |
| Module-specific NotFound | None found | clear with caution | Prohibit duplication |
| Invalid onboarding step | Redirects to explicit NotFound | verified | Parameter test |
| Context-aware links | Derived from route group and role | verified with caution | Unknown-role test |
| API 404 | Separate server behavior | verified | Separate Stage 5 contract |
| Canonical URL after wildcard | Unknown path remains in address bar | product decision | Human approval if changed |

