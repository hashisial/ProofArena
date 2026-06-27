# ADR-0001 Evidence Map

Generated: 2026-06-27

| Decision | Statement | Supporting docs | File evidence | Stage 1.1/1.2 findings | Confidence | Missing evidence | Risk if wrong |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-01 | ScaleOps parent; ProofArena flagship module | Source summary, invariants, guardrail manifest | One client/server repository tree | INV product boundary; final handoff | High | Human confirmation | Product fragmentation |
| D-02 | Existing repository is source | Repo inventory/evidence index | client/, server/, shared docs/config | No cross-repo architecture found | High | External organizational context | Duplicate repository/deployment |
| D-03 | Existing router/constants govern routes | Route inventory/dependency/source analysis/lock table | AppRoutes.jsx, constants/routes.js, routeMetadata.js | RTE-001..020 | High for current owners; medium aliases | Client/admin canonical choices, telemetry | Broken navigation/redirects |
| D-04 | Preserve role layouts/SidebarCore | Layout audit/ownership/lock table | Public/Auth/Dashboard/Client/Admin layouts, SidebarCore | LAY-001..010 | High current ownership; medium shared primitive | Browser/role tests | Role leakage/shell regression |
| D-05 | One HTTP transport and staged services | API inventory/source analysis/lock | apiClient.js, apiEndpoints.js, api.js, feature services | API-001..010, RTE-014/018 | High transport; low version | Method map, canonical version | Session/API outage |
| D-06 | Preserve auth/role boundaries | Critical list/backend flow/access docs | AuthProvider/store/guards; backend middleware/services | Auth boundary risks; WPH-035..037 | High principle; medium implementation | Email/throttle/auth-generation decisions | Security regression |
| D-07 | Feature module ownership | Frontend ownership/reusable/boundary reports | client/src/features, server modules/services | Ownership maps | Medium-high | Some legacy pages/domains | Scattered business logic |
| D-08 | Shared code only when cross-cutting | Dependency/reusable/do-not-duplicate docs | shared UI/utils/sidebar/state systems | LAY-009, API-007, utility overlaps | High principle | Equivalence tests per extraction | Over-abstraction/circular imports |
| D-09 | Classify placeholders; no fake truth | Placeholder reports/classification/risk table | RouteShells, constants fallbacks, ReviewsSection, auth TODOs | WPH-001..060 | High | Product/legal/security approvals | Misleading users/security claims |
| D-10 | Preflight/tests/rollback/safe delete | Preflight, critical list, cleanup sequence, safe-delete policy | Package scripts and absent tests | 12 blockers, 100 candidate ledger | High | Human enforcement and future tests | Unsafe cleanup |

All evidence is repository-local. Runtime/production telemetry and human product decisions remain outside static proof.

