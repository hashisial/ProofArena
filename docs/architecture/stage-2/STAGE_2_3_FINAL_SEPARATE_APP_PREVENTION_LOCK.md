# Final Separate-App Prevention Lock

| Lock | Rule | Evidence | Forbidden future action | Validation | Stop condition | Human review |
|---|---|---|---|---|---|---|
| AP-01 | ProofArena must not become a standalone app. | ADR-0001; Stage 2.1/2.2 locks; SA audit | Separate app/repo | Root/entry/package scan | New runtime boundary | Yes |
| AP-02 | ProofArena must not receive a separate package/workspace boundary. | Package audit; Stage 2 manifest | Product `package.json`/workspace | Package/lock/workspace diff | New product package | Yes |
| AP-03 | ProofArena must not receive a separate frontend or backend entry. | `main.jsx`, `App.jsx`, `server.js`, `app.js` | New entry/listener/Express app | Entry/listener scan | Second executable entry | Yes |
| AP-04 | ProofArena must not receive a separate router. | Route audit; `AppRoutes.jsx` | Module `Routes` tree/router | Route declaration scan | Second route authority | Yes |
| AP-05 | ProofArena must not receive a separate dashboard shell. | Layout audit/authority | Module dashboard root | Route/layout import scan | Parallel shell | Yes |
| AP-06 | ProofArena must not receive a separate navigation/sidebar stack. | Navigation audit | Product nav hierarchy/state framework | Config/import scan | Second nav authority | Yes |
| AP-07 | ProofArena must not receive a separate API client/server layer. | API audit/integration lock | Axios/fetch wrapper or server | Base/token/error/app scan | Alternate transport/runtime | Yes |
| AP-08 | ProofArena must not receive separate auth/role state or enforcement. | Auth audit/ADR | Provider/store/guard/middleware clone | Auth import/access tests | Second session/policy | Yes |
| AP-09 | ProofArena must not receive separate config/deploy/data boundaries. | Stage 2.1 risk docs | Product env/project/domain/DB connection | Local and external topology review | Unapproved split | Yes |
| AP-10 | Separation requires a formal ADR superseding ADR-0001 and explicit human approval. | ADR index/adoption package | Informal architecture reversal | Approved ADR check | No approved superseding ADR | Yes |

These locks are absolute until formally superseded.

