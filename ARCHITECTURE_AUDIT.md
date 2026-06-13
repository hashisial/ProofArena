# ScaleOps / ProofArena Architecture Audit

## Audit Intent

This report evaluates the existing ScaleOps repository as the long-term home of ProofArena.
It does not recommend creating a separate ProofArena project, replacing ScaleOps, or rewriting
the application. The recommended direction is a controlled evolution of the current modular
monolith into clearer domain modules with stronger contracts, tests, observability, and
operational safeguards.

No feature implementation or UI redesign was performed as part of this audit.

## Executive Verdict

ScaleOps is already a large, capable MERN platform. ProofArena is not a prototype bolted onto
an empty shell; it is represented by substantial client and server domains for provider
discovery, challenges, execution plans, matching, outcome offers, proof assets, saved
providers, provider acquisition, client decision workflows, and dashboards.

The architecture can support the planned product direction, but it is not yet safe to scale
through another 50 stages without consolidation. Its primary constraint is not missing
features. Its constraint is accumulated architectural ambiguity:

- older ScaleOps surfaces and newer ProofArena surfaces use different conventions;
- legacy and versioned APIs coexist as public contracts;
- compatibility aliases make several import paths appear canonical;
- critical domains have grown into very large files;
- automated tests, CI gates, contract validation, and production observability are absent or
  insufficiently visible;
- generated browser artifacts and uploaded media are tracked in Git;
- high-risk payment, messaging, and trust workflows lack demonstrated regression protection.

The correct strategy is:

1. protect the current system with tests, contracts, security cleanup, and CI;
2. establish canonical ownership and migrate legacy paths incrementally;
3. add missing execution, proof, reputation, event, AI, and analytics foundations;
4. extract services only when measured scale or team ownership requires it.

## Audit Scope And Evidence

The audit covered the active repository structure and representative implementation files for:

- frontend pages, routes, layouts, components, sections, services, feature hooks, constants,
  Zustand stores, React Query usage, utilities, styling, build configuration, and dependencies;
- backend application composition, routes, controllers, services, models, validators,
  middleware, configuration, realtime infrastructure, workers, queues, uploads, payments, and
  dependencies;
- cross-layer imports, duplicate filenames, compatibility aliases, public API surfaces,
  repository hygiene, source size, build/runtime foundations, and capability readiness.

Current source inventory:

| Area | Current evidence |
| --- | ---: |
| Client source files | 465 |
| Client source lines | 56,929 |
| Server source files | 228 |
| Server source lines | 32,598 |
| Client pages | 66 |
| Client components | 243 |
| Client feature files | 45 |
| Server routes | 36 |
| Server controllers | 35 |
| Server services | 46 |
| Server models | 50 |
| Server model index declarations | 167 |
| Tracked runtime artifacts found | 29 |
| Automated test files found | 0 |
| CI workflow files found | 0 |

The audit is structural. Because no automated test suite exists, it cannot prove full business
correctness, authorization correctness, payment correctness, or data-migration safety.

# Current Structure

## Repository-Level Structure

```text
ScaleOps repository/
  client/                         React 19 + Vite frontend
    src/
    dist/                         generated build output
    node_modules/
    .vercel/
    package.json
    vite.config.js
    vercel.json
  server/                         Express 5 + Mongoose backend
    src/
    api/                          Vercel server entry surface
    uploads/                      runtime media; some files tracked
    node_modules/
    .vercel/
    package.json
    vercel.json
  responsive-shots/               tracked browser screenshots
  .chrome-*/                      local browser-profile artifacts
  .codex-logs/                    local logs
  .next/                          unrelated/generated framework artifact
  node_modules/                   root dependencies without root package manifest
  *.md                            architecture and foundation documentation
  *.log                           runtime/development logs
```

The repository is operationally a two-application repository, but it is not configured as a
formal workspace or monorepo. There is no root `package.json` that owns common commands,
dependency policy, linting, testing, or CI orchestration.

## Frontend Structure

