# ADR-0001 Human Approval Dossier

Generated: 2026-06-27

## Safe to Approve Now

- ScaleOps parent / ProofArena in-product module boundary.
- One existing repository as current source.
- No duplicate router, layout shell, HTTP client, auth, or navigation stack.
- Existing owner files as planning sources.
- Backend authorization remains the security boundary.
- Classified placeholder and safe-delete governance.
- Mandatory preflight, tests, validation, and rollback.

## Needs Review or Must Remain Conditional

- Canonical client and admin proof routes.
- Canonical API version and compatibility window.
- api.js deprecation schedule.
- Protected-shell shared primitive scope.
- RootLayout/Layout and unmapped page disposition.
- Production email/throttling controls.
- Minimum automated test baseline.
- Business fallback replacement UX.

## Decisions That Must Remain Proposed

- `D-03` route governance remains conditional for client and admin-proof aliases.
- `D-04` layout governance does not authorize protected-shell consolidation.
- `D-05` API governance does not choose `/api` versus `/api/v1` or authorize facade removal.
- `D-07` module ownership does not force unknown legacy files into new folders.

## Blocked By Missing Evidence

- Route alias retirement is blocked by missing compatibility telemetry and route regression tests.
- `services/api.js` retirement is blocked by the missing export-to-caller-to-endpoint map.
- RootLayout and six unmapped page decisions are blocked by unknown runtime/external ownership.
- Cleanup execution is blocked by the missing maintained behavioral test suite.
- Production verification/recovery readiness is blocked by email-provider and throttling gaps.

## What Must Not Be Accepted Yet

- Cleanup, deletion, route deprecation, API-version migration, or facade-removal authorization.
- A claim that current auth delivery/throttling or production data/index behavior is complete.
- A shared protected shell that absorbs role, access, focus, drawer, or action policy.
- Any exception allowing a separate ProofArena router, app, API client, auth system, or navigation stack.

## Top Ten Questions

1. Do you formally approve ProofArena remaining inside ScaleOps?
2. Which client route is canonical?
3. Which admin proof route is canonical?
4. Is `/api/v1` the long-term API contract, and what is the deprecation window?
5. How long must `services/api.js` remain compatible?
6. May non-policy shell primitives be shared while role wrappers remain separate?
7. Are RootLayout and six unmapped pages legacy, externally consumed, or future-owned?
8. What honest empty/error UX replaces business fallbacks?
9. Which production email provider and throttling policy are approved?
10. What test baseline is mandatory before cleanup?

## Recommended Path

Approve the product/repository/no-duplicate governance in principle. Keep ADR-0001 **proposed** until the owner records approval and explicitly defers or answers the conditional questions. Do not accept cleanup decisions through implication.

Exact warning: do not allow a separate ProofArena app unless a future ADR reverses ADR-0001.

## Future Stage Dependencies

| Future stage | Human decision dependency |
| --- | --- |
| Stages 2-3 | Product/repository boundary and module ownership ratification |
| Stage 4 | Client/admin route compatibility policy |
| Stage 5 | API version, endpoint contract, and facade support window |
| Stage 8 | Honest empty/error behavior replacing business fallbacks |
| Stage 9 | Minimum automated regression baseline |
| Stage 23 | Email delivery, throttling, and auth-generation security decisions |
| Stage 26 | Backend-authoritative role and permission policy |
| Stage 36 | Protected-shell abstraction limits and provider dashboard ownership |
