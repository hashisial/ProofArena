# ADR-0001: ScaleOps / ProofArena Architecture Boundary and Refactor Governance

## Status

Proposed

## Date

2026-06-27

## Roadmap Stage

Stage 1.3 - Architecture Decision Record for ScaleOps plus ProofArena

## Context

ScaleOps is the parent SaaS ecosystem and ProofArena is its flagship module/product area inside the same repository. Stage 1.1 mapped one Vite/React client and one Express/Mongoose server. Stage 1.2 verified 100 duplicate/placeholder findings, locked current ownership candidates, and found twelve blockers that prevent cleanup execution. Future stages will extend routes, modules, authentication, dashboards, APIs, marketplace workflows, and shared UI. Without an explicit boundary, those stages could create parallel systems.

## Problem

The current architecture carries controlled overlap: compatibility route aliases, repeated protected-shell primitives, a 29-importer legacy API facade, dual API mounts, multiple auth generations, business-looking fallback data, and unknown legacy page ownership. Immediate rewriting would be unsafe; ignoring the overlap would compound it. Governance must prevent a separate ProofArena app, duplicate route/navigation/layout/API/auth systems, unsafe deletion, UI-only authorization, and frontend/backend contract drift.

## Decision

| ID | Category | Decision |
| --- | --- | --- |
| D-01 | Product boundary | ScaleOps remains the parent SaaS ecosystem. ProofArena remains its flagship module inside ScaleOps. |
| D-02 | Repository boundary | The existing repository remains the source of truth. No separate ProofArena app or repository may be created unless a future ADR supersedes this one. |
| D-03 | Routing | Use the existing router. AppRoutes declares behavior; grouped routes.js exports are the browser-path candidate; routeMetadata remains descriptive. Do not create a parallel route tree or constants registry. Compatibility aliases require a later decision. |
| D-04 | Layout/dashboard | Preserve Public/Auth/Dashboard/Client/Admin role layouts and SidebarCore. Future consolidation may extract tested non-policy primitives but must not merge role/access policy or create a second shell. |
| D-05 | API client | apiClient.js remains the browser HTTP transport candidate, apiEndpoints the path registry, and feature services the domain request direction. api.js remains a compatibility facade until method-level migration evidence exists. No second HTTP client. |
| D-06 | Auth/role | Existing frontend providers/stores/guards and backend middleware remain authoritative in their layers. Frontend visibility does not replace backend authorization. No random UI-only role security. |
| D-07 | Module ownership | Future code is owned by auth, profile, offers, challenges, plans, proof, matching, messages, payments, admin, public marketing, dashboard shell, shared UI, or shared utilities. Feature logic stays feature-owned unless demonstrably cross-cutting. |
| D-08 | Shared code | Shared locations hold stable cross-module contracts only. Compatibility exports remain until callers are migrated and validated. |
| D-09 | Placeholders | Disclosed previews/planned states may remain temporarily. Business-looking fallback records and fake auth/payment/verification/admin state are not production truth. Replace only with real contracts and honest empty/error states. |
| D-10 | Refactor governance | Every risky prompt reads Stage 1.1/1.2 sources, checks critical/protected files, identifies candidate IDs, establishes tests, isolates changes, validates, and records rollback. Deletion follows the safe-delete policy. |

## Accepted Rules

1. Do not create a separate ProofArena app, repository, router, dashboard shell, API client, auth system, or navigation stack.
2. Do not duplicate route constants; inspect routes.js, AppRoutes, metadata, and the route inventory first.
3. Do not duplicate API clients; reuse apiClient and existing feature services.
4. Do not duplicate dashboard shells or replace SidebarCore.
5. Do not bypass frontend guards or backend authorization middleware.
6. Do not hardcode role security in arbitrary UI components.
7. Do not delete unused-looking files without the Safe Delete Candidate Policy.
8. Do not edit critical files without the Critical File Protection List and required checks.
9. Do not replace classified placeholders with invented production logic or data.
10. Do not merge browser routes and API-relative paths into one namespace.
11. Do not remove compatibility aliases/adapters/facades before caller/runtime/telemetry proof.
12. Do not change package/config/environment files without explicit stage approval.
13. Audit-only prompts modify documentation only.
14. Unknown evidence blocks destructive or architecture-changing action.

## Consequences

Positive: one product boundary, safer staged refactors, reusable ownership rules, lower route/auth/API breakage risk, and explicit human gates.

