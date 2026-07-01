# Stage 5 Mandatory Preflight Checklist

| Check ID | Required action | Required doc | Pass condition | Fail condition | Stop condition |
|---|---|---|---|---|---|
| S5-P01 | Read Stage 4 freeze certificate | `STAGE_4_FINAL_FREEZE_CERTIFICATE.md` | Caution and planned-only limitations understood | Certificate missing/unread | Stop Stage 5 |
| S5-P02 | Read final source lock | `STAGE_4_FINAL_SOURCE_OF_TRUTH_LOCK.md` | Candidate authorities remain candidates | Candidate promoted | Stop implementation |
| S5-P03 | Read final risk register | `STAGE_4_FINAL_RISK_ACCEPTANCE_AND_DEFERMENT_REGISTER.md` | Stage 5 dependencies carried | Relevant risk omitted | Stop affected conclusion |
| S5-P04 | Read human dossier | `STAGE_4_FINAL_HUMAN_APPROVAL_DOSSIER.md` | Approval gates recorded | Required decision guessed | Stop affected work |
| S5-P05 | Read Stage 5 decision | `STAGE_5_GO_NO_GO_DECISION.md` | GO WITH CAUTION and docs-only mode retained | Implementation proposed | Stop Stage 5 Prompt 1 |
| S5-P06 | Read Stage 5 handoff | `STAGE_5_HANDOFF_PACKAGE.md` | Scope and forbidden assumptions accepted | Handoff ignored | Stop audit |
| S5-P07 | Confirm ScaleOps parent boundary | ADR/Stage 3 freeze | ScaleOps parent; ProofArena module | Separate app/package/API boundary proposed | Stop |
| S5-P08 | Locate existing API client | Repository evidence | Current client and consumers inventoried | New client proposed first | Stop implementation |
| S5-P09 | Confirm no duplicate API contract layer | Repository audit | Existing contracts/helpers catalogued | Parallel layer proposed before audit | Stop implementation |
| S5-P10 | Confirm no duplicate backend response wrapper | Backend audit | Existing response formats mapped | New wrapper proposed first | Stop implementation |
| S5-P11 | Confirm no duplicate frontend adapter contract | Stage 3.2 locks/repo audit | Existing adapters and call sites mapped | Parallel adapter system proposed | Stop implementation |
| S5-P12 | Confirm no duplicate auth/role error handling | Auth/API audit | Existing failure paths identified | New handler introduced first | Stop implementation |
| S5-P13 | Perform audit before implementation | Prompt 1 scope | Documentation-only evidence gathered | Runtime edit needed | Stop and document blocker |
| S5-P14 | Respect route/auth/redirect dependencies | Stage 4 final docs | Dependencies and unknowns recorded | Route policy assumed solved | Stop affected conclusion |
| S5-P15 | Stop on ambiguous response authority | Audit result | Conflicts classified and owned | One source chosen without evidence | Stop standardization |
| S5-P16 | Stop when permissions affect contracts | Risk FR-008 / HD-010 | Endpoint middleware and role evidence mapped | Frontend role used as proof | Stop authorization claim |
| S5-P17 | Preserve browser/API 404 separation | Final source lock | Browser and API scopes inventoried independently | Semantics conflated | Stop error-policy proposal |

