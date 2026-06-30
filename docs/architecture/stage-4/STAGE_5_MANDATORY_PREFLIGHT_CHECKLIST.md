# Stage 5 Mandatory Preflight Checklist

| ID | Required action | Required doc | Pass condition | Fail condition / stop |
|---|---|---|---|---|
| S5-P01 | Read Stage 4 freeze certificate | STAGE_4_FINAL_FREEZE_CERTIFICATE.md | Limitations understood | Missing/unread |
| S5-P02 | Read source lock | STAGE_4_FINAL_SOURCE_OF_TRUTH_LOCK.md | Candidates not promoted | Authority ambiguous |
| S5-P03 | Read risk register | STAGE_4_FINAL_RISK_ACCEPTANCE_AND_DEFERMENT_REGISTER.md | Risks carried | Risk omitted |
| S5-P04 | Read human dossier | STAGE_4_FINAL_HUMAN_APPROVAL_DOSSIER.md | Approval gates known | Required decision ignored |
| S5-P05 | Read Stage 5 decision/handoff | STAGE_5_GO_NO_GO_DECISION.md and handoff | Docs-only mode retained | Implementation proposed |
| S5-P06 | Confirm product boundary | Stage 3/ADR locks | ScaleOps parent, ProofArena module | Separate app/package proposed |
| S5-P07 | Confirm existing API client | Repository audit | Existing client located | New client proposed first |
| S5-P08 | Confirm no duplicate contract layer | Repository audit | Existing helpers catalogued | Parallel wrapper proposed |
| S5-P09 | Confirm no duplicate backend response wrapper | Backend audit | Existing formats mapped | New wrapper before audit |
| S5-P10 | Confirm no duplicate frontend adapter contract | Stage 3.2 locks and repo audit | Adapters mapped | Parallel adapter system |
| S5-P11 | Confirm auth/role error ownership | Auth/API audit | Current behavior identified | New failure handler proposed |
| S5-P12 | Audit before implementation | Prompt 1 scope | Documentation only | Runtime edit needed |
| S5-P13 | Respect route/auth/redirect dependencies | Stage 4 final docs | Dependencies recorded | Route policy assumed solved |
| S5-P14 | Stop on ambiguous API response authority | Audit result | Authority evidence strong | Conflicting wrappers/formats |
| S5-P15 | Stop when unresolved route/auth roles affect contract | Risk register | Mark unknown/human review | Guess endpoint permission |

