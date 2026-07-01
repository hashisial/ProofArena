# Stage 4 Prompt 10 Handoff

## Prompt 10 Objective

Prompt 10 must execute the Stage 4.3 gate, preserve a pre-implementation snapshot, run only non-mutating validation, and document why implementation remains blocked unless new evidence and approvals explicitly satisfy every gate. Current required mode: **docs plus no-op validation only**.

## Read First

Prompt 8:

- Scope gate, source audit, behavior and fallback inventories, auth/role baseline, broken-route and loop audits, constant alignment, gap register, rulebook, readiness, and Prompt 9 handoff.

Prompt 9:

- Audit verification report.
- Redirect/404 source-of-truth verification.
- Redirect and 404/wildcard correction matrices.
- Auth/role flow, broken-route, loop/priority, and constant-alignment verification.
- Hardening, implementation-batch, validation/test, rollback, and risk-acceptance plans.
- Hardening readiness decision and rulebook hardening report.

Protected-route evidence from Prompts 5-7:

- Auth/role source audits, route classification and guard matrices, redirect baseline and coordination plan, gap/readiness/status reviews, Prompt 7 safety and post-gate review.

Route-constant evidence from Prompts 1-4:

- Declaration, constants, navigation, hardcoded-path, source-of-truth, readiness, Prompt 4 safety, and centralization status documents.

## Prompt 9 Gate Result

- Decision: HUMAN APPROVAL REQUIRED.
- Prompt 10 mode: docs plus no-op validation only.
- Implementation allowed: no.
- Permissible activity: re-audit, clean-diff snapshot, script discovery, static scans, lint/build/boundary baseline if non-mutating, and documentation.

## Authorities To Reuse

- AppRoutes is the browser declaration and wildcard-order authority.
- The explicit /not-found route plus NotFound page form the browser 404 authority.
- server/src/errors/notFoundHandler.js remains the separate API 404 authority.
- ProtectedRoute, RoleRoute, PublicOnlyRoute, EmailVerifiedRoute, authRouteUtils, and accessPolicy retain their current auth/role redirect responsibilities.
- Layouts remain defense-in-depth consumers, not a second router.

## Early Hardening Eligibility

No redirect or fallback is currently eligible for production hardening. Batch B0 no-op snapshot is the only authorized batch. Even apparently low-risk constant-backed or logout behavior requires an approved assertion baseline before edits.

## Excluded Redirects And Fallbacks

- Guard and layout denial destinations.
- Login/register intended-destination behavior.
- Onboarding completion/revisit behavior.
- Role landing, unknown roles, and admin/super_admin hierarchy.
- Guest-only duplicate checks.
- Hardcoded internal full-page transitions.
- Dynamic messages/profile target builders.
- External payment-session destinations.
- Explicit NotFound, wildcard order, and any scoped dashboard/admin/module fallback.
- Legacy-looking pages/Auth.jsx behavior.

## Caution Areas

- Wildcard is currently safe only because it is unique and terminal.
- Wrong-role redirects preserve state.from in RoleRoute; layout fallbacks do not.
- Resend-verification must remain reachable outside the same verification gate.
- Browser and API 404 contracts must remain separate.
- Route constant presence does not prove declaration, access, or behavior compatibility.

## Validation Before Any Future Implementation

- Resolve all human decisions and owners in the risk table.
- Establish and pass the 24-item route/redirect behavior matrix.
- Run client lint, build, client boundary check, and server boundary check with an explained clean baseline.
- Verify deployed deep-link fallback.
- Prove exact targets, role states, query/hash, replace/push, back behavior, loop termination, and rollback for the proposed batch.

## Rollback Requirement

Use the Prompt 9 rollback plan. Every future batch must preserve an exact per-file revert target and rerun the affected state/history matrix after rollback. No destructive workspace reset or whole-router replacement is acceptable.

## Forbidden Changes

Prompt 10 must not modify routes, redirects, NotFound, wildcard order, guards, layouts, auth/role policy, route constants, navigation, imports, packages/config/env/build/deployment files, API behavior, or runtime tests. It must not create a router, redirect system, fallback system, 404 component, wildcard, guard, auth system, role system, or separate ProofArena routing.

## Required Final Response Format

Report the gate decision, snapshot result, skipped/implemented status, safety validation, rollback readiness, retained gaps, Stage 4.3 status, Prompt 11 recommendation, human-review items, unknowns, and exact production-change confirmation.

## Exact Warning

Do not implement redirect/404 hardening unless Prompt 9 explicitly marks implementation ready. If implementation is not ready, Prompt 10 must remain documentation-only and resolve blockers first.
