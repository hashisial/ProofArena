# Stage 3.3 Shared Library Approval Rulebook

## Section Coverage

### 1. Global Shared-Code Rules

Rules `SHR-001`, `SHR-002`, `SHR-013`, `SHR-014`, and `SHR-015` define qualification, ownership, dependency, platform, and stop controls.

### 2. Shared UI Rules

Rule `SHR-003` limits shared UI to accessible product-agnostic primitives.

### 3. Shared Hook Rules

Rule `SHR-004` prohibits module, auth, route, and API ownership in shared hooks.

### 4. Shared Utility Rules

Rule `SHR-005` requires purity or explicit platform approval.

### 5. Shared Type Rules

Rule `SHR-006` protects identity, role, payment, route, and API contract authority.

### 6. Shared Validation Rules

Rule `SHR-007` permits only neutral validation primitives.

### 7. Shared API Helper Rules

Rule `SHR-008` prohibits transport ownership and duplicate API clients.

### 8. Shared Service Rules

Rule `SHR-009` prevents a hidden global business layer.

### 9. Shared Design-Token Rules

Rule `SHR-010` keeps token authority with the ScaleOps platform.

### 10. Shared Test-Helper Rules

Rule `SHR-011` requires an established framework and real test consumers.

### 11. Module-to-Shared Promotion Rules

Rule `SHR-012` requires all promotion gates and behavior-neutral extraction.

### 12. Stop Conditions

Rule `SHR-015` blocks implementation when ownership, evidence, validation, or approval is incomplete.

## Rule Details

| ID | Section | Rule | Reason | Required docs | Forbidden action | Required validation | Stop condition |
|---|---|---|---|---|---|---|---|
| SHR-001 | Global | Shared code must be product-agnostic and have at least two independent real consumers. | Shared ownership is justified by stable reuse, not possibility. | Stage 3.1 ownership lock; Stage 3.2 internal lock; promotion criteria | Promote one-module or roadmap-only code | Consumer and semantic comparison | Consumer independence or generic semantics is unknown |
| SHR-002 | Global | Every shared artifact must have a named owner and explicit allowed/forbidden scope. | A folder name is not governance. | Candidate map; decision matrix | Create an ownerless shared folder | Owner approval and scope review | Owner is absent |
| SHR-003 | Shared UI | Shared UI may contain product-agnostic accessible primitives only. | Feature composition belongs to modules; shells belong to platform. | Component ownership lock; candidate map | Add module cards, dashboards, nav, auth, or API behavior | Import, prop, accessibility, and visual regression review | Component imports module/platform policy |
| SHR-004 | Shared hooks | Shared hooks must provide generic React/browser behavior and must not import modules. | Hooks can hide state, API, auth, and route ownership. | Hook ownership lock; dependency map | Add module state, service calls, auth/session, route ownership | Consumer map, dependency scan, hook tests | Feature import or platform-policy behavior appears |
| SHR-005 | Shared utilities | Shared utilities must be pure or explicitly platform-approved. | Generic utility roots otherwise hide side effects and domain logic. | Service/type locks; anti-pattern register | Add module calculations, env reads, API/auth/route policy | Purity, side-effect, consumer, and naming review | Side effect or domain rule is detected |
| SHR-006 | Shared types | Shared types must represent stable cross-module primitives and cannot duplicate authoritative identity/payment/role/API contracts. | Duplicate contracts create security and drift risk. | Type ownership lock; API lock | Introduce another User, Profile, Role, Payment, route, or response wrapper type | Cross-repo type inventory and contract-owner approval | Authoritative contract is unknown |
| SHR-007 | Shared validation | Shared validation may contain neutral primitives only; module and security schemas remain with their owner. | Validation encodes business and security policy. | Type/service locks; decision matrix | Move auth/payment/module schemas to shared | Frontend/backend authority and rule comparison | Validation weakens or duplicates backend enforcement |
| SHR-008 | Shared API helpers | Shared API helpers may transform already-normalized values but cannot own transport. | Helpers must not become a second API client. | Final API adapter lock; Stage 2 API/auth lock | Instantiate clients or own base URL, tokens, retries, global errors, versioning | Confirm sole client instance and canonical error handling | Any transport policy appears |
| SHR-009 | Shared services | Shared services are limited to neutral technical helpers and must not orchestrate business workflows. | A global business layer obscures module boundaries. | Service ownership lock; interdependency lock | Import private module services or coordinate cross-module use cases | Import graph and responsibility review | Shared service needs module knowledge |
| SHR-010 | Design tokens | Design tokens remain ScaleOps platform-owned even when broadly consumed. | Platform design authority is not generic shared ownership. | Platform ownership lock | Create module/shared token forks | Token-source scan and visual validation | Second source of design truth is proposed |
| SHR-011 | Test helpers | Shared test helpers require an established test framework and two real test-suite consumers. | Test architecture must follow actual tooling. | Repository scripts; candidate map | Create production mocks or speculative test utility folders | Test-only import and consumer validation | Framework or consumers do not exist |
| SHR-012 | Promotion | Promotion must pass all criteria and separate extraction from behavior changes. | Behavior-neutral moves are reviewable and reversible. | Promotion criteria; approval gate; risk register | Mix move, refactor, rename, and behavior change | Before/after build, lint, tests, boundary scan, rollback proof | Any gate fails or validation is unavailable for the risk |
| SHR-013 | Dependency | Modules may import approved shared APIs; shared must never import module implementations. | One-way dependency prevents cycles and ownership inversion. | Dependency direction map | Add shared-to-feature/module imports | Boundary script and targeted reverse-import search | Reverse dependency or cycle appears |
| SHR-014 | Platform | Shared code must not own or duplicate router, navigation, dashboard/layout, auth/role, API client, config/env, DB, response/error, design-system, or docs governance. | These are locked ScaleOps platform systems. | Stage 2 locks; Stage 3 platform lock | Repackage platform architecture as shared | Platform source-of-truth comparison | Proposed shared artifact changes platform authority |
| SHR-015 | Stop conditions | Unclear ownership, weak evidence, sensitive behavior, missing tests, or missing human approval blocks implementation. | Unknown is safer than ungoverned promotion. | All Stage 3.3 control docs | Proceed on assumption or create placeholder shared code | Record UNKNOWN/BLOCKED and escalate | Any required evidence remains unknown |

## Enforcement

1. Apply the promotion criteria before creating or moving any shared artifact.
2. Run `check:boundaries`, lint, build, and risk-appropriate tests when production work is later authorized.
3. Re-scan for shared-to-module imports and additional HTTP client instances.
4. Record human approval for auth, payment, admin, config, API, identity/type, and design-system scope changes.
5. Do not create a barrel export unless an existing convention and stable public API are both proven.
