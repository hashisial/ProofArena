# Stage 1.1 Forbidden Actions Manifest

Generated: 2026-06-27T16:22:15.6507021+05:00

These actions are prohibited unless a later stage explicitly authorizes them and the stated condition is met.

| ID | Forbidden action | Why forbidden | Affected systems | Allowed only after | Safer alternative |
| --- | --- | --- | --- | --- | --- |
| FA-001 | Create a separate ProofArena app, repository, router, or deployment. | It duplicates the verified ScaleOps platform boundary. | Client, server, auth, routes, deployment | Stage 2 ADR explicitly changes product boundary | Extend the existing ProofArena module boundary |
| FA-002 | Create another route-constant registry. | `routes.js` already owns centralized paths. | Routes, navigation, breadcrumbs | Stage 4 route migration with all importers updated | Add to the existing constants |
| FA-003 | Create another frontend router or hidden nested route stack. | `AppRoutes.jsx` owns route and guard composition. | Public and protected routing | Route-governance ADR and migration tests | Register through current router |
| FA-004 | Create another public/provider/client/admin layout for the same surface. | Current shells and compatibility layouts already overlap. | Layouts, topbars, sidebars | Stage 1.2 ownership decision and browser tests | Reuse the owning layout |
| FA-005 | Create another sidebar engine or manually duplicate nav rendering. | `SidebarCore` already handles rendering, active state, filtering, and accessibility. | All dashboards | Shared-navigation ADR | Add a thin wrapper/config |
| FA-006 | Create another auth provider, user store, or route-guard family. | Current auth state and compatibility layers are already complex. | Login, sessions, protected routes | Stage 23 canonical-auth migration | Reuse existing provider/store/guards |
| FA-007 | Bypass route guards or render protected content before auth resolves. | It creates security UX leaks and redirect instability. | Provider/client/admin routes | Never without approved security design | Preserve hydration and role guards |
| FA-008 | Hardcode role or permission logic in arbitrary UI components. | Central access policy and backend middleware already exist. | Navigation, CTAs, dashboards | Stage 26 permission model | Extend centralized policy and backend enforcement |
| FA-009 | Create another Axios/fetch client or make raw component requests. | `apiClient.js` owns credentials, refresh, and errors. | Frontend/backend contracts | Stage 5 client migration | Add/reuse a feature service using `apiClient` |
| FA-010 | Add a third backend API registry or silently change mount prefixes. | Two active registries already expose 233 dual mounts. | All API consumers | API-version ADR and compatibility telemetry | Extend the approved registry deliberately |
| FA-011 | Put substantial business logic in route files. | The verified normal flow is route-controller-service-model. | Backend features | Explicit exception with tests | Add to the owning controller/service |
| FA-012 | Add another auth, role, validation, error, rate-limit, or sanitization middleware generation. | Parallel generations already create governance risk. | Backend security and API behavior | Stage 23/26 consolidation plan | Reuse the mapped route middleware |
| FA-013 | Edit or merge models without reading the model usage map. | Aliases, overlaps, references, and sensitive fields are active. | MongoDB data and all services | Data migration, rollback, and tests | Preserve schema; document proposed migration |
| FA-014 | Delete files because they appear unused. | Dynamic imports, aliases, compatibility exports, or runtime registration may not be obvious. | All architecture layers | Zero-caller proof plus runtime tests | Mark candidate in duplicate radar |
| FA-015 | Merge overlapping Challenge, Settings, User, Profile, or middleware files immediately. | Canonical ownership is not established. | Data, auth, services | Stage 1.3 ADR and data/caller evidence | Retain compatibility and investigate |
| FA-016 | Modify package, lock, environment, build, or deployment files casually. | These files control runtime and deployment topology. | Tooling and production deployment | Stage 6/config approval with validation | Document required change first |
| FA-017 | Copy secrets or real environment values into code or documentation. | It exposes credentials and violates audit boundaries. | Security, deployments, integrations | Never | Refer only to variable names and secret-management docs |
| FA-018 | Add dependencies without explicit stage approval. | It changes build/runtime risk outside the audited architecture. | Client/server packages and lockfiles | Approved implementation stage and dependency review | Use existing dependencies or document the need |
| FA-019 | Convert placeholders or preview data into fake production behavior. | Business-looking fallbacks can hide API failures and mislead users. | Public pages, dashboard modules, legacy API facade | Owning feature stage with real contract/data | Keep clearly labeled placeholder or use honest empty/error state |
| FA-020 | Move code across module/shared boundaries without checking imports. | Shared-to-feature dependencies and cycles can result. | Features, modules, shared utilities/UI | Stage 3 boundary plan and passing boundary checker | Move one tested vertical slice with public exports |

