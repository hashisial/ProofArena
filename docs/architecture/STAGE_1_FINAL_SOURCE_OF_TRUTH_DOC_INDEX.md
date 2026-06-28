# Stage 1 Final Source-of-Truth Document Index

Generated: 2026-06-28

This index governs documentary authority after Prompt 15. Earlier audit documents remain evidence but do not override final lock, closure, risk, or ADR documents.

## A. Primary Source of Truth

| File path | Authority | Governs | Required before Stage 2 | Required before production edits | Notes |
| --- | --- | --- | --- | --- | --- |
| `docs/architecture/STAGE_1_FINAL_COMPLETION_DECISION.md` | primary | Stage 1 verdict and Stage 2 gate | yes | yes | Final closeout authority. |
| `docs/architecture/STAGE_1_FINAL_HANDOFF_PACKAGE.md` | primary | Stage 1-to-Stage 2 contract | yes | yes | Mandatory handoff read. |
| `docs/architecture/STAGE_1_FINAL_SOURCE_OF_TRUTH_DOC_INDEX.md` | primary | Documentation authority | yes | yes | This index. |
| `docs/architecture/STAGE_1_1_SOURCE_OF_TRUTH_SUMMARY.md` | primary | Repository architecture baseline | yes | yes | Use with live repository verification. |
| `docs/architecture/STAGE_1_1_ARCHITECTURE_INVARIANTS.md` | primary | Preserved architecture invariants | yes | yes | Changes require explicit later decision. |
| `docs/architecture/STAGE_1_2_FINAL_FINDINGS_CONSOLIDATED.md` | primary | Duplicate/placeholder classifications | conditional | yes | Final Stage 1.2 classifications. |
| `docs/architecture/STAGE_1_2_FINAL_SOURCE_OF_TRUTH_LOCK_TABLE.md` | primary | Route/layout/API/placeholder source candidates | yes | yes | Candidate locks still require target validation. |
| `docs/architecture/STAGE_1_PROMPT_14_SOURCE_OF_TRUTH_AUTHORITY_LOCK.md` | primary | Thirteen architecture authority areas | yes | yes | Prompt 15 Stage 2 docs supersede only the pending Stage 2 row. |
| `docs/architecture/STAGE_1_PROMPT_14_COUNT_METRIC_LOCK.md` | primary | Canonical Stage 1 metrics and units | no | no | Prevents baseline/final count conflation. |
| `docs/architecture/STAGE_1_FINAL_RISK_ACCEPTANCE_AND_DEFERMENT_TABLE.md` | primary | Final risk disposition | yes | yes | Final status/owner/expiry authority. |
| `docs/architecture/STAGE_1_FINAL_NO_PRODUCTION_CODE_MODIFICATION_PROOF.md` | primary | Stage 1 Git scope proof | yes | yes | Current-worktree proof with stated limits. |
| `docs/architecture/STAGE_2_MANDATORY_PREFLIGHT_CHECKLIST.md` | primary | Stage 2 preflight | yes | yes | All 15 checks must pass. |
| `docs/architecture/STAGE_2_START_CONDITIONS.md` | primary | Stage 2 start authorization | yes | yes | Current status: human approval required. |

## B. Supporting Evidence