Tradeoffs: cleanup is slower; duplicates remain temporarily; documentation and testing overhead increase; several canonical choices require human approval.

## Affected Systems

| System | Evidence | Impact | Future stage | Risk |
| --- | --- | --- | --- | --- |
| Product/repository | Stage 1.1 summary/invariants | One ScaleOps platform with ProofArena inside it | 2/3 | Critical |
| Routes | AppRoutes, routes.js, route analysis | Preserve current tree; govern aliases | 4/22 | High |
| Layouts/dashboard | Layout ownership/lock table | Preserve role wrappers/SidebarCore | 3/36 | High |
| Navigation/sidebar | Navigation configs/SidebarCore | Reuse existing configs/engine | 22/36 | High |
| HTTP/API | apiClient, apiEndpoints, api.js, backend flow | One transport; staged facade/version work | 5 | Critical |
| Backend layers/models | Backend flow/model maps | Preserve route-controller-service-model contracts | 3/5 | Critical |
| Auth/roles | Auth files/guards/middleware maps | Backend remains security boundary | 23/26 | Critical |
| Shared UI/utils | Reusable/dependency maps | Share only stable cross-module logic | 7/8 | Medium |
| Placeholders | Final classifications | Honest planned/empty/error states | 8/features | High |
| Future modules | Ownership map | Add within current app and contracts | 3 onward | High |

## Alternatives Considered

| Alternative | Decision | Why | Reconsideration |
| --- | --- | --- | --- |
| Separate ProofArena app | Rejected | Duplicates product, routes, auth, API, shell, deployment | Only a future evidence-backed ADR |
| Immediate router/layout rewrite | Rejected | No tests; aliases and role policies unresolved | After route/role baseline and migration plan |
| Keep duplicates without governance | Rejected | Drift and duplicate future work continue | Never as default |
| Refactor everything immediately | Rejected | Excessive blast radius and weak rollback | Replace with staged candidate execution |
| Unified architecture with staged governance | Selected | Matches repository evidence and preserves working behavior | Review through future ADRs |

## Validation Requirements

Use `STAGE_1_2_VALIDATION_QA_MATRIX.md`, `STAGE_1_2_FINAL_VALIDATION_COMMAND_CHECKLIST.md`, and candidate-specific tests. Validate build/lint/boundaries, routes/redirects, auth/roles, desktop/mobile shells, apiClient base/auth/error/envelope behavior, honest placeholder states, and absence of new duplicate systems.

## Human Review Questions

1. Confirm the unified product/repository boundary.
2. Select the canonical client route and alias policy.
3. Select the canonical admin proof route.
4. Select `/api` versus `/api/v1` direction.
5. Approve api.js compatibility/deprecation policy.
6. Approve limits of protected-shell primitive extraction.
7. Decide RootLayout/Layout and six unmapped page ownership.
8. Approve fallback-data retirement UX.
9. Approve production email/throttling controls.
10. Approve the minimum regression baseline.

## Future Stage Impact

Stages 2/3 enforce product/module boundaries; 4 governs routes; 5 governs API contracts/versioning; 6 governs env/config; 7 shared UI/tokens; 8 states; 10 docs; 22 public navigation; 23 auth/security; 26 permissions; 36 provider dashboard.

## Source Documents

All mandatory Prompt 9 source documents were found and read.

