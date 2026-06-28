# Stage 2.1 Human Review Questions

Generated: 2026-06-28

| Question ID | Question | Why it matters | Related evidence | Risk if unanswered | Recommended default | Blocks Stage 2.2 | Blocks production edits |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HQ-01 | Should ADR-0001 remain Proposed, be accepted with conditions, or be explicitly deferred? | Formal boundary authority is unresolved. | ADR status/gate/human brief | Future prompts may dispute mandatory rules. | Keep Proposed and preserve all controls. | yes for production-bearing work | yes |
| HQ-02 | Should repository and root README naming become ScaleOps-first? | First-read language influences architecture interpretation. | Root folder; `README.md` | Product may be mistaken for parent platform. | Clarify docs before any rename. | no | no |
| HQ-03 | What public naming should UI use: ProofArena, ProofArena by ScaleOps, or ScaleOps/ProofArena by context? | Public branding and internal ownership have different needs. | Client metadata/constants/navigation | Inconsistent customer/developer hierarchy. | Use ProofArena by ScaleOps publicly until decided. | no | yes for naming edits |
| HQ-04 | Should API health/startup labels identify ScaleOps API or ProofArena by ScaleOps? | API naming may imply a separate backend. | `server/src/app.js`, `server/src/server.js` | Deployment/monitoring ownership ambiguity. | Keep current label; document intent. | no | yes |
| HQ-05 | Are generic package names `mern-client` and `mern-server` intentional? | Package identities affect deployment and tooling. | Both package files | Renames can break caches/deploys/scripts. | Do not rename without approved migration. | no | yes |
| HQ-06 | Which documents are official for product boundary? | Prevents historical docs from overriding final governance. | Final source index; Stage 2 rulebook | Conflicting prompt instructions. | Use final index, ADR, and Stage 2 package. | no | yes |
| HQ-07 | Are `client/src/modules/proofarena` and `server/src/modules/proofarena` approved module boundaries? | Module folders are valid only if not treated as apps. | Module READMEs and boundary checker | Future package/router/server may grow there. | Keep as orchestration/documentation boundaries. | no | yes for structural expansion |
| HQ-08 | Should `@proofarena/*` remain configured when the checker already bans external private imports? | Alias and enforcement express different policy surfaces. | Alias config; checker lines 171-180 | A future tool may bypass checker. | Keep for internal module imports; require checker. | no | yes for config edits |
| HQ-09 | Do external Vercel project names/domains/repositories preserve ScaleOps parent ownership? | Local repository cannot prove hosted topology. | Local configs only | Separate deployment identity may create real boundary drift. | Verify with release owner before Stage 2.2 production work. | unknown | yes for deployment edits |
| HQ-10 | What exact human approvals are required before Stage 2 production edits? | Current start gate says human approval required. | Stage 2 start conditions; SR-01/SR-18 | Production work may start without authority. | Require architecture-owner boundary disposition plus system owner approval. | yes | yes |

## Decision Gate

Prompt 3 may close Stage 2.1 documentation with unanswered non-blocking naming questions, but it must not authorize production-bearing Stage 2.2 work while `HQ-01` and `HQ-10` remain unresolved. `HQ-09` is mandatory before deployment-boundary changes.
