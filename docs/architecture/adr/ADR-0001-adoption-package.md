# ADR-0001 Adoption Package

Generated: 2026-06-27
Revalidated: 2026-06-28

## 1. What ADR-0001 Controls

Product/repository boundaries, route governance, role layout/dashboard ownership, browser HTTP ownership, auth/role boundaries, module/shared ownership, placeholder truthfulness, critical-file preflight, safe deletion, future-prompt checks, and violation response.

## 2. What ADR-0001 Does Not Control

It does not choose final client/admin aliases, API version, facade retirement date, database migration, product feature behavior, email provider, permission matrix, or exact shared-shell extraction. It does not authorize cleanup, deletion, deprecation, or production implementation.

## 3. Mandatory Rules

- ProofArena remains inside ScaleOps and the existing repository.
- Reuse current AppRoutes/routes.js, role layouts, SidebarCore, apiClient, apiEndpoints, feature services, and auth boundaries.
- Do not create parallel router, shell, HTTP client, auth, navigation, or fake production systems.
- Identify candidate/control IDs, establish tests, isolate changes, validate behavior, and record rollback.
- Unknown evidence or failed preflight blocks action.
- Deletion uses the separate safe-delete process and required approval.
- Audit-only prompts change documentation only and prove scope with Git evidence.

## 4. Mandatory Documents Before Risky Edits

1. `STAGE_1_1_SOURCE_OF_TRUTH_SUMMARY.md`
2. `STAGE_1_1_ARCHITECTURE_INVARIANTS.md`
3. `STAGE_1_1_DO_NOT_DUPLICATE_REGISTRY.md`
4. `STAGE_1_1_CRITICAL_FILE_PROTECTION_LIST.md`
5. `STAGE_1_1_FUTURE_PROMPT_PREFLIGHT_CHECKLIST.md`
6. `STAGE_1_2_FINAL_FINDINGS_CONSOLIDATED.md`
7. `STAGE_1_2_FINAL_SOURCE_OF_TRUTH_LOCK_TABLE.md`
8. `STAGE_1_2_FINAL_BLOCKER_REGISTER.md`
9. `ADR-0001-scaleops-proofarena-architecture-boundary.md`
10. `ADR-0001-final-codex-governance-rulebook.md`
11. The domain-specific inventory, flow, ownership, QA, and risk documents listed in the official source map.

## 5. Protected Systems

| System | Protected source or control | Adoption requirement |
| --- | --- | --- |
| Product boundary | Stage 1.1 invariants and ADR D-01 | One ScaleOps platform; ProofArena remains inside it. |
| Repository boundary | Repository inventory and ADR D-02 | Current repository remains the starting source. |
| Routes | AppRoutes, grouped routes.js, metadata/guards | Preserve behavior and aliases until policy/tests/telemetry exist. |
| Layouts | Public/Auth/provider/client/admin layouts | Preserve role wrappers and layout semantics. |
| Dashboard shell | SidebarCore/useSidebarShell and role wrappers | Do not duplicate or merge role policy. |
| API clients | apiClient, apiEndpoints, feature services, api.js compatibility | One browser transport; map contracts before migration. |
| Auth/role | Frontend provider/store/guards and backend middleware/services | Backend authorization stays authoritative. |
| Module ownership | Ownership and boundary maps | Use mapped owner; document legacy exceptions. |
| Shared code | Reusable/dependency maps | Share only stable equivalent contracts. |
| Placeholder/mock | Final WPH classification and risk acceptance | Keep honest states; no fake production truth. |
| Critical files | Critical File Protection List | Run category-specific prechecks before editing. |
| Safe deletion | Safe Delete Candidate Policy | Separate prompt, complete proof, rollback, and approval. |

## 6. Compliance Check Before Editing

1. Read the official source map and required domain docs.
2. Identify the governing decision, rule, control, candidate, blocker, and risk IDs.
3. Inspect the target and every known dependent.
4. Run the ADR enforcement checklist.
5. Record allowed and forbidden scope, tests, QA, rollback, and stop conditions.
6. Execute available commands and target behavioral checks only after approval.
7. Reconcile final Git diff and report production scope honestly.

## 7. Reporting Non-Compliance

Record the violated rule, affected files/systems/users, detection evidence, current behavior risk, immediate stop action, rollback status, commands/QA, whether production behavior changed, and required human escalation. Follow `ADR-0001-violation-response-plan.md`.

## 8. Requesting An ADR Change

Submit evidence, the conflicting rule, alternatives considered, consequences, migration and compatibility plan, validation, rollback, owner approval, and proposed supersession/amendment. A prompt may not silently override ADR-0001 or create a second architecture before the change is accepted.

## 9. ADR-0001 Violations

Violations include a separate ProofArena system, duplicate routes/layouts/dashboard/API/auth/navigation, UI-only security, fake production state, unapproved critical/config/package/env changes, unsafe deletion, frontend/backend boundary violations, erased audit history, and false production-scope claims.
