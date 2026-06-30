# Approved Shared Library Catalog

These are approved categories, not approved folder-creation actions.

| Category | Purpose | Allowed | Forbidden | Import/ownership rules | Approval conditions |
|---|---|---|---|---|---|
| `shared/ui` | Generic visual primitives | Buttons, inputs, cards, modal, generic states | Feature components, shells, nav, auth/API logic | May import styling/shared types only; shared owner | 2+ consumers, accessible, tested |
| `shared/hooks` | Generic reusable React behavior | Debounce, media query, click outside | Module state, auth/session, routes, API clients | No feature imports | 2+ modules, generic name/tests |
| `shared/utils` | Pure cross-module helpers | Formatting, strings, pure transformations | Side effects, feature rules, auth/API/route policy | No module imports | 2+ consumers, purity/tests |
| `shared/types` | Cross-module data contracts | Stable common primitives/contracts | Single-module types, route/auth/API duplicates | No runtime imports | 2+ consumers and owner |
| `shared/constants` | Truly cross-module immutable values | Generic limits/labels only | Routes, roles, endpoints, env, module statuses | Platform catalogs stay platform-owned | Cross-module proof and review |
| `shared/validation` | Reused neutral schemas | Generic primitives or coordinated contracts | Auth/security/domain-only rules | No feature implementation imports | Frontend/backend contract evidence |
| `shared/config-readers` | Approved read-only config access | Existing normalized readers only | Env mutation, module config, deployment policy | Platform-owned API | Explicit Stage 6 approval |
| `shared/test-utils` | Cross-module test helpers | Render factories, neutral fixtures | Production mocks/fake business systems | Test-only imports | Test framework exists and 2+ users |

