# Stage 3.2 to Stage 3.3 Handoff Brief

## Established

- Ten modules have bounded internal ownership for components, hooks, services, contracts/types, API adapters, constants, utils and validation.
- Current feature services remain executable request boundaries and use the canonical platform client.
- Platform routing, auth, navigation, shells, API client, backend runtime/DB/config/errors and design system remain outside modules.
- Zero internal folders or READMEs were created.

## Shared Candidates

Only stable, product-agnostic primitives/hooks/types/pure utilities/request helpers with at least two real consumers may be considered. Candidates include generic UI primitives, neutral query mapping, pure formatting and stable platform-neutral contracts after consumer analysis.

## Never Shared

Module business rules, module hooks/services/adapters, auth/session/roles, route/navigation/shell policy, API client/base/token/errors, payment/provider/security behavior, admin permissions, private proof/profile data logic, backend models or config/env.

## Stage 3.3 Risks

- Feature-specific components promoted into shared UI too early.
- Product hooks/services/types placed in shared roots.
- Shared code importing modules or creating cycles.
- Platform API client/auth/payment/admin logic duplicated in shared utilities.
- Promotion without two consumers, stable abstraction, tests and owner.

## Required Reading and Scope

Read Stage 3.2 final locks, verification reports, risk/violation/acceptance/human/readiness docs, Stage 3.1 platform/module locks, Stage 2 prevention locks, ADR-0001 and Stage 1 shared/critical controls.

Stage 3.3 begins documentation-only. Do not move files, rewrite imports, create shared folders/barrels, alter runtime behavior or promote code without evidence.

**Shared libraries must not become dumping grounds for module-specific business logic.**

