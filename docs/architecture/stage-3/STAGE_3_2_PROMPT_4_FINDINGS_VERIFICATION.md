# Stage 3.2 Prompt 4 Findings Verification

| ID | Source | Claim/path | Repository evidence | Result | Corrected finding/impact | Duplicate risk | Human | Future action |
|---|---|---|---|---|---|---|---|---|
| PV-01 | Internal audit IS-01 | Broad component root | 273 files across 21 subdirectories | verified | Domain components are dispersed; no module copy | High | Yes | Consumer map before moves |
| PV-02 | IS-02 | Shared UI primitives | `components/ui` exists and is widely reused | verified | Shared UI stays product-agnostic | Critical | Conditional | Shared gate/tests |
| PV-03 | IS-03 | Ambiguous common UI | `components/common` exists beside UI/domain roots | verified | File-level owner needed | High | Yes | Consumer audit |
| PV-04 | IS-04 | Features are active convention | 16 feature folders and 47 files | verified | Retain feature paths | High | Yes | Vertical migration only |
| PV-05 | IS-05 | ProofArena composition module | Alias, index, hook and README exist | verified | Composition only; no domain copies | Critical | Yes | Preserve public boundary |
| PV-06 | IS-06 | Root hooks are mixed | 30 root hooks; feature imports confirmed | verified | Not a shared-hook template | High | Yes | Classify each hook |
| PV-07 | IS-07 | Feature hooks call services | React Query hooks import same-feature services | verified | Valid future module-hook pattern with exceptions | Medium | Yes | Fix private cross-feature imports later |
| PV-08 | IS-08 | Canonical API client | Only `apiClient.js` contains `axios.create` | verified | Platform client is source of truth | Critical | Yes | Never instantiate another client |
| PV-09 | IS-09 | Compatibility API facade imports features | `services/api.js` imports auth/dashboard/profile services | verified | Freeze as compatibility surface | High | Yes | Trace consumers before retirement |
| PV-10 | IS-10 | Feature services call platform client | Domain services import `api` and API_ENDPOINTS | verified | Current service/adapter combination is real | High | Yes | Do not duplicate with new adapters |
| PV-11 | IS-11 | Shared request helpers | `services/shared` maps queries/collections | verified | Keep neutral and lower-level | High | Yes | Consumer/purity tests |
| PV-12 | IS-12 | No adapter folders | No target-domain `api` or `adapters` path found | verified | Adapter folders are future-only | Critical | Yes | Path approval first |
| PV-13 | IS-13 | Root contract types | Six JavaScript/JSDoc contract files | verified | No TypeScript/module-type assumption | High | Yes | Check existing contract first |
| PV-14 | IS-14 | Constants mix platform concerns | Routes/endpoints/query keys/tokens/statuses exist | verified | Module constants cannot copy platform catalogs | Critical | Yes | Constant ownership audit |
| PV-15 | IS-15 | Root utils are mixed | 26 files and profile subfolder | verified | Not a generic shared template | High | Yes | Consumer/purity audit |
| PV-16 | IS-16 | Feature utils mix responsibilities | Endpoint builders, forms, validation, constants and transforms coexist | verified | Split only in tested migration | High | Yes | Define service/adapter/validation boundary |
| PV-17 | IS-17 | Import aliases are limited | `@/*` and ProofArena aliases only | verified | No module aliases now | High | Yes | Explicit config stage approval |
| PV-18 | IS-18 | Barrels are limited | Profile and ProofArena indexes; most features have none | verified | No universal barrel convention | High | Yes | Avoid new indexes |
| PV-19 | IS-19 | Backend is primarily layered | 37 routes, 35 controllers, 49 services, 50 models, 15 validators | verified | Preserve layered chains | Critical | Yes | Complete vertical migration only |
| PV-20 | IS-20 | Executable auth module exists | Eight auth module files and README | verified | No second auth module | Critical | Yes | Reconcile variants |
| PV-21 | IS-21 | ProofArena/users modules are limited | ProofArena README-only; users limited | verified | Do not infer general module convention | High | Yes | Human ownership decision |
| PV-22 | IS-22 | Backend validators use layered paths | Zod validators found under server validators | verified | Keep contract with registered chain | High | Yes | API/schema tests |
| PV-23 | IS-23 | Backend services use models/platform helpers | Challenge service imports several models, errors, DB helper | partially verified | Pattern varies and creates cross-domain coupling | Critical | Yes | Service-by-service graph |
| PV-24 | IS-24 | Client/server separation | Independent client and server roots; no shared runtime package | verified | API contracts are the boundary | Critical | Yes | No cross-imports |
| PV-25 | IS-25 | Dashboard/first-client compose many features | Multiple private feature hooks imported | verified | Platform/orchestration owner required | High | Yes | Public module interfaces later |
| PV-26 | IS-26 | Profile components use platform URL helper | Three components import `getRealtimeBaseUrl` | verified | UI/platform coupling, not a new client | Medium | Yes | Approved adapter/helper later |

Summary: 25 verified, 1 partially verified, 0 contradicted, 0 unknown. All runtime internal scaffolds remain blocked.

