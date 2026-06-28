# Stage 1 Prompt 14 Count and Metric Lock

Generated: 2026-06-28

Values are locked to their documented units. A baseline count and a final classified count are not interchangeable.

| Metric | Canonical value | Source | Confidence | Lock rationale | Required before Stage 2 |
| --- | ---: | --- | --- | --- | --- |
| Total files scanned | 817 | Stage 1.1 coverage/manifest | high | Repository audit scope. | none |
| Frontend files scanned | 564 | Stage 1.1 coverage/manifest | high | Frontend audit scope. | none |
| Backend files scanned | 252 | Stage 1.1 coverage/manifest | high | Backend audit scope. | none |
| Frontend routes | 108 found / 108 mapped | Stage 1.1 traceability and Prompt 13 reconciliation | high | Found and mapped are separate units. | none |
| Backend endpoints | 537 found / 436 fully mapped | Stage 1.1 API/coverage and Prompt 13 reconciliation | high | Full mapping requires route-controller-service-model traceability. | Preserve 101 partial/unknown mappings. |
| Models | 50 found / 45 mapped | Stage 1.1 model usage and Prompt 13 reconciliation | high | Five models retain incomplete usage proof. | Preserve unknowns. |
| Services | 73 found | Stage 1.1 source-of-truth manifest | high | Inventory count only. | none |
| Hooks | 44 found | Stage 1.1 source-of-truth manifest | high | Inventory count only. | none |
| Utilities | 79 found | Stage 1.1 source-of-truth manifest | high | Inventory count only. | none |
| Layouts inventoried | 7 | Stage 1.1 source-of-truth manifest | high | Inventory metric, not duplicate count. | none |
| Guards inventoried | 5 | Stage 1.1 source-of-truth manifest | high | Inventory metric. | none |
| API clients baseline | 2 | Stage 1.1 source-of-truth manifest | medium | Baseline client count differs from Stage 1.2 request-system findings. | Keep unit label. |
| High-risk files | 36 | Stage 1.1 source-of-truth manifest | high | Protection-list baseline. | Apply preflight. |
| Stage 1.1 duplicate candidates | 28 | Stage 1.1 source-of-truth manifest | high | Broad candidate baseline, not final confirmed duplicate count. | none |
| Duplicate layouts | 6 confirmed + 4 overlaps | Stage 1.2 final closure | high | Confirmed duplicates and possible overlaps remain separate. | none |
| Duplicate route/path systems | 17 confirmed + 3 possible | Stage 1.2 final closure | high | Confirmed and possible remain separate. | none |
| Duplicate API/request systems | 8 confirmed + 2 distinct transports | Stage 1.2 final closure | high | Distinct transports are not mislabeled as duplicates. | none |
| Placeholder/mock baseline | 48 | Stage 1.1 placeholder report | high | Earlier audit baseline only. | Never present as Stage 1.2 final total. |
| Final placeholder/mock findings | 60 | Stage 1.2 final closure | high | Final classified total. | none |
| Acceptable placeholders | 20 | Stage 1.2 final closure | high | Risk class. | none |
| Product-risk placeholders | 17 | Stage 1.2 final closure | high | Risk class. | none |
| Architecture-risk placeholders | 14 | Stage 1.2 final closure | high | Risk class. | none |
| Security-risk placeholders | 3 | Stage 1.2 final closure | high | Risk class. | none |
| Unknown placeholders | 6 | Stage 1.2 final closure | high | Risk class. | Preserve unknown status. |
| Cleanup candidates | 100 | Stage 1.2 blueprint/final closure | high | Final candidate ledger total. | none |
| Cleanup readiness | 17 ready / 23 caution / 54 blocked / 6 unknown | Stage 1.2 blueprint | high | Readiness classes total 100. | Do not execute blocked/unknown items. |
| Cleanup backlog | P0 11 / P1 43 / P2 23 / P3 4 / parked 13 / human 6 | Stage 1.2 final closure | high | Backlog classes total 100. | none |
| Stage 1.2 blockers | 12 | Stage 1.2 final blocker register | high | Closure blocker count. | Respect blocker owners. |
| Remaining Stage 1 risks | 18 | Stage 1 remaining risk register | high | Stable risk ID count. | Prompt 15 assigns final disposition. |
| ADR core decisions | 10 | ADR-0001 manifest | high | Original D-series decisions. | none |
| Final governance decisions | 14 | ADR final decision review | high | Expanded final review unit. | Do not conflate with core decisions. |
| Human-review questions | 10 | ADR human-approval docs | high | Question count. | Owner approval or explicit deferral. |
| Material human dependencies | 7 | ADR closeout package | high | Dependency count, not question count. | Prompt 15 records disposition. |
| Final human-review decision rows | 2 | ADR final decision review | high | Decision-row count, not question count. | Prompt 15 records disposition. |
| Acceptance gate | 7 pass / 4 conditional / 1 fail | ADR acceptance gate | high | Twelve gate outcomes. | Keep ADR proposed unless human gate changes. |
| Prompt 10 ADR readiness | 78/100 | ADR acceptance-readiness score | high | Historical Prompt 10 score. | Label historical. |
| Stage 1.3 closeout | 88/100 | Stage 1.3 closeout report | high | Stage 1.3 closeout score. | none |
| Stage 2 pre-readiness snapshot | 74/100 | Stage 2 pre-readiness snapshot | high | Historical snapshot; not final start authorization. | Prompt 15 owns final verdict. |

## Lock Result

- Required metric families locked: **17**.
- Detailed metric rows: **35**.
- Canonical values marked `UNKNOWN`: **0**.
- Runtime/deployed-state claims remain outside this metric lock and are not inferred from documentation counts.
