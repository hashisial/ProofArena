# Stage 3.2 Component Contract Verification

| ID | Path | Pattern | Correct owner | Status | Risk | Future action | Human |
|---|---|---|---|---|---|---|---|
| CV-01 | `client/src/components/ui/*` | Generic primitives | shared UI | compliant | Medium if polluted | Keep product-agnostic; shared gate | Conditional |
| CV-02 | `client/src/components/common/*` | Ambiguous common components | shared UI or module by file | suspicious | High leakage | Consumer/semantics audit | Yes |
| CV-03 | `client/src/layouts/*` | Public/auth/dashboard/client/admin layouts | platform layout | compliant | Critical if moved | Protect | Yes |
| CV-04 | Navigation and sidebar components | Route/role-aware navigation | navigation/sidebar | compliant | Critical if copied | Keep platform-owned | Yes |
| CV-05 | Dashboard components | Compose many private feature hooks | dashboard shell/composition | suspicious | High migration blast radius | Define public module hooks later | Yes |
| CV-06 | Domain subfolders under `components` | Module-specific UI outside feature roots | module | suspicious | High duplicate-copy risk | Move only complete tested slices | Yes |
| CV-07 | Challenge/offer/plan/profile/proof forms | Domain forms use feature utils/contracts | module | compliant with caution | Medium mixed validation | Keep module-owned; split later only with tests | Yes |
| CV-08 | Domain cards/tables/badges | Product-specific display logic | module | compliant | Medium sharing pressure | Promote only generic primitives | Yes |
| CV-09 | Root Loading/Empty/Error components | Generic state primitives | shared UI/platform | compliant with caution | Medium false shared semantics | Verify consumers and error policy | Yes |
| CV-10 | AdminResourcePage/admin components | Moderation UI using admin hooks | admin under platform | compliant with caution | Critical privilege coupling | Keep roles/backend auth external | Yes |
| CV-11 | `sections/home/*` | Public product marketing | public marketing | compliant | Medium ownership confusion | Keep outside business modules | No |
| CV-12 | Profile photo/header/cover components | Import platform realtime URL helper | profile | suspicious | Medium transport coupling | Route through approved adapter/helper later | Yes |
| CV-13 | Nav/client/provider components using `useAuth` | Platform UI consumes auth feature public hook | platform navigation/shell | compliant with caution | High private import risk | Stabilize platform auth public API | Yes |
| CV-14 | FirstClientDashboard and related composition | Component orchestrates many module hooks | platform/product orchestration | violation | High business orchestration in UI | Extract approved orchestration service only later | Yes |

Targeted scan found no component instantiating axios or calling raw `fetch`. Refetch callbacks are query actions, not raw HTTP clients.

