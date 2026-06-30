# Stage 4 Prompt 1 Final Start Packet

## Objective

Build a documentation-only route source-of-truth audit for the unified ScaleOps application before proposing centralized route constants or any route behavior change.

## Required First Action

Inventory current route declarations, route constants, hardcoded paths, navigation consumers, protected/admin/role routes, guards, redirects, fallbacks, and 404 behavior. Identify candidates and conflicts without editing them.

## Mandatory Reading

- Stage 3 final completion decision, handoff, source index, freeze certificate, source lock, Stage 4 decision, and route-readiness brief.
- Stage 3.1 platform/module locks and Stage 3.2 API/internal locks.
- Stage 3.3 dependency/API-helper/shared locks.
- Stage 4 mandatory preflight, start conditions, and Prompt 1 handoff.
- Stage 2 route/navigation/dashboard/API/auth locks and ADR-0001.

## Inspect, Do Not Change

- Route declarations/constants and nested groups.
- Public/mobile/footer/dashboard/admin/provider/client navigation.
- Dashboard, admin, provider, client, and ProofArena module routes.
- Protected wrappers, auth/role/admin guards.
- Redirects, catch-alls, fallbacks, and 404 behavior.
- Auth/role/API dependencies used by routing.

## Forbidden Actions

- No route constants or route files.
- No route, navigation, redirect, 404, guard, dashboard, sidebar, layout, API, auth, or role edits.
- No separate ProofArena router or application boundary.
- No file moves, import rewrites, barrel exports, package/config changes, dependencies, or runtime code.

## Required Stage 4 Prompt 1 Outputs

1. Stage 4 tracker and preflight result.
2. Existing route declaration inventory.
3. Route constant and hardcoded-path audit.
4. Navigation-to-route dependency map.
5. Protected/admin/role route and guard audit.
6. Redirect/fallback/404 behavior audit.
7. Route source-of-truth candidate decision.
8. Duplicate-route/navigation risk register.
9. Machine-readable Stage 4 Prompt 1 manifest.
10. Prompt 2 handoff with explicit implementation stop conditions.

## Required Final Response

Report files created/updated, route declarations/constants/navigation/guards/redirects/404 findings, source-of-truth candidate, duplicate risks, human-review items, blockers, next focus, and exact confirmation that no production code was modified.

Do not centralize route constants, edit routes, edit navigation, edit redirects, edit 404 behavior, or edit protected/admin/role routes until Stage 4 Prompt 1 completes a full route source-of-truth audit and explicitly proves the safe implementation path.