```text
client/src/
  app/                            foundation boundary; lightly used
  assets/                         static application assets
  components/
    admin/                        admin-specific UI
    challenges/                   challenge forms, cards, workflow UI
    common/                       shared cross-feature UI
    dashboard/                    client/provider dashboard compositions
    executionPlans/               plan creation, review, decision UI
    firstClient/                  first-client workflow UI
    matches/                      matching and recommendation UI
    navigation/                   sidebars and topbars
    opportunities/                provider pipeline UI
    outcomeOffers/                outcome-offer UI
    profile/                      owner and public profile sections
    proof/                        proof asset/readiness UI
    providers/                    discovery, compare, selection, save UI
    sections/                     component section boundary
    settings/                     settings-specific UI
    ui/                           canonical reusable UI primitives
    workspace/                    client workspace UI
    *.jsx                         legacy/shared component entry points
  constants/
    apiEndpoints.js               centralized endpoint constants
    designTokens.js               visual tokens
    navigation.js                 navigation definitions
    queryKeys.js                  query key foundation
    routes.js                     route constants and helpers
  features/
    admin/
    auth/
    challenges/
    dashboard/
    executionPlans/
    firstClient/
    matches/
    opportunities/
    outcomeOffers/
    profile/
    proof/                        currently not an active ownership boundary
    proofAssets/
    providers/
    savedProviders/
    social/
  hooks/                          shared and legacy hooks
  layouts/                        public, auth, dashboard, admin, workspace shells
  lib/                            foundation boundary; lightly used
  pages/                          route-level page orchestration
  routes/                         AppRoutes and route guards
  sections/                       homepage and marketing compositions
  services/
    apiClient.js                  canonical Axios client
    api.js                        legacy aggregate API facade
    queryClient.js                React Query client
    socket.js                     realtime client foundation
  store/                          Zustand session/UI/realtime state
  styles/                         token and typography CSS
  utils/                          cross-feature utilities and formatters
  App.jsx
  main.jsx
  styles.css                      large global stylesheet
```

## Backend Structure

```text
server/src/
  config/
    db.js                         MongoDB connection and index repair
    env.js                        environment validation
    loadEnv.js
  constants/
    index.js                      broad shared constants
    roles.js
    statuses.js
    subscriptionPlans.js
  controllers/                    HTTP adapters
  jobs/                           background-job definitions
  middleware/
    auth and roles
    validation
    security and sanitization
    upload
    errors and request logging
  models/                         Mongoose models and compatibility aliases
  routes/
    v1/                           newer ProofArena/versioned routes
    *.js                          legacy and shared routes
  services/                       domain and platform business logic
  socket/                         Socket.IO server and message events
  utils/                          response, error, logging, and async helpers
  validators/                     Zod plus legacy express-validator contracts
  workers/                        queue worker startup
  app.js                          middleware and route composition
  server.js                       database, workers, HTTP, realtime, shutdown
```

## Runtime And Deployment Topology

```text
Browser
  -> Vite React client
      -> Axios apiClient
          -> Express API (/api and /api/v1)
              -> controllers
                  -> services
                      -> Mongoose models
                          -> MongoDB
              -> Socket.IO
              -> BullMQ/Redis or memory queue
              -> Stripe
              -> Cloudinary/local uploads
              -> SMTP/email
```

The backend is a modular monolith with embedded realtime and worker startup. That is an
appropriate architecture for the current product stage, but worker and realtime lifecycle
ownership will need clearer deployment boundaries as load grows.

# Architecture Assessment

## Architecture Score

| Dimension | Score | Rationale |
| --- | ---: | --- |
| Scalability | 6/10 | Domain breadth, indexes, queues, realtime, and layered services provide a viable base. Large services, startup index mutation, dual APIs, client-composed dashboards, and absent load/contract tests limit safe scale. |
| Maintainability | 5/10 | Central constants, layouts, feature hooks, and service layers help. Compatibility aliases, oversized files, naming drift, route ownership ambiguity, and no regression suite make changes expensive. |
| Performance | 6/10 | Lazy routes, React Query caching, compression, indexes, and isolated 3D chunks are positive. The approximately 890 kB minified 3D chunk, broad pages, potentially chatty dashboards, and missing performance budgets remain risks. |
| Modularity | 6/10 | Newer ProofArena domains generally follow clear frontend and backend layers. Legacy aggregate APIs, model/controller exceptions, cross-domain mega-services, and mixed module conventions weaken enforceable boundaries. |
| Developer Experience | 4/10 | Documentation and centralized constants are improving, but there is no root workspace orchestration, test suite, CI, generated contracts, canonical import enforcement, or clean repository state. |

**Overall architecture readiness: 5.4/10**

This score means the application is capable and extensible, but additional product stages
should not continue at the current rate without first adding regression protection and
canonical boundaries.

## Architectural Style

### Frontend

The intended data path is:

```text
API client -> feature service -> React Query hook -> page/component
```

This pattern is correctly represented by 14 feature services and 13 feature hook groups.
React Query is the dominant server-state mechanism. Zustand is appropriately limited to auth,
UI, socket, and notification state.

The main deviation is `client/src/services/api.js`, a 671-line aggregate facade still serving
legacy surfaces. Pages also carry substantial workflow orchestration and derived-state logic.

### Backend

The intended dependency direction is:

```text
route -> controller -> service -> model
```

Newer ProofArena domains largely follow this rule. Routes do not directly import services or
models. Services do not import routes or controllers. The observed controller-layer exception
is `adminController.js`, which imports `Connection`, `Conversation`, and `Message` models
directly.

The backend currently combines domain logic, external integration adapters, realtime,
background jobs, and read-model composition under `services/`. This works today but will
become difficult to govern without clearer platform and domain boundaries.