| File path | Authority | Governs | Required before Stage 2 | Required before production edits | Notes |
| --- | --- | --- | --- | --- | --- |
| `docs/architecture/STAGE_1_1_REPO_INVENTORY.md` | supporting | Folder/file baseline | no | conditional | Read when target paths are involved. |
| `docs/architecture/STAGE_1_1_ROUTE_INVENTORY.md` | supporting | Frontend routes | no | yes for route work | Validate against current router. |
| `docs/architecture/STAGE_1_1_API_INVENTORY.md` | supporting | Backend endpoints/front-end callers | no | yes for API work | Partial mappings remain. |
| `docs/architecture/STAGE_1_1_MODEL_USAGE_MAP.md` | supporting | Model consumers and sensitive fields | no | yes for data work | Production query/index evidence remains unknown. |
| `docs/architecture/STAGE_1_1_REUSABLE_CODE_MAP.md` | supporting | Hooks/services/utilities reuse | no | yes for shared-code work | Reuse requires semantic equivalence. |
| `docs/architecture/STAGE_1_1_ROUTE_DEPENDENCY_MAP.md` | supporting | Route/layout/guard dependencies | no | yes for route work | Do not infer from names alone. |
| `docs/architecture/STAGE_1_1_BACKEND_FLOW_MAP.md` | supporting | Route-controller-service-model flow | no | yes for backend work | Preserve partial/unknown status. |
| `docs/architecture/STAGE_1_1_TRACEABILITY_MATRIX.md` | supporting | Frontend/API/model traceability | no | conditional | Evidence, not final contract. |
| `docs/architecture/STAGE_1_2_PROMPT_5_FINDINGS_VERIFICATION.md` | supporting | Prompt 5 corrections | no | conditional | Final closure governs. |
| `docs/architecture/STAGE_1_2_LAYOUT_OWNERSHIP_ANALYSIS.md` | supporting | Layout ownership evidence | no | yes for layout work | Final lock governs decisions. |
| `docs/architecture/STAGE_1_2_ROUTE_SOURCE_OF_TRUTH_ANALYSIS.md` | supporting | Route candidate evidence | no | yes for route work | Preserve aliases. |
| `docs/architecture/STAGE_1_2_API_CLIENT_SOURCE_OF_TRUTH_ANALYSIS.md` | supporting | API transport/facade evidence | no | yes for API work | No bulk migration. |
| `docs/architecture/STAGE_1_CROSS_STAGE_CLAIM_CONSISTENCY_MATRIX.md` | supporting | Cross-stage claim comparison | no | no | Prompt 13 evidence. |
| `docs/architecture/STAGE_1_ADR_ALIGNMENT_CHECK.md` | supporting | ADR alignment evidence | no | conditional | No core ADR decision was contradicted. |
| `docs/architecture/STAGE_1_PROMPT_14_MANIFEST_VERIFICATION.md` | supporting | Manifest schema/validity evidence | no | no | Ten pre-Prompt-14 manifests verified. |

## C. Risk and Control Documents

| File path | Authority | Governs | Required before Stage 2 | Required before production edits | Notes |
| --- | --- | --- | --- | --- | --- |
| `docs/architecture/STAGE_1_ARCHITECTURE_CONTROL_BOARD.md` | risk/control | Eleven control areas | yes | yes | Executive control map. |
| `docs/architecture/STAGE_1_REMAINING_RISK_REGISTER.md` | risk/control | Detailed risk evidence | yes | yes | Final disposition table governs status. |
| `docs/architecture/STAGE_1_1_CRITICAL_FILE_PROTECTION_LIST.md` | risk/control | Protected files and prechecks | yes | yes | Mandatory before critical edits. |
| `docs/architecture/STAGE_1_1_DO_NOT_DUPLICATE_REGISTRY.md` | risk/control | Existing systems to reuse | yes | yes | Mandatory before new systems/files. |
| `docs/architecture/STAGE_1_1_FORBIDDEN_ACTIONS_MANIFEST.md` | risk/control | Prohibited refactor actions | no | yes | Applies across stages. |
| `docs/architecture/STAGE_1_1_BOUNDARY_VIOLATION_REPORT.md` | risk/control | Existing boundary concerns | no | conditional | Check before moving shared code. |
| `docs/architecture/STAGE_1_2_FINAL_BLOCKER_REGISTER.md` | risk/control | Twelve cleanup blockers | conditional | yes for cleanup | Blocked means no execution. |
| `docs/architecture/STAGE_1_2_CLEANUP_RISK_REGISTER.md` | risk/control | Cleanup blast radius | no | yes for cleanup | Supporting risk detail. |
| `docs/architecture/STAGE_1_2_SAFE_DELETE_CANDIDATE_POLICY.md` | risk/control | Deletion proof standard | no | yes for deletion | Deletion requires a separate prompt. |
| `docs/architecture/STAGE_1_PROMPT_14_CONTRADICTION_RESOLUTION_STATUS.md` | risk/control | Six gap dispositions | no | conditional | Five remain unresolved/assigned. |

## D. Execution and Checklist Documents

