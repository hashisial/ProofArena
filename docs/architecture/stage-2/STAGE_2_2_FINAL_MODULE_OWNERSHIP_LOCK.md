# Final Module Ownership Lock

| Group | Items | Final class | Reason / allowed future change | ProofArena must not own | Required docs | Risk / review / future owner |
|---|---|---|---|---|---|---|
| Product logic | OW-01..OW-07: feature domains and versioned domain chains | ProofArena-owned product logic | May evolve tested domain behavior and contracts. | Router, shells, transport, global auth/security/DB connection | Ownership/dependency/backend maps | High-critical / human / Stage 3-5 |
| Platform logic | OW-08..OW-14: router, layouts, navigation, API client, auth, guards, API runtime | ScaleOps-owned platform logic | May accept module registrations through governed interfaces. | ProofArena-specific copies or bypasses | Authority lock, ADR, critical list | Critical / human / Stages 4-6, 22-26, 36 |
| Shared governed | OW-15..OW-18: UI, constants, utilities, module orchestration boundary | Shared but governed | May receive proven reusable contributions or cross-domain orchestration. | Feature dumping, copied services, deep private imports | Reuse map, module README, boundary report | Medium-high / mixed / Stages 3, 7 |
| Unknown | OW-19..OW-21: route shells, fallback records, external topology | Unknown/mixed ownership | Only evidence gathering or isolated replacement after verification. | Architecture authority or production truth | Placeholder reports, Stage 2 risk docs | High-critical / human / Stage 8/release owner |
| Human review | Naming, sensitive data/payment/admin ownership, final source selections | Human-review ownership | Approve explicit decisions. | Silent defaults | Human decision log | Critical / required / product-architecture owner |

The detailed OW item paths and purposes remain authoritative in `STAGE_2_2_MODULE_OWNERSHIP_BOUNDARY_TABLE.md`; this lock supplies the final disposition.