## Frontend Findings

### Strong Foundations

- `AppRoutes.jsx` centralizes lazy-loaded public, auth, dashboard, client, provider, and admin
  routes with role guards.
- Public, auth, dashboard, and admin layouts have explicit shell ownership.
- `apiClient.js` centralizes credentials, auth headers, refresh behavior, errors, timeouts, and
  production URL safeguards.
- API endpoint constants, route constants, navigation constants, design tokens, and query-key
  foundations exist.
- Feature services cover auth, profile, challenges, execution plans, matches, providers,
  saved providers, outcome offers, proof assets, opportunities, first-client mode, social,
  admin, and dashboards.
- No direct Axios calls were found in page/component code. Profile media components import
  only a realtime URL helper from the API client.
- The application has comprehensive client/provider/admin route coverage and professional
  empty/loading/error foundations.

### Frontend Risks

1. **Route file is a central change hotspot.**  
   `AppRoutes.jsx` owns all route declarations and lazy imports. It is readable now, but every
   future domain adds merge conflicts and cognitive load.

2. **Legacy aggregate API facade remains active.**  
   `services/api.js` is 671 lines and competes with feature services. It prevents a single
   enforceable data-access pattern.

3. **Pages own too much workflow logic.**  
   Examples include `LeadManagement.jsx` at 1,289 lines, `ProviderServices.jsx` at 890,
   `Marketplace.jsx` at 874, `Messages.jsx` at 781, and `RecommendedProviders.jsx` at 739.

4. **Shared UI ownership is ambiguous.**  
   Multiple public import paths exist for Button, Container, EmptyState, ErrorState,
   LoadingState, PageHeader, Footer, and auth hooks.

5. **Query-key ownership is not fully enforced.**  
   A centralized query-key file exists, but inline query keys remain possible and can cause
   cache invalidation drift.

6. **Global CSS is too broad.**  
   `styles.css` is 1,278 lines. Broad styling and arbitrary values make visual regressions and
   theme enforcement harder.

7. **Heavy media/3D path lacks a budget.**  
   The isolated ProofArena 3D ecosystem chunk is approximately 890 kB minified. Lazy loading
   helps, but no documented performance budget, mobile fallback policy, or automated bundle
   limit exists.

8. **Placeholder and complete page ownership overlap.**  
   Route shells coexist with full pages for some public destinations. This obscures which
   route experience is canonical.

## Backend Findings

### Strong Foundations

- Express application startup separates `app.js` from `server.js`.
- Environment configuration validates production requirements.
- Auth supports access/refresh tokens, cookies, roles, permissions, account status, email
  verification, and password reset foundations.
- Security middleware includes Helmet, CORS, compression, sanitization, rate limiting, request
  logging, and upload controls.
- The server has MongoDB models and indexes for a broad product surface.
- Background work supports BullMQ/Redis with a development memory fallback.
- Socket.IO messaging and notification foundations exist.
- Stripe billing and marketplace transaction foundations exist.
- Public provider/profile services contain public-safe sanitization logic.
- Newer ProofArena routes use Zod validation extensively.

### Backend Risks

1. **Two public API generations are mounted simultaneously.**  
   Most legacy routes are mounted under both `/api/*` and `/api/v1/*`, while newer ProofArena
   routes exist only under v1. This doubles the supported contract surface and complicates
   deprecation, monitoring, rate limiting, documentation, and incident response.

2. **Critical business logic is concentrated in mega-services.**  
   `userProfileService.js` is 2,086 lines, `providerSearchService.js` 1,361,
   `match.service.js` 1,179, and several other critical services exceed 600 lines.

3. **Models contain large, cross-cutting schemas.**  
   `UserProfile.js`, `Challenge.model.js`, and `ExecutionPlan.model.js` are substantial. Large
   aggregate documents can become migration, index, write-contention, and ownership risks.

4. **Index repair runs during application startup.**  
   `config/db.js` inspects and mutates ProviderProfile indexes when the API starts. Runtime
   schema repair is useful during development but unsafe as a long-term production migration
   strategy, especially with multiple instances.

5. **Unknown errors can expose internal messages.**  
   The central error handler returns `error.message` for unknown errors. Production responses
   should expose a generic message and a correlation ID while retaining detail only in logs.

6. **Controller boundary exception exists.**  
   `adminController.js` imports models directly, bypassing service ownership.

7. **Validation has two active systems.**  
   Zod is used broadly; contact routes use express-validator. This creates different error
   shapes and maintenance paths.

8. **Compatibility aliases and naming splits obscure canonical ownership.**  
   Plain names and dotted role suffixes coexist across models, routes, services, and
   controllers.

9. **A likely dead parallel challenge model exists.**  
   `OutcomeChallenge.model.js` has no references outside its own file while
   `Challenge.model.js` is active. It must be verified against stored collections before any
   removal.

