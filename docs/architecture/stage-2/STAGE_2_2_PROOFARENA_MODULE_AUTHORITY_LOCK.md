# ProofArena Module Authority Lock

| Area | Primary authority | Supporting docs | ADR / manifest | Confidence | Human review | Final rule | Forbidden action |
|---|---|---|---|---|---|---|---|
| Flagship identity | `STAGE_2_2_FINAL_CLOSEOUT_REPORT.md` | Identity audit, Stage 2.1 authority lock | ADR-0001; Stage 2.2 manifest | High | Yes for reversal | ProofArena stays inside ScaleOps. | Standalone app/repo |
| Public branding | Identity audit | Surface/status maps | ADR adoption | High | Yes for naming | Public branding is allowed without runtime ownership. | Derive architecture from copy |
| Feature ownership | Final ownership lock | Responsibility/dependency maps | ADR module decision | High | Mixed | Product domains may own behavior. | Own platform runtime |
| Route ownership | Integration contract lock | Route inventory/lock | ADR routing decision | High | Yes | Existing router/constants govern. | Parallel route tree |
| Dashboard ownership | Integration contract lock | Layout maps/critical list | ADR layout decision | High | Yes | Existing role shells govern. | Module dashboard shell |
| API ownership | Integration contract lock | API client lock/reuse map | ADR API decision | High | Yes | Shared transport and backend app govern. | Isolated API client/server |
| Auth/role behavior | Integration contract lock | Auth architecture/guards | ADR auth decision | High | Yes | Shared guards/middleware govern. | Auth/role bypass or clone |
| Backend module behavior | Final ownership lock | Backend flow/module README | ADR layering decision | High | Yes | Domain logic uses existing layers. | Parallel backend stack |
| Shared UI | Final ownership lock | Reusable code map | ADR shared-code decision | High | No | Generic primitives stay shared. | Module UI library clone |
| Shared utilities | Final ownership lock | Boundary report | ADR shared-code decision | High | No | Pure cross-cutting helpers stay shared. | Feature dumping/copies |
| Mock/placeholder | Final surface lock | Placeholder reports | ADR placeholder decision | High | Sensitive cases | Keep classification until real integration. | Fake production state |
| Naming/branding | Identity audit | Human decision log | ADR product boundary | Medium | Yes | No naming change without approval. | Audit-time rename |
| Standalone reversal | Final closeout | Stage 2.1 parent lock | ADR-0001 | High | Required | Only a superseding ADR can reverse boundary. | Informal separation |

