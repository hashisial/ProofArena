# Stage 1 Final Risk Acceptance and Deferment Table

Generated: 2026-06-28

This table is the final Stage 1 risk-disposition authority. Detailed descriptions remain in `STAGE_1_REMAINING_RISK_REGISTER.md`.

| Risk | Title | Source | Related evidence | Files/systems | Severity | Final status | Reason / expiry | Required future action | Final owner | Resolve before production change |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SR-01 | Boundary not ratified | 1.3 | ADR status/gate/human brief | Product/repository boundary | high | human review required | No owner acceptance or explicit deferral; expires when recorded. | Approve ADR-0001 or explicitly defer while retaining controls. | Architecture owner / Prompt 15 handoff | yes |
| SR-02 | Client alias undecided | 1.2 | Route lock; blocker B-04 | Client routes/navigation/bookmarks | high | deferred to later stage | Stage 2 boundary work does not need canonical route selection. | Use telemetry/tests and decide in Stage 4. | Stage 4 + product owner | yes for route removal |
| SR-03 | Admin proof alias undecided | 1.2 | Route lock; blocker B-05 | Admin routes/pages/navigation | high | deferred to later stage | Ownership and usage evidence remain incomplete. | Map page/API use and decide in Stage 4. | Admin / Stage 4 | yes for route removal |
| SR-04 | API version undecided | 1.1/1.2 | API lock; blocker B-06 | Server mounts/builders/consumers | high | deferred to later stage | Version/deprecation needs contracts and telemetry. | Decide version/facade window in Stage 5. | Stage 5 + architecture owner | yes for API contract change |
| SR-05 | Legacy API facade remains broad | 1.1/1.2 | API source analysis; blocker B-07 | Legacy facade and 29 importers | high | accepted temporarily | Compatibility is safer than bulk migration; expires after caller map/tests. | Migrate incrementally, then retire with rollback. | Stage 5 | yes for facade retirement |
| SR-06 | Protected shell repetition | 1.2 | Layout lock; blast-radius report | Provider/client/admin shells | high | deferred to Stage 2 | Boundary work may clarify ownership; consolidation still needs tests. | Verify role boundaries, then defer implementation to Stages 3/36. | Stage 2 analysis; Stages 3/36 implementation | yes for shell edits |
| SR-07 | `RootLayout` ownership unknown | 1.2 | Layout findings; blocker B-02 | `RootLayout`, layout components | unknown | human review required | Runtime/external ownership is not proven. | Obtain import/runtime/barrel/owner evidence. | Architecture owner / Stage 4 | yes for reuse/deletion |
| SR-08 | Six page owners unknown | 1.1/1.2 | Placeholder findings WPH-042..047 | Six unmapped page files | unknown | human review required | Product/runtime ownership is unclear. | Confirm owners and reachability. | Feature owners | yes for reuse/deletion |
| SR-09 | Maintained regression tests missing | 1.2 | Test-gap report; blocker B-01 | Routes/layouts/API/auth/cleanup | high | blocked | Risky cleanup cannot be verified; expires when target suites pass. | Add maintained target tests before cleanup/refactor. | Stage 9 + affected owner | yes for risky cleanup |
| SR-10 | Compatibility telemetry absent | 1.2 | Blocker B-12 | Aliases, mounts, adapters, facades | high | deferred to Stage 2 | Stage 2 may identify telemetry requirements; removal remains blocked. | Define/inspect usage telemetry before consolidation. | Stage 2 analysis; Stages 4/5 execution | yes for compatibility removal |
| SR-11 | Production email delivery incomplete | 1.1/1.2 | WPH-035/037; blocker B-09 | Auth controller/provider config | high | blocked | Development behavior is not production delivery proof. | Approve provider and pass delivery E2E. | Stage 23 | yes for auth release/change |
| SR-12 | Auth throttling incomplete | 1.1/1.2 | WPH-036; blocker B-10 | Auth routes/rate limits | high | blocked | User/email/IP policy and tests are incomplete. | Approve throttling policy and pass tests. | Stage 23 | yes for auth security change |
| SR-13 | Auth generations overlap | 1.1 | Auth dependency/risk docs | Auth services/middleware/aliases | high | deferred to later stage | Consolidation has high session/security blast radius. | Run dedicated dependency/security review. | Stage 23 | yes for auth consolidation |
| SR-14 | Business-looking fallback data | 1.2 | WPH-028..030; RA-05 | Constants, API facade, reviews | high | accepted temporarily | Allowed only as disclosed temporary fallback; expires when real empty/error UX exists. | Replace with honest empty/error states and tests. | Stage 8 / feature owners | yes for production-truth promotion |
| SR-15 | Route metadata gaps | 1.1/1.2 | Route analysis; RTE-019 | Metadata, titles, breadcrumbs | medium | deferred to Stage 2 | Boundary documentation can map ownership; implementation follows alias policy. | Record ownership then implement in Stage 4. | Stage 2 analysis; Stage 4 execution | no for documentation-only Stage 2 |
| SR-16 | Production model/index behavior unknown | 1.1 | Model usage map; RA-13 | Mongoose models/deployed database | unknown | human review required | Query plans, data shape, backup, and rollback are absent. | Obtain production-like evidence and migration plan. | Data owner | yes for model/index edits |
| SR-17 | Config/deployment drift | 1.1/1.3 | Critical list; rulebook G-14/G-15 | Env/package/build/deployment | high | accepted temporarily | Existing controls mitigate risk; expires on approved config change. | Validate and roll back every approved change. | Stage 6 / release owner | yes for config/deploy edits |
| SR-18 | ADR human gate pending | 1.3 | Acceptance gate AG-12 | ADR-0001 governance | high | human review required | Formal adoption remains unresolved. | Record acceptance or explicit deferral. | Architecture owner | yes; blocks Stage 2 authorization |

## Final Counts

| Disposition | Count | Risk IDs |
| --- | ---: | --- |
| Accepted temporarily | 3 | SR-05, SR-14, SR-17 |
| Deferred to Stage 2 | 3 | SR-06, SR-10, SR-15 |
| Deferred to later roadmap stage | 4 | SR-02, SR-03, SR-04, SR-13 |
| Human review required | 5 | SR-01, SR-07, SR-08, SR-16, SR-18 |
| Blocked | 3 | SR-09, SR-11, SR-12 |
| Unknown disposition | 0 | None |
| Total | 18 | SR-01 through SR-18 |

## Stage 2 Effect

`SR-01` and `SR-18` block Stage 2 authorization until architecture-owner approval or explicit deferral. Other human/blocked risks block only work touching their affected systems; the first Stage 2 prompt must remain documentation-only and must not absorb those implementation scopes.