10. **No formal data-migration system is visible.**  
    Schema/index changes, backfills, and destructive migrations need versioned, repeatable
    migration commands rather than startup repair.

11. **No durable domain-event/outbox architecture is visible.**  
    Notifications, analytics, matching updates, reputation events, and payment events need
    reliable post-transaction delivery as the product matures.

12. **Payment idempotency and auditability are not sufficiently demonstrated.**  
    Marketplace transactions and Stripe integrations exist, but there is no visible
    cross-domain idempotency standard, immutable financial ledger, or automated contract suite.

# Duplicate, Unused, And Inconsistent Systems

## Confirmed Duplicate Or Parallel Frontend Entry Points

| Parallel paths | Assessment | Required action |
| --- | --- | --- |
| `components/Button.jsx` and `components/ui/Button.jsx` | Compatibility/shared UI duplication | Declare `components/ui` canonical; migrate imports; retain alias temporarily. |
| `components/Container.jsx` and `components/ui/Container.jsx` | Compatibility/shared UI duplication | Same migration policy. |
| `components/EmptyState.jsx` and `components/ui/EmptyState.jsx` | Compatibility/shared UI duplication | Same migration policy. |
| `components/ErrorState.jsx` and `components/ui/ErrorState.jsx` | Ambiguous canonical implementation | Compare behavior, select canonical implementation, add import lint rule. |
| `components/LoadingState.jsx` and `components/ui/LoadingState.jsx` | Compatibility/shared UI duplication | Same migration policy. |
| `components/common/PageHeader.jsx` and `components/ui/PageHeader.jsx` | Ownership ambiguity | Keep one UI primitive; feature-specific wrappers should have explicit names. |
| `components/Footer.jsx` and `components/common/Footer.jsx` | Shared component duplication/alias | Define one public-layout owner. |
| `features/auth/useAuth.js` and `hooks/useAuth.js` | Hook compatibility alias | Standardize on feature-owned auth hook. |
| challenge and outcome-offer `SuccessCriteriaEditor.jsx` | Same name, potentially domain-specific | Keep separate unless contract and behavior are proven identical. |
| `services/api.js` and feature services | Real parallel service architecture | Migrate consumers incrementally; stop new imports from aggregate facade. |

No exact source-file hash duplicates were found. Most duplicate filenames are aliases or
domain-specific components, but their continued presence still creates architectural cost.

## Confirmed Duplicate Or Parallel Backend Entry Points

| Parallel paths | Assessment | Required action |
| --- | --- | --- |
| `/api/*` and `/api/v1/*` | Real duplicate public contracts | Inventory consumers, define deprecation window, converge on v1. |
| plain filenames and `*.model.js` aliases | Compatibility naming split | Choose one convention and migrate imports incrementally. |
| plain filenames and `*.service.js` aliases | Compatibility naming split | Choose one convention and migrate imports incrementally. |
| plain filenames and `*.controller.js` aliases | Compatibility naming split | Choose one convention and migrate imports incrementally. |
| Zod and express-validator | Active parallel validation systems | Use Zod for new work and migrate touched routes. |
| `Challenge.model.js` and `OutcomeChallenge.model.js` | Likely dead parallel model | Verify database and production references, then retire safely. |
| legacy and modern success response helpers | Response contract compatibility | Publish one response envelope and migrate call sites. |

## Unused Or Weakly Owned Boundaries

- `client/src/features/proof/` does not currently own the active proof implementation; proof
  behavior lives under proof assets, components, pages, and backend proof-asset modules.
- `client/src/app/` and `client/src/lib/` are foundation directories but do not yet own enough
  architecture to justify broad migration into them.
- `OutcomeChallenge.model.js` appears unused in source imports.
- Root `.next/` is unrelated to the active Vite application and should be treated as generated
  workspace residue.
- Root `node_modules/` has no root package manifest ownership.
- Browser profiles, responsive screenshots, logs, build outputs, and uploaded media are
  workspace/runtime artifacts rather than source architecture.

## Naming Violations

- Backend filenames mix `authService.js`, `auth.service.js`, `Challenge.model.js`,
  `ProviderProfile.js`, `profile.routes.js`, and legacy route names.
- Frontend uses both root shared components and `components/ui` or `components/common`.
- Some concepts use older marketplace terminology while ProofArena uses outcome/challenge
  terminology, increasing domain-language ambiguity.
- Public, owner, legacy, and provider profile routes overlap and require stronger naming and
  route ownership documentation.

# Capability Readiness

