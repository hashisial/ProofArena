# Stage 4.2 Protected Route Rollback Plan

Rollback is batch-local. Never replace the router, auth provider, role system, or dashboard shell to recover a protected-route change.

| ID | Scenario | Detection | Immediate action | Revert target | Validation after revert | Review |
|---|---|---|---|---|---|---|
| RB-001 | Guest can open protected route | direct protected content as guest | stop batch; block deploy | exact guard/wrapper delta | guest -> login with state.from; full role matrix | yes |
| RB-002 | Valid user is locked out | approved role receives denial | stop batch; restore prior role list | exact role/metadata delta | approved role deep links work | yes |
| RB-003 | Admin route opens to non-admin | admin content renders for other role | security incident response; revert immediately | admin parent/role delta | frontend and backend admin matrix | yes |
| RB-004 | Admin cannot access approved route | admin receives denial/loop | revert smallest admin delta | admin wrapper/metadata/redirect delta | all 12 admin leaves | yes |
| RB-005 | Guest-only loop | authenticated user cycles on auth route | restore prior PublicOnly/page behavior | auth wrapper/redirect delta | guest and every role | yes |
| RB-006 | Onboarding loop or bypass | completion states route incorrectly | restore prior route/page behavior | onboarding wrapper/state delta | incomplete/complete/re-entry/invalid step | yes |
| RB-007 | Wrong-role redirect loop | repeated Navigate or same-route denial | restore prior target/helper | guard/redirect helper delta | history/state/role matrix | yes |
| RB-008 | Attempted location lost | post-login return missing or unsafe | restore prior state handling | authRouteUtils/guard delta | pathname/search/hash and open-redirect defense | yes |
| RB-009 | Navigation exposes wrong role | item visible to disallowed role | revert visibility-only change | exact nav/metadata delta | desktop/mobile/all roles + direct URL | yes |
| RB-010 | Dynamic record leakage | other account record is returned | stop release; revert UI batch and escalate backend | route/API permission delta | own/other/missing record API tests | yes |
| RB-011 | Build/lint/boundary failure | nonzero approved command | stop; revert current batch | all files in failing batch only | repeat command plus prior checks | no |
| RB-012 | Duplicate guard/auth/shell introduced | static scan finds second authority | remove new duplicate by reverting batch | new guard/provider/router/layout files/imports | single-stack scan and full matrix | yes |

Stop implementation on any unauthorized access, authorized-user denial, redirect loop, lost intended destination, session inconsistency, cross-record exposure, duplicate authority, or unexplained validation delta.
