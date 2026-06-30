# Stage 3 Prompt 9 Handoff

## Prompt 9 Objective

Prompt 9 must finalize Stage 3.3 shared-code governance, lock final approval statuses, accept/defer risks, consolidate human decisions, and determine whether Stage 3.3 can close. It must remain documentation-only.

## Current Library Status

| Group | Current status | Prompt 9 action |
|---|---|---|
| Architecture governance docs | approved docs-only | Lock as platform documentation authority |
| Product-agnostic shared UI subset | approved with caution | Lock allowed/forbidden scope and route-aware exceptions |
| Shared form and generic state subsets | approved with caution | Lock as UI subsets, not separate libraries |
| Neutral service/API response helpers | approved with caution | Lock no-transport/no-domain contract |
| Generic hooks | candidate only | Keep unapproved; zero real consumers |
| Formatters/date/currency helpers | candidate only | Keep file-level candidates pending tests/owner |
| Accessibility helpers | candidate only | Keep unapproved; no concrete library evidence |
| Shared validation/types/test helpers | blocked | Retain production block |
| Design tokens as shared library | blocked; platform-owned | Retain ScaleOps design authority |
| Mixed client/server roots | suspicious or unknown | Freeze new shared additions and retain human review |

## Suspicious Folders and Violations to Carry Forward

- `client/src/components/common/`.
- Root `client/src/hooks/`, `utils/`, `types/`, and broad `services/api.js`.
- Three route-aware components inside `components/ui`.
- Mixed `server/src/utils`, `constants`, and `services` roots.
- Reverse feature imports in `useAuth.js`, `useMyDashboard.js`, `useMyProfile.js`, and `services/api.js`.
- Server boundary warnings for direct model imports in `adminController.js`.
- No duplicate client, cross-runtime import, or checker-detected cycle was found.

## README Scaffold Result

- Created: `client/src/components/ui/README.md`.
- Created: `client/src/services/shared/README.md`.
- Blocked: every new shared folder and every README that would imply approval of a candidate, mixed, platform-owned, or unknown library.
- Both created files are documentation-only and live in existing evidenced folders.

## Documents Prompt 9 Must Read

- All Prompt 7 governance docs and the Prompt 7 manifest.
- `STAGE_3_3_PROMPT_7_FINDINGS_VERIFICATION.md`.
- `STAGE_3_3_SHARED_LIBRARY_CANDIDATE_CORRECTION_REPORT.md`.
- `STAGE_3_3_SHARED_FOLDER_OWNERSHIP_CLASSIFICATION.md`.
- `STAGE_3_3_SHARED_CODE_CONSUMER_EVIDENCE_MAP.md`.
- `STAGE_3_3_SHARED_CODE_DEPENDENCY_VIOLATION_AUDIT.md`.
- `STAGE_3_3_SHARED_UI_VERIFICATION.md`.
- `STAGE_3_3_SHARED_HOOK_UTILITY_TYPE_VERIFICATION.md`.
- `STAGE_3_3_SHARED_API_HELPER_SERVICE_VERIFICATION.md`.
- `STAGE_3_3_SHARED_LIBRARY_README_SCAFFOLD_DECISION.md`.
- `STAGE_3_3_SHARED_LIBRARY_README_SCAFFOLD_AUDIT.md`.
- `STAGE_3_3_SHARED_CODE_APPROVAL_STATUS_REGISTER.md`.
- `STAGE_3_3_SHARED_CODE_ACCEPTANCE_CRITERIA.md`.
- Stage 3.1/3.2 final ownership locks, Stage 2 duplicate-prevention locks, and ADR-0001.

## Prompt 9 Must Not Change

- Do not move, rename, refactor, delete, or create runtime files.
- Do not update imports or create barrel exports.
- Do not create shared folders, utilities, components, hooks, services, types, validation, constants, adapters, mocks, or tests.
- Do not change routes, navigation, dashboard/layout, API/auth, backend, config/env, package, build, deployment, or database behavior.
- Do not approve candidate-only or blocked libraries without new repository evidence and human approval.

## Closeout Recommendation

Stage 3.3 can close with caution after Prompt 9 if it locks the current statuses, preserves all production blocks, records the missing Stage 3.1 document, and does not claim that mixed roots are approved shared libraries.

Shared libraries must not become dumping grounds for module-specific business logic, and shared API helpers must not become duplicate API clients.

