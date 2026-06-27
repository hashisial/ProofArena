# Stage 1.1 Future Prompt Pre-Flight Checklist

Generated: 2026-06-27T16:22:15.6507021+05:00

Every future implementation prompt must complete the universal checks and the table matching its change surface before editing production files.

## Universal Checks

1. Read `STAGE_1_1_SOURCE_OF_TRUTH_SUMMARY.md`.
2. Search `STAGE_1_1_DO_NOT_DUPLICATE_REGISTRY.md` for the proposed system.
3. Check `STAGE_1_1_CRITICAL_FILE_PROTECTION_LIST.md` for every target file.
4. Read the route inventory before changing routes, navigation, layouts, or guards.
5. Read the API inventory before changing clients, services, routes, controllers, or responses.
6. Read the model usage map before changing schemas, fields, indexes, or references.
7. Read the boundary report before moving code or changing ownership.
8. Read the duplicate radar before creating any architecture-level file.
9. Read the placeholder/mock report before replacing fallback or preview data.
10. Classify every target as low-risk, tests-required, high-risk, or UNKNOWN.

## Frontend Feature Prompt

| Check ID | Verify | Required document | Pass condition | Fail condition | If failed |
| --- | --- | --- | --- | --- | --- |
| PF-FE-01 | Existing page/component/hook/service ownership | Frontend Ownership Map | One clear owner and callers identified | Parallel owner or unmapped page | Stop; document ownership and migration path |
| PF-FE-02 | Existing route and layout | Route Dependency Map | Route constant, layout, guard, metadata known | Hardcoded path or unknown guard | Stop; resolve route governance first |
| PF-FE-03 | Existing API/service boundary | Reusable Code Map; API Inventory | Existing service/client can be reused | Proposed raw request or second client | Use existing service or plan a tested migration |
| PF-FE-04 | Shared versus feature UI | Do-Not-Duplicate Registry | Generic UI uses shared primitives; domain UI stays feature-owned | New generic local system | Reuse shared UI or request Stage 7 decision |

## Backend Feature Prompt

| Check ID | Verify | Required document | Pass condition | Fail condition | If failed |
| --- | --- | --- | --- | --- | --- |
| PF-BE-01 | Route-controller-service-model chain | Backend Flow Map | Full chain and middleware are identified | Inline/partial/unknown flow | Add tests and map the exception before editing |
| PF-BE-02 | Existing endpoint/version | API Inventory | Correct current mount and callers known | New duplicate endpoint/version | Stop for API governance decision |
| PF-BE-03 | Existing domain service/model | Model Usage Map; Reusable Code Map | Existing owner is reused | New overlapping model/service | Use existing owner or write an ADR candidate |
| PF-BE-04 | Response/error contract | Traceability Matrix | Existing helper/envelope preserved | Custom response shape | Reuse `apiResponse`/`AppError` conventions |

## Auth and Security Prompt

| Check ID | Verify | Required document | Pass condition | Fail condition | If failed |
| --- | --- | --- | --- | --- | --- |
| PF-AU-01 | Canonical and compatibility auth generations | Duplicate Radar; Critical File List | All current callers and endpoints mapped | One generation assumed unused | Do not delete; add auth regression coverage |
| PF-AU-02 | Frontend hydration/guard sequence | Route Dependency Map | Guest and all role outcomes documented | Protected content can render before decision | Stop and test loading/redirect behavior |
| PF-AU-03 | Backend role middleware chain | Backend Flow Map | Route-specific auth and role middleware known | UI-only permission or unknown middleware | Require backend enforcement mapping |
| PF-AU-04 | Sensitive fields/tokens/errors | Model Usage Map; Risk Map | No secret/raw token/private field exposure | Sensitive data reaches UI/docs/logs | Block change and perform security review |

## Route and Navigation Prompt

