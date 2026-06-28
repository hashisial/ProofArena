# ADR-0001 Contradiction and Gap Analysis

Generated: 2026-06-27
Revalidated: 2026-06-28

## Contradictions And Tensions

| ID | Location | Problem | Evidence | Impact | Recommended correction | Severity | Fix before Prompt 11 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CT-01 | ADR D-03 and current route system | Central route governance is the direction, while hardcoded paths, compatibility aliases, and metadata gaps remain. | RTE-001..020; route lock table; `AppRoutes.jsx`, `routes.js`, `routeMetadata.js` | Calling one alias canonical now could break links, redirects, or bookmarks. | State that governance is directional and preserve aliases pending telemetry and owner decision. | High | Yes |
| CT-02 | ADR D-05 and API request layer | One Axios transport exists, but `api.js`, endpoint literals, conditional `/v1` builders, and dual server mounts overlap. | API-001..008; blockers B-06/B-07; server route indexes | A premature standardization can break auth refresh, response transforms, or endpoint versions. | Lock `apiClient` as transport only; keep facade/version choices conditional. | Critical | Yes |
| CT-03 | ADR D-04 and dashboard layouts | A shared SidebarCore exists while provider, client, and admin shells repeat non-policy primitives. | LAY-003..009; layout lock and blast-radius reports | A broad merge could absorb role, focus, drawer, or action policy. | Preserve role wrappers and permit only tested non-policy extraction. | High | Yes |
| CT-04 | ADR D-09 placeholder rules | Disclosed previews are allowed while fake production records are rejected, which can look inconsistent without a decision rule. | WPH classes A-D; risk acceptance table | Future prompts may remove valid previews or retain misleading fallbacks. | Make disclosure, data source, mutation capability, and security/commercial claims the classification test. | High | Yes |
| CT-05 | ADR D-10 and cleanup readiness | Static audit evidence is extensive, but runtime tests and compatibility telemetry are missing. | Test-gap report; blockers B-01/B-12; readiness score | Governance could be mistaken for permission to execute cleanup. | State explicitly that ADR enforcement does not authorize cleanup. | High | Yes |

These are controlled current-state tensions, not evidence for creating parallel architecture.

## Evidence Gaps

| ID | Location | Problem | Evidence | Impact | Recommended correction | Severity | Fix before Prompt 11 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-01 | Client routes | No canonical choice exists among `/client`, `/dashboard/client`, and `/dashboard/workspace`. | RTE-011; blocker B-04 | Redirect and navigation policy cannot be finalized. | Keep all compatibility paths and require owner/telemetry decision. | High | No; keep proposed |
| GAP-02 | Admin proof routes | No canonical choice exists among `/admin/proofs`, `/admin/proof-assets`, and `/admin/proof-review`. | RTE-012; blocker B-05 | The wrong operational surface could become canonical. | Require admin/proof owner and endpoint/page mapping. | High | No; keep proposed |
| GAP-03 | API versioning | Canonical `/api` versus `/api/v1` policy is unknown. | API-006; RTE-014; blocker B-06 | Broad feature contracts can break during prefix cleanup. | Require API-version ADR decision, telemetry, and contract suite. | Critical | No; keep proposed |
| GAP-04 | Legacy API facade | Export-level runtime usage for the 29-importer `api.js` facade is incomplete. | API-001..005; blocker B-07 | Facade removal cannot be safely sequenced. | Build export-to-caller-to-endpoint map before migration. | High | No; block removal |
| GAP-05 | Legacy public layout | Runtime/external ownership of `RootLayout.jsx` and `components/Layout.jsx` is unproven. | LAY-001; blocker B-02 | Deletion or consolidation may break hidden consumers. | Require runtime, barrel, import, and external-consumer proof. | High | No; human review |
| GAP-06 | Unmapped pages | Six page files have no confirmed route or product owner. | WPH-042..047; blocker B-03 | Reuse or deletion may revive or break legacy behavior. | Require product owner plus import/route/runtime proof. | Unknown | No; human review |
| GAP-07 | Auth delivery and throttling | Production email delivery and approved user/email/IP throttling are incomplete. | WPH-035..037; blockers B-09/B-10 | Verification and recovery cannot be claimed production-ready. | Keep implementation claim conditional and require security E2E. | Critical | No; security stage |
| GAP-08 | Regression automation | No maintained behavioral test command or test/spec suite exists. | Test-gap report; blocker B-01 | Risky cleanup cannot prove behavior preservation. | Establish target-specific route, role, shell, API, and auth tests first. | High | No; block cleanup |
| GAP-09 | Compatibility telemetry | Production usage of aliases, mounts, adapters, and facade exports is unknown. | Blocker B-12 | Safe deprecation windows cannot be selected. | Add or inspect telemetry before retirement decisions. | High | No; keep proposed |
| GAP-10 | Production data behavior | Model ownership is mapped, but production indexes, query plans, and deployed consumers are not proven. | Model usage map; risk acceptance RA-13 | Data refactor decisions remain speculative. | Require production-like query evidence, migration plan, and backup/rollback. | High | No; data stage |

No contradiction invalidates the ScaleOps parent boundary, ProofArena in-product boundary, existing repository ownership, or the prohibition on duplicate architecture. The unresolved gaps require ADR-0001 to remain Proposed or to be accepted only after explicit human conditions are recorded.
