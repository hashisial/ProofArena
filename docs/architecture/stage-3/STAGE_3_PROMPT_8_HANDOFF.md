# Stage 3 Prompt 8 Handoff

## Objective

Prompt 8 must verify and harden Stage 3.3 shared-code governance against repository evidence. It must not perform migration or create runtime shared libraries.

## Required Verification

1. Verify all 28 findings in `STAGE_3_3_EXISTING_SHARED_CODE_AUDIT.md` at file and consumer level.
2. Confirm whether each candidate has two independent real consumers and product-agnostic semantics.
3. Recheck `client/src/components/ui/` item by item, especially page/navigation-flavored primitives.
4. Recheck `client/src/services/shared/` to ensure it remains transport-neutral and domain-neutral.
5. Inspect `client/src/components/common/`, root hooks, root utilities, root types/constants, and server utility/service roots as suspicious mixed locations.
6. Verify reverse dependencies in `useAuth.js`, `useMyDashboard.js`, `useMyProfile.js`, and `client/src/services/api.js`.
7. Reconfirm `client/src/services/apiClient.js` remains the sole client-side HTTP client instance.
8. Validate dependency direction and identify cycles or private cross-module imports.
9. Resolve or explicitly defer ownership and test-strategy unknowns.

## Candidate Disposition to Recheck

| Candidate | Current Prompt 7 status | Prompt 8 requirement |
|---|---|---|
| Existing shared UI primitives | approved with caution | Verify each item's semantics, consumers, accessibility, and imports |
| Existing neutral service helpers | approved with caution | Verify no transport, auth, global error, or domain normalization ownership |
| Generic hooks | candidate only | Prove two-module use, no feature imports, and tests |
| Formatting utilities | candidate only | Prove purity, locale behavior, consumers, and owner |
| Form/state primitives | candidate only | Verify accessibility and absence of domain workflow behavior |
| Accessibility helpers | candidate only | Identify concrete repeated behavior before proposing a library |
| Validation/type libraries | blocked | Resolve security/domain/contract authority before reconsidering |
| Design tokens as shared | blocked | Keep ScaleOps platform-owned |
| Test helpers | blocked | Establish actual test framework and consumers first |

## Documents Prompt 8 Must Read

- `STAGE_3_3_MASTER_TRACKER.md`
- `STAGE_3_3_EXISTING_SHARED_CODE_AUDIT.md`
- `STAGE_3_3_APPROVED_SHARED_LIBRARY_CANDIDATE_MAP.md`
- `STAGE_3_3_SHARED_MODULE_PLATFORM_DECISION_MATRIX.md`
- `STAGE_3_3_SHARED_CODE_PROMOTION_CRITERIA.md`
- `STAGE_3_3_SHARED_CODE_ANTI_PATTERN_REGISTER.md`
- `STAGE_3_3_SHARED_LIBRARY_APPROVAL_RULEBOOK.md`
- `STAGE_3_3_SHARED_CODE_DEPENDENCY_DIRECTION_MAP.md`
- `STAGE_3_3_SHARED_CODE_RISK_REGISTER.md`
- `stage-3-3-shared-code-governance-manifest.json`
- Stage 3.1 final ownership/platform/interdependency locks.
- Stage 3.2 final component/hook/service/type/API-adapter locks.
- Stage 2 duplicate-prevention and API/auth/role locks.
- ADR-0001.

## Prohibited Changes

- Do not move, rename, refactor, or delete production files.
- Do not update imports or create barrel exports.
- Do not create shared components, hooks, utilities, services, adapters, types, validation, constants, mocks, or tests.
- Do not create or duplicate API clients, auth/role systems, route/navigation systems, dashboard/layout shells, config/env readers, database boundaries, response/error systems, or deployment systems.
- Do not convert module-specific ProofArena logic into generic ScaleOps shared code.

## README Scaffold Decision

Prompt 8 should not create documentation-only shared-library README scaffolds by default. A README may be considered only for an already-existing runtime folder after file-level verification proves its owner, scope, consumers, and allowed/forbidden contents. Creating a new folder remains blocked.

## Expected Prompt 8 Output

- Finding verification report.
- Corrected shared ownership map.
- File-level candidate decisions.
- Reverse-dependency and consumer verification.
- Shared-library approval/denial decisions.
- Updated risk and acceptance status.
- Prompt 9 or Stage 3.3 closeout recommendation.
- Exact no-production-code confirmation.

Shared libraries must not become dumping grounds for module-specific business logic.

