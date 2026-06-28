# Stage 1 Count And Metric Reconciliation

Generated: 2026-06-27
Revalidated: 2026-06-28

| Metric | Values found | Source documents | Consistent | Canonical value | Confidence | Required correction |
| --- | --- | --- | --- | --- | --- | --- |
| Total files scanned | 817 | Stage 1.1 source manifest; coverage report | Yes | 817 baseline files | High | None; this is the Stage 1.1 scan snapshot. |
| Frontend files scanned | 564 | Stage 1.1 source manifest | Yes | 564 | High | None |
| Backend files scanned | 252 | Stage 1.1 source manifest | Yes | 252 | High | None |
| Shared/root files scanned | 1 implied by 817 total minus frontend/backend | Source manifest/coverage report | Mostly | 1 in this baseline accounting | Medium | Prompt 14 should preserve the manifest's own categories rather than infer new totals. |
| Frontend routes | 108 found / 108 mapped | Route inventory; source manifest; QA references | Yes | 108 / 108 | High | None |
| Backend endpoints | 537 found / 436 mapped | API inventory; source manifest | Yes | 537 / 436 | High | Keep unmapped remainder explicit. |
| Models | 50 found / 45 mapped | Model usage map; source manifest | Yes | 50 / 45 | High | Keep five unresolved mappings explicit. |
| Services | 73 | Service inventory; source manifest | Yes | 73 | High | None |
| Hooks | 44 | Hook inventory; source manifest | Yes | 44 | High | None |
| Utilities | 79 | Utility inventory; source manifest | Yes | 79 | High | None |
| Layouts found | 7 inventory layouts | Stage 1.1 source manifest | Yes within inventory scope | 7 inventory owners | High | Do not compare directly with duplicate clusters. |
| Guards found | 5 | Stage 1.1 source manifest | Yes | 5 | High | None |
| API clients found | 2 baseline clients | Stage 1.1 source manifest | Yes within baseline scope | 2 baseline API-client systems | High | Distinct transport overlaps are a separate Stage 1.2 metric. |
| High-risk files | 36 | Stage 1.1 source manifest and protection list | Yes | 36 | High | None |
| Duplicate candidates baseline | 28 | Stage 1.1 source manifest | Yes | 28 early candidates | High | Mark as Stage 1.1 baseline, not final Stage 1.2 findings. |
| Duplicate layout systems | 10 initial; 6 confirmed + 4 possible/intentional overlaps | Prompt 5 tracker; final closure manifest | Yes after classification | 6 confirmed, 4 overlaps | High | Prompt 14 locks final split and labels 10 as initial total. |
| Route/path systems | 20 initial; 17 confirmed + 3 possible/distinct | Prompt 5 tracker; final closure manifest | Yes after classification | 17 confirmed, 3 possible | High | Prompt 14 locks final split. |
| API/request systems | 10 initial; 8 confirmed + 2 distinct transports | Prompt 5 tracker; final closure manifest | Yes after classification | 8 confirmed, 2 distinct | High | Prompt 14 must not call the two distinct transports duplicates. |
| Placeholder/mock items | 48 Stage 1.1 baseline; 60 final WPH findings | Stage 1.1 source manifest; Stage 1.2 final findings | Mostly; different audit depth | 60 final classified items; 48 baseline snapshot | High | Label each value by stage instead of forcing equality. |
| Placeholder risk classes | 20 acceptable, 17 product, 14 architecture, 3 security, 6 unknown | Final closure manifest | Yes; totals 60 | 20/17/14/3/6 | High | None |
| Cleanup candidates | 100 | Cleanup blueprint; final closure manifest | Yes | 100 | High | None |
| Cleanup readiness | 17 ready, 23 caution, 54 blocked, 6 unknown | Cleanup blueprint/tracker | Yes; totals 100 | 17/23/54/6 | High | None |
| Final backlog | P0 11, P1 43, P2 23, P3 4, parked 13, human 6 | Final closure manifest/backlog | Yes; totals 100 | 11/43/23/4/13/6 | High | None |
| Stage 1.2 blockers | 12 | Blocker register; final closure manifest | Yes | 12 | High | None |
| Remaining Stage 1 risks | 18 | Remaining risk register; Stage 1.3 manifest | Yes | 18 unique risk IDs | High | Count unique IDs, not the later status-addendum rows. |
| ADR core decisions | 10 D-series decisions | ADR manifest; Prompt 10 report | Yes | 10 | High | None |
| ADR final governance decisions | 14 F-series decisions | Final decision review; ADR manifest | Yes | 14 | High | Do not compare to 10 core decisions as though duplicate. |
| Human-review metrics | 10 owner questions; 7 material Prompt 10 dependencies; 2 final human-review decision rows | Human dossiers; Prompt 10/11 manifests | Yes; different units | Preserve all three labeled values | High | Prompt 14 must label the unit whenever reporting a human-review count. |
| ADR acceptance gate | 7 pass, 4 conditional, 1 fail | Acceptance gate; ADR manifest | Yes; totals 12 | 7/4/1 | High | None |
| ADR Prompt 10 readiness | 78/100 | Acceptance readiness score | Yes | 78 historical validation score | High | Do not use as Stage 1.3 closeout score. |
| Stage 1.3 closeout | 88/100 | Closeout report/manifest | Yes | 88 | High | None |
| Stage 2 pre-readiness snapshot | 74/100, not ready | Snapshot/closeout manifest | Yes at Prompt 12 | 74 historical snapshot | High | Prompt 15 owns the later final handoff verdict. |

No numeric contradiction requires changing production or architecture records. Prompt 14 must lock labels and units so baseline, final, and readiness metrics are not conflated.
