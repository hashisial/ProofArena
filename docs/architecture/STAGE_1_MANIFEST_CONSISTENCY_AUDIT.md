# Stage 1 Manifest Consistency Audit

Generated: 2026-06-27

## Summary
- All required JSON manifests currently parse.
- `productionCodeModified` remains `false` across the Stage 1 manifests.
- The metric differences across manifests are expected because they measure different audit layers.

| Manifest | Status | Key alignment notes |
| --- | --- | --- |
| `stage-1-1-inventory.json` | Parseable | Repository inventory, route counts, endpoint counts, models, hooks, services, utilities, layouts, guards, and API clients align with the Stage 1.1 evidence set. |
| `stage-1-1-architecture-graph.json` | Parseable | Dependency graph aligns with the Stage 1.1 file-to-file relationships. |
| `stage-1-1-source-of-truth-manifest.json` | Parseable | Scan totals and route/API/model counts match the recorded inventory. |
| `stage-1-1-guardrail-manifest.json` | Parseable | Product boundary, duplication, critical-file, and governance rules remain consistent. |
| `stage-1-2-duplicate-audit-manifest.json` | Parseable | Prompt 5 findings were verified, corrected, and carried into the final closure layers. |
| `stage-1-2-cleanup-blueprint.json` | Parseable | Cleanup candidates, blocker counts, and QA contracts are consistent with the final closure package. |
| `stage-1-2-final-closure-manifest.json` | Parseable | Final findings, closure backlog, blockers, and readiness counts match the closeout report. |
| `adr/adr-0001-manifest.json` | Parseable | ADR-0001 remains proposed and aligned with the final governance decision package. |
| `stage-1-3-final-closeout-manifest.json` | Parseable | Final ADR adoption status, closeout score, and Stage 2 pre-readiness are internally consistent. |

## Metric Reconciliation Notes

| Metric family | Reconciled value | Why it is not a contradiction |
| --- | --- | --- |
| Stage 1.1 repository scan | 817 files scanned | This is the baseline repository inventory. |
| Stage 1.1 route inventory | 108 routes found and mapped | Route inventory is a full coverage count, not a cleanup count. |
| Stage 1.1 backend inventory | 537 endpoints found, 436 mapped | Some endpoints remain intentionally unresolved for later ownership checks. |
| Stage 1.2 final findings | 100 findings | This is a duplicate/overlap/placeholder classification count, not a file count. |
| Stage 1.2 closure backlog | 11 / 43 / 23 / 4 / 13 / 6 | These are cleanup staging buckets, not contradiction signals. |
| Stage 1.3 closeout | 88 / 74 | These are separate closeout and Stage 2 pre-readiness scores. |

