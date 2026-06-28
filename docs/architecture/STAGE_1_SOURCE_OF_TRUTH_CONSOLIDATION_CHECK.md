# Stage 1 Source-of-Truth Consolidation Check

Generated: 2026-06-27
Revalidated: 2026-06-28

| System | Current source-of-truth document or file | Supporting docs | Conflicting docs | Confidence | Human review | Recommended final authority | Correction before Stage 2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Product boundary | Stage 1.1 invariants and ADR D-01 | Source summary; final human brief | None; approval absent | High | Yes | ADR-0001 after ratification; invariants until then | Record approval or explicit deferral. |
| Repository boundary | Stage 1.1 source summary/manifest and ADR D-02 | Repo inventory; evidence map | None | High | Yes for any split | Current repository and official source map | Confirm boundary in Stage 2 preflight. |
| Route declarations | `client/src/routes/AppRoutes.jsx` | Route inventory/dependency map | No competing executable tree | High | No for ownership | AppRoutes for behavior | None; preserve guards and aliases. |
| Route constants | `client/src/constants/routes.js` grouped exports | Route analysis; lock table | Hardcoded callers/aliases are overlap, not authority | High | Yes for canonical aliases | routes.js for browser paths | Label aliases conditional. |
| Public navigation | Existing public navigation config and Header/mobile/footer consumers | Navigation maps; route QA | Legacy adapters only | Medium | No for current use | Existing config/components | Verify active/disabled/mobile behavior before edits. |
| Dashboard shell | Role layouts plus SidebarCore/useSidebarShell | Layout ownership/blast report | Repeated primitives are candidates, not replacement authority | High | Yes for consolidation | Existing role wrappers and SidebarCore | No new shell; tests before extraction. |
| Layouts | Public/Auth/Dashboard/Client/Admin current owners | Layout lock; route map | RootLayout/Layout ownership unknown | High current; low legacy | Yes for legacy disposition | Current AppRoutes-owned layouts | Keep legacy candidates until runtime proof. |
| API clients | `client/src/services/apiClient.js` browser transport | API audit; apiEndpoints; feature services | api.js is compatibility facade; socket/server fetch are distinct | High transport | Yes for version/facade | apiClient plus domain services | Preserve facade/version compatibility. |
| Auth provider/guards | Existing AuthProvider/store/hooks/route guards | Auth flow; critical list | Multiple surfaces/generations require coordination | High frontend ownership | Yes for changes | Existing frontend auth owners | Backend remains authoritative. |
| Role middleware/guards | Existing backend auth/role middleware | Backend flow; risk register | No valid UI-only alternative | Medium-high | Yes | Existing backend middleware/services | Security tests before consolidation. |
| Backend routes/controllers/services/models | Stage 1.1 API/backend/model maps and current code owners | Traceability/usage maps | API version mounts and production data behavior unresolved | High ownership; medium runtime | Yes for persistent/version changes | Current mapped layers | Require contract/migration/query evidence. |
| Shared UI | Existing shared UI/state/navigation primitives | Reusable map; dependency graph | Similar feature components may not be equivalent | Medium | No for reuse; yes for broad move | Current shared locations | Equivalence and accessibility checks. |
| Shared utilities | Existing shared utility/config/helper locations | Reusable map; boundary report | Domain utilities remain feature-owned | Medium | No for reuse | Current mapped owners | No broad relocation without importer proof. |
| Placeholder/mock systems | Stage 1.2 final WPH classification | Placeholder report; risk acceptance | Stage 1.1 count is earlier baseline only | High | Yes for product/legal/security replacements | Final findings and risk acceptance table | Use 60-item final classification. |
| Safe-delete policy | `STAGE_1_2_SAFE_DELETE_CANDIDATE_POLICY.md` | Critical list; execution contracts | None | High | Yes for high risk | Safe-delete policy | No deletion in Stage 2 boundary work. |
| Critical-file protection | `STAGE_1_1_CRITICAL_FILE_PROTECTION_LIST.md` | Control board; rulebook | None | High | As listed | Critical-file list plus control board | Cite target category and prechecks. |
| Future prompt preflight | Stage 1.1 preflight plus ADR rulebook/adoption package | Enforcement checklist; control board | None | High | No | Official source map routes prompts to required docs | Prompt 14 locks authority; Prompt 15 locks handoff. |

No source-of-truth conflict requires a new architecture system. The unresolved items are approval, compatibility, legacy ownership, testing, and runtime evidence gaps.
