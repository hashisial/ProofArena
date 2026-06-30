# Stage 3.2 Existing Internal Structure Audit

| ID | Path | Area | Pattern | Purpose/convention | Copy risk | Ignore risk | Reuse rule | Confidence |
|---|---|---|---|---|---|---|---|---|
| IS-01 | `client/src/components` | frontend | components | Broad component root with 273 files and domain subfolders | High: copied module UI | High: ownership stays dispersed | Treat domain subfolders as candidates, not shared UI | High |
| IS-02 | `client/src/components/ui` | shared | shared UI | Generic visual primitives | Critical design-system duplication | High inconsistent UI | Reuse; promote only through shared gate | High |
| IS-03 | `client/src/components/common` | shared | shared/unknown | Ambiguous common components | High feature leakage | Medium duplicate reuse | Audit consumers before shared classification | Medium |
| IS-04 | `client/src/features/*` | frontend | feature/module | Primary active domain convention; 16 feature folders | High parallel modules | High continued dispersion | Preserve until approved vertical migration | High |
| IS-05 | `client/src/modules/proofarena` | frontend | module | ProofArena composition module with alias/public index/hook | Critical if copied per domain | High if treated as domain owner | Keep composition-only; no sibling module scaffolds now | High |
| IS-06 | `client/src/hooks` | frontend/shared | hooks | 30 root hooks with platform/domain mix | High shared-to-feature inversion | High ownership ambiguity | Classify per file; do not copy root pattern | High |
| IS-07 | Feature `use*.js` files | frontend | hooks | React Query hooks call same-feature services | Medium if cloned | Medium inconsistent query policy | Reuse pattern after module path approval | High |
| IS-08 | `client/src/services/apiClient.js` | platform | API client | Canonical axios client owns base/auth/error behavior | Critical duplicate transport | Critical bypass | Every future adapter must use it | High |
| IS-09 | `client/src/services/api.js` | frontend/platform | service facade | Compatibility facade imports auth/dashboard/profile features | High reverse dependency | High hidden authority | Freeze; do not use as new module template | High |
| IS-10 | Feature `*Service.js` files | frontend | services/API | Domain request objects call canonical client and shared mappers | Medium service/adapter ambiguity | Medium duplicated request logic | Preserve; document adapter split before migration | High |
| IS-11 | `client/src/services/shared` | shared | services/utils | Shared request mapping/query utilities | High if domain rules enter | Medium duplication | Keep neutral and lower-level | High |
| IS-12 | Client `api/` or `adapters/` | frontend | adapters | No established target-domain directories detected | Critical invented convention | Medium service/adapter remains mixed | Do not create until path and contract approved | High |
| IS-13 | `client/src/types` | shared/mixed | types | Six JavaScript contract files; auth/profile and platform types mixed | High duplicate contracts | High drift | Check existing type before module-local type | High |
| IS-14 | `client/src/constants` | platform/mixed | constants | Routes, API endpoints, query keys, tokens and statuses | Critical platform constant copy | Critical path/contract drift | Modules may own only domain-local constants | High |
| IS-15 | `client/src/utils` | shared/mixed | utils | 26 helpers with platform, fallback and domain concerns | High dumping-ground pattern | High duplicate helpers | Require consumer/owner/purity evidence | High |
| IS-16 | Feature `*Utils.js` | frontend | utils/validation/API | Domain constants, forms, validation and endpoint builders often coexist | High if blindly copied | Medium unclear separation | Split only during tested migration | High |
| IS-17 | `client/jsconfig.json` | root/platform | imports | `@/*` and ProofArena aliases; no generic module aliases | High alias proliferation | Low relative-import burden | Add no aliases in Stage 3.2 | High |
| IS-18 | Feature/module index files | frontend | exports | Barrels are limited to profile and ProofArena | High broad barrels/cycles | Low inconsistent imports | No new barrel without explicit proof | High |
| IS-19 | `server/src/routes/controllers/services/models/validators` | backend | layered | Governing backend organization with 37/35/49/50/15 files | Critical parallel backend modules | High continued domain dispersion | Preserve complete registered vertical chains | High |
| IS-20 | `server/src/modules/auth` | backend | module | Existing executable auth module/public boundary | Critical auth duplication | Critical authority ambiguity | Preserve; reconcile compatibility variants | High |
| IS-21 | `server/src/modules/proofarena`, `modules/users` | backend | module | ProofArena README-only composition and limited users boundary | High false pattern inference | Medium unresolved ownership | Do not infer general module convention | Medium |
| IS-22 | `server/src/validators` | backend | validation | Zod request/domain validation follows layered paths | High duplicate schemas | High contract drift | Keep with registered backend chain | High |
| IS-23 | Server services | backend | services | Business operations use models, errors, DB helper and cross-domain data | Critical private cross-module coupling | High hidden dependencies | Map public contracts before migration | High |
| IS-24 | Frontend/backend roots | root | separation | Separate client and server trees with no shared runtime package | Critical cross-import | Critical contract drift | Communicate only through API contracts | High |
| IS-25 | Dashboard/first-client components | frontend/platform | composition | Shell-level components compose many feature hooks | High if moved into one module | High orchestration remains implicit | Keep platform/composition-owned | High |
| IS-26 | Profile image components | frontend | components/API | Three components import `getRealtimeBaseUrl` from platform client | Medium UI/platform coupling | Medium duplicated URL handling | Future module adapter/helper review; no new client | High |

## Audit Result

The repository supports module-specific ownership concepts but not immediate internal folder creation. Existing services and hooks are executable conventions; new `api/`, `adapters/`, `types/`, or module folders would create a second structure unless introduced through a tested migration.