| Capability | Readiness | Existing foundation | Main gaps before scale |
| --- | --- | --- | --- |
| Authentication | Strong foundation | JWT access/refresh, cookies, auth store, refresh interceptor, roles, permissions, verification, password reset | Security/authorization tests, session audit trail, token rotation/reuse detection evidence, operational metrics |
| Marketplace | Functional but mixed-generation | services, categories, reviews, portfolios, payments, public discovery | Clarify relationship between legacy services marketplace and ProofArena outcome economy; consolidate APIs and language |
| Provider system | Strong foundation | provider profiles, public discovery, availability, proof, offers, matches, saved providers, dashboards | Canonical profile model, reputation lifecycle, provider organization/team model, contract tests |
| Client system | Strong foundation | challenges, plans, recommendations, shortlists, selection center, workspace, dashboard | Engagement lifecycle, decision audit, shared read models, permissions tests |
| Outcome offers | Strong foundation | model, routes, service, validation, owner/public UI | Versioning, purchase/engagement contract, archival policy, outcome completion linkage |
| Challenge system | Strong foundation | model, CRUD, quality, owner/public UI, matching integration | Explicit state machine, immutable transition log, concurrency rules, lifecycle tests |
| Execution plans | Strong foundation | model, routes, review/compare/select UI, provider/client workflows | State machine, selected-plan-to-engagement conversion, revision/version history, decision audit |
| Proof Vault | Partial-to-strong foundation | proof assets, readiness, attachments, public/private handling | Verified outcome aggregate, proof review workflow, chain of custody, verifier identity, immutable evidence policy |
| Reputation/trust | Early foundation | proof scores and trust metrics represented in profiles/discovery | Formal event model, explainable calculation, decay/recovery rules, anti-gaming, immutable reputation history |
| AI integrations | Not architected for production | placeholder AI extraction status and future markers | Provider abstraction, prompt/version registry, evaluation suite, safety policy, cost/rate controls, observability, human review |
| Payments | Functional foundation, high risk | Stripe billing, marketplace transactions, invoices, subscriptions, connected accounts | Automated webhook/contract tests, idempotency standard, immutable ledger, reconciliation, disputes/refunds, compliance review |
| Messaging | Functional foundation | conversations, messages, Socket.IO, auth, notifications | delivery/read guarantees, pagination/load tests, moderation, retention policy, attachment security, observability |
| Analytics | Basic foundation | analytics events, routes, service, admin exposure | event taxonomy, warehouse/export strategy, data governance, funnel definitions, privacy/retention, product observability |
| Admin/moderation | Functional foundation | admin routes, tables, verification and resource management | service-layer purity, audit logs, fine-grained permissions, review queues, immutable moderation history |
| Search/matching | Strong rule-based foundation | provider search, filters, matching records and reasons | dedicated search index strategy, offline evaluation, feedback loops, explainability contracts, future AI boundary |
| Notifications | Functional foundation | persistent notifications and socket delivery | durable event delivery, preferences, retry/dead-letter policy, notification taxonomy |
| Background work | Basic production foundation | BullMQ/Redis and memory fallback, workers | job registry, idempotency, retry policy, DLQ operations, metrics, worker deployment separation |

# Critical Issues

## P0: Resolve Before High-Risk Product Expansion

1. **No automated regression suite or CI quality gate**  
   Authentication, authorization, public/private data, payments, messaging, challenge
   transitions, and proof workflows cannot be changed safely without tests.

2. **Tracked runtime and browser artifacts**  
   At least 29 runtime artifacts are tracked, including responsive screenshots and uploaded
   media. Browser profile directories also exist locally. Browser profiles can contain
   session, history, cookie, and machine-specific data and require a reviewed security cleanup.

3. **Dual API contracts without a deprecation policy**  
   `/api/*` and `/api/v1/*` coexist. Every new endpoint or contract change compounds future
   migration cost.

4. **Production error-message exposure**  
   Unknown internal error messages are returned to clients. Production should return a generic
   error plus a correlation ID.

5. **High-risk payment and trust flows lack demonstrated safeguards**  
   Payments, proof verification, provider selection, and future reputation changes need
   idempotency, audit history, transition rules, and automated integration tests before they
   become financially or reputationally authoritative.

## P1: Resolve Before Scaling Teams And Domains

1. Oversized frontend pages and backend services create high regression and merge-conflict risk.
2. Compatibility aliases obscure canonical import ownership.
3. Legacy aggregate frontend API calls compete with feature services.
4. Startup-time index repair is not a durable migration strategy.
5. Backend naming conventions and validation systems are split.
6. No API schema/OpenAPI/generated-contract source exists.
7. No durable domain-event/outbox strategy exists.
8. No formal audit-log architecture exists for critical state changes.
9. Missing engagement, milestone, verified-outcome, and proof-review lifecycle aggregates leave
   a gap between provider selection and trusted completion.
10. AI integration boundaries, evaluations, policies, and cost controls are absent.
11. Observability lacks explicit traces, correlation IDs, SLOs, domain metrics, and runbooks.
12. Dashboard/workspace data is likely composed from multiple client queries instead of stable
    backend read models.

## P2: Resolve Incrementally

