# Frontend File Migration Readiness

| Source group | Classification/category | Dependencies/import risk | Shared/platform risk | Required tests | Readiness/recommendation |
|---|---|---|---|---|---|
| FE-01 auth feature/store/routes/layout | auth/platform; hooks/services/components | API, router, session; critical | Critical identity duplication | Full auth/security | Do not move |
| FE-02 profile feature/components/pages/config/types | profile; mixed | Auth/API/storage/routes; high | Shared types/config overlap | Profile/public/private/upload | Dependency cleanup first |
| FE-03 offer feature/components/pages | offers; domain UI/hooks/services | Auth/API/routes/profile/proof; high | Shared UI only | Offer lifecycle | Safe after tests |
| FE-04 challenge feature/components/pages | challenges | Auth/API/routes/plans/matching; high | Shared UI only | Challenge lifecycle/roles | Safe after tests |
| FE-05 execution-plan feature/components/pages | plans | Challenges/proof/shell; high | Shell platform | Plan decisions/roles | Safe after tests |
| FE-06 proof/proofAssets groups | proof | Storage/auth/profile; critical | Two current feature owners | Upload/security/visibility | Blocked |
| FE-07 match feature/components/pages | matching | Challenges/profile/auth; high | Shared UI only | Match algorithm/roles | Safe after tests |
| FE-08 messages page/services/hooks | messages/platform | Auth/socket/API/shell; critical | Realtime platform | Realtime/security | Blocked |
| FE-09 payments page/billing hooks | payments/platform | Auth/API/config; critical | Billing platform | Payment/security | Blocked |
| FE-10 admin feature/components/pages | admin/platform | Guard/shell/all domains; critical | Admin shell/roles | Negative access/moderation | Blocked |
| FE-11 routes/constants/metadata | platform | All pages/nav; critical | Platform authority | Route suite | Do not move |
| FE-12 navigation/layout/sidebar | platform | Routes/auth/state; critical | Platform authority | Responsive/role/visual | Do not move |
| FE-13 shared UI/common | shared-governed | Many consumers; high | Shared authority | Component/accessibility | Stage 3.3 audit |
| FE-14 root hooks/utils/types/constants/services | mixed/unknown | Broad imports; high | Shared/platform ambiguity | Per consumer | Blocked pending Stage 3.3 |
| FE-15 home/public marketing | public marketing | Public layout/nav/API; medium | Outside target modules | Public route/visual | Keep in place |

No frontend migration is authorized by this matrix.

