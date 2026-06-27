# Stage 1.2 Cleanup Readiness Scorecard

Generated: 2026-06-27

Scoring measures evidence and regression safety, not implementation effort. A high score does not authorize cleanup; the target must still pass its listed gates.

| Category | Score | Reason | Known | Unknown/gap | Required next action | Safe for cleanup now |
| --- | ---: | --- | --- | --- | --- | --- |
| Layout cleanup readiness | 58 | Ownership and repetition are well mapped, but runtime compatibility and regression coverage are incomplete. | Six repeated-implementation clusters; three protected wrappers use one sidebar store. | RootLayout external/runtime ownership; no maintained visual/keyboard suite. | Add protected route and mobile shell regression tests, then extract one primitive. | No |
| Route constants cleanup readiness | 62 | Declaration and constant sources are clear, but aliases and metadata gaps require policy decisions. | AppRoutes owns 108 entries; routes.js is the constant candidate; 34 metadata gaps. | Client/admin-proof alias usage and production bookmarks/telemetry. | Decide compatibility policy and create route matrix tests. | With caution: literals/builders only, no alias deletion |
| API client cleanup readiness | 54 | The transport source is clear, but the facade has broad method-level ownership and version ambiguity. | One Axios instance; 29 api.js importers; feature services exist. | Per-export callers, exact response assumptions, canonical API mount. | Build facade export-to-caller-to-endpoint matrix and API contract tests. | No |
| Placeholder cleanup readiness | 78 | All 60 items are classified and disclosed previews are separable from harmful fallbacks. | 20 acceptable, 17 product-risk, 14 architecture-risk, 3 security-risk, 6 unknown. | Product/legal decisions and six page owners. | Start only with explicit empty/error UX for product-risk fallbacks; preserve disclosed previews. | With caution |
| Auth-related cleanup readiness | 35 | Auth is mapped but is the least safe area because provider, throttling, compatibility, and E2E checks remain incomplete. | Frontend auth service/store/provider and backend auth modules are identified. | Production email delivery, user/email rate limits, three backend auth generations, full E2E coverage. | Build auth route/service/middleware compatibility and delivery test plan. | No |
| Dashboard shell cleanup readiness | 48 | Shared primitives are obvious, but protected role behavior and admin confidentiality raise blast radius. | Provider/client/admin layout and SidebarCore ownership is known. | Cross-role runtime matrix and drawer/focus snapshots. | Test role matrix, collapse persistence, mobile drawers, and auth loading. | No |
| Public navigation cleanup readiness | 72 | Route-safe config and behavior are visible; local active matching and legacy Header adapters remain. | Public nav configs, disabled items, mobile groups, CTA paths are mapped. | RootLayout/Header compatibility consumer and complete browser keyboard tests. | Add public nav behavior tests, then normalize active helper/route literals. | With caution |
| Backend service/API cleanup readiness | 46 | Endpoint flows are deeply inventoried, but dual mounts and persistent contracts make cleanup high risk. | 304 operations, 537 mounted variants, controller/service/model flow map. | Canonical API version, mount telemetry, runtime clients, production index behavior. | Decide API version/deprecation policy and add contract tests. | No |
| Shared utility cleanup readiness | 68 | Duplicate helpers and aliases are mapped, but broad imports and behavior equivalence remain untested. | Route helpers, active matching, endpoint/error builders, WorkspaceLayout alias identified. | Exact semantic differences and circular-import risk after moves. | Add focused unit tests and normalize one family at a time. | With caution |

## Overall Readiness

**58/100 - not ready for broad Stage 1.2 cleanup.**

The repository is ready for cleanup planning, caller mapping, ADR preparation, and test-baseline work. It is not ready for bulk route alias deletion, layout merging, api.js removal, auth consolidation, or backend mount/model changes.

## Immediate Safe Work

- Produce tests and method-level maps without changing production behavior.
- Correct documentation classifications and source-of-truth statements.
- Prepare deprecation/compatibility policies.
- Replace no data source until the real empty/error/feature contract is approved.

## Immediate Unsafe Work

- Delete RootLayout, Layout, unmapped pages, route aliases, api.js exports, or dual API mounts.
- Merge provider/client/admin role wrappers.
- Change auth email/rate-limit behavior without a security-specific implementation stage.
- Treat marketing previews and business fallback data as the same cleanup class.

