# ScaleOps System Reuse Map for ProofArena

| ID | ScaleOps-wide system | Existing path(s) | Required reuse | Forbidden duplicate | Risk | Required docs/validation | Human review |
|---|---|---|---|---|---|---|---|
| SR-01 | Repository/workspace | `client`; `server`; root lockfile | Keep module in this repository | New ProofArena repository/workspace | Critical | ADR adoption package; repository scan | Yes |
| SR-02 | Frontend entry | `client/src/main.jsx`; `client/src/App.jsx` | Compose through existing app | ProofArena entry app | Critical | Route inventory; build | Yes |
| SR-03 | Backend entry | `server/src/server.js`; `server/src/app.js` | Mount through existing API | ProofArena server | Critical | API inventory; server start | Yes |
| SR-04 | Router | `client/src/routes/AppRoutes.jsx` | Register through one route tree | ProofArena router | Critical | Route maps; route QA | Yes |
| SR-05 | Route constants | `client/src/constants/index.js` | Use governed constants | Module route catalog with conflicting paths | High | Stage 1.2 route lock; link scan | Yes |
| SR-06 | Public navigation | `client/src/config/navigation/publicNavigation.js` | Add branded links through shared nav | ProofArena nav stack | High | Navigation audit; mobile QA | Yes |
| SR-07 | Public layout | `client/src/layouts/PublicLayout.jsx` | Render public module pages here | ProofArena public shell | High | Layout ownership; route QA | Yes |
| SR-08 | Dashboard shell | `client/src/layouts/DashboardLayout.jsx` | Compose provider module features | ProofArena dashboard shell | Critical | Critical file list; dashboard QA | Yes |
| SR-09 | Client shell | `client/src/layouts/ClientLayout.jsx` | Compose client module features | ProofArena client shell | Critical | Role/route QA | Yes |
| SR-10 | Admin shell | `client/src/layouts/AdminLayout.jsx` | Reuse for moderation | ProofArena admin app | Critical | Admin role QA | Yes |
| SR-11 | Sidebar/navigation state | `client/src/layouts/useSidebarShell.js`; navigation components | Reuse shared shell behavior | Module sidebar framework | High | Layout QA | Yes |
| SR-12 | Auth context/store | `client/src/features/auth`; `client/src/store/useAuthStore.js` | Use one session source | Module auth provider/store | Critical | Auth architecture; auth QA | Yes |
| SR-13 | Route guards | `client/src/routes/ProtectedRoute.jsx`; `RoleRoute.jsx` | Protect module routes centrally | UI-only role checks | Critical | Auth/role maps; negative QA | Yes |
| SR-14 | API transport | `client/src/services/apiClient.js` | Reuse base URL, cookies, refresh, errors | ProofArena axios/fetch instance | Critical | API client lock; network QA | Yes |
| SR-15 | Endpoint catalog | `client/src/constants/apiEndpoints.js` | Reuse endpoint definitions | Module endpoint registry | High | API inventory; contract QA | Yes |
| SR-16 | Backend layering | `server/src/routes`; `controllers`; `services`; `models`; `validators` | Keep route/controller/service/model flow | Parallel ProofArena backend stack | High | Backend flow map; boundary check | Yes |
| SR-17 | Backend auth/roles | `server/src/middleware` | Apply shared auth and role middleware | ProofArena auth middleware | Critical | Middleware map; protected endpoint QA | Yes |
| SR-18 | Shared UI | `client/src/components/ui` | Reuse primitives; module composes only | ProofArena UI library | Medium | Shared ownership docs; visual QA | No |
| SR-19 | Shared utilities | `client/src/utils`; `server/src/utils` | Reuse true cross-cutting helpers | Copied module helpers | Medium | Reusable code map; boundary check | No |
| SR-20 | Config/env/deploy | `client/vite.config.js`; `server/src/config/env.js`; Vercel/root config | Use platform settings | Module env/deployment target | Critical | Config controls; build/deploy validation | Yes |
| SR-21 | Data connection | `server/src/config`; shared Mongoose models | Reuse existing DB boundary | ProofArena database connection | Critical | Model usage map; migration review | Yes |
| SR-22 | Errors/responses | `server/src/errors`; `server/src/utils/apiResponse.js` | Use shared contracts | Module response/error framework | High | API contract tests | No |
| SR-23 | Build scripts | `client/package.json`; `server/package.json`; `scripts/check-module-boundaries.mjs` | Use existing scripts | Module build pipeline | High | Build/lint/boundary checks | Yes |
| SR-24 | Documentation governance | `docs/architecture`; `docs/architecture/adr` | Follow Stage 1/2 authority | Parallel architecture rulebook | High | Authority index review | No |

