# Stage 4.3 Redirect and 404 Governance Rulebook Draft

Prompt 9 hardened this draft from the verified runtime topology and correction matrices. It remains a governance document, not implementation approval.

| Rule ID | Rule | Why Prompt 9 hardened it | Evidence | Required validation | Stop condition |
|---|---|---|---|---|---|
| R4-001 | The platform must retain one redirect source-of-truth topology. | Guards/helpers/layouts are distributed consumers and must not become parallel systems. | source verification R4S-001, R4S-005 to R4S-021 | authority/import/source-consumer trace | a second router, registry, provider, or redirect authority appears |
| R4-002 | The browser must retain one NotFound/404 source-of-truth. | One explicit route and one page already serve global browser 404. | NF-001, NF-003 | explicit/wildcard render parity | another browser 404 authority is proposed without scoped approval |
| R4-003 | No duplicate wildcard route is allowed. | A competing catch-all can intercept valid or protected routes. | NF-002 and AppRoutes order | exact route-order and valid-leaf matrix | wildcard uniqueness/order is not proven |
| R4-004 | Separate ProofArena fallback routing is prohibited. | ProofArena is inside ScaleOps route governance. | Stage 2/3 locks; one BrowserRouter/Routes scan | router/import/boundary scan | module router or fallback stack is introduced |
| R4-005 | Every redirect target must be declared and reachable for the intended state. | Constants and literals can be stale or denied. | BR-001 to BR-013; alignment matrix | declaration/constant/guard/state join | target, owner, or access path is unknown |
| R4-006 | Fallback routes must remain after valid siblings and must not swallow nested routes. | Current wildcard is safe because it is terminal. | NF-002; LP-009 | route count/order plus direct-link tests | route tree changes without renewed audit |
| R4-007 | Unauthorized redirects must terminate on an approved safe route. | Guard/layout destinations currently differ. | RDI-003, RDI-017 to RDI-021; LP-003 | wrong-role and unknown-role loop/history matrix | denial priority is unapproved |
| R4-008 | Forbidden redirects must not expose protected areas or shells. | Role dashboard fallback is not proof of authorization. | F4-007, F4-008, F4-016 | negative access/data-visibility tests | role/permission or denial semantics conflict |
| R4-009 | Login and logout redirects must respect hydrated auth state and session ordering. | Restore and logout behavior spans helpers/pages/four callers. | RDI-006 to RDI-011, RDI-024, RDI-025 | hydration, state.from, failure, history, stale-session matrix | auth state ordering is unknown |
| R4-010 | Guest-only redirects must not trap authenticated users or duplicate policy silently. | PublicOnlyRoute and auth pages overlap. | RDI-004, RDI-007, RDI-009 | all-role guest/auth page matrix | observable evaluator priority is unknown |
| R4-011 | Onboarding redirects require an approved completion-state source and revisit policy. | Only invalid-step and next-step behavior are evidenced. | RDI-022, RDI-023; F4-009, F4-010 | incomplete/complete/skip/resume/invalid tests | completion source or product intent is unknown |
| R4-012 | Role landing may use only verified roles and approved hierarchy. | Unknown role and super_admin semantics are unresolved. | accessPolicy; LP-001, LP-005 | frontend/backend role parity and all-role landing matrix | role alias, hierarchy, or unknown fallback lacks approval |
| R4-013 | Redirects may adopt route constants only after Stage 4.1 and target contracts are ready. | Seven internal literals and dynamic targets remain. | AL-025 to AL-033 | constant/declaration/parameter/history comparison | key is missing, stale, ambiguous, or behavior-changing |
| R4-014 | Every implementation batch requires a passing validation plan. | Static evidence cannot prove loops, history, host fallback, or role behavior. | VAL-001 to VAL-024 | named pre/post checks and clean baseline | test command/harness, assertion, or owner is absent |
| R4-015 | Every implementation batch requires an independently executable rollback plan. | Redirect failures have broad security and navigation blast radius. | RB-001 to RB-014 | targeted revert rehearsal and post-revert matrix | prior semantics or revert target cannot be restored exactly |
| R4-016 | Unknown redirect source-of-truth or policy blocks implementation. | Guessing creates duplicate authority or unsafe targets. | source verification and risk table | source-consumer trace plus required approvals | any critical redirect owner/target/priority is unknown |
| R4-017 | Unknown 404/wildcard ownership, scope, host behavior, or order blocks implementation. | Client fallback cannot prove deployment rewrites or future scoped intent. | NF-008, NF-009, BR-014 to BR-016 | browser/host direct-link and route-order evidence | host fallback, scoped UX, uniqueness, or terminal order is unknown |

## Status

All 17 rules are mandatory stop controls for Prompt 10. No rule permits implementation while the readiness decision remains HUMAN APPROVAL REQUIRED.
