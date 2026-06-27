# Stage 1.2 Zero-Break Cleanup Sequence

Generated: 2026-06-27

No step is authorized until its stop conditions pass.

| Step | Lane/target | Inspect first | Likely later edits | Forbidden in step | Required docs | Pre-checks | Expected result | Manual QA | Rollback | Risk | Stop condition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ZB-01 | Documentation-only confirmation | Stage 1.1/1.2 manifests and Git status | Documentation only | All production files | Source summary, verification report | JSON/docs consistency | Stable candidate IDs/counts | None | Revert docs | S3 | Any production diff |
| ZB-02 | Harmless placeholder labeling | Class A files | Copy/disclosure only in future prompt | Services/routes/auth | Placeholder classification | Product approval, screenshot baseline | Preview remains explicit | Home/public placeholder routes | Revert copy | S3 | Label could imply live data |
| ZB-03 | Route constant planning | routes.js, AppRoutes, routeMetadata | Tests/ADR first; later literal callers | Alias deletion | Route source analysis | 108-route matrix, direct loads | Canonical/compatibility policy documented | Public/auth/client/admin routes | Keep old aliases/builders | S1 | Missing telemetry/test |
| ZB-04 | Navigation/sidebar path alignment | nav configs, Header, SidebarCore | Literal links and active helper later | Layout/guard merge | Route decisions, QA matrix | Keyboard/active/disabled tests | Same links and active state | Header/mobile/three sidebars | Revert one caller | S2 | Any route/role ambiguity |
| ZB-05 | Layout ownership consolidation | three layouts, content shells, drawers/topbars | One shared primitive at a time | Role policy wrappers | Layout ownership/blast report | Route-role/browser/mobile tests | Less markup duplication, same wrappers | Provider/client/admin desktop/mobile | Restore extracted block | S1 | Auth/focus/layout baseline missing |
| ZB-06 | Dashboard shell duplication cleanup | Dashboard/Client/Admin shells, useSidebarShell | Grid/content/drawer primitive | SidebarCore replacement, fixed margins | Critical-file list, QA matrix | Collapse persistence, no overflow | Same shell behavior and role separation | All dashboard roots/children | Revert isolated primitive | S1 | Any protected flash or role leak |
| ZB-07 | API client standardization | apiClient, api.js, apiEndpoints, feature services | Facade caller migrations | Transport replacement, auth interceptor changes | API source analysis/backend flow | Method-to-endpoint map, contract tests | One transport, domain service ownership | Login/public/protected/error/upload | Keep facade shim | S1 | Unknown method/response |
| ZB-08 | Raw/direct request migration | Three profile components; feature utils | Profile service methods/shared endpoint helper | Socket/scraper merge | API decisions | Upload and /v1 tests | Components stop owning HTTP details | Avatar/cover/profile and feature APIs | Re-add direct adapter | S2 | API version undecided |
| ZB-09 | Dangerous fake-data retirement | api.js fallbacks, constants, ReviewsSection | Empty/error UX only after approval | Invented API/data | Placeholder classification | Empty/error/outage tests | Real empty/error state; no fake records | Services/portfolio/reviews | Restore prior UI behind dev fixture only | S1 | No real empty/error design |
| ZB-10 | Final removal candidate lane | RootLayout/Layout, adapters, aliases, unmapped pages, facade exports | Separate deletion prompt only | Bulk deletion | Safe-delete policy | Import/route/config/docs/runtime/replacement proof | One proven candidate removed | Full affected matrix | Restore file/alias/export | S1/UNKNOWN | Human approval or proof missing |

## Required Ordering

ZB-03 precedes ZB-04. ZB-03 and auth tests precede ZB-05/06. ZB-07 precedes ZB-08/09. ZB-10 is always last and must be a separate prompt.

## Universal Stop Conditions

- Any unexplained production diff.
- Any unknown route or importer.
- Any missing rollback.
- Any auth/role/critical-file edit outside the approved target.
- Any failed lint/build/boundary/test/QA check.
- Any proposal to replace a placeholder with invented data or behavior.

