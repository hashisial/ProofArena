# Stage 4.2 Protected Route Validation And Test Plan

Package scripts were inspected: client provides `lint`, `build`, and `check:boundaries`; server provides `check:boundaries` but no test script. Route-role and API authorization tests are therefore manual/UNKNOWN until a future approved test harness exists.

| ID | Requirement | Method | Tool/command | Manual check | Pass | Fail | Blocks | Review |
|---|---|---|---|---|---|---|---|---|
| PV-001 | Public routes remain public | route inventory + browser matrix | manual; no route test script | open representative public/dynamic/system paths as guest | no auth redirect | unexpected login/denial | yes | no |
| PV-002 | Login works for guest | browser auth flow | manual | submit valid/invalid login | expected auth/error and landing | loop or wrong landing | yes | yes |
| PV-003 | Register/signup works | browser auth flow | manual | client/provider intent | allowed role registration and landing | wrong role or lost intent | yes | yes |
| PV-004 | Guest-only routes redirect authenticated users | direct URL matrix | manual | login/register as each role | role default or intended safe destination | auth page displayed/loop | yes | yes |
| PV-005 | Recovery routes preserve approved behavior | browser recovery flow | manual | forgot/reset guest and authenticated | approved flow behavior | token/history regression | yes | yes |
| PV-006 | Verification routes preserve approved behavior | browser verification flow | manual | verified/unverified/guest states | approved callback/resend flow | loop or bypass | yes | yes |
| PV-007 | Logout clears session and reaches login | all logout surfaces | manual | header, dashboard, client, admin topbars | server/local session cleared; login replace | stale session or wrong route | yes | no |
| PV-008 | Dashboard requires authentication | 70-route direct URL matrix | manual until tests exist | guest deep links | login with state.from | protected page rendered | yes | no |
| PV-009 | Unverified users are redirected consistently | guard matrix | manual | client/dashboard/admin paths | resend with reason/from | protected page or loop | yes | yes |
| PV-010 | Admin rejects non-admin | frontend/browser matrix | manual | guest/client/provider/support/unknown | login or not-authorized | admin page rendered | yes | yes |
| PV-011 | Backend admin rejects unauthorized principals | API integration/security test | UNKNOWN: server has no test script | call admin endpoints with role/token matrix | 401/403 except approved admin | sensitive response | yes | yes |
| PV-012 | Provider routes reject clients | direct URL matrix | manual | client to provider leaves | not-authorized | provider page rendered | yes | no |
| PV-013 | Client routes reject providers | direct URL matrix | manual | provider to client leaves | not-authorized | client page rendered | yes | no |
| PV-014 | Support access matches approved scope | direct URL matrix | manual | support across all groups | only approved leaves | implicit broad access | yes | yes |
| PV-015 | Dynamic records enforce ownership | API integration test | UNKNOWN: endpoint tests absent | own/other/missing IDs | approved 403/404 policy | cross-account data | yes | yes |
| PV-016 | Unauthorized/forbidden behavior is canonical | redirect matrix | manual | wrong role and unknown role | approved target, no loop | caller-dependent surprise | yes | yes |
| PV-017 | Onboarding preserves completion flow | state matrix | manual | incomplete/complete/invalid step/re-entry | approved journey | loop or bypass | yes | yes |
| PV-018 | Navigation matches auth/role state | navigation snapshot | manual + future generated parity script | guest/all roles, desktop/mobile | only approved items visible | wrong-role/admin item visible | yes | yes |
| PV-019 | Direct URL remains authoritative | compare hidden nav vs guard | manual | visit hidden/deep-link paths | guard decides independently | hidden link treated as security | yes | no |
| PV-020 | Route constants remain aligned | static registry comparison | existing source audit; no dedicated script | compare 108 declarations and constants | no unexplained literal/value delta | missing/stale mapping | yes | yes |
| PV-021 | No duplicate guards/auth/roles | static import/file scan | rg and boundary review | scan provider/store/guard/router definitions | one frontend stack; known backend families only | new parallel authority | yes | no |
| PV-022 | No dashboard shell duplication | static structure check | rg BrowserRouter/Routes/layout/sidebar | one platform shell stack | parallel shell/tree | duplicate found | yes | no |
| PV-023 | Client lint passes | lint | cd client; npm run lint | none | exit 0 | nonzero | yes | no |
| PV-024 | Client boundary check passes | architecture check | cd client; npm run check:boundaries | none | exit 0 | nonzero | yes | no |
| PV-025 | Client production build passes | build | cd client; npm run build | none | exit 0 | nonzero | yes | no |
| PV-026 | Server boundary check passes | architecture check | cd server; npm run check:boundaries | none | exit 0 | nonzero | yes | no |
| PV-027 | No separate ProofArena protection stack | source and architecture scan | rg plus Stage 2/3 lock review | none | no parallel router/auth/guard/shell | parallel system found | yes | no |

No implementation can pass on lint/build alone; the role/deep-link and backend authorization matrices are mandatory.
