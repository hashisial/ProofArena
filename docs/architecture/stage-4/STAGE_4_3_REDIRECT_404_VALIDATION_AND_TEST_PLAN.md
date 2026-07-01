# Stage 4.3 Redirect and 404 Validation and Test Plan

The client exposes lint, build, and module-boundary scripts. No route/redirect test script was found, so behavioral commands remain UNKNOWN until an approved harness is selected.

| Validation ID | Requirement | Validation method | Tool/command if known | Manual check | Pass condition | Fail condition | Blocks implementation | Human review needed |
|---|---|---|---|---|---|---|---|---|
| VAL-001 | Valid public routes avoid 404 | enumerate declarations and direct-load each | future browser harness; current script unknown | yes | every declared public leaf renders intended page | any valid leaf renders NotFound/host 404 | yes | no |
| VAL-002 | Valid dashboard routes avoid 404 | role-aware direct-link matrix | future browser harness unknown | yes | each allowed role reaches intended dashboard leaf | NotFound/denial for allowed role | yes | yes |
| VAL-003 | Valid admin routes avoid 404 | authenticated admin direct-link matrix | future browser harness unknown | yes | approved admin roles render intended page | NotFound or access leak | yes | yes |
| VAL-004 | Valid module routes avoid 404 | dynamic/static module route matrix | future browser harness unknown | yes | valid params render intended module page | valid route falls through | yes | yes |
| VAL-005 | Invalid public route uses correct fallback | unknown public URL direct load | future browser harness unknown | yes | global NotFound renders without loop | blank, host error, or wrong shell | yes | yes |
| VAL-006 | Invalid dashboard route uses approved fallback | role-aware invalid nested URL | future browser harness unknown | yes | approved global/scoped outcome occurs | protected content leak or loop | yes | yes |
| VAL-007 | Invalid admin route never exposes admin UI | anonymous/wrong-role/admin invalid URL matrix | future browser harness unknown | yes | no unauthorized admin shell/data exposure | admin UI/data visible to denied user | yes | yes |
| VAL-008 | Wildcard does not swallow valid routes | assert wildcard last; exercise every leaf | static AppRoutes scan plus future browser harness | yes | wildcard terminal and all leaves reachable | valid route intercepted | yes | no |
| VAL-009 | Nested fallback behavior matches approved policy | invalid child URLs under each shell/module | future browser harness unknown | yes | exact approved global/scoped recovery | inconsistent shell or duplicate fallback | yes | yes |
| VAL-010 | Login redirects work | success, failure, state.from, query/hash, roles | future browser harness unknown | yes | validated intended route or approved role default | open redirect, wrong target, lost state, loop | yes | yes |
| VAL-011 | Logout redirects work | all four callers; success/failure/stale state | future browser harness unknown | yes | session clears then public login replaces history | protected target, stale access, divergence | yes | no |
| VAL-012 | Anonymous protected redirect works | every protected family and representative leaves | future browser harness unknown | yes | login with correct state.from | content flash/leak or missing state | yes | no |
| VAL-013 | Wrong-role redirect works | pairwise role-route negative matrix | future browser harness unknown | yes | approved denial destination, no content leak | wrong dashboard, loop, or exposure | yes | yes |
| VAL-014 | Forbidden behavior is consistent | /403 and /not-authorized direct/caller checks | future browser harness unknown | yes | approved semantics and safe recovery | conflicting or protected recovery | yes | yes |
| VAL-015 | Guest-only routes do not trap users | anonymous and all authenticated roles | future browser harness unknown | yes | guests render; users reach approved default once | repeated redirect or auth page trap | yes | yes |
| VAL-016 | Onboarding behavior follows approved state | incomplete/complete/skip/resume/invalid step | future browser harness unknown | yes | exact approved transition per state | invented state, loop, wrong NotFound | yes | yes |
| VAL-017 | Role landing uses verified roles | client/provider/support/admin/super_admin/unknown | future browser harness unknown | yes | each lands on approved route or fails closed | unapproved alias/default | yes | yes |
| VAL-018 | Every redirect target exists | join redirect inventory to declarations/constants | repository script to be created only after approval; manual static check now | yes | every internal target resolves to declared path | missing/stale target | yes | no |
| VAL-019 | No redirect loop exists | capped navigation chain and history observation | future browser harness unknown | yes | chain terminates within approved hops | repeated target/source or browser loop | yes | yes |
| VAL-020 | Route constants stay aligned | static literal/constant/declaration comparison | rg plus approved comparison script; exact script not present | yes | no new hardcoded internal target or stale key | drift introduced | yes | no |
| VAL-021 | Navigation has no missing target | compare enabled nav to declarations | existing inventory plus future automated comparator | yes | every enabled link resolves | link reaches fallback unexpectedly | yes | yes |
| VAL-022 | No duplicate NotFound/404 system | file/import/declaration scan | rg -n "NotFound|notFoundHandler" client/src server/src | yes | one browser page and one API handler scope | second authority for same scope | yes | no |
| VAL-023 | No duplicate wildcard route | route declaration scan | rg -n 'path="\\*"' client/src | yes | exactly one approved terminal browser wildcard | added/relocated competing wildcard | yes | no |
| VAL-024 | No separate ProofArena fallback routing | architecture/path/import scan | rg -n "BrowserRouter|createBrowserRouter|HashRouter|MemoryRouter|<Routes" client/src | yes | one BrowserRouter and one Routes authority | parallel module router/fallback | yes | no |

## Required Baseline Commands

- npm --prefix client run lint
- npm --prefix client run build
- npm --prefix client run check:boundaries
- npm --prefix server run check:boundaries

These commands validate static/build boundaries only; they do not satisfy the behavioral route matrix. Any unexplained baseline failure blocks implementation and must not be normalized away.
