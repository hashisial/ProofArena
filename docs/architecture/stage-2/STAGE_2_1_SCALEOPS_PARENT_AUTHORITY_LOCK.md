# Stage 2.1 ScaleOps Parent Authority Lock

Generated: 2026-06-28

| Area | Primary authority | Supporting docs | ADR authority | Manifest | Confidence | Human review | Final rule | Forbidden future action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ScaleOps parent identity | Final boundary closeout | Stage 1 handoff; architecture docs | ADR decision 1 | Stage 2.1 manifest | high | yes for reversal | ScaleOps is parent SaaS. | Treat ProofArena as parent/peer platform. |
| ProofArena module identity | Parent audit + module READMEs | Project/module maps | ADR product boundary | Stage 2.1 manifest | high | yes for structural expansion | ProofArena is a flagship module. | Create standalone product architecture. |
| Repository boundary | Repository verification | Repo inventory/project structure | ADR repository boundary | Stage 1/2 manifests | high | yes for split | One repository remains source of truth. | Create separate repo/package/root. |
| Route boundary | Stage 1.2 route lock | Route inventory/AppRoutes | ADR routing rule | Stage 1.2 closure | high | yes for replacement | One route governance system. | Create module router/constants tree. |
| Dashboard/layout boundary | Stage 1.2 layout lock | Sensitive system map | ADR layout rule | Stage 1.2 closure | high | yes | Reuse role shells/layouts. | Create ProofArena shell/layout system. |
| API client boundary | Stage 1.2 API lock | API inventory/apiClient | ADR API rule | Stage 1.2 closure | high | yes | Reuse canonical transport. | Create ProofArena HTTP client. |
| Auth/role boundary | ADR final rulebook | Auth flow/critical files | ADR auth decision | ADR manifest | high | yes | Shared auth and backend authorization govern. | Fork provider/guards/middleware. |
| Navigation/sidebar boundary | Stage 2.1 system map | Navigation configs/sidebar engine | ADR no-duplicate rules | Stage 2.1 manifest | high | no | Integrate with central navigation. | Create module nav/sidebar stack. |
| Backend boundary | Backend flow/app composition | Route/service/model maps | ADR repository/API rules | Stage 1 manifests | high | yes | One app/server and shared infrastructure. | Create module server/config/database. |
| Shared code boundary | Module boundaries | Reusable-code/boundary reports | ADR shared-code rule | Guardrail manifest | high | conditional | Shared foundations remain product-neutral. | Import ProofArena implementation into shared layer. |
| Documentation boundary | Final source index + this lock | Prompt 1/2 evidence | ADR adoption package | Stage 2.1 manifest | high | no | Final authority overrides historical evidence. | Use stale audit as final permission. |
| Future ADR reversal | ADR index/acceptance gate | Human decision log | ADR-0001 | ADR manifest | high | yes | Reversal requires superseding ADR and approval. | Reverse through ordinary prompt. |

This authority lock does not mark ADR-0001 Accepted. It makes the existing mandatory boundary rules enforceable while human ratification remains pending.
