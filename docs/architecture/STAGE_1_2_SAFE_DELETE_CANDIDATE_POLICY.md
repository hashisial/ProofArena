# Stage 1.2 Safe Delete Candidate Policy

Generated: 2026-06-27

## Absolute Policy

No file is safe to delete because it looks unused. Deletion is a separate future prompt after multi-source proof and, for high-risk files, explicit human approval.

A candidate must pass:

1. Static import/export search.
2. Route and lazy/dynamic import search.
3. Config/barrel/alias/build reference search.
4. Documentation and generated manifest search.
5. Runtime route/action/build verification.
6. External/package consumer review where relevant.
7. Replacement and compatibility review.
8. Full affected tests and manual QA.
9. Written rollback plan.
10. Human approval for route/auth/layout/dashboard/API/model/config files.

## Candidate Checklist

| Check | Required value before deletion |
| --- | --- |
| File path | Exact repository-relative path |
| Imported anywhere | No, supported by search and build |
| Routed anywhere | No, including lazy, proxies, aliases, redirects |
| Referenced in config/barrel | No |
| Referenced in docs | References updated or intentionally historical |
| Runtime reachable | No, demonstrated by route/action/browser evidence |
| Replacement exists | Yes, behavior-equivalent and already validated |
| Risk if deleted | Documented with blast radius |
| Rollback method | Exact file/ref restoration |
| Human approval | Yes for high-risk/unknown; recorded |
| Commands | All available checks pass |
| Manual QA | All affected routes/actions pass |

Any `unknown` value blocks deletion.

## Extra-Protected Categories

| Category | Examples | Extra requirement |
| --- | --- | --- |
| Route | routes.js, AppRoutes, metadata, guards | Route matrix, compatibility policy, telemetry |
| Auth | provider/store/guards/backend middleware/services | Security review and full auth E2E |
| Layout/dashboard | Public/Dashboard/Client/Admin layouts, SidebarCore | Role/browser/mobile/accessibility regression suite |
| API | apiClient, api.js, endpoints, server route indexes | Caller/contract/version evidence |
| Model/data | Mongoose models and migrations | Data migration, backup, rollback, production-like tests |
| Config/package/env | package files, Vite/Tailwind/env/config | Explicit stage approval and deployment validation |
| Shared | Broadly imported utilities/components | Dependency graph and compatibility export window |

## Current Candidate Status

- `RootLayout.jsx`, `components/Layout.jsx`, adapters, aliases, unmapped pages, and api.js exports are **candidates only**.
- Six unmapped pages remain UNKNOWN and cannot be deleted.
- No production file is approved for deletion by Stage 1.2 documentation.

