# Stage 3.2 Hook Contract Verification

| ID | Path | Pattern | Correct owner | Status | Risk | Future action | Human |
|---|---|---|---|---|---|---|---|
| HV-01 | Feature `useChallenges`, `useOutcomeOffers`, `useExecutionPlans`, `useProofAssets`, `useMatches` | React Query hooks call feature services | module | compliant | Medium migration risk | Preserve until vertical migration | Yes |
| HV-02 | `features/executionPlans/useExecutionPlans.js` | Imports challenge private query key | module with public contract needed | violation | High cross-module coupling | Public invalidation/query-key contract | Yes |
| HV-03 | `features/outcomeOffers/useOutcomeOffers.js` | Imports profile private query key | module with public contract needed | violation | High cross-module coupling | Public invalidation contract | Yes |
| HV-04 | `client/src/hooks/useAuth.js` | Root re-export of feature auth hook | platform auth compatibility | suspicious | High authority ambiguity | Trace consumers; preserve facade | Yes |
| HV-05 | `client/src/hooks/useMyProfile.js` | Imports dashboard service and profile feature | profile/dashboard orchestration | violation | High reverse/cross-domain dependency | Assign owner and public APIs | Yes |
| HV-06 | `client/src/hooks/useMyDashboard.js` | Root hook imports dashboard feature service | dashboard/platform | suspicious | High shared-to-feature inversion | Keep platform-owned or move via tested migration | Yes |
| HV-07 | `client/src/hooks/useLocalStorage.js` | Generic browser storage hook | shared hook | compliant with caution | Medium misuse for session | Prohibit auth/session use without platform approval | Yes |
| HV-08 | `features/auth/useAuth.js` | Auth context hook | platform auth | compliant | Critical if duplicated | Keep canonical public auth hook | Yes |
| HV-09 | `features/admin/useAdmin.js` | Admin query/mutation hooks | admin under platform | compliant with caution | Critical permissions | Backend authorization and role tests | Yes |
| HV-10 | `modules/proofarena/hooks/useProofArenaModule.js` | Product composition hook | ProofArena composition | compliant | Medium boundary expansion | Keep cross-domain composition-only | Yes |
| HV-11 | Dashboard and first-client hook usage | Components consume many private feature hooks | dashboard/orchestration | suspicious | High migration/cycle risk | Public module interfaces later | Yes |
| HV-12 | All searched hooks | No raw fetch, axios instance, API client import or backend import found | module/platform as mapped | compliant | Low current transport risk | Repeat AST/lint audit before migration | No |

No hook may create a client, bypass platform auth/roles, import backend code, or introduce cycles.

