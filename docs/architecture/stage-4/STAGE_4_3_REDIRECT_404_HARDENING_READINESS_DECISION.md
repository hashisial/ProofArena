# Stage 4.3 Redirect and 404 Hardening Readiness Decision

## Decision

**HUMAN APPROVAL REQUIRED.**

## Required Prompt 10 Mode

**docs plus no-op validation only**

Prompt 10 may re-check the gate, capture a clean source/runtime snapshot, inspect available scripts, and execute non-mutating static validation. It may not implement any redirect, 404, wildcard, guard, route, constant, navigation, layout, auth, or role change.

## Reason

The platform redirect and fallback authorities are verified and a staged plan exists, but policy and validation blockers remain. The evidence does not support selecting denial targets, role defaults, onboarding behavior, scoped fallback behavior, external payment URL policy, or route migrations.

## Evidence Docs

- Prompt 9 audit verification and source-of-truth verification.
- Redirect and fallback correction matrices.
- Auth/role flow, broken-route, loop/priority, and constant-alignment verification.
- Hardening, batch, validation, rollback, and risk-acceptance plans.
- Stage 4.2 protected-route decisions and Stage 4.1 constant readiness documents.

## Blocking Issues

- Canonical denial evaluator priority and /403 versus /not-authorized semantics.
- Unknown-role and admin/super_admin landing policy.
- Onboarding completion/revisit authority.
- Email verification/resend reachability regression evidence.
- /offers route intent and route metadata ownership gaps.
- Runtime reachability of pages/Auth.jsx.
- Dynamic messages/profile target contracts.
- External payment-session origin/scheme/failure policy.
- Host-level SPA deep-link fallback evidence.
- No automated redirect/role/history/loop baseline.

## Accepted Risks

- Current explicit NotFound plus terminal wildcard may remain unchanged.
- Browser and API 404 scopes remain separate.
- Current logout callers may remain unchanged pending tests.

## Deferred Risks

- Hardcoded internal redirect migration is deferred to an approved route-constant batch.
- Guard/layout policy reconciliation is deferred to protected-route governance.
- Scoped fallbacks are deferred until product/security intent exists.

## Human Approvals Required

Architecture/security approval for denial priority and role hierarchy; product approval for route, onboarding, and scoped-fallback intent; security/payment approval for external session destinations.

## Gate Condition

Prompt 10 implementation remains blocked unless every affected decision has an owner and approval, the no-op baseline passes, a behavioral route matrix exists, exact files/targets are identified, and rollback is independently executable. Prompt 9 authorizes no production batch.
