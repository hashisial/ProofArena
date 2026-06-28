# Stage 1 Remaining Risk Register

Generated: 2026-06-27
Revalidated: 2026-06-28

| Risk ID | Risk title | Source stage | Related docs | Related files/systems | Severity | Likelihood | Blast radius | Current mitigation | Remaining action | Human review | Future stage owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SR-01 | Boundary not ratified | 1.3 | ADR final status; acceptance gate | Product and repository boundary | High | Medium | Entire product and roadmap | Keep ADR Proposed; enforce no-duplicate rule | Record owner approval or explicit deferral | Yes | Architecture / Stage 2 | Open |
| SR-02 | Client alias undecided | 1.2 | Route lock; blocker B-04 | routes.js, AppRoutes, client navigation | High | Medium | Client links, bookmarks, role shell | Preserve all aliases | Decide canonical policy with telemetry/tests | Yes | Stage 4 | Open |
| SR-03 | Admin proof alias undecided | 1.2 | Route lock; blocker B-05 | Admin routes, pages, navigation | High | Medium | Admin proof workflows | Preserve all paths | Owner decision plus page/API mapping | Yes | Admin / Stage 4 | Open |
| SR-04 | API version undecided | 1.1/1.2 | API lock; blocker B-06 | Server route indexes and feature builders | High | High | All versioned API consumers | Preserve mounts/builders | Decide version/deprecation with telemetry/contracts | Yes | Stage 5 | Open |
| SR-05 | Legacy API facade remains broad | 1.1/1.2 | API analysis; blocker B-07 | `api.js` and 29 importers | High | High | Client API behavior and transforms | Freeze compatibility | Build method map and migrate incrementally | No for mapping; yes for retirement | Stage 5 | Open |
| SR-06 | Protected shell repetition | 1.2 | Layout lock; blast-radius report | Three layouts, topbars, drawers | High | Medium | Provider/client/admin dashboards | Preserve role wrappers | Add tests, then extract non-policy primitives | Yes | Stages 3 and 36 | Open |
| SR-07 | RootLayout ownership unknown | 1.2 | Layout findings; blocker B-02 | RootLayout and components/Layout | Unknown | Low | Public shell or external consumers | No deletion or reuse | Runtime, barrel, import, external proof | Yes | Stage 4 | Unknown |
| SR-08 | Six page owners unknown | 1.1/1.2 | WPH-042..047; blocker B-03 | Six unmapped page files | Unknown | Medium | Auth/content/profile/admin features | No reuse or deletion | Product owner and runtime/import proof | Yes | Feature owners | Unknown |
| SR-09 | Maintained regression tests missing | 1.2 | Test-gap report; blocker B-01 | Whole repository | High | High | All risky cleanup and refactors | Cleanup execution blocked | Add target route/role/layout/API/auth suites | Yes | Stage 9 | Open |
| SR-10 | Compatibility telemetry absent | 1.2 | Blocker B-12; acceptance gaps | Aliases, API mounts, adapters, facades | High | Medium | External contracts and deprecation | Preserve compatibility | Add or inspect usage telemetry | Yes | Stages 4 and 5 | Open |
| SR-11 | Production email delivery incomplete | 1.1/1.2 | WPH-035/WPH-037; blocker B-09 | Auth controller and provider config | High | High | Verification and recovery users | Development-only claim | Approve provider and pass delivery E2E | Yes | Stage 23 | Blocked |
| SR-12 | Auth throttling incomplete | 1.1/1.2 | WPH-036; blocker B-10 | Auth routes and rate limits | High | High | Account security and abuse controls | Existing general limiter only | Approve user/email/IP policy and tests | Yes | Stage 23 | Blocked |
| SR-13 | Auth generations overlap | 1.1 | Auth dependency/risk docs | Auth services, middleware, compatibility aliases | High | Medium | Session and authorization behavior | Do-not-merge rule | Dedicated dependency and security review | Yes | Stage 23 | Open |
| SR-14 | Business-looking fallback data | 1.2 | WPH-028..030; risk acceptance RA-05 | constants, api.js, ReviewsSection | High | High | Public trust and marketplace behavior | Not accepted as production truth | Approve empty/error UX and tests | Yes | Stage 8 / features | Open |
| SR-15 | Route metadata gaps | 1.1/1.2 | Route analysis; RTE-019 | routeMetadata and AppRoutes | Medium | High | Titles, breadcrumbs, route UX | Existing fallback behavior | Fill gaps after alias policy | No | Stage 4 | Open |
| SR-16 | Production model/index behavior unknown | 1.1 | Model usage map; RA-13 | Mongoose models and deployed database | Unknown | Medium | Persistent data and query performance | No casual model/index edits | Query plans, migration, backup, rollback evidence | Yes | Data stage | Unknown |
| SR-17 | Config/deployment drift | 1.1/1.3 | Critical-file list; rulebook G-14/G-15 | Env, package, build, deployment files | High | Medium | Build and deployment | Critical controls and explicit approval | Validate every approved change | Yes | Stage 6 | Mitigated |
| SR-18 | ADR human gate pending | 1.3 | Acceptance gate AG-12; human brief | ADR-0001 governance | High | Medium | Governance adoption and Stage 2 boundary | Keep ADR Proposed | Answer or explicitly defer questions | Yes | Architecture owner | Open |

Remaining risk count: **18**.

## Prompt 13 Cross-Stage Evidence Update

No new risk ID was added because Prompt 13 findings map to existing risks.

