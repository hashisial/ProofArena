# Stage 4 Prompt 9 Handoff

## Objective

Prompt 9 must verify every Prompt 8 redirect/404 claim against current repository evidence, correct weak or contradicted findings without erasing uncertainty, and create a safe hardening plan only if the verified evidence supports one. Prompt 9 remains documentation-only.

## Read First

Prompt 8 documents:

- STAGE_4_PROMPT_8_STAGE_4_3_SCOPE_GATE_DECISION.md
- STAGE_4_3_REDIRECT_404_SYSTEM_SOURCE_OF_TRUTH_AUDIT.md
- STAGE_4_3_REDIRECT_BEHAVIOR_INVENTORY.md
- STAGE_4_3_404_NOTFOUND_WILDCARD_INVENTORY.md
- STAGE_4_3_AUTH_ROLE_REDIRECT_BASELINE_MATRIX.md
- STAGE_4_3_BROKEN_ROUTE_AND_FALLTHROUGH_RISK_AUDIT.md
- STAGE_4_3_REDIRECT_LOOP_AND_PRIORITY_RISK_AUDIT.md
- STAGE_4_3_ROUTE_CONSTANT_ALIGNMENT_FOR_REDIRECTS_404.md
- STAGE_4_3_REDIRECT_404_GAP_REGISTER.md
- STAGE_4_3_REDIRECT_404_GOVERNANCE_RULEBOOK_DRAFT.md
- STAGE_4_3_REDIRECT_404_READINESS_ASSESSMENT.md

Protected-route evidence from Prompts 5-7:

- STAGE_4_2_AUTH_ROLE_SYSTEM_SOURCE_OF_TRUTH_AUDIT.md
- STAGE_4_2_PROTECTED_ROUTE_CLASSIFICATION_MATRIX.md
- STAGE_4_2_UNAUTHORIZED_FORBIDDEN_LOGIN_REDIRECT_BASELINE.md
- STAGE_4_2_AUTH_ROLE_SOURCE_OF_TRUTH_VERIFICATION.md
- STAGE_4_2_GUARD_SYSTEM_VERIFICATION_MATRIX.md
- STAGE_4_2_REDIRECT_POLICY_COORDINATION_PLAN.md
- STAGE_4_2_PROTECTED_ROUTE_HARDENING_READINESS_DECISION.md
- STAGE_4_PROMPT_7_EXECUTION_GATE_DECISION.md
- STAGE_4_PROMPT_7_PROTECTED_ROUTE_SAFETY_VERIFICATION.md
- STAGE_4_PROMPT_7_ACCESS_CONTROL_VALIDATION_EXECUTION_REPORT.md
- STAGE_4_2_PROTECTED_ROUTE_STATUS_REVIEW.md

Route-constant evidence from Prompts 1-4:

- STAGE_4_1_ROUTE_DECLARATION_INVENTORY.md
- STAGE_4_1_ROUTE_CONSTANTS_INVENTORY.md
- STAGE_4_1_NAVIGATION_LINK_INVENTORY.md
- STAGE_4_HARDCODED_PATH_AND_DUPLICATION_DEEP_ANALYSIS.md
- STAGE_4_1_ROUTE_SOURCE_OF_TRUTH_VERIFICATION_MATRIX.md
- STAGE_4_1_SAFE_IMPLEMENTATION_READINESS_DECISION.md
- STAGE_4_PROMPT_4_ROUTE_CONSTANTS_SAFETY_VERIFICATION.md
- STAGE_4_1_CENTRALIZE_ROUTE_CONSTANTS_STATUS_REVIEW.md

## Required Verification

- Confirm AppRoutes, NotFound, and the terminal wildcard remain the single browser fallback authority.
- Confirm the API not-found handler remains a separate backend contract.
- Verify all 35 redirect behaviors and distinguish policy redirects from ordinary post-action navigation.
- Verify guard, layout, page, authRouteUtils, and accessPolicy evaluator ordering.
- Resolve or explicitly defer /403 versus /not-authorized, unknown-role landing, and admin/super_admin hierarchy.
- Verify login/register intended-destination permission, validation, history, and loop behavior.
- Verify logout ordering and parity across the public header and all three shell topbars.
- Locate the onboarding completion source-of-truth and decide whether completion/revisit redirects exist or are required.
- Verify unverified-user access to resend-verification and its ordering relative to protected routes.
- Determine runtime reachability and ownership of pages/Auth.jsx before planning any change.
- Verify /offers route intent, dynamic profile/service/message target contracts, and every hardcoded internal full-page transition.
- Verify direct deep-link host fallback and terminal wildcard ordering without changing deployment configuration.
- Verify all 44 route-constant alignment rows and do not invent new keys or builders.
- Reassess all 18 gaps and assign accountable owners for policy-sensitive decisions.

## Gaps That Block Hardening

- Canonical denial priority and wrong-role destination.
- Unknown-role and admin/super_admin policy.
- Onboarding completion and revisit policy.
- Verification/resend route precedence.
- Legacy Auth reachability.
- Route metadata and /offers intent gaps.
- Deployment deep-link fallback.
- External payment-session destination validation policy.
- Missing automated redirect loop, history, and role-state matrix.

## Forbidden Changes

Prompt 9 must not modify route declarations, redirect rules, NotFound, wildcard order, auth pages, protected routes, guards, layouts, route constants, navigation, role definitions, API behavior, imports, package/config/env/build/deployment files, or runtime tests. It must not create a new redirect, fallback, 404, router, route-constant, auth, role, or navigation authority.

## Required Output Direction

Prompt 9 should produce verified/corrected inventories, an ordered redirect policy decision table, exact candidate batches, validation and rollback plans, risk acceptance, and a readiness decision. If any critical policy remains unapproved, the implementation gate must remain closed.

## Required Final Response Format

Report files created and updated, audit verification result, corrected redirect/fallback findings, policy and source-of-truth result, blocking gaps, hardening-plan readiness, validation/rollback readiness, human-review items, unknowns, recommended Prompt 10 focus, and the exact no-production-change confirmation required by Prompt 9.

## Exact Warning

Do not modify redirect rules, 404 behavior, wildcard routes, unauthorized redirects, forbidden redirects, login redirects, logout redirects, onboarding redirects, role-landing redirects, route constants, navigation, or guards until the redirect/404 audit is verified and a safe hardening plan exists.
