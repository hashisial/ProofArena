# Stage 1 Cross-Stage Claim Consistency Matrix

Generated: 2026-06-27
Revalidated: 2026-06-28

## Summary

- Required claims checked: **15**.
- Hard contradictions: **0**.
- Consistent claims: **14**.
- Incomplete claim: **1** (`CL-15`, Stage 2 readiness at the Prompt 13 snapshot).
- Deliberate deferrals and human-approval gaps remain visible rather than being treated as resolved.

| Claim ID | Claim statement | Stage 1.1 position | Stage 1.2 position | Stage 1.3 ADR position | Status | Evidence docs | Problem if inconsistent | Required correction | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CL-01 | ScaleOps is the parent SaaS. | Explicit product invariant | Preserved in all audit scope | D-01 and final review require it | Consistent | Source summary; invariants; ADR | Product authority fragments | None; human ratification remains | Human review |
| CL-02 | ProofArena is the flagship module inside ScaleOps. | Explicit module boundary | No separate product system allowed | D-01/F-01 preserve in-product ownership | Consistent | Invariants; final findings; ADR | Duplicate product/module architecture | None; ratify wording | Human review |
| CL-03 | No separate ProofArena app should be created. | Forbidden action and duplicate registry | Closure rejects separate router/shell/client/auth | D-02/F-03/G-01 prohibit it | Consistent | Forbidden actions; risk acceptance; rulebook | Entire architecture duplicates | None | Prompt 14 verifies scope |
| CL-04 | The existing repository remains source of truth. | Inventory and manifest define current repo | Locks use current files | D-02/F-02 adopt current repository | Consistent | Repo inventory; source manifest; ADR evidence map | Competing repositories and contracts | Record owner approval | Human review |
| CL-05 | Route constants need governance. | Route inventory finds constants/literals | RTE-001..020 and route lock establish direction | D-03/F-04 preserve AppRoutes/routes.js roles | Consistent | Route inventory; route analysis; ADR | Broken links or parallel constants | Keep aliases until Stage 4 decision | Stage 4 |
| CL-06 | Duplicate route/path systems exist or may overlap. | Duplicate candidates identified | 17 confirmed and 3 possible overlaps | ADR keeps migration conditional | Consistent | Duplicate route audit; final manifest; ADR gap analysis | Mislabeling could trigger unsafe deletion | Use final Stage 1.2 classification | Prompt 14 authority lock |
| CL-07 | Duplicate layouts exist or may overlap. | Layout inventory and overlap radar identify risk | 6 confirmed duplication clusters and 4 overlaps | D-04/F-05 preserve role wrappers | Consistent | Layout audit; final closure; ADR | Role policy may be merged incorrectly | No cleanup without tests | Stages 3/36 |
| CL-08 | Duplicate API/request systems exist or may overlap. | API inventory finds two clients/facades/transports | 8 confirmed overlaps and 2 distinct transports | D-05/F-06 locks one browser transport direction | Consistent | API audit; final closure; ADR | Distinct transports may be merged or a second client created | Preserve apiClient and distinct realtime/server fetch | Stage 5 |
| CL-09 | Placeholders must be classified before replacement. | 48 baseline items and placeholder report | 60 final WPH items split into five risk classes | D-09/F-10/G-12 enforce classification | Consistent | Placeholder reports; final findings; ADR | Fake production truth or removal of valid previews | Use final WPH class and owner approval | Stage 8/features |
| CL-10 | Auth/role guards must not be bypassed. | Auth flow and critical files preserve boundaries | Security placeholders and blockers remain open | D-06/F-07/G-09 make backend authoritative | Consistent | Backend flow; blockers; rulebook | Unauthorized data/API access | Preserve middleware and run role E2E | Stages 23/26 |
| CL-11 | Dashboard shell must not be duplicated. | Dashboard/layout ownership mapped | Role shells and SidebarCore locked | D-04/F-05/G-05/G-06 prohibit parallel shell | Consistent | Layout ownership; lock table; rulebook | Role leakage and shell drift | Reuse wrappers/SidebarCore | Stages 3/36 |
| CL-12 | Critical files require preflight checks. | Protection list defines categories | Cleanup contracts require target checks | F-13/G-18 make checks enforceable | Consistent | Critical list; execution contracts; control board | Broad regressions | Stop on missing preflight | Prompt 14 safety check |
| CL-13 | Safe-delete policy is mandatory before deletion. | Forbidden actions prohibit casual removal | Dedicated safe-delete policy blocks unknowns | F-12/G-13 require separate proof/approval | Consistent | Forbidden actions; safe-delete policy; ADR | Hidden consumers break | No deletion in audit prompts | All cleanup stages |
| CL-14 | Future prompts must read Stage 1 docs before risky edits. | Future-prompt checklist established | Execution contracts cite source docs | D-10/F-14/G-16 enforce preflight | Consistent | Preflight checklist; contracts; adoption package | Repeated discovery and contradictory architecture | Cite governing docs and IDs | Every future prompt |
| CL-15 | Stage 2 starts only after Stage 1 closeout conditions. | Stage 1.1 readiness was conditional | Stage 1.2 ready for ADR, not cleanup | Prompt 12 snapshot says 74/100, not ready until Prompts 13-15 and boundary decision | Incomplete | Completion review; Stage 1.2 handoff; Stage 2 snapshot | Stage 2 may start with unresolved authority/safety gates | Prompt 14 verifies safety; Prompt 15 issues final handoff | Prompts 14 and 15 |