1. Global CSS and arbitrary styling weaken token enforcement.
2. The 3D/homepage bundle needs explicit budgets and mobile fallback policy.
3. Route ownership and route-shell ownership need consolidation.
4. Root workspace commands and dependency policy are missing.
5. Empty or weakly owned folders communicate misleading architecture.
6. Constants modules need domain ownership rather than continued growth.

# Recommended Architecture For The 50-Stage Roadmap

## Core Decision: Evolve A Modular Monolith

Do not split ScaleOps and ProofArena into separate projects or microservices now.

The recommended target is:

- one repository;
- one product identity with ScaleOps as parent and ProofArena as flagship domain;
- independently deployable web, API, and worker applications when operationally useful;
- shared contracts and platform packages;
- domain modules with enforced dependency direction;
- event-ready internals without requiring distributed infrastructure prematurely.

Service extraction should occur only when at least one of these is true:

- independent scaling is measured and necessary;
- a domain has a dedicated owning team;
- availability/security/compliance isolation is required;
- deployment cadence materially differs;
- the modular-monolith boundary has already been proven.

## Exact Future Repository Structure

This is a target structure, not a recommendation for a blind bulk move.

```text
scaleops/
  apps/
    web/                                  future home of current client
      src/
        app/
          providers/
          router/
          App.jsx
          main.jsx
        features/
          auth/
          profiles/
          providers/
          clients/
          marketplace/
          challenges/
          execution-plans/
          engagements/
          milestones/
          proof/
          reputation/
          matching/
          messaging/
          billing/
          analytics/
          admin/
          proofarena/
        entities/
          user/
          provider/
          client/
          challenge/
          execution-plan/
          engagement/
          milestone/
          proof-record/
          reputation-event/
        shared/
          api/
          config/
          hooks/
          lib/
          state/
          styles/
          ui/
        pages/
        layouts/
    api/                                  future home of current server API
      src/
        app.js
        server.js
        platform/
          auth/
          database/
          errors/
          events/
          jobs/
          observability/
          payments/
          realtime/
          search/
          storage/
          email/
          ai/
        modules/
          identity/
          profiles/
          providers/
          clients/
          marketplace/
          challenges/
          execution-plans/
          engagements/
          milestones/
          proof/
          reputation/
          matching/
          messaging/
          billing/
          analytics/
          admin/
        read-models/
          client-dashboard/
          provider-dashboard/
          client-workspace/
          provider-discovery/
          admin-overview/
        migrations/
        scripts/
    worker/
      src/
        consumers/
        jobs/
        schedules/
        index.js
  packages/
    contracts/
      http/
      events/
      schemas/
      generated/
    config/
      eslint/
      environment/
      build/
    observability/
    testing/
      factories/
      fixtures/
      contract/
    ui/
      primitives/
      tokens/
  docs/
    architecture/
      adr/
      domains/
      diagrams/
    api/
    runbooks/
    security/
  tooling/
    migrations/
    scripts/
  .github/
    workflows/
  package.json
```

The current `client/` and `server/` roots should remain in place until tests and workspace
orchestration make a move safe. Renaming folders is not an architectural improvement by itself.

## Recommended Frontend Domain Template

```text
features/challenges/
  api/
    challengeService.js
    challengeKeys.js
  components/
  hooks/
  model/
    challengeSelectors.js
    challengeState.js
  routes/
    ChallengeRoutes.jsx
  utils/
  index.js
```

Rules:

- pages compose feature capabilities; they do not own reusable business rules;
- components do not call API clients directly;
- server data lives in React Query;
- local interaction/session state lives in Zustand only when it spans components;
- route groups are registered by domain into the app router;
- shared UI contains only domain-neutral primitives;
- domain terminology is explicit: `PublicProviderCard`, `OwnerChallengeCard`, and
  `ClientPlanDecisionPanel` are preferable to ambiguous generic names.

## Recommended Backend Domain Template

```text
modules/challenges/
  challenge.routes.js
  challenge.controller.js
  challenge.service.js
  challenge.repository.js
  challenge.model.js
  challenge.validator.js
  challenge.policy.js
  challenge.transitions.js
  challenge.events.js
  challenge.queries.js
  index.js
```

Rules:

- routes own HTTP paths and middleware composition;
- controllers translate HTTP requests/responses only;
- services execute use cases and transactions;
- repositories own persistence queries when query complexity or testability justifies them;
- models define persistence schemas, not cross-domain orchestration;
- policies own authorization decisions;
- transition modules own legal state changes;
- events describe durable facts after successful state changes;
- queries/read models optimize cross-domain dashboards and discovery;
- platform adapters own Stripe, Cloudinary, email, queues, realtime, AI, and observability.

## Required Missing Domain Foundations

To support the full roadmap, the architecture needs explicit first-class domains for:

### Engagements

