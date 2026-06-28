# ADR-0001 Acceptance Gate

Generated: 2026-06-27
Revalidated: 2026-06-28

| Gate ID | Gate description | Required evidence | Human approval | Pass condition | Fail condition | Current result | Action if failed | Related docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AG-01 | Product boundary confirmed | Unified ScaleOps/ProofArena evidence and owner decision | Required | Owner ratifies parent/flagship wording | Boundary is rejected or unrecorded | Conditional | Keep Proposed and stop boundary-dependent restructuring | Stage 1.1 invariants; human approval dossier |
| AG-02 | Repository boundary confirmed | Repository inventory, manifests, and source map | Required for future split | Current repository is adopted as source; external exceptions are recorded | A competing repository is authoritative without governance | Pass | Record exception or require a superseding ADR | Stage 1.1 inventory/manifests; ADR evidence map |
| AG-03 | No separate ProofArena app allowed | No-duplicate invariants and explicit owner agreement | Required | Owner agrees that reversal needs a future ADR | Parallel app/repo/router/shell/client/auth/nav is allowed silently | Conditional | Stop and revert parallel architecture after review | Do-not-duplicate registry; forbidden actions; ADR D-01/D-02 |
| AG-04 | Route source confidence acceptable | Route inventory, 108-route map, constants/metadata evidence | Required for alias policy | Current owners accepted and aliases explicitly deferred or decided | Canonical aliases are changed without evidence | Conditional | Preserve all aliases; do not deprecate routes | Route lock; blocker register; validation QA matrix |
| AG-05 | Layout/dashboard confidence acceptable | Layout ownership, SidebarCore reuse, role-shell blast radius | Required for consolidation only | Existing role wrappers and SidebarCore accepted | A duplicate shell or policy-merging abstraction is proposed | Pass | Preserve wrappers and stop consolidation | Layout lock; final decision review; rulebook |
| AG-06 | API client confidence acceptable | API transport, endpoint, facade, and version evidence | Required for version/window | `apiClient` transport accepted and unresolved version/facade choices explicitly deferred | A second client or untested version/facade migration is allowed | Conditional | Freeze transport and compatibility behavior | API lock; blockers B-06/B-07; contract QA |
| AG-07 | Auth/role governance clear | Frontend guard and backend middleware evidence | Required for security changes | Backend authority and guard reuse accepted | UI-only security or middleware bypass is permitted | Pass | Stop change and require security review | Backend flow; critical files; ADR D-06 |
| AG-08 | Placeholder/mock governance clear | Sixty-item classification and risk acceptance | Required for product/security replacements | Classification and no-fake-truth rule adopted | Fake data/workflow/security claim is allowed as production | Pass | Restore honest planned/empty/error state | Placeholder classification; risk acceptance table |
| AG-09 | Critical-file protection documented | Critical-file categories and pre-checks | Per-file where listed | Protection preflight is mandatory | Protected file may be edited casually | Pass | Stop edit and establish tests/rollback | Critical-file protection list; rulebook |
| AG-10 | Safe-delete policy documented | Import/route/config/docs/runtime/replacement proof policy | Required for high risk | Policy adopted and no current deletion implied | Unused-looking deletion is allowed | Pass | Restore file and complete deletion proof | Safe-delete policy; cleanup contracts |
| AG-11 | Future-stage impact mapped | Stage 2-36 governance map | No | Required stages, rules, sources, shortcuts, and validation are mapped | Material future stage has no governance mapping | Pass | Complete map before that stage edits production | Future-stage governance map |
| AG-12 | Human questions answered or deferred | Human dossier and recorded owner responses | Required | Every question has an answer or explicit deferral with owner/date/condition | Any material question remains unrecorded | Fail | Keep Proposed and do not authorize cleanup/deprecation | Human dossier; final approval brief; tracker |

## Gate Result

- Pass: 7 (`AG-02`, `AG-05`, `AG-07`, `AG-08`, `AG-09`, `AG-10`, `AG-11`).
- Conditional: 4 (`AG-01`, `AG-03`, `AG-04`, `AG-06`).
- Fail: 1 (`AG-12`).

Recommendation: **Keep ADR-0001 Proposed until human approval.** Static evidence supports conservative enforcement but does not satisfy formal acceptance or authorize cleanup execution.
