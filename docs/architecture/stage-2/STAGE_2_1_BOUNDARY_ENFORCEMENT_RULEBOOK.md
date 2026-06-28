# Stage 2.1 Boundary Enforcement Rulebook

Generated: 2026-06-28

| Rule ID | Section | Rule | Reason | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BE-01 | Global | ScaleOps remains the parent SaaS. | Establishes product authority. | ADR-0001; final handoff | Treat ProofArena as parent/peer platform. | Company/product/repository evidence check. | Conflicting parent claim. |
| BE-02 | Global | ProofArena remains a flagship module/product area. | Prevents product fragmentation. | ADR; parent audit | Call ProofArena standalone architecture. | Module path and ownership check. | Standalone ownership proposed. |
| BE-03 | Global | Mandatory ADR rules apply while status is Proposed. | Safety controls are not optional pending ratification. | ADR status/adoption/gate | Ignore rules because ADR is Proposed. | Prompt preflight cites ADR. | Rules are rejected without owner decision. |
| BE-04 | Repository | Never create a ProofArena root app, repository, or package. | Preserves one source of truth. | Repo verification; critical files | New ProofArena root/package/repo. | Root/package scan and owner approval. | New root/package appears. |
| BE-05 | Repository | Client and server remain ScaleOps runtime tiers. | Prevents interpreting tiers as products. | Project structure; architecture | Split tiers into product-specific repos. | Workspace/deployment map. | Independent product deployment proposed. |
| BE-06 | Routing | Never create a ProofArena parallel router. | Avoids path/guard drift. | Route inventory/lock | Module router or route tree. | Route constants, guard, deep-link QA. | Duplicate path/tree exists. |
| BE-07 | Routing | Route constants remain centrally governed. | One browser-path contract. | Stage 1.2 route lock | ProofArena route constants facade. | Path/reference/alias search. | Unregistered path appears. |
| BE-08 | Layout/dashboard | Never create a ProofArena-only dashboard shell. | Role shells encode access and responsive behavior. | Layout lock; critical files | Parallel dashboard/layout system. | Role/sidebar/mobile/focus QA. | Role shell owner is bypassed. |
| BE-09 | Navigation/sidebar | Reuse central navigation and sidebar engine. | Prevents link and role-filter divergence. | Navigation configs; control board | Module primary nav/sidebar. | Nav source and role visibility map. | Duplicate nav source appears. |
| BE-10 | API | Never create a ProofArena-only API client. | Base URL/auth/errors/contracts must be unified. | API lock; `apiClient.js` | Axios/fetch client or token interceptor. | Transport/import/endpoint/service audit. | Second transport is proposed. |
| BE-11 | API | ProofArena endpoints remain groups inside ScaleOps API governance. | Module endpoints are not a separate API product. | API inventory; backend route map | Separate API root/version/server. | Mount/controller/service/model trace. | Parallel API composition appears. |
| BE-12 | Auth/role | Never create a ProofArena-only auth or role system. | Identity/security are platform-wide. | Auth docs; ADR rules | Provider/store/guard/middleware fork. | Session, role, backend authorization QA. | Existing guard/middleware is bypassed. |
| BE-13 | Auth/role | Never rely on ProofArena UI checks as security. | Frontend visibility is not backend authorization. | Backend flow; role docs | UI-only admin/private protection. | Protected endpoint role tests. | Backend authorization absent. |
| BE-14 | Backend | One Express app and shared infrastructure remain authoritative. | Prevents server/database/security duplication. | Backend flow; module README | ProofArena server/config/database boundary. | App mounts, middleware, data ownership map. | Separate backend startup/config proposed. |
| BE-15 | Module ownership | ProofArena composes domains through its public module API. | Keeps internals replaceable. | Module READMEs; boundary script | External private-module import. | Import search and boundary checker. | Checker violation or bypass. |
| BE-16 | Module ownership | Features must not depend upward on ProofArena composition. | Prevents circular ownership. | Module boundaries; checker | Feature imports ProofArena module. | Dependency-direction scan. | Upward dependency found. |
| BE-17 | Shared code | Shared UI/utilities remain product-neutral. | Prevents ProofArena implementation leaking into foundations. | Reusable map; boundary report | Shared layer imports product implementation. | Boundary check and semantic review. | Foundation dependency violation. |
| BE-18 | Naming | ProofArena naming must not weaken ScaleOps parent ownership. | Language drives architecture decisions. | Naming audit; ADR | Standalone app/server/platform wording. | Naming/ownership matrix review. | Ambiguous text is used to justify duplication. |
| BE-19 | Docs/ADR | Final authority index governs over historical docs. | Prevents stale decisions. | Final source index; stale report | Use superseded audit as final permission. | Citation/authority check. | Source authority is unclear. |
| BE-20 | Docs/ADR | Any boundary reversal requires a future ADR and human approval. | Reversal has platform-wide blast radius. | ADR index; acceptance gate | Reverse boundary in ordinary prompt. | ADR, migration, tests, rollback, approval. | Formal decision evidence absent. |

## Global Stop Conditions

Stop immediately if any prompt proposes a separate ProofArena root, router, dashboard shell, navigation stack, API client/server, auth/role system, config/deployment boundary, or database ownership boundary. Record the violation and follow `STAGE_2_1_BOUNDARY_VIOLATION_RESPONSE_PLAN.md`.
