# ADR-0001 Final Human Approval Brief

Generated: 2026-06-27
Revalidated: 2026-06-28

## What ADR-0001 Decides

ScaleOps is the parent platform, ProofArena stays inside it, and the existing repository and mapped systems remain the starting point. Routes, layouts, dashboard shells, API clients, auth boundaries, modules, shared code, placeholders, critical files, and deletion all receive enforceable governance.

## What ADR-0001 Prevents

Parallel ProofArena architecture; duplicate route, layout, dashboard, API client, auth, or navigation systems; UI-only security; fake production data; unsafe deletion; and unapproved dependency/config/environment changes.

## Safe To Approve Now

- Unified product and repository direction.
- No-duplicate architecture rule.
- Current ownership locks as planning sources, not deletion authorization.
- Backend-authoritative authorization.
- Placeholder classification, preflight, validation, rollback, critical-file, and safe-delete governance.

## Remaining Uncertainty

Client/admin canonical aliases, API version/deprecation, `api.js` compatibility window, protected-shell primitive scope, legacy file ownership, fallback UX, email/throttling controls, compatibility telemetry, and minimum regression tests.

## Human Approval Required

Ratify the product/repository/no-separate-app boundary and answer or explicitly defer each material uncertainty with an owner, date, condition, and future stage.

## Future Stages Depending On Approval

Stages 2-3 depend on boundary/module ratification; Stage 4 on route policy; Stage 5 on API version/facade policy; Stage 8 on fallback UX; Stage 9 on test baseline; Stages 23/26 on auth/security/permissions; Stage 36 on protected-shell limits.

## Top Ten Questions

1. Approve the unified ScaleOps/ProofArena boundary?
2. Which client route is canonical?
3. Which admin proof route is canonical?
4. Which API version and deprecation window are approved?
5. How long must `services/api.js` remain compatible?
6. Which non-policy shell primitives may be shared?
7. Who owns RootLayout and the six unmapped pages?
8. What honest empty/error UX replaces business fallbacks?
9. Which email provider and throttling policy are approved?
10. What regression baseline is mandatory before cleanup?

## Recommended Decision

Keep ADR-0001 **Proposed** until approval is recorded. After approval, accept with explicit conditions for any deferred route, API, layout, ownership, security, or testing decision. Do not treat acceptance as cleanup authorization.

"ProofArena must remain inside ScaleOps unless a future ADR formally reverses this decision."
