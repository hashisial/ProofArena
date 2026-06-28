# Stage 1 Prompt 13 Correction Plan

Generated: 2026-06-27
Revalidated: 2026-06-28

This plan routes documentation corrections to Prompt 14 or final handoff decisions to Prompt 15. It authorizes no production edit.

| Correction ID | Issue | Docs affected | Correction type | Severity | Prompt | Exact correction instruction | Risk if not corrected |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PC-01 | Older Stage 1.2 audit totals can be mistaken for final classifications. | Prompt 5 audits, severity matrix, duplicate manifest, final findings | Authority update | Medium | 14 | Lock final findings/closure manifest as classification authority; label earlier values historical. | Unsafe cleanup based on stale labels. |
| PC-02 | Stage 1.1 baseline placeholder count 48 differs from final WPH count 60. | Source manifest, placeholder reports, metric reconciliation | Count reconciliation | Medium | 14 | Lock 48 as Stage 1.1 baseline and 60 as final Stage 1.2 classified scope. | False metric contradiction or missed placeholders. |
| PC-03 | Human-review counts use different units: 10 questions, 7 dependencies, 2 final decision rows. | ADR manifest/reports, trackers | Wording update | Medium | 14 | Require every human-review count to state its unit. | Misreported ADR readiness. |
| PC-04 | Legacy inventory and graph manifests omit production-scope and docs-change fields. | `stage-1-1-inventory.json`, `stage-1-1-architecture-graph.json` | Manifest update/authority clarification | Low | 14 | Treat as legacy/schema-specific manifests; do not invent historical fields. Record exception in safety manifest. | False claim that all manifests share identical schema. |
| PC-05 | ADR manifest uses ADR-specific identity fields rather than project top-level fields. | `adr/adr-0001-manifest.json`, manifest audit | Manifest update/authority clarification | Low | 14 | Validate identity through ADR title and `productBoundary`; lock schema as intentional. | False missing-key failure. |
| PC-06 | Prompt 12 Stage 2 score is a snapshot, not final Stage 2 handoff. | Stage 2 snapshot, closeout manifest, later handoff docs | Status clarification | High | 15 | Mark 74/100 as historical Prompt 12 pre-readiness and issue the final Stage 2 start verdict separately. | Stage 2 may be started or blocked using stale status. |
| PC-07 | ADR boundary approval is not recorded. | ADR status/gate/human brief, risk SR-01/SR-18 | Human review | High | 15 | Obtain approval or record an explicit deferral with owner and conditions; do not mark ADR accepted automatically. | Governance authority remains ambiguous. |
| PC-08 | Six open gaps can be mislabeled as hard contradictions. | Contradiction register, ADR gap analysis, blockers | Wording update | Medium | 14 | Preserve them as gaps/tensions with owners; report hard contradiction count as zero. | Teams may create replacement architecture to “resolve” a non-contradiction. |
| PC-09 | Prompt 13 detailed files need final completeness/link verification. | All Prompt 13 docs and consistency manifest | Checklist/execution | Medium | 14 | Parse JSON, verify all referenced files, authority labels, counts, and docs-only Git scope. | Prompt 15 receives an unverified handoff. |
| PC-10 | Final Stage 2 preflight must name exact target files/tests/rollback. | Prompt 15 handoff and Stage 2 checklist | Status clarification | High | 15 | Block implementation until exact scope, checks, rollback, and no-duplicate confirmation are recorded. | Broad Stage 2 work can absorb blocked cleanup. |

No correction requires deleting historical documents, changing ADR status, or modifying production code.
