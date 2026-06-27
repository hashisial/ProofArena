# Stage 1.3 Official Source-of-Truth Document Map

Generated: 2026-06-27

## Primary

| File | Purpose | Read when | Governs | Stages |
| --- | --- | --- | --- | --- |
| `STAGE_1_1_SOURCE_OF_TRUTH_SUMMARY.md` | Current repository facts/unknowns | Every architecture prompt | Whole repo | All |
| `stage-1-1-source-of-truth-manifest.json` | Machine evidence/traceability | Automated or count-sensitive work | Whole repo | All |
| `STAGE_1_1_ARCHITECTURE_INVARIANTS.md` | Preserved boundaries | Before architecture edits | Product/frontend/backend/data | All |
| `STAGE_1_2_FINAL_FINDINGS_CONSOLIDATED.md` | Final 100 findings | Duplicate/placeholder work | Routes/layouts/API/placeholders | 1.2 onward |
| `STAGE_1_2_FINAL_SOURCE_OF_TRUTH_LOCK_TABLE.md` | Current owner locks | Before choosing source | Routes/layouts/API/states | 1.2 onward |
| `stage-1-2-final-closure-manifest.json` | Final machine closure | Automated planning | Stage 1.2 | 1.3 onward |
| `adr/ADR-0001-scaleops-proofarena-architecture-boundary.md` | Architecture decision | Every risky future prompt | Product/refactor governance | All |
| `adr/ADR-0001-final-codex-governance-rulebook.md` | Enforceable prompt rules | Before production edits | All controlled systems | All |
| `adr/ADR-0001-adoption-package.md` | How to apply ADR | Preflight/non-compliance | All controlled systems | All |

## Supporting Evidence

Route/API/model/dependency/frontend ownership/backend flow/reusable maps, Stage 1.1 evidence index/traceability, Prompt 5/6 audits, layout/API/route source analyses, candidate ledger, and QA/test-gap documents remain supporting evidence. Read the domain-specific file before touching that domain.

## Risk and Control

| File | Authority | Use |
| --- | --- | --- |
| `STAGE_1_1_CRITICAL_FILE_PROTECTION_LIST.md` | Control | Any listed/adjacent file edit |
| `STAGE_1_1_DO_NOT_DUPLICATE_REGISTRY.md` | Control | Before creating systems |
| `STAGE_1_1_FORBIDDEN_ACTIONS_MANIFEST.md` | Control | Scope approval |
| `STAGE_1_2_FINAL_BLOCKER_REGISTER.md` | Risk | Determine blocked work |
| `STAGE_1_2_RISK_ACCEPTANCE_TABLE.md` | Risk | Decide temporary/not-accepted risks |
| `STAGE_1_2_SAFE_DELETE_CANDIDATE_POLICY.md` | Control | Any deletion proposal |
| `adr/ADR-0001-acceptance-gate.md` | Control | ADR status |
| `adr/ADR-0001-violation-response-plan.md` | Control | Architecture violation |

## Execution/Checklists

`STAGE_1_1_FUTURE_PROMPT_PREFLIGHT_CHECKLIST.md`, Stage 1.2 execution contracts, zero-break sequence, validation QA matrix, final validation command checklist, ADR enforcement checklist, and adoption package.

## Human Review

Stage 1.2 human review pack, ADR human approval dossier, ADR final human approval brief, and final status decision report. These do not replace recorded owner approval.

## Machine Manifests

Stage 1.1 inventory/graph/source/guardrail manifests; Stage 1.2 duplicate/blueprint/final closure manifests; ADR manifest; Stage 1.3 final closeout manifest.

## Historical/Supporting, Not Superseded Away

Prompt 1-7 detailed docs remain evidence history. Final classifications in the Stage 1.2 consolidated findings and closure manifest take precedence where they differ. No document is deleted or falsely labeled obsolete.

## Missing Evidence

No human approval record, compatibility telemetry, maintained test suite, canonical client/admin/API-version decision, or production model/index evidence exists. Those are gaps, not missing documentation to invent.

