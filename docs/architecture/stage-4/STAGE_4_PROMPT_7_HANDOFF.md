# Stage 4 Prompt 7 Handoff

## Required Mode

Prompt 6 decision is **HUMAN APPROVAL REQUIRED**. Prompt 7 must remain **documentation-only plus no-op validation only**. No protected-route implementation is authorized.

## Prompt 7 Objective

1. Re-read all Prompt 5 and Prompt 6 verification, correction, hardening, validation, rollback, risk, readiness, and rulebook documents.
2. Reconcile Prompt 1-4 route inventories, Prompt 4 execution gate, and Stage 2/3 platform locks.
3. Capture a fresh no-op snapshot of route leaves, guard imports, metadata, navigation targets, role catalogs, redirect targets, and production diff.
4. Run only known read-only checks: client lint, client/server boundary checks, and optionally client build if the gate explicitly allows it.
5. Record skipped implementation and carry every unresolved blocker forward.

## Authorities To Reuse

Reuse `AuthProvider`, `useAuthStore`, `ProtectedRoute`, `RoleRoute`, `PublicOnlyRoute`, `EmailVerifiedRoute`, `accessPolicy`, existing role constants, existing layouts, and each backend middleware only within its current API family. Do not expand `RequireRole` or `AdminGate`.

## Route Eligibility

No route is eligible for an implementation batch. Existing explicit-role routes may be regression-tested only. The 16 parent-auth-only dashboard routes, all admin hierarchy decisions, support access, verification/resend policy, onboarding completion, unknown roles, dynamic ownership, navigation changes, and denial redirects are excluded.

## Required Validation And Rollback

Follow `STAGE_4_2_PROTECTED_ROUTE_VALIDATION_AND_TEST_PLAN.md` and `STAGE_4_2_PROTECTED_ROUTE_ROLLBACK_PLAN.md`. Any source diff, failed baseline, duplicate authority, or unexplained count change closes the gate.

## Forbidden Scope

No guards, routes, metadata, role constants, auth/session state, API middleware, navigation visibility, redirects, 404 behavior, layouts, imports, package/config/build files, or separate ProofArena systems may change.

## Required Final Response

Report the execution gate, snapshot, checks run/skipped, implementation skipped/change status, safety result, rollback readiness, remaining gaps, Stage 4.2 status, next scope, human decisions, unknowns, and exact no-production-code confirmation.

## Exact Warning

Do not implement protected-route hardening unless Prompt 6 explicitly marks implementation ready. If implementation is not ready, Prompt 7 must remain documentation-only and resolve blockers first.
