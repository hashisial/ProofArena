# Stage 4.3 Redirect and 404 Rollback Plan

Future changes must be isolated by batch and reverted with targeted file patches or a commit revert. Destructive workspace reset commands are prohibited.

| Rollback ID | Scenario | Detection signal | Immediate action | Revert target | Validation after revert | Human review needed |
|---|---|---|---|---|---|---|
| RB-001 | Redirect target missing | navigation reaches NotFound/blank or declaration join fails | stop batch and disable release | exact target expression in changed file | target existence and original workflow | no |
| RB-002 | Redirect loop | repeated URL/guard chain or browser limit | stop immediately; capture state/role/history | last changed redirect/evaluator order | full loop matrix and history termination | yes |
| RB-003 | Wildcard swallows valid route | valid leaf renders NotFound | stop route batch | AppRoutes wildcard position/declaration | all valid leaves plus unknown URL | no |
| RB-004 | Browser 404 broken | unknown URL blank/errors/wrong page | stop fallback batch | AppRoutes/NotFound exact prior behavior | explicit and wildcard 404 direct loads | yes |
| RB-005 | API 404 contract changed | unmatched API response shape/status differs | stop cross-scope batch | server app/handler change | API unmatched request and browser 404 separation | yes |
| RB-006 | Login redirect wrong | wrong role/default, lost from, or unsafe destination | stop auth batch | Login/Register/authRouteUtils change | all login state/role/query/hash cases | yes |
| RB-007 | Logout redirect/session broken | stale access, protected landing, or caller divergence | stop logout batch | exact header/topbar/auth change | four callers, session clear, back history | yes |
| RB-008 | Unauthorized/forbidden behavior leaks | denied content/shell visible or wrong target | security stop and isolate | RoleRoute/layout/accessPolicy/denial target | negative role matrix and data visibility | yes |
| RB-009 | Guest-only trap | authenticated user cycles or cannot leave auth page | stop guest batch | PublicOnlyRoute/auth page change | guest and all authenticated roles | yes |
| RB-010 | Onboarding transition broken | loop, skip, wrong completion, invalid step failure | stop onboarding batch | onboarding state/redirect change | complete/incomplete/skip/resume/invalid | yes |
| RB-011 | Role landing broken | role sent to unapproved dashboard or denied incorrectly | stop role batch | accessPolicy/Dashboard dispatch change | all role values and unknown role | yes |
| RB-012 | Query/hash/history lost | destination content wrong or back behavior regresses | stop target migration | page redirect method/target/state | exact query/hash/replace/push/back behavior | no |
| RB-013 | Constant migration drifts | target string differs or key stale | stop B10 item | one constant consumer change | static comparison and workflow smoke | no |
| RB-014 | Scoped fallback exposes shell or duplicates 404 | invalid admin/module URL renders wrong shell/page | stop B4 | scoped route/fallback addition | invalid public/dashboard/admin/module matrix | yes |

## Isolation and Stop Rules

- Revert only the failing batch; do not replace the router or create a parallel fallback.
- Preserve the prior target, navigation method, state payload, query/hash handling, replace/push semantics, and wildcard order.
- After rollback, rerun the complete static/build baseline and every affected state/history case.
- Stop implementation on any access expansion, redirect loop, valid-route interception, unknown destination, unexplained baseline failure, or rollback ambiguity.
- Escalate when policy, role hierarchy, onboarding state, payment URL security, or cross-scope 404 behavior is implicated.
