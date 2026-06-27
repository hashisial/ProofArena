# Stage 1.2 Future Prompt Execution Contracts

Generated: 2026-06-27

| Contract | Allowed actions | Forbidden actions | Required docs | Inspect | Required checks | Required final response | Rollback | Production edits | Stop conditions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C-ROUTE | Add tests, migrate one verified literal/builder, preserve aliases | Router rewrite, alias deletion, hardcoded replacement sweep | Route inventory/source analysis/critical list | routes.js, AppRoutes, metadata, guards, callers | Route matrix, redirects, roles, build/lint | Exact paths/callers changed and compatibility retained | Restore literal/alias | Future-only with explicit approval | Unknown route owner or failed direct load |
| C-NAV | Align one config/link/helper after route decision | Duplicate nav stack, hidden admin links, enable future paths | Route decisions, QA matrix | Header, public configs, sidebars, navigationActive | Keyboard, active, disabled, mobile | Surface-by-surface QA | Revert one config/caller | Future-only | Path/role ambiguity |
| C-LAYOUT | Extract one non-policy primitive | Merge role guards/wrappers, replace SidebarCore | Layout ownership/blast report | Three layouts, drawers, topbars, content shells | Role matrix, focus, overflow, screenshots | Before/after behavior evidence | Restore inline primitive | Future-only | Protected flash/focus/layout change |
| C-DASHBOARD | Reduce shared shell markup only | New shell, fixed margin-left, cross-role actions | Critical files, layout analysis | Dashboard/Client/Admin layouts and useSidebarShell | Collapse persistence, mobile, direct routes | Role-specific outcomes | Revert isolated commit | Future-only | Any role leak |
| C-API | Migrate one facade method to existing domain service | New Axios instance, remove interceptor, bulk-delete api.js | API source analysis/backend flow | apiClient, api.js, endpoints, backend route | Method/path/envelope/auth/error tests | Caller and backend contract map | Keep/re-enable facade shim | Future-only | Unknown caller/response/version |
| C-RAW | Move verified direct component request to service | Merge Socket.IO or server fetch into browser client | API decision tables | Profile components/utils/services | Upload/prefix/error tests | Request owner before/after | Restore adapter | Future-only | Transport semantics differ |
| C-PLACEHOLDER | Improve disclosure or replace with real empty/error contract | Fake API/data, enable unsupported mutation | Placeholder classification | Exact WPH file and owner service | Empty/error/loading/accessibility QA | State and data-source disclosure | Restore explicit placeholder | Future-only | Real contract absent |
| C-AUTH | Add tests and approved guard/provider/throttle changes | Rewrite auth, frontend-only security, expose tokens | Auth docs, critical list, backend flow | Auth provider/store/guards/backend middleware/services | Login/logout/refresh/recovery/verification/roles | Security assumptions and tests | Roll back atomically | Future-only with security approval | Provider/role policy unclear |
| C-UTILITY | Consolidate one proven equivalent helper | Broad move, circular import, semantics loss | Reusable map/dependency graph | All importers and similar helpers | Unit/equivalence/build/boundary | Compatibility exports listed | Restore old helper/export | Future-only | Behavior differs |
| C-DELETE | Verify one candidate only, then request human approval | Delete during discovery, batch deletion | Safe-delete policy, critical list | Imports/routes/config/docs/runtime/replacement | Build/lint/tests/full affected QA | Proof matrix and approval | Restore exact file/ref | No in verification prompt | Any unknown, high risk, no approval |

## Universal Requirements

Every implementation prompt must state the target candidate IDs, read the required docs, show pre-change evidence, keep scope isolated, run available commands, perform manual QA, report rollback, and stop on uncertainty.

