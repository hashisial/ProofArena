# Stage 1.2 Final Blocker Register

Generated: 2026-06-27

| Blocker | Category | Description | Affected files/systems | Why it blocks cleanup | Unblock action / decision owner | Stage | Severity | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| B-01 | Missing tests | No test/spec files or test script exist | Routes, layouts, API, auth, placeholders | Behavior-preserving cleanup cannot be demonstrated | Establish target-specific baseline; engineering lead | Before execution | S1 | Open |
| B-02 | Unknown layout ownership | RootLayout/Layout runtime/external ownership unproven | `RootLayout.jsx`, `components/Layout.jsx` | "Unused" static result is insufficient for deletion | Runtime/build/barrel/external consumer proof | Route/layout cleanup | S1 | Unknown |
| B-03 | Unknown page ownership | Six pages have no direct AppRoutes ownership | WPH-042..047 | Deletion/reuse may break indirect flows | Product/engineering owner plus runtime/import proof | Before cleanup | UNKNOWN | Human review |
| B-04 | Route alias policy | Client canonical/legacy paths undecided | RTE-011 | Bookmarks and role shells may break | Human ADR, telemetry, redirect plan | Stage 1.3/4 | S1 | Open |
| B-05 | Admin proof route ownership | Three proof paths overlap | RTE-012, admin pages/nav | Wrong operational page may become canonical | Admin/proof product owner and API mapping | Stage 1.3/admin | S1 | Open |
| B-06 | API version policy | `/api`, `/api/v1`, conditional `/v1` coexist | Server indexes, seven feature utils | Prefix/mount cleanup can break 537 variants | ADR, telemetry, contract tests | Stage 1.3/5 | S1 | Open |
| B-07 | Legacy facade method map | api.js has 29 importers but per-export runtime use is not fully cataloged | api.js, feature services, hooks/pages | File-level migration is unsafe | Export-to-caller-to-endpoint matrix | API cleanup | S1 | Open |
| B-08 | Auth ownership generations | Multiple backend auth service/middleware naming generations remain | Stage 1.1 auth risk files | Consolidation may alter security/session behavior | Dedicated auth dependency/test review | Stage 23/security | S1 | Open |
| B-09 | Production email delivery | Controller records provider TODOs | Verify/recovery flows | Production behavior cannot be claimed complete | Approved provider/config/E2E; security owner | Auth stage | S1 | Blocked |
| B-10 | Recovery/login throttling | User/email throttling TODOs remain | auth.routes.js | Security cleanup/release assumptions are incomplete | Approved rate-limit policy and tests | Auth stage | S1 | Blocked |
| B-11 | Fallback replacement UX | Real empty/error behavior not approved for service/portfolio/reviews | WPH-028..030 | Removing data without UX may silently blank pages | Product/design/API owner; empty/error tests | Feature/API stage | S1 | Open |
| B-12 | Compatibility telemetry | No evidence of production usage for aliases/mounts/adapters | Routes, dual API mounts, legacy facade | Deprecation safety cannot be measured | Add/inspect telemetry and define support window | Stage 4/5 | S1 | Open |

**Blocker count: 12.** Cleanup execution readiness remains false.

