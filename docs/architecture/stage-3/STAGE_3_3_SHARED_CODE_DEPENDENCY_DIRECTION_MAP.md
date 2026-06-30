# Stage 3.3 Shared Code Dependency Direction Map

| ID | Source | Target | Allowed | Reason | Example allowed import | Example forbidden import | Risk if violated | Detection | Stop condition |
|---|---|---|---|---|---|---|---|---|---|
| SDR-001 | Feature module | Approved shared UI | yes | Modules may compose product-agnostic primitives | Module component -> `components/ui/Button` | Shared Button -> module component | Coupling and ownership inversion | Import graph / boundary script | Shared UI imports module code |
| SDR-002 | Feature module | Approved shared helper | yes | Neutral transformations reduce demonstrated duplication | Module service -> `services/shared/buildQueryString` | Helper -> module service | Hidden orchestration/cycle | Reverse-import scan | Helper requires module knowledge |
| SDR-003 | Feature module | Platform API client/interface | yes | Modules must reuse ScaleOps transport authority | Module adapter -> `services/apiClient` | Module -> new `axios.create` | Split token/base URL/error behavior | Client-instantiation scan | New client or manual token policy appears |
| SDR-004 | Feature module | Another module public interface | conditional | Explicit contracts may support orchestration without private imports | Orchestrator -> approved DTO/interface | Module -> another module private service/model | Tight coupling and cycles | Public/private import audit | Public contract/owner is absent |
| SDR-005 | Approved shared library | Lower-level shared primitive | yes | Layered neutral primitives are acceptable if acyclic | Shared form field -> shared UI input | Shared utils -> module validation | Cycles and semantic leakage | Dependency graph | Dependency is not lower-level and neutral |
| SDR-006 | Approved shared library | Feature/module implementation | no | Shared cannot depend on consumers. | None | Shared hook -> `features/profile` | Reverse dependency and global coupling | `rg` feature/module paths under shared | Any reverse import is introduced |
| SDR-007 | Shared UI | Module service/API adapter | no | UI primitives cannot own data/business behavior. | None; use props/callbacks | Shared component -> offer service | Hidden API/business layer | Shared UI import scan | Service/adapter import appears |
| SDR-008 | Shared hooks | Module API adapter/service | no | Generic hooks cannot compose a feature use case. | Shared hook -> browser API | Shared hook -> challenge adapter | Module leakage and auth/API bypass | Hook import/behavior review | Module data dependency appears |
| SDR-009 | Shared types | Backend models | unknown / default no | Runtime models are not automatically shared contracts. | Approved generated/contract type only | Client shared type -> Mongoose model | Frontend/backend coupling and drift | Type/runtime import scan | Explicit contract architecture is absent |
| SDR-010 | Shared utilities | Private env/config | no | Environment ownership remains platform-governed. | Utility receives value as argument | Utility -> `import.meta.env` or server config | Hidden deployment boundary | Env/config search | Private config read appears |
| SDR-011 | Shared API helpers | HTTP client construction | no | Helpers must not instantiate transport. | Helper maps normalized result | Helper -> `axios.create` / token storage | Duplicate API client | Transport/client scan | Client/base URL/token behavior appears |
| SDR-012 | Platform | Approved shared primitive | yes with caution | Platform can use neutral primitives if direction remains acyclic. | Layout -> shared Button | Shared Button -> layout/router | Cycle and platform leakage | Dependency graph | Shared primitive must import platform implementation |
| SDR-013 | Frontend shared code | Backend-only code | no | Runtime and trust boundaries differ. | Shared DTO defined by approved contract | UI helper -> server model/service | Bundling and security failure | Path/import scan | Backend runtime import appears |
| SDR-014 | Backend shared/platform helper | Frontend-only code | no | Backend must not depend on browser/UI implementation. | Backend helper -> backend primitive | Server util -> React/client component | Runtime failure and coupling | Path/import scan | Frontend runtime import appears |
| SDR-015 | Shared library | Platform interface | conditional | Only stable, lower-level, side-effect-free platform interfaces may be consumed. | Shared UI -> approved design token | Shared hook -> auth provider/router/client | Platform authority leaks into shared | Interface and cycle review | Platform behavior, not value contract, is required |

## Current Exceptions to Contain

- Root shared-like hooks import feature code: `useAuth.js`, `useMyDashboard.js`, and `useMyProfile.js`.
- `client/src/services/api.js` imports feature services and is a compatibility facade, not an approved shared service.
- These existing bridges are not templates for new code and must not be copied or expanded.

