# Stage 1 Contradiction Register

Generated: 2026-06-27
Revalidated: 2026-06-28

## Result

No hard contradiction was found across the authoritative Stage 1.1, Stage 1.2, and Stage 1.3 records. Six apparent conflicts are deliberate deferrals or missing-evidence gaps. They remain registered because hiding them would create false certainty.

| Contradiction ID | Type | Docs involved | Conflicting statements or tension | Evidence | Severity | Impact | Recommended correction | Fix before Stage 2 | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CR-01 | Route source-of-truth | Route inventory, Stage 1.2 route lock, ADR D-03 | Current route owners are known, but no canonical client alias is selected. | RTE-011; blocker B-04; GAP-01 | High | Premature redirect/deletion can break bookmarks and role shells. | Preserve all aliases; record canonical/deprecation decision later. | No for Stage 2 boundary work; yes before route cleanup | Stage 4 / human review |
| CR-02 | Route source-of-truth | Admin route inventory, route lock, ADR D-03 | Three admin proof paths coexist while current governance forbids arbitrary canonicalization. | RTE-012; blocker B-05; GAP-02 | High | Wrong operational surface may become canonical. | Preserve paths and obtain admin/proof owner mapping. | No for Stage 2 boundary work; yes before admin route cleanup | Admin / Stage 4 |
| CR-03 | API client source-of-truth | API inventory, API lock, ADR D-05 | apiClient transport is clear, but `/api` versus `/api/v1` and facade window are not. | API-001..008; blockers B-06/B-07 | Critical | Auth, endpoint, and 29-importer regressions. | Keep transport/facade/mount compatibility; decide with contracts and telemetry. | No for Stage 2 boundary work; yes before API cleanup | Stage 5 / human review |
| CR-04 | ADR status | ADR status report, acceptance gate, Stage 1.3 closeout | Governance is enforceable conservatively while ADR acceptance is blocked by human gate. | AG-12 fail; status keep-proposed | High | Future prompts may confuse enforcement with formal adoption or cleanup permission. | Keep Proposed and distinguish conservative rules from acceptance. | Yes | Architecture owner / Prompt 15 |
| CR-05 | Cleanup readiness | Stage 1.2 readiness, test-gap report, ADR refactor rules | Documentation is complete enough for planning, but cleanup lacks behavioral tests and telemetry. | B-01/B-12; SR-09/SR-10 | High | Safe-looking refactors remain unverifiable. | Do not execute cleanup; establish target tests and compatibility evidence. | Yes for cleanup; no for documentation-only Stage 2 planning | Stage 9 / target stage |
| CR-06 | Stage 2 readiness | Stage 1.3 snapshot and Prompts 13-15 plan | Prompt 12 says Stage 2 is not ready at 74/100; later handoff is expected to permit a conditional start. | Stage 2 snapshot; closeout report; Prompt 15 plan | Medium | A stale snapshot may be mistaken for the final handoff verdict. | Label Prompt 12 value as a snapshot; let Prompt 15 own final Stage 2 decision. | Yes | Prompts 14 and 15 |

Product boundary, layout ownership, placeholder classification, risk severity, manifest counts, and no-production-code claims do not conflict in the authoritative records. Any later mismatch must be added here rather than silently normalized.