The durable contract created when a client selects a provider and execution plan. It should
link challenge, selected plan, client, provider, commercial terms, lifecycle status, and
transition history.

### Milestones

The execution units under an engagement. They should own deliverables, due dates, acceptance
criteria, proof requirements, status transitions, and revision history.

### Verified Outcomes

The immutable result of an approved proof-review process. A verified outcome should reference
the engagement, milestone, submitted evidence, verifier, decision, and reputation effects.

### Reputation Events

Append-only facts such as accepted outcome, late delivery, rejected proof, successful dispute
resolution, or verified reliability. Current scores should be projections derived from events,
not silently mutable truth.

### Audit Events

Append-only security and business audit events for privileged, financial, moderation, proof,
and reputation changes.

### Domain Events And Outbox

Reliable events emitted in the same transaction as business state changes, then delivered to
notifications, analytics, matching, reputation projections, and external integrations.

## API And Contract Strategy

1. Declare `/api/v1` canonical.
2. Inventory every active legacy `/api` consumer.
3. Publish a deprecation policy and sunset dates.
4. Define request/response contracts using the existing Zod foundation.
5. Generate or validate OpenAPI from those contracts.
6. Share stable contract schemas with the client through a contracts package or generated
   client.
7. Standardize success, pagination, validation-error, authorization-error, and unknown-error
   envelopes.
8. Add correlation IDs and structured error codes.
9. Never expose raw Mongoose documents as public contracts.
10. Version high-risk workflow and reputation contracts explicitly.

## State And Data Strategy

- Keep MongoDB while document access patterns remain appropriate.
- Create explicit aggregate ownership to prevent uncontrolled cross-document mutation.
- Add versioned migration scripts and stop production index repair during API startup.
- Use transactions for multi-document critical changes where MongoDB topology supports them.
- Add optimistic concurrency/version fields for contested workflow decisions.
- Store immutable audit, payment, proof, and reputation events separately from mutable
  projections.
- Introduce read models for dashboard, workspace, provider discovery, and admin reporting.
- Define retention, deletion, export, and privacy rules before reputation/proof data becomes
  permanent.
- Add a search index only when MongoDB search/filter performance is measured as insufficient.
- Build a warehouse/event export path before analytics becomes a decision-critical system.

## AI Architecture Strategy

AI should be a platform adapter, not embedded ad hoc inside domain services.

```text
platform/ai/
  aiGateway.js
  providers/
  prompts/
  policies/
  evaluations/
  telemetry/
  costControls/
```

Every AI use case must define:

- input and output contract;
- source-data permission policy;
- prompt/model version;
- deterministic fallback;
- human-review requirements;
- evaluation dataset and acceptance thresholds;
- latency and cost budget;
- PII/redaction rules;
- audit and observability fields;
- behavior when the provider is unavailable.

AI-generated recommendations must never directly mutate proof, reputation, payments, or
selection state without deterministic validation and authorized human confirmation.

## Reliability, Security, And Observability Strategy

- Add structured logs with request, user, domain entity, and correlation IDs.
- Add traces across HTTP, database, queue, realtime, Stripe, Cloudinary, email, and AI calls.
- Define SLOs for auth, discovery, challenge publishing, plan submission, provider selection,
  proof submission, messaging, and payment webhooks.
- Add alerting and runbooks for queue failures, webhook failures, notification failures,
  database saturation, auth anomalies, and payment reconciliation.
- Add an immutable audit log for admin, payment, proof, reputation, privacy, and role changes.
- Add dependency scanning, secret scanning, code scanning, and artifact scanning in CI.
- Add permission-matrix tests for client, provider, admin, owner, public, suspended, and
  unauthenticated states.
- Add rate-limit and abuse strategies per domain rather than only globally.

# Migration Plan

## Phase 1: Stabilize And Protect

**Goal:** make the current system safe to change without altering product behavior.

Recommended duration: 4-8 weeks, performed alongside only low-risk feature work.

### Repository And Ownership

1. Review and remove tracked runtime artifacts, uploaded media, logs, and browser profiles.
2. Assess whether browser-profile material ever contained sensitive session data; rotate
   credentials or tokens if required.
3. Add a root workspace manifest with non-destructive commands for client/server lint, build,
   test, and development.
4. Declare canonical paths for UI primitives, feature services, routes, models, services,
   controllers, validators, and constants.
5. Add architecture decision records for modular-monolith direction, API versioning, naming,
   and ProofArena domain ownership.

### Regression Protection

1. Add CI for client lint/build, server import/start validation, tests, dependency audit, and
   secret scanning.
2. Add route-contract smoke tests for every public and protected API surface.
3. Add authorization-matrix integration tests.
4. Add critical end-to-end tests for login, public provider discovery, challenge creation,
   execution plan submission/review, provider selection, messaging, and payments.
5. Add payment webhook and idempotency tests before changing payment behavior.

### Security And Operations