| Check ID | Verify | Required document | Pass condition | Fail condition | If failed |
| --- | --- | --- | --- | --- | --- |
| PF-RT-01 | Route constant and metadata | Route Inventory | Existing constant used and metadata impact known | New scattered string or duplicate constant | Use current constant and metadata registry |
| PF-RT-02 | Layout and guard chain | Route Dependency Map | Correct public/provider/client/admin shell and guards identified | Unknown or copied shell | Stop; map ownership first |
| PF-RT-03 | Navigation surfaces | Do-Not-Duplicate Registry | Header/mobile/footer/sidebar configs assessed | One surface updated independently | Update through shared config/filter strategy |
| PF-RT-04 | Catch-all and fallback behavior | Route Inventory; Source Summary | Valid routes remain ahead of catch-all and fallback is role-safe | New redirect loop or hidden valid route | Add route matrix tests before change |

## Dashboard and Layout Prompt

| Check ID | Verify | Required document | Pass condition | Fail condition | If failed |
| --- | --- | --- | --- | --- | --- |
| PF-DS-01 | Existing shell/state ownership | Critical File List | Correct layout, `useSidebarShell`, and sidebar state identified | New shell or state hook proposed | Reuse current shell; do not duplicate |
| PF-DS-02 | Shared sidebar rendering | Do-Not-Duplicate Registry | `SidebarCore` plus role config remains in use | Manual nav rendering proposed | Use thin wrapper and shared engine |
| PF-DS-03 | Role/loading behavior | Route Dependency Map; Access risk docs | Shell waits for auth and role is allowed | Protected shell can flash | Block until access tests exist |
| PF-DS-04 | Responsive/accessibility behavior | Architecture Invariants | Grid, drawer, focus, labels, and collapse persistence preserved | Fixed margin or hidden focus introduced | Add browser/keyboard regression tests |

## Model and Database Prompt

| Check ID | Verify | Required document | Pass condition | Fail condition | If failed |
| --- | --- | --- | --- | --- | --- |
| PF-DB-01 | All model consumers | Model Usage Map | Routes, controllers, services, refs, sensitive fields mapped | Unknown collection/caller | Stop for data ownership review |
| PF-DB-02 | Overlap/alias status | Duplicate Radar | Canonical decision exists or compatibility retained | Similar model assumed duplicate | Do not merge/delete |
| PF-DB-03 | Migration and rollback | Risk Map | Migration, backfill, rollback, and compatibility defined | Direct schema rename/removal | Block until migration plan exists |
| PF-DB-04 | Index/query impact | Audit Coverage Report | Query patterns and production-like evidence available | Index choice based only on schema glance | Mark UNKNOWN; obtain query-plan evidence |

## Shared Utility or Component Prompt

| Check ID | Verify | Required document | Pass condition | Fail condition | If failed |
| --- | --- | --- | --- | --- | --- |
| PF-SH-01 | Existing reusable candidate | Reusable Code Map | No equivalent helper/component already exists | Similar helper found | Reuse or extend existing owner |
| PF-SH-02 | Dependency direction | Boundary Violation Report | Shared code imports no feature/page/route implementation | Shared-to-feature dependency introduced | Move composition upward instead |
| PF-SH-03 | Blast radius | Architecture Graph; Critical File List | Importers and behavior tests identified | High fan-in changed blindly | Add tests and stage the migration |
| PF-SH-04 | Compatibility wrappers | Duplicate Radar | Wrapper purpose and callers known | Wrapper deleted as “unused-looking” | Prove zero callers and migration first |

## UI and Theme Prompt

| Check ID | Verify | Required document | Pass condition | Fail condition | If failed |
| --- | --- | --- | --- | --- | --- |
| PF-UI-01 | Existing tokens/primitives | Do-Not-Duplicate Registry | `tokens.css` and shared UI primitives used | New hardcoded token system | Reuse tokens or schedule Stage 7 |
| PF-UI-02 | Accessibility states | Architecture Invariants | Focus, contrast, disabled, loading, and reduced motion preserved | Meaning relies on color/hover only | Block until accessible behavior defined |
| PF-UI-03 | Layout surface | Route Dependency Map | Public/dashboard context and container rules known | Dashboard/public styling mixed | Use owning shell and content wrapper |
| PF-UI-04 | Visual regression scope | Critical File List | Shared importer blast radius and viewport checks planned | Shared primitive edited without coverage | Add snapshots/browser checks first |

## Pre-Flight Result

A prompt may proceed only when every applicable row passes. Any UNKNOWN or failed high-risk check changes the prompt from implementation to investigation/documentation until resolved.