| Source document | Status | Use in this ADR |
| --- | --- | --- |
| `docs/architecture/STAGE_1_1_SOURCE_OF_TRUTH_SUMMARY.md` | Found | Repository and product-boundary baseline |
| `docs/architecture/STAGE_1_1_FINAL_DOC_INDEX.md` | Found | Stage 1.1 authority and document routing |
| `docs/architecture/STAGE_1_1_ARCHITECTURE_INVARIANTS.md` | Found | Product, route, auth, API, data, and shared-code invariants |
| `docs/architecture/STAGE_1_1_DO_NOT_DUPLICATE_REGISTRY.md` | Found | Existing systems future work must reuse |
| `docs/architecture/STAGE_1_1_CRITICAL_FILE_PROTECTION_LIST.md` | Found | High-risk files and required pre-checks |
| `docs/architecture/STAGE_1_1_FORBIDDEN_ACTIONS_MANIFEST.md` | Found | Prohibited architecture and refactor actions |
| `docs/architecture/STAGE_1_1_FUTURE_PROMPT_PREFLIGHT_CHECKLIST.md` | Found | Mandatory future-prompt checks |
| `docs/architecture/STAGE_1_1_ADR_CANDIDATES.md` | Found | Decision candidates considered for Stage 1.3 |
| `docs/architecture/STAGE_1_1_FUTURE_STAGE_IMPACT_MAP.md` | Found | Roadmap impact and ownership expectations |
| `docs/architecture/stage-1-1-source-of-truth-manifest.json` | Found | Machine-readable inventory and evidence counts |
| `docs/architecture/stage-1-1-guardrail-manifest.json` | Found | Machine-readable architecture controls |
| `docs/architecture/STAGE_1_2_FINAL_FINDINGS_CONSOLIDATED.md` | Found | Final duplicate and placeholder classifications |
| `docs/architecture/STAGE_1_2_FINAL_SOURCE_OF_TRUTH_LOCK_TABLE.md` | Found | Current route, layout, API, and placeholder ownership locks |
| `docs/architecture/STAGE_1_2_FINAL_CLEANUP_EXECUTION_BACKLOG.md` | Found | Ordered future cleanup candidates |
| `docs/architecture/STAGE_1_2_FINAL_BLOCKER_REGISTER.md` | Found | Twelve blockers preventing cleanup execution |
| `docs/architecture/STAGE_1_2_RISK_ACCEPTANCE_TABLE.md` | Found | Accepted, rejected, and human-review risks |
| `docs/architecture/STAGE_1_2_FINAL_VALIDATION_COMMAND_CHECKLIST.md` | Found | Available automated checks and missing test commands |
| `docs/architecture/STAGE_1_2_HUMAN_REVIEW_PACK.md` | Found | Owner decisions required before consolidation |
| `docs/architecture/STAGE_1_2_TO_STAGE_1_3_HANDOFF_BRIEF.md` | Found | ADR scope, constraints, and unresolved decisions |
| `docs/architecture/STAGE_1_2_MASTER_TRACKER.md` | Found | Stage 1.2 audit history and frozen counts |
| `docs/architecture/stage-1-2-final-closure-manifest.json` | Found | Machine-readable final findings, locks, backlog, and readiness |

## Unknowns

Canonical client route; canonical admin proof route; canonical API version; RootLayout/external ownership; six unmapped page owners; production compatibility telemetry; production email/rate-limit completion; production model/index behavior.

## Final Decision Summary

ScaleOps remains the parent SaaS. ProofArena remains inside ScaleOps. The existing repository stays the source of truth. Future work must strengthen the current architecture instead of creating duplicate systems.


## Prompt 10 Validation and Hardening Update

- Confirmed: unified product/repository boundary; no duplicate route/layout/API/auth systems; backend authorization principle; shared-code, placeholder, and refactor governance.
- Revised/conditional: route governance does not select client/admin aliases; layout governance preserves role wrappers; API governance does not select an API version; module ownership allows mapped legacy exceptions.
- Blocked sub-decisions: route alias retirement, API-version migration, compatibility-facade removal, file deletion, and cleanup execution.
- Human review: product ratification, route/API compatibility choices, shell abstraction scope, legacy ownership, fallback UX, email/throttling, and test baseline.
- Source confidence: high for current executable owners, medium for consolidation policies, low for production compatibility usage.
- Rule clarification: similarity is not deletion proof; browser and API paths remain separate; frontend access checks do not replace backend security.
- Explicit warning: never create a separate ProofArena app or duplicate route, layout, dashboard, API client, authentication, or navigation systems.

Final recommendation: **keep proposed pending human approval**. Readiness score: 78/100.


## Prompt 11 Finalization Update

Final review covers fourteen governance decisions. Shared-code, placeholder, refactor, safe-delete, critical-file, and preflight rules are ready to enforce. Product/repository/no-separate-app wording requires owner ratification. Route alias, protected-shell consolidation, API version/facade, auth implementation, and legacy module ownership decisions remain proposed.

Acceptance gate: 7 pass, 4 conditional, 1 fail. Human questions are not answered, so ADR-0001 remains Proposed.

Final rules: preserve one product/repository; reuse current router, role layouts, SidebarCore, apiClient, backend authorization, and mapped modules; classify placeholders; protect critical files; require tests/rollback; delete nothing on appearance alone.

Source confidence is high for current owners, medium for consolidation direction, and low for production compatibility/version decisions. Stages 2 through 36 must use the governance map.

ProofArena must remain inside ScaleOps unless a future ADR formally reverses this decision.
