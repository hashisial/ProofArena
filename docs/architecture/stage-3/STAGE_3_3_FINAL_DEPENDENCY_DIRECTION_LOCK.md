# Stage 3.3 Final Dependency Direction Lock

| ID | Source | Target | Allowed | Reason | Allowed example | Forbidden example | Risk | Detection | Validation | Stop condition |
|---|---|---|---|---|---|---|---|---|---|---|
| DDL-001 | Module | Approved shared library | yes | Modules consume lower-level reusable code | Offer component -> shared Button | Shared Button -> offer service | Ownership inversion | Import graph | Boundary/lint/tests | Shared imports consumer |
| DDL-002 | Module | Platform-approved interface | yes | Modules reuse ScaleOps systems | Adapter -> platform API client | Module -> new client | Duplicate platform architecture | Client/import scan | Platform contract review | Interface bypassed |
| DDL-003 | Shared library | Lower-level shared primitive | yes | Layering is valid when neutral/acyclic | Form primitive -> `cn` | Shared util -> module rule | Cycle/semantic leakage | Dependency graph | Purity/owner review | Target not lower-level |
| DDL-004 | Shared library | Module implementation | no | Shared cannot depend on consumers | none | Shared hook -> profile service | Reverse dependency/cycle | Reverse-import scan | Boundary script | Any module import |
| DDL-005 | Shared UI | Module service/data adapter | no | Primitives receive neutral props | Callback prop | UI -> offer API | Hidden business/data layer | UI import scan | Component review | Service/adapter import |
| DDL-006 | Shared hooks | Module API adapter/service | no | Generic hooks cannot own use cases | Hook -> browser API | Hook -> challenge adapter | API/auth bypass | Hook import scan | Hook tests | Module dependency appears |
| DDL-007 | Shared utilities | Private env/config | no unless explicit platform interface | Deployment authority is platform-owned | Value passed as argument | Util -> `import.meta.env` | Hidden config boundary | Env/config search | Platform review | Private env read |
| DDL-008 | Shared API helper | API client construction | no | One canonical transport | Map normalized result | `axios.create`/token handling | Duplicate client/security split | Client/base URL/token scan | API lock review | Transport logic appears |
| DDL-009 | Frontend shared | Backend-only runtime | no | Runtime/trust boundaries differ | Approved DTO contract | UI -> server model | Build/security failure | Cross-runtime scan | Build/boundary | Backend import |
| DDL-010 | Backend shared/platform | Frontend-only runtime | no | Backend cannot depend on UI/browser code | Backend primitive | Server util -> React component | Runtime failure | Cross-runtime scan | Build/boundary | Frontend import |
| DDL-011 | Shared types | Backend models | default no | Models are not shared contracts | Approved generated contract | Type -> Mongoose model | Runtime coupling/drift | Type/runtime scan | Contract-owner review | Explicit support absent |
| DDL-012 | Platform | Approved shared primitive | yes with caution | Platform may consume lower-level primitives | Route guard -> LoadingState | Shared state -> route guard | Cycle/platform leakage | Graph and reverse scan | Boundary/tests | Shared needs platform implementation |
| DDL-013 | Any shared code | Dependency cycle | no | Cycles violate lower-level shared ownership | acyclic graph | module -> shared -> module | Runtime defects/coupling | Boundary tool/full graph | Build/tests | Cycle detected |

Current contained exceptions (`useAuth`, `useMyDashboard`, `useMyProfile`, `services/api.js`, route-aware UI) are migration risks, not approved patterns.

