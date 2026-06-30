# Frontend Module Boundary Verification

| ID | Path/pattern | Type | Module | Platform/shared dependency | Data | Route/auth | Duplicate/move risk | Readiness | Notes |
|---|---|---|---|---|---|---|---|---|---|
| FE-01 | `features/auth/*`; auth store/routes/layout | feature/platform | auth | API client, router, store | API | Auth routes/guards | Critical/critical | Blocked | Global identity. |
| FE-02 | Profile feature/components/pages/config/types | mixed domain | profile | auth, API, shared UI | API | Public/protected | Medium/high | Tests + review | Multiple current owners. |
| FE-03 | Outcome-offer feature/components/pages | domain | offers | API/auth/routes/UI | API | Mixed | Low/high | After tests | Clear signal. |
| FE-04 | Challenge feature/components/pages | domain | challenges | API/auth/routes/UI | API | Mixed | Low/high | After tests | Clear signal. |
| FE-05 | Execution-plan feature/components/pages | domain | plans | challenges/proof/API/shell | API | Protected | Medium/high | After tests | Cross-domain. |
| FE-06 | Proof/proofAssets features/components/pages | domain | proof | storage/auth/API/profile | API/mixed | Mixed | Medium/critical | Blocked | Two feature signals. |
| FE-07 | Match feature/components/pages | domain | matching | challenges/profile/API | API | Protected | Medium/high | After tests | Cross-domain. |
| FE-08 | `pages/Messages.jsx`; message hooks/services | page/platform | messages | auth/socket/API/shell | API/realtime | Protected | High/critical | Blocked | Identity/realtime. |
| FE-09 | `pages/Payments.jsx`; billing hooks/services | page/platform | payments | auth/API/config | API | Protected | High/critical | Blocked | Sensitive. |
| FE-10 | Admin feature/components/pages | domain/platform | admin | admin layout/guard/API | API | Admin | High/critical | Blocked | Security shell. |
| FE-11 | `routes`; route constants/metadata | route | platform | all modules | Config | Global | Critical/critical | Do not move | Platform. |
| FE-12 | navigation/layouts/sidebar | navigation/layout | platform | routes/auth | Config/state | Global | Critical/critical | Do not move | Platform. |
| FE-13 | `components/ui`; common | shared UI | shared | many modules | N/A | N/A | Medium/high | Stage 3.3 | Consumer audit. |
| FE-14 | root hooks/utils/types/constants/services | mixed | shared/platform/unknown | mixed | Mixed | Mixed | High/high | Blocked | Classify consumers. |
| FE-15 | `sections/home`; public shells | marketing | public marketing | public layout/nav/UI | Static/API/placeholder | Public | Low/medium | Keep | Not target module. |

