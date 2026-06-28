# Stage 1.3 Official Source-of-Truth Document Map

Generated: 2026-06-27
Revalidated: 2026-06-28

## Primary

| File | Purpose | Authority | Read when | Governs | Related stages | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `STAGE_1_1_SOURCE_OF_TRUTH_SUMMARY.md` | Current repository facts and unknowns | Primary | Every architecture prompt | Whole repository | All | Repository facts outrank later assumptions. |
| `stage-1-1-source-of-truth-manifest.json` | Machine evidence and traceability | Manifest | Automated or count-sensitive work | Whole repository | All | Validate JSON before relying on counts. |
| `STAGE_1_1_ARCHITECTURE_INVARIANTS.md` | Preserved product/frontend/backend/data boundaries | Primary | Before architecture edits | Architecture boundaries | All | A future ADR is required to reverse an invariant. |
| `STAGE_1_2_FINAL_FINDINGS_CONSOLIDATED.md` | Final 100 duplicate/placeholder findings | Primary | Duplicate, placeholder, or cleanup work | Routes, layouts, API, placeholders | 1.2 onward | Final classifications supersede earlier audit labels. |
| `STAGE_1_2_FINAL_SOURCE_OF_TRUTH_LOCK_TABLE.md` | Current planning owner locks | Primary | Before choosing a route/layout/API/state source | Routes, layouts, API, state systems | 1.2 onward | Locks guide planning; they do not authorize deletion. |
| `stage-1-2-final-closure-manifest.json` | Machine-readable Stage 1.2 closure | Manifest | Automated planning and reconciliation | Stage 1.2 findings/backlog/blockers | 1.3 onward | Preserve all 100 finding IDs. |
| `adr/ADR-0001-scaleops-proofarena-architecture-boundary.md` | Architecture boundary and governance decision | Primary | Every risky future prompt | Product and refactor governance | All | Status remains Proposed pending human approval. |
| `adr/ADR-0001-final-codex-governance-rulebook.md` | Enforceable future-prompt rules | Checklist | Before any production edit | All controlled systems | All | Any failed rule is a stop condition. |
| `adr/ADR-0001-adoption-package.md` | ADR compliance and change process | Primary | Preflight, violation, or ADR-change work | All controlled systems | All | Adoption is conservative governance, not cleanup permission. |

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
