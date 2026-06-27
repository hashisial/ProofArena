# Stage 1.2 Test Gap Report

Generated: 2026-06-27

## Tooling Found

| Scope | File | Available scripts |
| --- | --- | --- |
| Client | `client/package.json` | `dev`, `build`, `preview`, `lint`, `check:boundaries` |
| Server | `server/package.json` | `dev`, `start`, `check:boundaries` |
| Root | No root `package.json` found | None |
| Tests | Repository scan excluding generated/dependency directories | No test/spec files found |
| Typecheck | Client/server package scripts | Not found |

No Jest, Vitest, Playwright, Cypress, Supertest, or equivalent maintained test command is declared in the inspected package files.

## Missing Coverage

| Gap | Missing evidence | Blocked candidates |
| --- | --- | --- |
| Route declarations/aliases | Direct-load, redirect, compatibility bookmark tests | RTE-001..012, RTE-016/019/020 |
| Route metadata | ID/path/title/breadcrumb/access coverage | RTE-019 |
| Auth guards | Guest/provider/client/admin/unknown and auth-loading behavior | RTE-004/011/012/016; layouts; API-002 |
| Layout shells | Grid, overflow, role wrappers, content expansion | LAY-003..008 |
| Mobile drawers | Escape, overlay, route close, focus restore, hidden tab order | LAY-006 |
| Public nav | Hover/focus/Escape/mobile/disabled/active behavior | RTE-003/015 |
| API transport | Base URL, token, refresh, normalized errors, envelope | API-001/005 |
| Feature services | Method/path/version/response contracts | API-002..008, RTE-014/018 |
| Backend contracts | 304 operation behavior and 537 mount variants | Dual-mount cleanup |
| Auth email/security | Real provider delivery and user/email throttling | WPH-035..037 |
| Models/services | Persistent behavior and indexes under production-like data | Backend/model cleanup |
| Placeholder safety | Empty/error behavior and no fake success/data | WPH-028..030 |
| Delete candidates | Runtime/lazy/external ownership | RootLayout and WPH-042..048 |

## Minimum Baseline Before Risky Cleanup

1. Route-manifest tests for all 108 entries, guards, and catch-all.
2. Role matrix tests for guest/provider/client/admin/unknown.
3. Browser tests for public nav, three shells, collapse, drawers, focus, and overflow.
4. apiClient tests for base URL, auth injection, refresh serialization, errors, envelopes, uploads.
5. Contract tests for every facade method migrated.
6. Server route/middleware/controller tests for changed endpoints.
7. Auth recovery/verification delivery and rate-limit tests.
8. Explicit empty/error tests before removing business fallbacks.
9. Build/lint/boundary checks on every isolated change.
10. Runtime/import evidence plus human approval before deletion.

## Current Cleanup Effect

- 54 candidates are blocked.
- 6 candidates remain unknown.
- "Ready" candidates are primarily retain/document/label decisions, not deletion work.
- Broad cleanup execution must not start until the relevant tests exist.
