# Stage 1.1 Verified Architecture Diagrams

Generated: 2026-06-27

The diagrams show verified source relationships. Dashed edges represent compatibility, indirect, or unresolved ownership.

## 1. High-Level Repository Structure

~~~mermaid
flowchart LR
  Root["ScaleOps / ProofArena repository"]
  Client["client: Vite + React"]
  Server["server: Express + Mongoose"]
  Scripts["scripts: boundary tooling"]
  Docs["docs: architecture and stage records"]
  ProofArena["ProofArena feature/module capability"]

  Root --> Client
  Root --> Server
  Root --> Scripts
  Root --> Docs
  Client --> ProofArena
  Server --> ProofArena
~~~

## 2. Frontend Route, Layout, and Guard Flow

~~~mermaid
flowchart TD
  Main["main.jsx"] --> App["App.jsx"]
  App --> Router["AppRoutes.jsx: 108 entries"]
  Router --> Public["PublicLayout"]
  Router --> Auth["AuthLayout"]
  Router --> ClientGuard["AuthHydration -> RoleRoute(client) -> EmailVerifiedRoute"]
  Router --> DashboardGuard["AuthHydration -> ProtectedRoute -> EmailVerifiedRoute"]
  Router --> AdminGuard["AuthHydration -> RoleRoute(admin) -> EmailVerifiedRoute"]
  ClientGuard --> Client["ClientLayout"]
  DashboardGuard --> Dashboard["DashboardLayout"]
  AdminGuard --> Admin["AdminLayout"]
  Public --> PublicPages["Public and system pages"]
  Auth --> AuthPages["Login, register, reset, verification"]
  Client --> ClientPages["Client routes"]
  Dashboard --> DashboardPages["Provider/shared dashboard routes"]
  Admin --> AdminPages["Admin routes"]
  Router --> CatchAll["Wildcard -> PublicLayout -> NotFound"]
~~~

## 3. Backend Route to Model Flow

~~~mermaid
flowchart LR
  App["app.js"] --> API["routes/index.js: /api"]
  App --> V1["routes/v1/index.js: /api/v1"]
  API --> Route["Route file"]
  V1 --> Route
  Route --> Middleware["Auth, role, validation, upload, rate limit"]
  Route --> Controller["Controller function"]
  Controller --> Service["Service function"]
  Service --> Model["Mongoose model"]
  Controller --> Response["Response/error helpers"]
  Model --> Mongo["MongoDB"]
~~~

## 4. Authentication Flow

~~~mermaid
flowchart TD
  Page["Auth page"] --> FrontAuth["features/auth/authService.js"]
  FrontAuth --> Client["services/apiClient.js"]
  Client --> Endpoint["/api/auth or /api/v1/auth"]
  Endpoint --> AuthRoute["modules/auth/auth.routes.js"]
  AuthRoute --> Validate["Auth validators and rate limiters"]
  AuthRoute --> AuthController["modules/auth/auth.controller.js"]
  AuthController --> AuthService["modules/auth/auth.service.js"]
  AuthService -. compatibility and delegated behavior .-> LegacyAuth["services/authService.js and auth.service.js"]
  AuthService --> User["User model"]
  User --> Store["AuthProvider and useAuthStore session state"]
  Store --> Guards["ProtectedRoute, RoleRoute, EmailVerifiedRoute"]
~~~

## 5. Frontend API Client to Backend Endpoint

~~~mermaid
flowchart LR
  Page["Page/component"]
  Hook["Feature/shared hook"]
  FeatureService["Feature service"]
  Legacy["Legacy services/api.js"]
  ApiClient["services/apiClient.js"]
  Constants["API endpoint constants"]
  Backend["Express endpoint"]

  Page --> Hook
  Hook --> FeatureService
  FeatureService --> ApiClient
  FeatureService --> Constants
  Page -. 11 direct-import exceptions .-> Legacy
  Legacy --> ApiClient
  ApiClient --> Backend
~~~

## 6. Shared Utility, Design, and Config Flow

~~~mermaid
flowchart TD
  Routes["Route constants and metadata"] --> Nav["Public and dashboard navigation"]
  Routes --> Guards["Access policy and route guards"]
  Tokens["styles/tokens.css and designTokens.js"] --> UI["Shared UI components"]
  UI --> Pages["Public, provider, client, admin pages"]
  Query["queryKeys and queryClient"] --> Hooks["TanStack Query hooks"]
  Utils["Shared route, format, storage, validation utilities"] --> Hooks
  Utils --> UI
  Env["Client/server env helpers"] --> Api["API client and server config"]
~~~

## 7. Risky or Unknown Dependency Flow

~~~mermaid
flowchart TD
  RouteRegistry["108 routes"] --> Metadata["73 metadata records"]
  Metadata -. 34 named patterns missing .-> UnknownRoute["Unknown metadata ownership"]

  LegacyApi["services/api.js"] --> Fallback["utils/constants.js fallback data"]
  LegacyApi --> FeatureServices["14 feature services"]

  AuthA["services/auth.service.js"] --> AuthB["services/authService.js"]
  AuthB --> AuthC["modules/auth/auth.service.js"]

  Challenge["Challenge model"] -. overlap .-> OutcomeChallenge["OutcomeChallenge model"]
  Settings["Settings model"] -. overlap .-> UserSettings["UserSettings model"]
  Saved["SavedItem model"] -. overlap .-> SavedProvider["SavedProvider model"]

  ProviderProfile["ProviderProfile ref"] -. missing model .-> VerifiedOutcome["VerifiedOutcome: unknown"]
