# Shared Code Migration Readiness Matrix

| ID/path group | Current owner | Recommended owner | Disposition/reason | Dependencies/dependents | Readiness/tests | Risk/human |
|---|---|---|---|---|---|---|
| SH-01 `components/ui/*` | Shared-like UI | shared/ui governance | Stay; established primitives | Broad UI consumers | Keep; component/a11y tests | Medium/No |
| SH-02 UI navigation/page headers | Shared/platform mixed | platform or shared after proof | Stay pending overlap review | routes/navigation/pages | Blocked; visual/consumer tests | High/Yes |
| SH-03 `components/common/*` | Unknown/common | mixed owners | Stay; placeholders/footer/header conflicts | public/pages/layouts | Blocked; runtime/visual tests | High/Yes |
| SH-04 generic hooks | Shared-like | shared/hooks candidates | Stay; promote only after consumer proof | many components | Caution; hook tests | Medium/No |
| SH-05 feature/platform root hooks | Root hooks | target modules/platform | Move later individually | feature services/pages | Blocked; per-hook tests | High/Yes |
| SH-06 auth hook bridge | Platform bridge | platform/auth | Stay | auth consumers | Do not move; auth tests | Critical/Yes |
| SH-07 generic pure utils | Shared-like | shared/utils candidates | Stay | broad consumers | Caution; unit tests | Low-medium/No |
| SH-08 feature-specific utils | Root utils | target modules | Move later individually | domain UI/hooks | Blocked; domain tests | High/Yes |
| SH-09 route/nav/access/storage utils | Platform | platform | Stay | router/nav/auth | Do not move; platform tests | Critical/Yes |
| SH-10 fallback constants | Unknown/public | public/domain owners | Retire or move later | public services/UI | Blocked; empty-state tests | High/Yes |
| SH-11 platform types | Platform | platform types | Stay | routes/auth/nav | Do not move; type checks | High/Yes |
| SH-12 profile types | Root types | profile | Move later | profile consumers | Blocked; type/contract tests | Medium/Yes |
| SH-13 platform constants | Platform | platform | Stay | entire client | Do not move; build/contract tests | Critical/Yes |
| SH-14 API/query/socket platform services | Platform | platform | Stay | all remote data/realtime | Do not move; integration tests | Critical/Yes |
| SH-15 broad API facade | Platform bridge | retire/split later | Stay frozen | many pages/hooks/features | Blocked; consumer/contract tests | High/Yes |
| SH-16 shared service utils | Shared-like | shared/utils/services only if generic | Stay pending consumers | service callers | Caution; unit tests | Medium/Yes |
| SH-17 `lib/README.md` | Docs reservation | docs-only | Stay; no library creation | none | N/A | Low/No |
| SH-18 generic server utils | Platform/shared | backend shared/platform | Stay | broad backend | Do not move; API/unit tests | High/Yes |
| SH-19 security/domain server utils | Mixed | platform or modules by item | Stay pending ownership | auth/profile/controllers | Blocked; security tests | Critical/Yes |
| SH-20 server constants | Mixed | platform/modules by item | Stay pending semantics | broad services/models | Blocked; contract tests | High/Yes |
| SH-21 target-domain server services | Root service layer | target modules | Move later vertical slice | controllers/models/routes | Blocked; endpoint tests | High/Yes |
| SH-22 infrastructure services | Platform | platform adapters | Stay | all domains/config | Do not move; integration tests | Critical/Yes |
| SH-23 other domain services | Domain owners | future modules outside current scope | Stay | corresponding controllers/models | Blocked; domain tests | Medium-high/Yes |
| SH-24 server config | Platform | platform config | Stay | entire backend | Do not move; startup/deploy tests | Critical/Yes |

No shared-code move is currently approved.

