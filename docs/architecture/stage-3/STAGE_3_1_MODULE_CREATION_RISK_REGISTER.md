# Module Creation Risk Register

| ID | Risk | Modules/systems | Sev. | Likelihood | Blast radius | Prevention/detection | Future action | Blocks Prompt 2 / production |
|---|---|---|---|---|---|---|---|---|
| MR-01 | Duplicate modules beside active feature folders | All | High | High | Ownership/import confusion | Exact path and duplicate scan | Classify first | No / Yes |
| MR-02 | Moving files early | All | Critical | Medium | Build/runtime | No moves before dependency map | Vertical plan | No / Yes |
| MR-03 | Broken imports | All | Critical | High | App/API | Import/dependent mapping | Tests per move | No / Yes |
| MR-04 | Route ownership break | Pages/routes | Critical | Medium | Navigation/auth | Keep router platform-owned | Stage 4 only | No / Yes |
| MR-05 | API client duplication | Services/api | Critical | Medium | Auth/network | Canonical client scan | Stage 5 contract | No / Yes |
| MR-06 | Auth/role break | auth/admin/all protected | Critical | Medium | Security | Platform guard/middleware lock | Stage 23/26 | No / Yes |
| MR-07 | Platform/module mixing | All | High | High | Coupling | Protection map | Ownership lock | No / Yes |
| MR-08 | Feature dumping into shared | All/shared | High | Medium | Coupling | Shared approval gate later | Stage 3.3 | No / Yes |
| MR-09 | Duplicate backend services | Domain backend | High | High | Business behavior | Route/controller/service map | One vertical slice | No / Yes |
| MR-10 | Duplicate models | Domain backend | Critical | Medium | Data integrity | Model ownership/migration review | Data tests | No / Yes |
| MR-11 | Fake placeholder modules | All | High | Medium | False architecture | No empty behavior files | README-only only if approved | No / Yes |
| MR-12 | Separate ProofArena architecture | All platform boundaries | Critical | Low | Entire product | ADR/Stage 2 stop ship | Reject proposal | Yes / Yes |

