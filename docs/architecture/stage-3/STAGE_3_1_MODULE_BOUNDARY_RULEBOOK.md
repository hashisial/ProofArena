# Stage 3.1 Module Boundary Rulebook

These rules apply to every future Stage 3 prompt. Later final Stage 3 locks may strengthen them.

| Rule ID | Section | Rule | Reason | Required docs | Forbidden action | Required validation | Stop condition |
|---|---|---|---|---|---|---|---|
| MBR-01 | Global module rules | Keep ScaleOps as the platform and ProofArena as a flagship module in one application. | Prevent product/runtime split. | Stage 2 handoff; ADR-0001 | Separate app, package, entry, deployment, DB boundary | Repository and manifest check | Any separate ProofArena boundary proposed |
| MBR-02 | Global module rules | Assign every file one primary module, platform, shared, marketing, or unknown owner before moving it. | Prevent ambiguous duplication. | Candidate audit; ownership matrix | Copying an unclassified file | Consumer/import graph and owner approval | Ownership remains ambiguous |
| MBR-03 | Frontend module rules | Module UI may own feature composition only. | Preserve platform shells and shared primitives. | Frontend blueprint; Stage 2 shell lock | Module router, layout, dashboard shell, sidebar, navigation | Route/layout visual and import checks | Platform UI ownership enters module |
| MBR-04 | Backend module rules | Preserve route-controller-service-model layering and migrate only complete registered slices. | Avoid duplicate active handlers. | Backend blueprint; Stage 1 backend flow | Partial copy, direct route business/model access, second app/DB | Registration trace, API tests, rollback | Old and new handlers would coexist |
| MBR-05 | Shared code rules | Shared code must have 2+ real consumers and no feature-specific policy. | Prevent feature dumping and coupling. | Stage 3.3 approval gate | Promoting single-module logic or importing modules from shared | Consumer count, cycle/import checks | Consumer or owner evidence missing |
| MBR-06 | API adapter/service rules | Module adapters must call the approved ScaleOps API client; services own module operations only. | Preserve auth/base URL/error behavior. | API prevention lock; adapter contract | New fetch/axios wrapper, base URL, token, global normalization | Network/auth/error regression tests | Alternate transport behavior appears |
| MBR-07 | Hook rules | Module hooks may compose module state but cannot own global auth, session, routing, or API clients. | Keep cross-cutting state authoritative. | Hook contract; auth lock | Module session hook, router policy, client creation | Hook dependencies and cycle scan | Hook becomes platform authority |
| MBR-08 | Model/schema rules | A module may own domain models only after compatibility and cross-module consumers are known. | Prevent duplicate schemas and data drift. | Model usage map; backend blueprint | Copying profile/user/payment/proof models | Model import/index/migration tests | Multiple model authorities remain unresolved |
| MBR-09 | Route rules | Modules provide routeable content; platform routing owns declaration, paths, redirects, and guards. | Prevent parallel route trees. | Stage 2 navigation/route lock; route inventory | Module router or route constants registry | Route map, redirects, guard and 404 checks | New route authority is introduced |
| MBR-10 | Auth/role rules | Reuse existing frontend guards/providers and backend auth/role middleware. | Backend security cannot be replaced by module UI checks. | Auth/role prevention lock; ADR-0001 | Provider/store/guard/middleware clone or UI-only authorization | Positive/negative auth and permission tests | Guard or middleware would be bypassed |
| MBR-11 | Dashboard/admin rules | Dashboard/admin modules consume platform shells, navigation, and role policy. | Prevent shell and privilege duplication. | Dashboard prevention lock; admin ownership matrix | Module dashboard/admin shell, sidebar, role registry | Role, shell, navigation and responsive checks | Separate shell or permission source appears |
| MBR-12 | Placeholder/mock rules | Keep mocks/placeholders classified and never present invented behavior as production. | Prevent false data/security/payment state. | Stage 1 placeholder report; ADR-0001 | Fake API, payment, auth, verification, or admin logic | Data-source trace and honest state checks | Production behavior depends on invented data |
| MBR-13 | Safe scaffold rules | Create a scaffold only after the approval gate, and only as behavior-free documentation in the selected existing convention. | Empty parallel folders create false ownership. | Scaffolding plan; final ownership lock | Blind module directories, imports, exports, routes, code placeholders | `git diff`, build neutrality, owner approval | Any runtime/import/config change is required |
| MBR-14 | Safe scaffold rules | Do not move, rename, delete, or re-export current files during scaffolding. | Preserve behavior and rollback clarity. | Safe-delete policy; critical-file list | File move/deletion or barrel adoption | Name-status diff and import graph | Existing path must change |
| MBR-15 | Stop conditions | Stop on unclear ownership, missing evidence/tests/approval, duplicate platform behavior, cycles, or sensitive-data uncertainty. | Future refactor safety outranks speed. | All Stage 1-3 controls | Assuming an answer or proceeding partially | Record blocker and human question | Any listed uncertainty remains material |

## Section Coverage

1. Global module rules: MBR-01 to MBR-02.
2. Frontend module rules: MBR-03.
3. Backend module rules: MBR-04.
4. Shared code rules: MBR-05.
5. API adapter/service rules: MBR-06.
6. Hook rules: MBR-07.
7. Model/schema rules: MBR-08.
8. Route rules: MBR-09.
9. Auth/role rules: MBR-10.
10. Dashboard/admin rules: MBR-11.
11. Placeholder/mock rules: MBR-12.
12. Safe scaffold rules: MBR-13 to MBR-14.
13. Stop conditions: MBR-15.

