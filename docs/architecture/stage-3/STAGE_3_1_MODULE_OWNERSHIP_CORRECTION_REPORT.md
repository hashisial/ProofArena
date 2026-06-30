# Stage 3.1 Module Ownership Correction Report

Prompt 1 correctly identified the ten business domains. Prompt 2 narrows ownership where repository evidence shows platform coupling or ambiguous variants.

| Module | Prompt 1 summary | Confirmed and corrected ownership | Confirmed files | Excluded or weak evidence | Human-review files | Platform reuse | Must never own | Confidence | Blocking issues |
|---|---|---|---|---|---|---|---|---|---|
| auth | Auth UI/use cases under platform security | Domain auth UI/use cases may be auth-owned; identity/session/token/role enforcement remains platform-owned | `client/src/features/auth`, `server/src/modules/auth` | Legacy/versioned variants are not assigned to a new module | All auth variants and users contract | Provider/store, guards, API client, middleware, routes | Router, token/session clone, role system, API client | Medium-high | Runtime authority and compatibility |
| profile | Profile lifecycle | Profile presentation/use cases are domain-owned; account identity, credentials and storage remain platform/users-owned | Client profile surfaces; server profile chain candidates | `server/src/modules/users` and duplicate models are not profile-owned yet | Profile/users models/services/controllers | Auth, API, routes, storage, shared UI | Credentials, session, storage infrastructure | Medium | Model authority/privacy/storage |
| offers | Outcome-offer lifecycle | Offer UI and full domain backend chain are confirmed | Outcome-offer feature/components/pages and backend chain | Payment execution and proof/profile internals excluded | Cross-domain contract points | Auth, API, routes, profile/proof public contracts | Payments, auth, router, API client | High | Tests and migration approval |
| challenges | Challenge lifecycle | Challenge UI and full domain backend chain are confirmed | Challenge feature/components/pages and backend chain | Plans/matching internals excluded | Cross-domain contracts | Auth, API, routes, dashboard shell, profile | Router, shell, auth, other module internals | High | Tests and contracts |
| plans | Execution-plan lifecycle | Plan UI and full domain backend chain are confirmed | Execution-plan feature/components/pages and backend chain | Payment processing/subscription billing excluded | Plan/payment package boundary | Auth, API, routes, shell, challenge/proof contracts | Payment logic, router, shell | High | Tests, cross-domain cycles |
| proof | Proof assets/readiness | Proof domain is confirmed but split frontend ownership remains unresolved | Proof/proofAssets UI and proof-asset backend chain | Storage infrastructure and visibility policy excluded | Both proof roots and storage/security files | Auth, API, routes, storage, profile | Storage client, auth, global error/privacy policy | Medium-high | Split ownership and sensitive data |
| matching | Matching workflows | Match UI and backend chain are confirmed | Matches feature/components/pages and match backend chain | Permission/identity policy excluded | Algorithm and role contracts | Auth/roles, API, routes, challenge/profile contracts | Auth, permissions, router | High | Tests and role behavior |
| messages | Message workflows | Message domain UI/data may be module-owned; socket runtime and auth remain platform-owned | Message page, routes/controller/model/events candidates | Messaging auth middleware/service and socket platform excluded | Realtime/security boundaries | Auth, users, API, socket platform, guards | Session, socket runtime, guards | Medium | Realtime ownership/security tests |
| payments | Payment workflows | Payment UI/domain handlers may be module-owned only under platform payment architecture | Payment page and billing/marketplace chain candidates | Env/secrets, Stripe adapter, webhook/raw-body policy excluded | Billing versus marketplace and webhook files | Auth, API, config/env, Stripe platform, errors | Secrets, client, DB, fake state | Medium | Security/payment architecture |
| admin | Moderation workflows | Admin resource/moderation behavior may be module-owned; shell, roles and domain models stay platform/domain-owned | Admin feature/components/pages and server chain | AdminLayout, AdminGate, nav, role policy, other domain models excluded | Cross-domain admin contracts | Admin shell/nav, auth/roles, API, audit/errors | Role system, shell, router, business dumping ground | High | Permission matrix and negative tests |

## Platform Ownership Corrections

| Platform area | Corrected ownership | Evidence | Module restriction |
|---|---|---|---|
| Routing | ScaleOps platform | `client/src/routes/AppRoutes.jsx`, route guards, `constants/routes.js` | Modules provide content only; no router/constants |
| API client | ScaleOps platform | `client/src/services/apiClient.js` | Adapters reuse it; no fetch/axios wrapper |
| Auth/role | ScaleOps platform with auth-domain use cases | Auth provider/store/guards and server middleware | No provider/store/guard/middleware clone |
| Dashboard shell | ScaleOps platform | `client/src/layouts/*`, navigation and shell components | No module shell/sidebar/topbar |
| Shared UI | Shared-governed | `client/src/components/ui`, `components/common` | Promote only after consumer/owner review |
| Shared utilities | Shared/platform/unknown by file | Root hooks/services/utils/types/constants and server utilities | No feature dumping or reverse imports |
| Public marketing | Public marketing under ScaleOps | `client/src/sections/home`, public pages/layout/navigation | Not owned by target business modules |
| Config/env | ScaleOps platform | root env/package/build and client/server config | No module config, env, package or deployment boundary |

