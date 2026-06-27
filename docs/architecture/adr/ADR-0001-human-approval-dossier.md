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

