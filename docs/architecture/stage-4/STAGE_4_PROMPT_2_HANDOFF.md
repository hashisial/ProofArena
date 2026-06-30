# Stage 4 Prompt 2 Handoff

## Prompt 2 Objective

Verify and harden Prompt 1 evidence before any route source is finally selected or any migration plan is approved. Prompt 2 remains documentation-only.

## Required Verification

- Re-parse all 108 route declarations and confirm component/layout/guard ownership.
- Disposition all 34 declared routes missing metadata.
- Verify all 117 constant entries, nine aliases, and the undeclared `/offers` base.
- Inspect the 72 route-context literal occurrences across 28 files and distinguish active, legacy, API, asset, and parsing literals.
- Verify all configured public/mobile/footer/provider/client/admin/dashboard links and intentional hidden routes.
- Confirm role intent for 16 parent-auth-only DashboardLayout routes, especially the eight without metadata.
- Prove reachability or non-reachability of `pages/Auth.jsx`, `pages/Admin.jsx`, `features/auth/RequireRole.jsx`, and `components/AdminGate.jsx` without deleting them.
- Reconcile guard, layout, access-policy, auth-helper, and component-level role fallbacks.
- Verify explicit `/not-found`, wildcard `*`, `/403`, `/not-authorized`, `/500`, logout, login, role landing, and invalid-step behavior.
- Validate `client/src/constants/routes.js` as candidate against `AppRoutes.jsx`, metadata, navigation, guards, redirects, and existing route docs.

## Risks That Block Centralization

Metadata gaps, hardcoded consumers, unresolved aliases, role ambiguity, stale/legacy reachability, dynamic parameter semantics, route docs drift, and missing route-regression tests all block centralization or production edits.

## Required Reading

Read every Prompt 1 Stage 4 document and manifest, the Stage 3 final start packet/readiness brief, Stage 2 route/navigation/dashboard/API/auth locks, and ADR-0001.

## Prohibited Work

Prompt 2 must not create or centralize constants, edit routes/navigation/guards/redirects/404 behavior, create a router or ProofArena route tree, move files, update imports, create barrels, change configuration, or begin implementation.

Do not centralize route constants until existing route declarations, route constants, navigation links, protected routes, role/admin routes, redirects, and 404 behavior are verified and a safe migration plan exists.

