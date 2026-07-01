# Stage 4.3 Redirect and 404 Risk Acceptance Table

| Risk ID | Risk title | Source doc | Related file/path/system | Severity | Likelihood | Blast radius | Final planning status | Why accepted/deferred/blocked | Expiry condition | Required next action | Owner | Blocks Prompt 10 | Blocks production redirect/404 edits |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RA-001 | Denial evaluator priority | Prompt 8 gap/loop audits | RoleRoute and layouts | critical | medium | all protected routes | requires human approval | security behavior cannot be inferred | approved ordered policy | architecture/security signoff | human | yes | yes |
| RA-002 | Unknown-role landing | Prompt 8 gap register | authRouteUtils/accessPolicy/Dashboard | high | medium | auth/role entry | requires human approval | callers differ | approved fail-closed destination | decide and test all role values | human | yes | yes |
| RA-003 | Hardcoded internal redirects | alignment verification | six page areas/Auth | high | high | multiple workflows | deferred to route-constant prompt | targets exist but behavior/history need proof | B1 tests and target contracts pass | create one-item B10 candidates | later Stage 4 prompt | no for docs | yes |
| RA-004 | Attempted state inconsistency | auth/role flow matrix | guards versus layouts/pages | medium | high | protected workflows | requires human approval | preservation policy varies by denial type | approved state policy | define allowed restoration classes | human | yes | yes |
| RA-005 | /offers route intent | broken-route verification | constants/routes.js/AppRoutes | high | medium | offers/public | requires human approval | stale versus missing intent unknown | product owner decision | decide declare/deprecate | human | yes | yes |
| RA-006 | Messages query builder | alignment verification | ServiceDetail/messages | medium | medium | service messaging | deferred to implementation prompt | query target requires contract | approved builder/parameter contract | verify API/page query consumer | Prompt 10 | yes | yes |
| RA-007 | Missing loop/history suite | validation plan | browser route system | high | high | whole app | blocks implementation | static evidence cannot prove state/history safety | approved harness and passing baseline | implement/execute test matrix first | Prompt 10 | yes | yes |
| RA-008 | Explicit versus wildcard NotFound URL policy | fallback correction | AppRoutes/NotFound | medium | medium | global fallback | accepted with caution | current render behavior is safe; policy is undocumented | URL/SEO decision before change | retain no-change baseline | later Stage 4 prompt | no | yes |
| RA-009 | Legacy Auth reachability | redirect correction | pages/Auth.jsx | high | unknown | authentication | blocks implementation | runtime ownership unproven | import/route/reachability proof | classify stale or active | Prompt 10 | yes | yes |
| RA-010 | Browser/API 404 separation | source verification | client router/server handler | medium | low | frontend/API | accepted for planning | distinct scopes are verified | any cross-scope proposal | lock separate contracts | Prompt 10 | no | yes |
| RA-011 | Scoped signed-in fallback intent | fallback correction | invalid dashboard/admin/module paths | medium | medium | signed-in UX | requires human approval | absence is not automatically a defect | product/security layout decision | decide global versus scoped recovery | human | yes | yes |
| RA-012 | Onboarding completion/revisit | flow verification | onboarding routes/page | high | medium | onboarding/dashboard | requires human approval | state owner and product policy unknown | approved completion source/policy | document and test all states | human | yes | yes |
| RA-013 | Verification/resend precedence | loop verification | EmailVerifiedRoute/AppRoutes | critical | low | verified-only routes | blocks implementation | future composition could loop | passing reachability regression | lock target outside same guard | Prompt 10 | yes | yes |
| RA-014 | Guest-only duplicate checks | correction matrix | PublicOnlyRoute/auth pages | medium | medium | auth UX | deferred to implementation prompt | current behavior works but duplicates authority | ordered baseline and approved removal | plan isolated B7 | Prompt 10 | yes | yes |
| RA-015 | Logout parity | validation plan | Header/topbars | medium | medium | all shells | accepted with caution | static parity exists; no runtime test | passing four-caller matrix | add baseline before refactor | Prompt 10 | no | yes |
| RA-016 | External session URL security | source/alignment verification | Settings/Payments | critical | low | payments | requires human approval | not internal routing; origin/scheme policy needed | security approval and failure contract | define external destination validation | human | yes | yes |
| RA-017 | Route metadata gaps | Stage 4.2 gap docs | 34 paths | high | high | protected navigation | deferred to protected-route prompt | Prompt 7 implementation was blocked | metadata ownership approved | resolve Stage 4.2 decisions | later Stage 4 prompt | yes | yes |
| RA-018 | Host deep-link fallback | broken-route verification | deployment host unknown | high | unknown | all deep links | unknown | repository client code cannot prove hosting behavior | deployed-environment evidence | test representative direct URLs | unknown | yes | yes |

## Acceptance Summary

- Accepted for planning: browser/API separation.
- Accepted with caution: current explicit/wildcard rendering and static logout parity.
- Deferred: hardcoded target migration, query builder, duplicate guest behavior, and Stage 4.2 metadata.
- Human approval required: denial priority, unknown roles, attempted-state policy, /offers, scoped fallbacks, onboarding, and external payment URLs.
- Implementation blocked: runtime loop/history baseline, legacy Auth reachability, verification reachability, metadata policy, and host fallback evidence.
