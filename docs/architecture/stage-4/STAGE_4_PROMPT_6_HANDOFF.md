# Stage 4 Prompt 6 Handoff

## Objective

Prompt 6 must verify and correct Prompt 5 against the active route tree, auth/session systems, frontend and backend role catalogs, metadata, navigation, redirects, and layouts. If evidence remains coherent, it may create a documentation-only hardening, validation, rollback, and batch plan. It may not implement that plan.

## Required Reading

Read every Prompt 5 document first, then the Prompt 1-4 inventories, corrections, planning package, Prompt 4 gate/no-op validation, Stage 3 platform/auth locks, Stage 2 route/navigation/dashboard/API-auth locks, ADR-0001, and the Stage 4 manifest.

## Verification Priorities

1. Prove the active authority and behavior of `AuthProvider`, `useAuthStore`, all four route guards, `accessPolicy`, metadata, and layout checks.
2. Compare both active backend auth/role middleware generations without consolidating them.
3. Verify all 53 dashboard rows, especially the 16 parent-auth-only leaves and eight metadata-less leaves.
4. Verify all 12 admin leaves, `/admin/proof-review`, and frontend/backend admin hierarchy.
5. Verify explicit client/provider/support routes and separate coarse role access from object ownership.
6. Verify login/register/recovery/verification/onboarding/logout behavior for guest, supported roles, unverified users, and unknown roles.
7. Reconcile all 42 enabled navigation targets and 16 hardcoded/distributed consumer groups with route protection.
8. Approve or defer canonical anonymous, wrong-role, unverified, forbidden, logout, and role-landing redirects.
9. Retain every gap until evidence closes it; do not infer product policy.

## Blocking Gaps

Guard hardening remains blocked by unresolved role intent, role hierarchy, onboarding completion semantics, denial destinations, cross-tier permission parity, and the absence of automated all-role direct-deep-link tests. Backend authorization uncertainty blocks end-to-end security claims.

## Forbidden Scope

No changes to guards, routes, auth/session state, role definitions, navigation visibility, redirects, 404 behavior, route constants, layouts, API middleware, imports, packages, configuration, or build/deployment files. Prompt 6 remains documentation-only.

## Required Final Response

Report files created/updated, verification results for auth/role authority and every route group, corrected gaps, hardening plan status, validation/rollback status, readiness decision, human-review items, unknowns, and exact no-production-code confirmation.

## Exact Warning

Do not modify guards, protected routes, admin routes, role routes, guest-only routes, onboarding routes, navigation visibility, or redirects until the protected-route audit is verified and a safe hardening plan exists.
