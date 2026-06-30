# Stage 4 Start Conditions

## Required Status and Authority

- Required Stage 3 status: `COMPLETE WITH CAUTION`.
- Required ADR status: ADR-0001 remains accepted and unsuperseded.
- Required docs: final Stage 3 decision, handoff, source index, Stage 3.1 module/platform locks, Stage 3.2 API lock, Stage 3.3 dependency/API locks, Stage 2 route/navigation/dashboard/API/auth locks, preflight checklist.
- Required approvals: none for documentation-only audit; human approval required before production route changes or ambiguous authority decisions.
- Required risk status: no active separate-app, duplicate-router, duplicate-navigation, duplicate-shell, duplicate-client, or duplicate-auth proposal.
- Required source-of-truth clarity: current route declarations/constants/metadata/nav/guards must be inventoried before centralization.
- Required production proof: Prompt 9 changed no runtime code; Prompt 8 added only two documentation READMEs.
- Required preflight: all 21 checks recorded as pass before Stage 4 work.

## Blocking Conditions

- Stage 3 final docs or required Stage 2/ADR locks are absent.
- A separate ProofArena app, router, route tree, navigation stack, shell, API client, or auth system is proposed.
- A duplicate protected-route wrapper, admin guard, role guard, redirect rule, fallback, or 404 definition is proposed.
- Route authority is assumed rather than evidenced.
- Production edits are attempted in the first Stage 4 prompt.
- Guard, redirect, 404, navigation, or route behavior changes are mixed with the audit.
- Missing human approval is required for an ambiguous/sensitive production decision.

## Start-With-Caution Conditions

- The first prompt is documentation-only.
- Existing route behavior remains unchanged.
- Hardcoded, duplicate, stale, legacy, and unknown paths are recorded, not removed.
- Module/shared migrations remain out of scope.
- Missing `STAGE_3_1_FINAL_ACCEPTANCE_REVIEW.md` remains explicit and does not become invented evidence.

## First Prompt Recommendation

Inventory and verify route declarations, constants, metadata, hardcoded links, public/dashboard/admin/role routes, protected wrappers, redirects, 404/fallbacks, and navigation consumers. Produce a source-of-truth candidate and risk register; make no production edits.

## Recommendation

**START WITH CAUTION, documentation-first.**