1. Harden unknown production errors and add correlation IDs.
2. Establish structured logging, request metrics, and basic alerts.
3. Move index repair into versioned migration scripts.
4. Document backup, restore, migration, and rollback procedures.
5. Add performance budgets for route chunks, 3D assets, and critical API latency.

### Phase 1 Exit Criteria

- CI blocks regressions.
- Critical routes and permissions have tests.
- Runtime artifacts are no longer tracked.
- Canonical ownership and API version policy are documented.
- Production errors do not expose internals.
- Database changes use versioned migrations.

## Phase 2: Consolidate Domains And Contracts

**Goal:** remove architectural ambiguity without a rewrite.

Recommended duration: 2-6 months, migrated domain by domain.

### Frontend

1. Stop new imports from `services/api.js`.
2. Migrate legacy consumers to feature services and React Query hooks.
3. Split large pages into route orchestration, feature hooks, selectors, and focused
   components.
4. Register routes by domain while retaining a single app router.
5. Consolidate UI aliases after usage scans and test coverage.
6. Enforce centralized query keys and API endpoint constants.
7. Reduce global CSS and enforce token usage.

### Backend

1. Make `/api/v1` canonical and deprecate duplicate legacy mounts with telemetry.
2. Standardize response and validation contracts.
3. Move direct admin model access into services.
4. Split mega-services by use case, query, policy, and external adapter.
5. Establish versioned migrations and remove startup schema repair.
6. Verify and retire dead aliases/models only after database and production evidence.
7. Add engagement, milestone, verified-outcome, reputation-event, and audit-event aggregates.
8. Add domain transitions, policies, events, and an outbox.
9. Build stable read models for client/provider dashboards and workspaces.

### Phase 2 Exit Criteria

- One canonical frontend service path exists per domain.
- One canonical versioned API surface exists.
- High-risk domains have explicit state machines, policies, audit history, and contracts.
- Client/provider dashboards consume stable read models.
- Oversized modules are reduced without behavior loss.

## Phase 3: Platformize Based On Measured Scale

**Goal:** prepare ScaleOps/ProofArena for high volume, multiple teams, AI, and trust authority.

Recommended duration: 6-18 months and ongoing.

### Operational Separation

1. Deploy API, workers, and realtime processes independently when traffic requires it.
2. Add durable queue retry, dead-letter, replay, and job-observability operations.
3. Extract services only from already-proven modular boundaries.
4. Add search infrastructure based on measured discovery/matching needs.
5. Add warehouse/event-stream exports for analytics and model training.

### Trust And AI Platform

1. Build immutable proof, outcome, reputation, and trust event histories.
2. Add explainable reputation projections and anti-gaming controls.
3. Build AI gateway, prompt registry, evaluations, policy enforcement, cost controls, and
   human-review workflows.
4. Use verified outcome data for matching and forecasting only after governance and quality
   thresholds are established.

### Enterprise And Governance

1. Add organization/team tenancy only when real product requirements demand it.
2. Add data governance, retention, export, deletion, and regional policies.
3. Add security reviews, threat modeling, penetration testing, and compliance controls.
4. Define team ownership, on-call responsibilities, SLOs, and domain runbooks.

### Phase 3 Exit Criteria

- Scale-sensitive components deploy independently where justified.
- Trust and reputation are auditable, explainable, and resistant to manipulation.
- AI features are evaluated, governed, observable, and reversible.
- Analytics and operational decisions rely on governed event data.
- New stages can be implemented inside explicit domain boundaries without central-file growth.

# Immediate Recommended Next Action

Do not begin with folder moves or service extraction.

The next architecture action should be a **stabilization milestone**:

1. create a root-level quality command and CI workflow;
2. add baseline API contract and authorization tests;
3. harden error responses and add correlation IDs;
4. clean tracked runtime artifacts through a reviewed security procedure;
5. document canonical API/import/naming ownership;
6. add a migration registry for legacy aliases and `/api` routes.

Once these protections exist, migrate one bounded vertical slice, preferably challenges or
saved providers, through the target pattern. Use that migration to validate the module
template before applying it to payments, messaging, proof, or reputation.

## Final Conclusion

ScaleOps can support ProofArena and the planned roadmap. A separate project or rewrite would
discard valuable working systems and introduce unnecessary risk.

The platform's strongest assets are its broad domain implementation, generally healthy
backend dependency direction, centralized frontend infrastructure, mature provider/client
workflows, and existing operational adapters.

Its largest risks are insufficient regression protection, ambiguous canonical ownership,
duplicate API contracts, oversized critical modules, missing lifecycle/audit foundations, and
repository hygiene.

The long-term architecture should remain one ScaleOps platform with ProofArena as a flagship
domain, evolved deliberately into a contract-driven modular monolith with event-ready
internals, explicit trust/reputation aggregates, governed AI adapters, and measured service
extraction.