| Prompt 13 risk category | Existing risk IDs | Evidence update | Required action |
| --- | --- | --- | --- |
| Contradictory docs | SR-02, SR-03, SR-04, SR-18 | No hard contradiction; route/API/approval differences are explicit gaps. | Preserve owners and do not resolve by assumption. |
| Missing docs | None | All 96 expected Stage 1 documents were found. | Prompt 14 rechecks completeness. |
| Stale source authority | SR-18 | Nineteen files/groups have limited or superseded authority but remain evidence. | Prompt 14 locks primary/supporting/historical labels. |
| Manifest inconsistency | SR-17, SR-18 | Nine manifests parse; two legacy schema exceptions lack closeout fields. | Prompt 14 records intentional schema exceptions. |
| Metric inconsistency | SR-18 | No numeric contradiction; baseline, final, and readiness units can be conflated. | Prompt 14 locks canonical labels and units. |
| ADR alignment gaps | SR-01, SR-18 | All decisions align; human boundary gate remains open. | Record approval or explicit deferral. |
| Stage 2 readiness uncertainty | SR-01, SR-09, SR-18 | Prompt 12 snapshot remains 74/100 and not ready at Prompt 13. | Prompt 15 owns final handoff after Prompt 14 safety proof. |

## Prompt 14 Final Safety Evidence Update

| Prompt 14 safety area | Related risk IDs | Evidence result | Status / assignment |
| --- | --- | --- | --- |
| Missing documents | None | 119/119 required Stage 1 and Prompt 13/14 package files exist. | Resolved for Prompt 14; Prompt 15 adds final outputs. |
| Manifest issues | SR-17, SR-18 | 10/10 required manifests parse; two legacy/artifact and two schema-specific exceptions are documented, with no semantic conflict. | Mitigated; Prompt 15 validates final manifests. |
| Unresolved contradictions | SR-02, SR-03, SR-04, SR-09, SR-18 | Zero hard contradictions; three gaps deferred, one cleanup/testing gap blocked, one human gate open, and one readiness-authority item resolved. | Assigned to Stage 4, Stage 5, Stage 9, Prompt 15, or human review. |
| Unknown metrics | None | All 17 required metric families have canonical values and explicit units; 0 values remain unknown. | Resolved for documentation scope. |
| Stage 2 readiness blockers | SR-01, SR-09, SR-18 | Prompt 14 score is 92/100, but Stage 2 remains not ready at Prompt 14 and the 74/100 value is historical. | Prompt 15 must publish final start authority and exact first-scope checks/rollback. |
| Human approvals | SR-01, SR-18 | ADR-0001 remains proposed; owner approval or explicit deferral is absent. | Architecture owner and Prompt 15. |
| Production-code-change uncertainty | SR-17 | Current Git diff is documentation-only; no deletion or package/config/env/build/source change exists. Historical proof remains bounded to Git/manifests. | Mitigated; Prompt 15 reruns Git scope proof. |

## Prompt 15 Final Status Addendum

| Risk | Final status | Final owner | Final required action | Blocks Stage 2 authorization | Blocks affected production changes |
| --- | --- | --- | --- | --- | --- |
| SR-01 | Human review required | Architecture owner | Record ADR boundary approval or explicit deferral. | Yes | Yes |
| SR-02 | Deferred to later stage | Stage 4 + product owner | Decide canonical client route with telemetry/tests. | No | Yes, route removal only |
| SR-03 | Deferred to later stage | Admin / Stage 4 | Map ownership and decide canonical admin proof route. | No | Yes, route removal only |
| SR-04 | Deferred to later stage | Stage 5 + architecture owner | Decide API version and facade window. | No | Yes, API contract changes |
| SR-05 | Accepted temporarily | Stage 5 | Preserve compatibility until caller migration is proven. | No | Yes, facade retirement |
| SR-06 | Deferred to Stage 2 analysis | Stage 2; Stages 3/36 implementation | Verify shell ownership; do not consolidate in Stage 2. | No | Yes, shell edits |
| SR-07 | Human review required | Architecture owner / Stage 4 | Prove `RootLayout` ownership before reuse/deletion. | No for docs-only Stage 2 | Yes |
| SR-08 | Human review required | Feature owners | Confirm runtime ownership for six page files. | No for docs-only Stage 2 | Yes |
| SR-09 | Blocked | Stage 9 + affected owner | Add maintained target suites before risky cleanup. | No for docs-only Stage 2 | Yes, risky cleanup |
| SR-10 | Deferred to Stage 2 analysis | Stage 2; Stages 4/5 implementation | Define/inspect compatibility telemetry. | No | Yes, compatibility removal |
| SR-11 | Blocked | Stage 23 | Complete production email provider and E2E proof. | No for boundary-only Stage 2 | Yes, auth delivery changes |
| SR-12 | Blocked | Stage 23 | Approve throttling policy and pass tests. | No for boundary-only Stage 2 | Yes, auth security changes |
| SR-13 | Deferred to later stage | Stage 23 | Run auth dependency/security review. | No | Yes, auth consolidation |
| SR-14 | Accepted temporarily | Stage 8 / feature owners | Keep disclosed fallback only; replace with honest empty/error UX. | No | Yes, production-truth promotion |
| SR-15 | Deferred to Stage 2 analysis | Stage 2; Stage 4 implementation | Record metadata ownership, implement after alias policy. | No | No for documentation-only analysis |
| SR-16 | Human review required | Data owner | Obtain query, migration, backup, and rollback evidence. | No for docs-only Stage 2 | Yes |
| SR-17 | Accepted temporarily | Stage 6 / release owner | Preserve controls and validate every approved config/deploy change. | No | Yes, config/deployment edits |
| SR-18 | Human review required | Architecture owner | Record ADR acceptance or explicit deferral. | Yes | Yes |

Final disposition counts: **3 accepted temporarily, 3 deferred to Stage 2, 4 deferred later, 5 human-review, 3 blocked, 0 unknown**. `SR-01` and `SR-18` block Stage 2 authorization; system-specific risks block only changes to their affected production areas.