| File path | Authority | Governs | Required before Stage 2 | Required before production edits | Notes |
| --- | --- | --- | --- | --- | --- |
| `docs/architecture/STAGE_1_1_FUTURE_PROMPT_PREFLIGHT_CHECKLIST.md` | checklist | General future-prompt preflight | yes | yes | Apply with ADR rulebook. |
| `docs/architecture/STAGE_1_2_FINAL_VALIDATION_COMMAND_CHECKLIST.md` | checklist | Available validation commands | no | yes | Use only commands that exist. |
| `docs/architecture/STAGE_1_2_VALIDATION_QA_MATRIX.md` | checklist | Route/layout/API/manual QA | no | yes for cleanup | Target-specific checks required. |
| `docs/architecture/STAGE_1_2_ZERO_BREAK_CLEANUP_SEQUENCE.md` | checklist | Cleanup ordering | no | yes for cleanup | Does not authorize cleanup. |
| `docs/architecture/STAGE_1_2_FUTURE_PROMPT_EXECUTION_CONTRACTS.md` | checklist | Cleanup prompt contracts | no | yes for cleanup | Stop conditions are mandatory. |
| `docs/architecture/STAGE_1_PROMPTS_13_TO_15_EXECUTION_PLAN.md` | tracker/checklist | Stage 1 closeout history | no | no | Historical after Prompt 15. |
| `docs/architecture/STAGE_1_PROMPT_15_ACTION_LIST.md` | checklist | Prompt 15 execution contract | no | no | Completed by this package. |
| `docs/architecture/STAGE_2_MANDATORY_PREFLIGHT_CHECKLIST.md` | checklist/primary | Stage 2 start checks | yes | yes | All 15 checks required. |
| `docs/architecture/STAGE_2_START_CONDITIONS.md` | checklist/primary | Stage 2 gate | yes | yes | Human approval currently missing. |

## E. ADR Documents

| File path | Authority | Governs | Required before Stage 2 | Required before production edits | Notes |
| --- | --- | --- | --- | --- | --- |
| `docs/architecture/adr/ADR-0001-scaleops-proofarena-architecture-boundary.md` | ADR primary | Product/repository/refactor governance | yes | yes | Status remains Proposed. |
| `docs/architecture/adr/ADR-0001-adoption-package.md` | ADR primary | How future work applies ADR | yes | yes | Mandatory. |
| `docs/architecture/adr/ADR-0001-final-codex-governance-rulebook.md` | ADR primary | Enforceable future-prompt rules | yes | yes | Mandatory. |
| `docs/architecture/adr/ADR-0001-final-status-decision-report.md` | ADR status | Recommended status and conditions | yes | yes | Keep Proposed pending human gate. |
| `docs/architecture/adr/ADR-0001-acceptance-gate.md` | ADR gate | Acceptance criteria | yes | yes | Human gate fails/remains unresolved. |
| `docs/architecture/adr/ADR-0001-final-decision-review.md` | ADR evidence | Fourteen governance decisions | no | conditional | Supporting final review. |
| `docs/architecture/adr/ADR-0001-violation-response-plan.md` | ADR control | Violation stop/rollback | no | yes | Apply on governance breach. |
| `docs/architecture/adr/ADR_INDEX.md` | ADR index | ADR discovery/status | yes | yes | Must show Proposed status. |

## F. Machine-Readable Manifests

| File path | Authority | Governs | Required before Stage 2 | Required before production edits | Notes |
| --- | --- | --- | --- | --- | --- |
| `docs/architecture/stage-1-1-inventory.json` | manifest/evidence | Stage 1.1 inventory | no | no | Legacy schema. |
| `docs/architecture/stage-1-1-architecture-graph.json` | manifest/evidence | Dependency graph | no | conditional | Artifact-specific schema. |
| `docs/architecture/stage-1-1-source-of-truth-manifest.json` | manifest/primary | Stage 1.1 counts and traceability | yes | conditional | Machine baseline. |
| `docs/architecture/stage-1-1-guardrail-manifest.json` | manifest/control | Stage 1.1 guardrails | yes | yes | Machine guardrails. |
| `docs/architecture/stage-1-2-duplicate-audit-manifest.json` | manifest/evidence | Prompt 5/6 findings | no | no | Historical layered audit. |
| `docs/architecture/stage-1-2-cleanup-blueprint.json` | manifest/checklist | Prompt 7 cleanup plan | no | yes for cleanup | No execution authority. |
| `docs/architecture/stage-1-2-final-closure-manifest.json` | manifest/primary | Stage 1.2 final closure | conditional | yes for cleanup | Final Stage 1.2 machine authority. |
| `docs/architecture/adr/adr-0001-manifest.json` | manifest/ADR | ADR decisions/history/status | yes | yes | Preserve Prompt history. |
| `docs/architecture/stage-1-3-final-closeout-manifest.json` | manifest/primary | Stage 1.3 closeout | no | conditional | Stage 2 score is historical. |
| `docs/architecture/stage-1-prompt-13-consistency-manifest.json` | manifest/evidence | Cross-stage consistency | no | no | Prompt 13 authority evidence. |
| `docs/architecture/stage-1-prompt-14-safety-manifest.json` | manifest/primary | Prompt 14 safety result | yes | yes | 92/100 safety result. |
| `docs/architecture/stage-1-final-completion-manifest.json` | manifest/primary | Final Stage 1 handoff | yes | yes | Final machine authority. |

