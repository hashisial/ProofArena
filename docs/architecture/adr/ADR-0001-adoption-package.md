# ADR-0001 Adoption Package

Generated: 2026-06-27

## Controls

ADR-0001 controls product/repository boundaries, route governance, role layout/dashboard ownership, browser HTTP ownership, auth/role boundaries, module/shared ownership, placeholder truthfulness, critical-file preflight, and safe deletion.

It does not choose final client/admin aliases, API version, facade retirement date, database migrations, product feature behavior, email provider, or permission matrix. Those require later decisions/implementation.

## Mandatory Adoption Rules

- ProofArena remains inside ScaleOps and the existing repository.
- Reuse AppRoutes/routes.js/role layouts/SidebarCore/apiClient/apiEndpoints/feature services/auth boundaries.
- No parallel router, shell, HTTP client, auth, navigation, or fake production system.
- Read official Stage 1 docs before risky edits.
- Identify candidate/control IDs; establish tests; isolate; validate; provide rollback.
- Unknown or failed preflight blocks action.
- Deletion follows the separate safe-delete policy.

## Protected Systems

| System | Protected source |
| --- | --- |
| Product/repository | Stage 1.1 invariants and ADR |
| Routes | AppRoutes, grouped routes.js exports, route metadata/guards |
| Layout/dashboard | Public/Auth/Dashboard/Client/Admin layouts; SidebarCore/useSidebarShell |
| API | apiClient, apiEndpoints, feature services; api.js compatibility |
| Auth/roles | Auth provider/store/hooks/guards and backend middleware/services |
| Modules/shared | Ownership/reusable/dependency maps |
| Placeholders | Final classification/risk acceptance |
| Critical/delete | Critical-file list and safe-delete policy |

## Compliance Process

1. Read official doc map and candidate/control records.
2. Inspect target and dependents.
3. Run ADR enforcement checklist.
4. Record allowed/forbidden scope and rollback.
5. Add/execute target tests and available commands.
6. Perform QA matrix.
7. Report deviations and stop on violation.

Non-compliance is reported with affected files, violated rule, behavior risk, immediate stop action, rollback, and human escalation. An ADR change requires evidence, alternatives, consequences, migration, owner approval, and a formal superseding/amending ADR; silent override is prohibited.

Violations include separate ProofArena architecture, duplicate systems, auth bypass, fake production state, unapproved critical/config changes, unsafe deletion, and false production-scope claims.

