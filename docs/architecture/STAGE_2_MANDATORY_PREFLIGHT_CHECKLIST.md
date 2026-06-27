# Stage 2 Mandatory Preflight Checklist

Generated: 2026-06-27

## Use Before Any Stage 2 Work

| Check ID | What to verify | Required doc | Pass condition | Fail action |
| --- | --- | --- | --- | --- |
| SP-01 | Final Stage 1 completion decision | `STAGE_1_FINAL_COMPLETION_DECISION.md` | Decision is understood and acknowledged. | Stop and read the final completion package again. |
| SP-02 | Source-of-truth docs | `STAGE_1_FINAL_SOURCE_OF_TRUTH_DOC_INDEX.md` | Primary authority docs are clear. | Stop and resolve authority ambiguity first. |
| SP-03 | Remaining risks | `STAGE_1_FINAL_RISK_ACCEPTANCE_AND_DEFERMENT_TABLE.md` | Risks are categorized correctly. | Stop and identify the blocked items. |
| SP-04 | No production code change proof | `STAGE_1_FINAL_NO_PRODUCTION_CODE_MODIFICATION_PROOF.md` | Stage 1 audit scope is docs-only. | Stop and investigate any non-doc diff. |
| SP-05 | ADR governance | `adr/ADR-0001-adoption-package.md` | ADR rules and boundary controls are known. | Stop and read ADR-0001 again. |
| SP-06 | Mandatory checklist itself | `STAGE_2_MANDATORY_PREFLIGHT_CHECKLIST.md` | The checklist is present before implementation. | Stop until the checklist exists. |
| SP-07 | Stage 2 start conditions | `STAGE_2_START_CONDITIONS.md` | Conditions for beginning Stage 2 are explicit. | Stop and record the blocking condition. |

