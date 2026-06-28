# Stage 1 Stale Or Superseded Document Report

Generated: 2026-06-27
Revalidated: 2026-06-28

No document is deleted. "Superseded" means a newer document controls the current classification or readiness decision; the older file remains evidence.

| File path | Why stale or superseded | Newer authority | Keep as evidence | Future prompts read it | Authority status | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| `STAGE_1_1_REPO_INVENTORY.md` | Initial inventory; later source summary/manifest reconcile counts. | Source summary and source-of-truth manifest | Yes | For file-level evidence | Supporting | Keep as supporting evidence |
| `STAGE_1_1_RISK_MAP.md` | Initial risks are consolidated into guardrails and final risk register. | Architecture invariants and Stage 1 Remaining Risk Register | Yes | When tracing original risk evidence | Supporting | Keep as supporting evidence |
| `STAGE_1_1_DUPLICATE_OVERLAP_RADAR.md` | Early duplicate candidates were reverified in Stage 1.2. | Stage 1.2 final findings | Yes | For historical comparison only | Superseded classification | Keep but mark superseded |
| `STAGE_1_1_PLACEHOLDER_MOCK_SYSTEM_REPORT.md` | Baseline 48-item view predates final 60-item WPH classification. | Stage 1.2 final findings and placeholder classification | Yes | For baseline provenance | Superseded classification | Keep but mark superseded |
| `STAGE_1_1_COMPLETION_READINESS_REVIEW.md` | Stage 1.1 readiness is not final Stage 1/Stage 2 readiness. | Stage 1.3 closeout and final Stage 1 handoff | Yes | Only for Stage 1.1 history | Historical | Keep as supporting evidence |
| `STAGE_1_2_DUPLICATE_LAYOUT_AUDIT.md` | Prompt 5 classifications were corrected and finalized later. | Final findings and source lock | Yes | For similarity/evidence details | Superseded classification | Keep but mark superseded |
| `STAGE_1_2_DUPLICATE_ROUTE_CONSTANTS_AUDIT.md` | Prompt 5 route findings were reclassified by Prompt 6/8. | Final findings and route lock | Yes | For caller evidence | Superseded classification | Keep but mark superseded |
| `STAGE_1_2_DUPLICATE_API_CLIENT_AUDIT.md` | Prompt 5 API findings were separated into overlap versus distinct transports. | Final findings and API lock | Yes | For transport/caller evidence | Superseded classification | Keep but mark superseded |
| `STAGE_1_2_WEAK_PLACEHOLDER_AUDIT.md` | Early placeholder labels were replaced by five final risk classes. | Final findings and risk classification | Yes | For item-level evidence | Superseded classification | Keep but mark superseded |
| `STAGE_1_2_DUPLICATE_SYSTEM_SEVERITY_MATRIX.md` | Prompt 5 severity totals changed after verification. | Final closure manifest | Yes | For original audit history | Superseded counts | Keep but mark superseded |
| `stage-1-2-duplicate-audit-manifest.json` | Prompt 5 machine snapshot predates verification and final closure. | Cleanup blueprint and final closure manifest | Yes | For historical machine trace | Superseded snapshot | Keep but mark superseded |
| `STAGE_1_2_CLEANUP_READINESS_SCORECARD.md` | Prompt 6 readiness was refined into final backlog/blockers. | Final cleanup backlog and blocker register | Yes | For readiness evolution | Supporting | Keep as supporting evidence |
| `STAGE_1_2_CLEANUP_CANDIDATE_LEDGER.md` | Candidate ledger is detailed evidence, while Prompt 8 owns final classifications. | Final findings and closure manifest | Yes | Before candidate-specific cleanup | Supporting | Keep as supporting evidence |
| `STAGE_1_2_SOURCE_OF_TRUTH_DECISION_TABLES.md` | Planning choices were locked by Prompt 8. | Final source-of-truth lock table | Yes | For decision rationale | Supporting | Keep as supporting evidence |
| `stage-1-2-cleanup-blueprint.json` | Prompt 7 execution blueprint predates final closure priorities. | Final closure manifest | Yes | For candidate/QA/rollback detail | Supporting manifest | Keep as supporting evidence |
| `adr/ADR-0001-acceptance-readiness-score.md` | Prompt 10 score 78 is not the Stage 1.3 closeout score. | Final status report and Stage 1.3 closeout report | Yes | For validation history | Historical score | Keep as supporting evidence |
| `adr/ADR-0001-human-approval-dossier.md` | Prompt 10 dossier is refined by the final human approval brief. | Final human approval brief | Yes | For detailed question history | Supporting | Keep as supporting evidence |
| `adr/ADR-0001-final-decision-review.md` | Final decision evidence remains current, but status authority lives in final status report. | Final status decision report | Yes | Before interpreting individual decisions | Supporting | Keep as supporting evidence |
| `STAGE_2_PRE_READINESS_SNAPSHOT.md` | Prompt 12 snapshot is 74/100 and intentionally precedes final Prompt 15 handoff. | Final Stage 1 completion/handoff package | Yes | For Prompt 12 historical state | Stale-risk after Prompt 15 | Keep but mark superseded after final handoff |

Primary authority remains the Stage 1.1 source summary/manifests, Stage 1.2 final findings/locks/closure manifest, ADR-0001 plus final rulebook/adoption package, and the final Stage 1 source-of-truth/handoff documents.
