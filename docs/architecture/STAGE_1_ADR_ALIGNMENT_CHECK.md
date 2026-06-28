# Stage 1 ADR Alignment Check

Generated: 2026-06-27
Revalidated: 2026-06-28

| Decision ID | Decision statement | Stage 1.1 support | Stage 1.2 support | Contradictions | Missing evidence | Enforcement docs | Future-stage impact | Alignment | Action before Stage 2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D-01 | ScaleOps parent; ProofArena in-product flagship | Source summary and product invariant | All audit scopes preserve unified product | None | Human ratification | ADR, rulebook G-01, control CB-01 | Stage 2 and all modules | Aligned | Approve or explicitly defer boundary. |
| D-02 | Existing repository remains source of truth; no separate app | Repo inventory, duplicate registry, forbidden actions | Final locks use existing files | None | External organizational context | ADR, adoption package, rulebook G-02 | Stage 2/repository governance | Aligned | Confirm current repository in preflight. |
| D-03 | Existing route system governs paths and behavior | Route inventory/dependency map | RTE findings, route lock, blockers | No contradiction; aliases unresolved | Client/admin policy and telemetry | G-03/G-04; CB-02 | Stages 4 and 22 | Mostly aligned | Preserve aliases; do not canonicalize in Stage 2. |
| D-04 | Preserve role layouts/dashboard and SidebarCore | Layout inventory and dependency map | Six duplicate clusters, four overlaps, layout lock | None | Browser/role test baseline | G-05/G-06; CB-03 | Stages 3 and 36 | Mostly aligned | No shell consolidation before tests. |
| D-05 | One browser API transport direction with staged facade compatibility | API inventory and backend flow | Eight overlaps, two distinct transports, API blockers | None | API version, facade caller map, telemetry | G-07/G-08; CB-04 | Stage 5 | Mostly aligned | Preserve apiClient/facade/mount behavior. |
| D-06 | Frontend guard UX plus backend-authoritative auth/roles | Auth flow, backend middleware map, critical files | Security placeholders/blockers remain explicit | None | Email/throttling and auth-generation tests | G-09; CB-05 | Stages 23 and 26 | Aligned as governance | Do not claim implementation completion. |
| D-07 | Feature module ownership with mapped legacy exceptions | Frontend/backend ownership and boundary reports | Unknown pages and legacy overlap remain blocked | None | Six page owners and some legacy ownership | G-10 | Stage 3 and feature stages | Mostly aligned | Require explicit owner before moves. |
| D-08 | Shared code only for stable cross-module contracts | Reusable/dependency maps | Sidebar adapters and utility overlaps classified | None | Per-change behavioral equivalence | G-11; CB-07 | Stage 7 and all features | Aligned | No broad shared refactor in Stage 2. |
| D-09 | Placeholder classes govern replacement; fake truth prohibited | Baseline placeholder report | Final 60-item classification and risk acceptance | Stage 1.1 count differs by audit depth only | Product/legal/security replacement approvals | G-12; CB-08 | Stage 8 and owning features | Aligned | Use final WPH classes. |
| D-10 | Preflight, testing, rollback, safe delete, and critical protection govern refactors | Guardrails, preflight, critical list | Candidate ledger, QA, test gaps, safe-delete policy | None | Maintained behavioral tests remain absent | G-13 through G-20; CB-09..11 | Every future stage | Aligned | Prompt 14 verifies safety; Prompt 15 locks handoff. |

ADR-0001 is aligned with Stage 1.1 and Stage 1.2. Alignment does not satisfy the failed human-approval gate, and it does not authorize cleanup.
