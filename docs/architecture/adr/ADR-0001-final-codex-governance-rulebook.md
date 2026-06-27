# ADR-0001 Final Codex Governance Rulebook

Generated: 2026-06-27

| Rule | Area | Requirement | Why / read first | Forbidden | Validate / stop |
| --- | --- | --- | --- | --- | --- |
| G-01 | Global | Keep ProofArena inside ScaleOps | ADR/source summary | Separate app/repo/system | Repository scan; stop on parallel architecture |
| G-02 | Global | Use current repository owners | Invariants/locks | Replacement system without migration | Dependency/behavior evidence |
| G-03 | Routes | Read route inventory/lock before edits | Route sources/aliases | Duplicate tree/constants | Route matrix; stop on unknown alias |
| G-04 | Routes | Preserve compatibility until policy/telemetry | Blocker register | Delete aliases | Direct-load/redirect/role tests |
| G-05 | Layout | Preserve Public/Auth/role wrappers | Layout lock | New dashboard shell | Browser/role/overflow QA |
| G-06 | Dashboard | Reuse SidebarCore/useSidebarShell | Layout analysis | Duplicate sidebar/state engine | Collapse/mobile/accessibility QA |
| G-07 | API | Reuse apiClient for browser HTTP | API lock | New Axios/fetch client | Auth/base/error/envelope tests |
| G-08 | API | Use apiEndpoints and feature services direction | API analysis | Bulk facade removal/literal spread | Method/path/backend map |
| G-09 | Auth | Frontend guards are UX; backend middleware is security | Backend flow/critical list | UI-only authorization/bypass | Auth/role E2E; stop on ambiguity |
| G-10 | Modules | Keep feature logic in mapped owner | Ownership maps | Random shared dumping | Boundary/import checks |
| G-11 | Shared | Share only stable cross-module contracts | Reusable map | Premature generic abstraction | Equivalence/build tests |
| G-12 | Placeholder | Check risk class before replacement | Placeholder classification | Fake production data/workflow | Empty/error/disclosure QA |
| G-13 | Delete | Apply safe-delete policy in separate prompt | Safe-delete doc | Delete because unused-looking | All proof fields known + approval |
| G-14 | Dependencies | Require explicit stage approval | Critical config/forbidden actions | Casual install/version change | Lock/build/deploy validation |
| G-15 | Config/env | Never expose secrets; require approval | Config critical list | Casual env/package/build edits | Environment/deployment check |
| G-16 | Documentation | Preserve historical evidence and manifests | Final doc map | Rewrite history/erase findings | JSON/docs consistency |
| G-17 | Audit | Documentation-only prompts change docs only | Prompt contract | Source/config edits | Git scope check |
| G-18 | Execution | Identify candidate IDs, prechecks, postchecks, rollback | Candidate ledger/contracts | Mixed unrelated refactor | Isolated diff and QA |
| G-19 | Unknown | Unknown blocks destructive action | Blocker register | Guessing ownership | Human/runtime evidence |
| G-20 | Final response | Report files, commands, failures, unknowns, rollback, production scope | All governance docs | False clean claim | Git status/diff evidence |

Any failed rule is a stop condition. A future prompt may propose an ADR change, but it must document conflict, evidence, alternatives, migration, human approval, and supersession; it may not silently override ADR-0001.

