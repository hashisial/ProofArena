# Stage 1.2 to Stage 1.3 Handoff Brief

Generated: 2026-06-27

## Stage 1.3 Must Decide

- ScaleOps parent / ProofArena flagship-module boundary.
- One-repository and no-duplicate-architecture rule.
- Browser route governance: AppRoutes declaration, grouped routes.js constants, metadata role.
- Compatibility policy for client and admin-proof aliases.
- Role-specific layout ownership and limits of future shared primitives.
- apiClient transport, apiEndpoints registry, feature-service ownership, api.js compatibility policy.
- API version direction for `/api` and `/api/v1`.
- Auth/role security boundary and critical-file preflight.
- Placeholder/fallback governance and safe-delete policy.
- Human approval gates and regression-test prerequisites.

## Stage 1.3 Must Not Change

No source, route, layout, auth, API, model, config, package, environment, or dependency behavior. It must write one ADR, not a second architecture or a cleanup implementation.

## Mandatory Reading

1. Stage 1.1 source summary, invariants, do-not-duplicate registry, critical-file list, forbidden actions, preflight checklist.
2. Stage 1.2 final findings, lock table, backlog, blockers, risk acceptance, validation commands, human review pack.
3. Both Stage 1.1 manifests and the Stage 1.2 final closure manifest.

## Risks the ADR Must Address

- Six repeated protected-layout clusters without merging role policy.
- Seventeen route/path overlaps, including client/admin-proof compatibility.
- Eight API/request overlaps and the 29-importer legacy facade.
- Dual API mounts/version ambiguity.
- Business-looking fallback records.
- Auth delivery/throttling gaps.
- Six unknown page owners.
- Missing regression tests and compatibility telemetry.

## Recommended ADR Outcome

Record the high-confidence ownership locks as architecture direction. Keep client/admin/API-version/deletion decisions conditional or human-review-required. Do not authorize cleanup execution.

## Final Warning

ProofArena must remain inside ScaleOps. No separate app, repository, router, dashboard shell, API client, auth system, or navigation stack may be created without a future superseding ADR.

