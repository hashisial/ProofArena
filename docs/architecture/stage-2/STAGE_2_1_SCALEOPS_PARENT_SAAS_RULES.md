# Stage 2.1 ScaleOps Parent SaaS Rules

Generated: 2026-06-28

These rules apply immediately to Stage 2 documentation and to any later production work after explicit approval.

| Rule ID | Rule | Reason | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| SOP-01 | ScaleOps is the parent SaaS ecosystem. | Prevents product/repository fragmentation. | ADR-0001; final Stage 1 handoff | Treat ProofArena as parent platform. | Confirm company/product identifiers and repository composition. | Any conflicting parent claim. |
| SOP-02 | ProofArena is a flagship module/product area, not a standalone project. | Preserves unified ownership and infrastructure. | ADR-0001; module READMEs | Create ProofArena app/repository/server. | Verify target remains under current client/server/module ownership. | New standalone root or package proposed. |
| SOP-03 | The existing repository remains the source of truth. | Avoids parallel implementation and contract drift. | Stage 1 source index; repo inventory | Scaffold a replacement repository or root. | Inspect live paths and Git root first. | Target cannot be traced to current repository. |
| SOP-04 | ProofArena features use ScaleOps-wide routing, auth, layout, API, dashboard, and navigation governance. | Cross-cutting systems require one owner. | Stage 1.2 lock; control board | Add module-local platform substitutes. | Map existing owner and dependencies. | Existing owner is unknown or bypassed. |
| SOP-05 | No ProofArena route tree may exist outside current route governance. | Parallel routes create broken links and authorization drift. | Route inventory; `AppRoutes.jsx`; route constants | Add a module router or duplicate constants. | Direct-load, redirect, guard, alias, and navigation map. | Any duplicate or unregistered route path. |
| SOP-06 | No ProofArena dashboard/layout shell may bypass current layout governance. | Role shells encode access, responsive, and navigation behavior. | Layout lock; critical files | Add a parallel provider/client/admin shell. | Verify role wrapper, sidebar, mobile, focus, and overflow ownership. | Role behavior or shell owner is unclear. |
| SOP-07 | No ProofArena navigation/sidebar stack may be created. | Navigation filtering is not an authorization boundary and must remain coordinated. | Navigation configs; ADR rulebook | Add module-local primary navigation. | Confirm central route/config/sidebar integration. | Duplicate nav source or role leakage risk. |
| SOP-08 | No ProofArena API client may be created outside current API governance. | Duplicate transports split base URL, auth, error, and response contracts. | API lock; `apiClient.js`; API inventory | Add Axios/fetch client or independent token handling. | Verify central transport, endpoint, service, and backend contract. | New transport or auth injection proposed. |
| SOP-09 | No ProofArena auth/role system may be created. | Authentication and authorization are platform security concerns. | Auth flow; critical files; ADR rules | Add module auth provider, token store, guard, or backend bypass. | Test shared session, guards, backend middleware, and roles. | UI-only security or middleware bypass. |
| SOP-10 | Shared UI/utilities follow ScaleOps-wide ownership; feature logic stays module/domain-owned. | Prevents shared dumping and upward dependencies. | Reusable-code map; module boundaries | Move product logic into shared foundations. | Dependency direction and semantic-equivalence check. | Shared layer imports ProofArena implementation. |
| SOP-11 | External consumers use the ProofArena public module surface. | Keeps module internals replaceable and prevents duplicate private contracts. | Module READMEs; boundary checker | Import private ProofArena files from outside module. | Search imports and run client boundary checker. | `@proofarena/*` or private relative import violates policy. |
| SOP-12 | Any reversal requires a formal future ADR and explicit human approval. | Product-boundary changes have platform-wide blast radius. | ADR index; acceptance gate | Reverse boundary through an ordinary feature prompt. | New ADR, migration plan, impact analysis, rollback, approval. | Reversal lacks formal decision evidence. |

## Enforcement Result

Violation of `SOP-01`, `SOP-02`, `SOP-03`, `SOP-05`, `SOP-08`, `SOP-09`, or `SOP-12` is an immediate stop condition. Documentation must record the violation before any further work.
