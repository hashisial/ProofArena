# Stage 4 Prompt 1 Handoff

## Objective

Stage 4 Prompt 1 starts the Route Governance System. It must perform a documentation-only audit of current route authority before any centralization or behavior change.

## Required Work

- Inventory route declaration files, route constants, route metadata, hardcoded paths, navigation consumers, public/dashboard/admin/provider/client routes, protected and role guards, redirects, and 404/fallback behavior.
- Identify current source-of-truth candidates and overlaps without deleting or merging anything.
- Map route consumers and ownership to Stage 3 modules/platform.
- Record stale, duplicate, broken, ambiguous, and unknown paths.
- Create route-governance risks, stop conditions, and the next handoff.

## Stage 3 Documents to Read First

- `STAGE_3_FINAL_COMPLETION_DECISION.md`
- `STAGE_3_FINAL_HANDOFF_PACKAGE.md`
- `STAGE_3_FINAL_SOURCE_OF_TRUTH_DOC_INDEX.md`
- Stage 3.1 final module/platform/interdependency locks.
- Stage 3.2 final internal and API-adapter locks.
- Stage 3.3 final dependency and API-helper/service locks.
- `STAGE_4_MANDATORY_PREFLIGHT_CHECKLIST.md`
- `STAGE_4_START_CONDITIONS.md`
- `stage-3-final-completion-manifest.json`

## Stage 2 Documents to Read First

- Final handoff and source-of-truth index.
- Separate-app prevention lock.
- Navigation/route governance lock.
- Dashboard/sidebar/layout prevention lock.
- API/auth/role prevention lock.

## Stage 1 and ADR Documents to Read First

- Stage 1 final handoff, source-of-truth index, control board, remaining risk register, and manifest.
- ADR-0001 boundary, adoption package, governance rulebook, index, and manifest.

## Prohibited Changes

- Do not edit production routes, constants, metadata, navigation links, redirects, guards, layouts, dashboard shells, or 404 behavior.
- Do not create duplicate protected-route wrappers, admin route guards, role guards, redirects, fallback routes, or 404 definitions.
- Do not move, rename, delete, or consolidate files.
- Do not create a second router, route tree, route constants catalog, navigation stack, dashboard shell, API client, auth/role system, app, package, config, or deployment boundary.
- Do not mix route governance with module/shared migration.
- Do not install dependencies or change package/config/env/build/deployment files.

## Mode

Stage 4 Prompt 1 must remain documentation-only. Production route work requires later explicit approval, verified source-of-truth, dependency analysis, and risk-appropriate tests.

## Required Final Response Format

1. Files created.
2. Files updated.
3. Route declarations found.
4. Route constants and metadata found.
5. Navigation/guard/redirect/fallback findings.
6. Source-of-truth candidate.
7. Duplicate/stale/hardcoded risks.
8. Human-review items.
9. Unknowns/blockers.
10. Recommended next focus.
11. Exact no-production-code confirmation.

Centralize route constants only after auditing existing route declarations, navigation links, protected routes, admin routes, role-specific routes, redirects, and 404 behavior. Do not create duplicate route constants or duplicate route trees.
