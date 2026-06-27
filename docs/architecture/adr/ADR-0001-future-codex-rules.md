# ADR-0001 Rules for Future Codex Prompts

Generated: 2026-06-27

| Area | Read first | Inspect | Forbidden | Validate | Stop when |
| --- | --- | --- | --- | --- | --- |
| Routes | Route inventory, final route lock, ADR | AppRoutes, routes.js, metadata, guards, callers | Parallel router/constants; alias deletion | Route/redirect/role matrix | Alias/owner unknown |
| Layouts | Layout ownership, blast report, critical list | Role layouts, content shells, drawers/topbars | New shell; merge role policy | Desktop/mobile/focus/overflow | Protected behavior changes |
| Dashboard | Same plus QA matrix | useSidebarShell, SidebarCore, nav configs | Replace SidebarCore; fixed margin hacks | Collapse/mobile/active/role QA | Any role leak |
| API/services | API inventory/flow/lock, blocker register | apiClient, api.js, endpoints, services, backend route | New HTTP client; interceptor bypass; bulk facade removal | Method/path/auth/error/envelope | Caller/version unknown |
| Auth/roles | Critical list, backend flow, ADR | Provider/store/hooks/guards/middleware/services | UI-only security; raw tokens; auth rewrite | Full auth/role/E2E/security | Provider/policy unresolved |
| Models | Model usage/critical list | Routes/controllers/services/refs/indexes | Casual schema/index deletion | Migration/backups/production-like tests | Data ownership unknown |
| Shared code | Reusable/dependency/do-not-duplicate docs | All importers and similar helpers | Shared dumping ground; broad move | Equivalence/build/boundary | Behavior differs |
| Mock/placeholders | Classification/risk acceptance | Exact WPH file and real owner | Fake production data/workflow | Empty/error/disclosure/accessibility | Real contract absent |
| Deletion | Safe-delete policy/critical list | Imports/routes/config/docs/runtime/replacement | Delete during audit or batch cleanup | All checks plus human approval | Any unknown |
| Dependencies/config | Forbidden actions/config critical list | Package/lock/env/build files | Install/change without stage approval | Build/deploy/env review | Approval absent |
| New modules | ADR and ownership maps | Existing feature/shared locations | Separate ProofArena system | Boundary check/import direction | Existing owner can be reused |

Every final response must list changed files, checks, failures, unknowns, rollback, and whether production code changed.

