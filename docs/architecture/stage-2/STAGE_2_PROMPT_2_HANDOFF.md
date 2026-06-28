# Stage 2 Prompt 2 Handoff

Generated: 2026-06-28

## Prompt 2 Must Verify

1. Whether root README, package, runtime API, and deployment naming should be ScaleOps-first or remain product-first branding.
2. Whether `@proofarena/*` should be restricted so external consumers use only `@proofarena` public exports.
3. Whether the boundary checker already rejects private imports in all intended cases.
4. Whether external Vercel project names, production domains, and linked repositories preserve the ScaleOps parent boundary, if owner-approved evidence is available.
5. Whether generic `mern-client` / `mern-server` package names are intentional and governed.
6. Whether ADR-0001 acceptance or explicit owner deferral has been recorded.

## Boundary Risks Requiring Deeper Inspection

- `BR-07`: inconsistent or ambiguous naming.
- `BR-09`: Proposed ADR may be ignored without formal owner disposition.
- `BR-10`: Stage 2 production work remains blocked by human approval.
- `BR-11`: private ProofArena alias access.
- `BR-12`: external deployment/repository/domain topology unknown.

## Mandatory Read Set

- `STAGE_2_MASTER_TRACKER.md`
- `STAGE_2_1_PARENT_PRODUCT_BOUNDARY_AUDIT.md`
- `STAGE_2_1_REPOSITORY_BOUNDARY_VERIFICATION.md`
- `STAGE_2_1_SCALEOPS_PARENT_SAAS_RULES.md`
- `STAGE_2_1_BOUNDARY_RISK_REGISTER.md`
- `STAGE_2_1_PREFLIGHT_CHECKLIST.md`
- `stage-2-1-parent-boundary-manifest.json`
- `../STAGE_1_FINAL_HANDOFF_PACKAGE.md`
- `../STAGE_2_START_CONDITIONS.md`
- `../adr/ADR-0001-adoption-package.md`
- `../adr/ADR-0001-final-codex-governance-rulebook.md`

## Prompt 2 Must Not Change

- Frontend/backend source, routes, layouts, dashboards, navigation, API clients, auth, models, middleware, config, packages, aliases, env, build, deployment, or lockfiles.
- ADR-0001 status without explicit human approval evidence.
- Existing module or repository structure.

## Execution Mode

Prompt 2 should remain **documentation-only** unless a newer explicit instruction authorizes a narrowly scoped production change after the human boundary gate and all preflight checks pass.

## Exact Warning

Do not create a separate ProofArena app or duplicate systems.
