# Stage 3 Prompt 10 Correction Plan

No final architectural decision is changed by this plan.

| ID | Issue | Source | Target later | Recommended correction | Safe now | Reason | Blocks Stage 4 | Future prompt | Human review |
|---|---|---|---|---|---|---|---|---|---|
| COR-001 | Source index lists missing Stage 3.1 human log | Authority validation | Final source index | Mark missing/remove present-authority row until restored | yes | Pure factual consistency | no | Prompt 11 | yes |
| COR-002 | Final manifest references missing human log and incomplete unknowns | Manifest reconciliation | Final manifest | Remove/mark missing reference; add human/readiness/handoff gaps | yes | Machine/doc consistency only | no | Prompt 11 | yes |
| COR-003 | Final UI/HUT locks omitted from primary/official lists | Authority validation | Source index + final manifest | Add both final lock references | yes | Existing final authority, no meaning change | no | Prompt 11 | no |
| COR-004 | Stage 3.1 sub-manifest lacks final closeout fields | Manifest reconciliation | Stage 3.1 manifest | Append final existing lock/decision fields and explicit missing-artifact list | yes with caution | Preserves history; must not invent missing docs | no | Prompt 11 | yes |
| COR-005 | Historical tracker Prompt 9-12 sequence conflicts with current final 1-9 chronology | Consistency report | Stage 3 tracker | Label older sequence historical/superseded; do not delete | yes | Clarifies chronology only | no | Prompt 11 | yes |
| COR-006 | Four Stage 4 duplicate checks are implicit | Safety audit | Preflight + Prompt 1 handoff | Add explicit protected/admin/role guard and redirect/404 duplicate checks | yes | Strengthens existing prohibition | no for audit | Prompt 11 | no |
| COR-007 | Three mandatory Stage 3.1 final docs and handoff brief are missing | Existence/carryforward audits | Missing Stage 3.1 artifacts | Restore from evidence or formally supersede/waive | no | Creating them could invent authority/readiness | no for docs-only | Human-approved correction prompt | yes |
| COR-008 | Final 16-risk count can be read as total Stage 3 risk count | Consistency report | Final manifest/handoff/index | Label as Stage 3.3 risks plus inherited Stage 3.1/3.2 blockers | yes | Scope clarification | no | Prompt 11 | yes |
| COR-009 | Stage 3.1 path/scaffold locks omitted from index | Authority validation | Final source index | Add as production-path supporting/primary controls | yes | Existing docs; no decision change | no | Prompt 11 | no |
| COR-010 | Stage 4 readiness should remain documentation-only | All final docs | No correction required | Preserve start-with-caution wording | n/a | Claims already align | no | Prompt 11 verification | no |

## Priority

Prompt 11 should apply `COR-001` through `COR-006`, `COR-008`, and `COR-009` as documentation-only reconciliation, then revalidate. `COR-007` requires human approval and must remain explicit if unresolved.