## G. Human-Review Documents

| File path | Authority | Governs | Required before Stage 2 | Required before production edits | Notes |
| --- | --- | --- | --- | --- | --- |
| `docs/architecture/STAGE_1_2_HUMAN_REVIEW_PACK.md` | human-review | Duplicate/placeholder owner choices | no | conditional | Required when affected. |
| `docs/architecture/adr/ADR-0001-human-approval-dossier.md` | human-review | ADR approval questions | yes | yes | Approval remains absent. |
| `docs/architecture/adr/ADR-0001-final-human-approval-brief.md` | human-review | Final owner decision | yes | yes | Boundary gate. |
| `docs/architecture/STAGE_2_PRE_READINESS_SNAPSHOT.md` | human-review/historical | Prompt 12 pre-readiness | no | no | Superseded for start authority. |

## H. Superseded or Stale for Authority

These files remain evidence and must not be deleted solely because newer authority exists.

| File path | Authority | Governs | Required before Stage 2 | Required before production edits | Notes |
| --- | --- | --- | --- | --- | --- |
| `docs/architecture/STAGE_1_1_DUPLICATE_OVERLAP_RADAR.md` | superseded baseline | Early duplicate candidates | no | no | Stage 1.2 final findings govern. |
| `docs/architecture/STAGE_1_1_PLACEHOLDER_MOCK_SYSTEM_REPORT.md` | superseded baseline | Initial 48 placeholder items | no | no | Final Stage 1.2 total is 60. |
| `docs/architecture/STAGE_1_2_DUPLICATE_LAYOUT_AUDIT.md` | supporting historical | Prompt 5 layout candidates | no | no | Final findings/lock govern. |
| `docs/architecture/STAGE_1_2_DUPLICATE_ROUTE_CONSTANTS_AUDIT.md` | supporting historical | Prompt 5 route candidates | no | no | Final findings/lock govern. |
| `docs/architecture/STAGE_1_2_DUPLICATE_API_CLIENT_AUDIT.md` | supporting historical | Prompt 5 API candidates | no | no | Final findings/lock govern. |
| `docs/architecture/STAGE_1_2_WEAK_PLACEHOLDER_AUDIT.md` | supporting historical | Prompt 5 placeholder candidates | no | no | Final findings govern. |
| `docs/architecture/STAGE_1_2_SOURCE_OF_TRUTH_DECISION_TABLES.md` | superseded planning | Prompt 7 recommendations | no | no | Prompt 8 final lock governs. |
| `docs/architecture/adr/ADR-0001-future-codex-rules.md` | superseded rules | Early Codex rules | no | no | Final governance rulebook governs. |
| `docs/architecture/adr/ADR-0001-acceptance-readiness-score.md` | historical score | Prompt 10 score 78 | no | no | Final status report governs. |
| `docs/architecture/STAGE_2_PRE_READINESS_SNAPSHOT.md` | historical score | Prompt 12 score 74 | no | no | `STAGE_2_START_CONDITIONS.md` governs. |

## Authority Rule

When documents differ, use this order: final Stage 1 decision/handoff/start conditions; ADR-0001 and final rulebook; final Stage 1.2 locks; Stage 1.1 source/invariants; risk/control/checklists; supporting evidence; historical/superseded records. Human approval gates override documentary readiness scores.
