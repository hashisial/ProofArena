# Stage 3 Prompt 12 Route Governance Readiness Brief

## Stage 4 Objective

Stage 4 must establish a single evidence-backed route-governance model for centralized route constants, protected dashboard/admin/role-specific routes, redirects, fallbacks, and 404 prevention without creating parallel architecture.

## Audit First

Stage 4 Prompt 1 must inventory and cross-reference:

- route constants and hardcoded paths;
- route declaration files and nested route groups;
- public, mobile, footer, dashboard, admin, provider, and client navigation links;
- dashboard, admin, provider, client, and ProofArena module routes;
- protected-route wrappers, auth guards, role guards, and admin guards;
- redirects, fallback routes, catch-all routes, and 404 behavior;
- auth/role dependencies and API-driven route assumptions.

## Protected Systems

| System | Required protection |
|---|---|
| Route constants | Locate authority; create no second constants system |
| Route declarations | Preserve current behavior during audit |
| Navigation links | Treat as consumers, not a new source-of-truth |
| Dashboard routes | Reuse the ScaleOps dashboard shell |
| Admin routes | Reuse platform admin auth/role governance |
| Role-specific routes | Preserve current permissions and guard ownership |
| Protected routes | Do not duplicate wrappers or guards |
| Redirect rules | Audit before changing or consolidating |
| 404 behavior | Map all fallbacks/catch-alls before editing |
| Auth/role dependencies | Reuse platform auth and role systems |

## Governance Dependencies

- Stage 3: module code cannot own platform routing; adapters/shared helpers cannot become platform replacements; shared code cannot import modules.
- Stage 2: no separate ProofArena route tree, navigation stack, dashboard/sidebar/layout, API client, or auth/role system.
- Stage 1 and ADR-0001: ScaleOps remains the parent SaaS and ProofArena remains an integrated flagship module.

## Required First Action

Create a documentation-only route source-of-truth audit that identifies every declaration, constant, consumer, guard, redirect, fallback, and 404 path before proposing implementation.

## Forbidden Actions

- Do not create or centralize route constants.
- Do not edit route declarations, navigation, guards, redirects, fallbacks, or 404 behavior.
- Do not create a ProofArena router, shell, navigation, API client, auth system, or deployment boundary.
- Do not move files, rewrite imports, or begin a route refactor.

## Stop Conditions

Stop on ambiguous route authority, duplicate path ownership, conflicting guard behavior, untested redirect/404 behavior, missing required docs, a duplicate-platform proposal, or any request for implementation before the audit is accepted.

Centralize route constants only after auditing existing route declarations, route constants, navigation links, protected routes, admin routes, role-specific routes, redirects, and 404 behavior. Do not create duplicate route constants, duplicate route trees, duplicate navigation, duplicate dashboard shells, duplicate auth/role guards, or separate ProofArena routing.