~~~
*** Add File: C:\Users\hasee\OneDrive\Desktop\Scaleops by Proofarena\docs\architecture\STAGE_1_1_VERIFICATION_CHECKLIST.md
# Stage 1.1 Prompt 2 Verification Checklist

Generated: 2026-06-27

Status vocabulary: Done, Not found, Partial, Blocked, Unknown.

| Verification item | Status | Evidence/notes |
| --- | --- | --- |
| Repository root folders checked | Done | Root, client, server, scripts, docs, generated/runtime areas inventoried |
| Client source folders checked | Done | 552 source files represented in Prompt 1 inventory |
| Server source folders checked | Done | 251 source files represented in Prompt 1 inventory |
| Internal import/export graph built | Done | 811 nodes and 3,145 direct edges |
| Frontend route declaration files checked | Done | AppRoutes.jsx plus route guard files |
| Frontend routes verified | Done | 108 route entries |
| Route constants checked | Done | routes.js and constants barrels |
| Route metadata checked | Partial | Registry verified; 34 named route patterns are absent |
| Public layout checked | Done | PublicLayout and navigation/footer dependencies |
| Auth layout checked | Done | AuthLayout and public-only route behavior |
| Provider/shared dashboard layout checked | Done | DashboardLayout and sidebar shell |
| Client layout checked | Done | ClientLayout and role guard tree |
| Admin layout checked | Done | AdminLayout and role guard tree |
| Auth hydration checked | Done | AuthHydration and useAuthStore |
| Protected route guards checked | Done | ProtectedRoute, RoleRoute, EmailVerifiedRoute, PublicOnlyRoute |
| Redirect behavior checked | Done | Login, not-authorized, resend-verification, and role dashboard fallbacks |
| Catch-all/404 checked | Done | Final wildcard renders NotFound in PublicLayout |
| Navigation configs checked | Done | Public, provider, client, and admin configs |
| Frontend pages checked | Done | 78 page files and named RouteShell exports |
| Frontend components checked | Done | Import graph includes component and section files |
| Frontend hooks checked | Done | 44 custom hook files |
| Zustand stores checked | Done | Store hook APIs classified as config/state, not custom hooks |
| Frontend service/API clients checked | Done | 23 files |
| Frontend utilities checked | Done | Shared, feature, route, error, and validation helpers mapped |
| Client environment helper checked | Done | Values were not copied into documentation |
| Backend route registries checked | Done | Unversioned and v1 registries |
| Backend operation-bearing route files checked | Done | 304 operations reconstructed |
| Mounted backend endpoints checked | Done | 537 method/path variants |
| Backend controllers checked | Done | 36 controller-layer files in graph |
| Controller-to-service evidence checked | Done | 291 handler-level, 6 controller-file-level, 3 service-free, 4 inline |
| Backend services checked | Done | 50 service-layer files; workers/socket lifecycle files also graphed |
| Backend models checked | Done | 50 model-layer files; 45 registered models |
| Model indexes checked | Partial | Syntactic index evidence only; query-plan adequacy not established |
| Backend middleware checked | Done | Auth, role, validation, upload, rate limit, sanitize, logging, error paths |
| Backend validators checked | Done | Validator files and route use mapped |
| Backend utilities checked | Done | Utility and error helper imports mapped |
| Server config/env checked | Done | Config consumers mapped; secret values intentionally excluded |
| File upload/storage handlers checked | Done | Multer, local upload, Cloudinary, and upload route dependencies |
| Payment/webhook flow checked | Done | Billing/marketplace routes, Stripe services, webhook handler |
| Socket/realtime flow checked | Done | Socket entry, event handlers, messaging services/stores |
| Queue/worker flow checked | Done | Queue service, job and worker entry files mapped |
| Frontend imports backend source | Not found | No cross-source import edge |
| Backend imports frontend source | Not found | No cross-source import edge |
| Raw browser fetch/Axios outside services | Not found | Static source scan |
| Routes importing models/services directly | Not found | Controller boundary is preserved |
| Pages importing services directly | Partial | Eleven confirmed legacy/direct service imports |
| Inline endpoint controller mapping | Partial | Four status/discovery handlers are intentionally inline |
| VerifiedOutcome model | Not found | ProviderProfile reference has no registered model file |
| Runtime API behavior | Blocked | Audit is static and no maintained application test suite exists |
| Database index adequacy | Unknown | Requires production-like query plans and cardinality |
| Existing Prompt 1 docs cross-checked | Done | Counts and claims reconciled against source |
| Prompt 2 dependency map created | Done | STAGE_1_1_DEPENDENCY_MAP.md |
| Prompt 2 route dependency map created | Done | STAGE_1_1_ROUTE_DEPENDENCY_MAP.md |
| Prompt 2 frontend ownership map created | Done | STAGE_1_1_FRONTEND_OWNERSHIP_MAP.md |
| Prompt 2 backend flow map created | Done | STAGE_1_1_BACKEND_FLOW_MAP.md |
| Prompt 2 model usage map created | Done | STAGE_1_1_MODEL_USAGE_MAP.md |
| Prompt 2 reusable code map created | Done | STAGE_1_1_REUSABLE_CODE_MAP.md |
| Prompt 2 boundary report created | Done | STAGE_1_1_BOUNDARY_VIOLATION_REPORT.md |
| Prompt 2 architecture graph created | Done | stage-1-1-architecture-graph.json |
| Prompt 2 Mermaid diagrams created | Done | STAGE_1_1_ARCHITECTURE_DIAGRAMS.md |
| No dependencies installed | Done | Package files and lockfiles unchanged |
| No production code modified | Done | Git scope check limited to docs/architecture |
