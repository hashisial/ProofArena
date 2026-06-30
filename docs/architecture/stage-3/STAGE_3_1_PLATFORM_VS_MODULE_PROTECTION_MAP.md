# Platform vs Module Protection Map

| ID | System/path | Class | Rule | Forbidden module action | Required docs/validation | Stop condition |
|---|---|---|---|---|---|---|
| PV-01 | `client/src/main.jsx`; `App.jsx` | Platform | One frontend entry. | Module bootstrap/app. | Stage 2 app lock; build | Second entry. |
| PV-02 | `server/src/server.js`; `app.js` | Platform | One API runtime. | Module server/app. | API lock; server tests | Second listener/app. |
| PV-03 | `client/src/routes/AppRoutes.jsx` | Platform | One route tree. | Module router. | Route lock/QA | Parallel tree. |
| PV-04 | `client/src/constants/routes.js`; route metadata | Platform | One route catalog. | Module route constants. | Route audit | Conflicting path. |
| PV-05 | `client/src/config/navigation` | Platform | Shared navigation. | Module nav stack. | Nav lock/QA | Second nav authority. |
| PV-06 | `client/src/layouts`; sidebar/topbar components | Platform | Shared shells. | Module shell/sidebar. | Layout lock/visual QA | Parallel shell. |
| PV-07 | Auth provider/store/guards | Platform | One identity/session policy. | Module auth provider/store/guard clone. | Auth docs/tests | Second session source. |
| PV-08 | `client/src/services/apiClient.js` | Platform | One HTTP transport. | Module API client. | API lock/network tests | Alternate base/token/errors. |
| PV-09 | Server middleware/auth/roles | Platform | Shared security enforcement. | Module middleware clone/bypass. | Auth/role tests | Unauthorized path. |
| PV-10 | Config/env/package/deploy files | Platform | Platform-level ownership. | Module config/deploy. | Stage 2 lock/build | Product split. |
| PV-11 | `client/src/components/ui` | Shared governed | Generic UI only. | Feature logic or duplicate library. | Stage 3.3 approval | Module-specific API/auth import. |
| PV-12 | `client/src/hooks`; `utils`; `types`; `constants` | Shared governed/mixed | Cross-module only after proof. | Feature dumping. | Consumer analysis | Unknown owner assumed. |
| PV-13 | `server/src/utils`; errors/responses | Shared/platform | Cross-cutting semantics. | Module response/error stack. | API contract tests | Divergent responses. |
| PV-14 | Module pages/components/hooks/services | Module | Domain behavior only. | Platform ownership. | Ownership lock/tests | Imports reverse boundary. |
| PV-15 | Module routes/controllers/services/models/validation | Module with platform composition | Domain layers may migrate together. | Duplicate copies/second app. | Backend map/tests | Partial slice migration. |
| PV-16 | Shared types/validation | Shared governed | Only genuinely cross-module contracts. | Module-specific schema dumping. | 2+ consumers/approval | Circular coupling. |
| PV-17 | `docs/architecture`; ADR | Documentation authority | Final locks govern. | Parallel authority docs. | Source index | Contradictory rule. |

