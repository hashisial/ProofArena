# Stage 3.3 Final Shared Code Anti-Pattern Prevention Lock

| ID | Anti-pattern | Detection signal | Severity | Prevention | Future action | Blocks production edits | Human review | Stop condition |
|---|---|---|---|---|---|---|---|---|
| APLK-001 | Module business logic in shared utils | Domain statuses/workflows/calculations under shared/root utils | high | Keep domain rules module-owned | Classify/migrate with tests | yes | yes | Domain semantics appear |
| APLK-002 | Feature components in shared UI | Module types/services/copy/actions in UI primitive | high | Shared UI stays product-neutral | Reject or compose in module | yes | yes | Feature dependency appears |
| APLK-003 | Shared hooks call module services | Shared/root hook imports feature/service/adapter | high | Shared hooks remain generic | Freeze/reassign current bridges | yes | yes | Module import appears |
| APLK-004 | Shared services become global business layer | Root facade imports many feature services | high | Neutral helpers only | Contain `services/api.js` | yes | yes | New orchestration added |
| APLK-005 | Shared API helper becomes client | Client construction/base URL/token/retry/error logic | critical | Sole platform client | Stop and remove proposal | yes | yes | Transport policy appears |
| APLK-006 | Shared types duplicate User/Profile/Role/Payment | Competing shapes/enums | critical | Authoritative sensitive contracts | Contract-owner review | yes | yes | Duplicate proposed |
| APLK-007 | Shared validation contains module rules | Domain/auth/payment fields/rules | high | Module schemas stay module-owned | Contract/security review | yes | yes | Domain/security rule appears |
| APLK-008 | Shared UI imports module data | Service/hook/adapter import | high | Props/callbacks only | Reject promotion | yes | no | Data-layer import appears |
| APLK-009 | Shared component owns auth/session | Auth context/token/role/redirect logic | critical | Platform wrappers compose primitives | Security escalation | yes | yes | Security policy appears |
| APLK-010 | Shared util reads private env/config | `process.env`, `import.meta.env`, config import | critical | Platform config interfaces only | Keep platform-owned | yes | yes | Private env read appears |
| APLK-011 | Shared imports modules | `features/` or `modules/` import | critical | One-way module -> shared | Block change | yes | no | Reverse import introduced |
| APLK-012 | Circular dependency through shared | module -> shared -> module | critical | Acyclic lower-level shared graph | Redesign ownership | yes | yes | Cycle detected |
| APLK-013 | Premature abstraction | One/speculative consumer | medium | Two stable consumers/platform reason | Keep local | yes for promotion | no | Consumer gate fails |
| APLK-014 | Over-generalized component | Many module flags/branches | high | Small primitive plus module composition | Reject/split before promotion | yes | yes | Generic API cannot be stable |
| APLK-015 | Admin/payment/auth hidden in shared | Privileged mutations/sensitive fields/role checks | critical | Sensitive explicit owner | Security review | yes | yes | Sensitive behavior hidden |
| APLK-016 | ProofArena logic disguised as ScaleOps shared | Proof/challenge/provider semantics under generic name | critical | Keep ProofArena domain logic module-owned | Require ADR for boundary reversal | yes | yes | Product boundary diluted |

