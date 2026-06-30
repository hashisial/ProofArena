# Shared UI Governance

This existing folder contains reusable client-side UI primitives. It is not a general destination for feature or platform code.

## Allowed Contents

- Product-agnostic visual primitives with at least two real consumers.
- Generic form controls and loading, empty, error, skeleton, modal, and feedback primitives.
- Presentation behavior expressed through props and callbacks.
- Styling through the approved ScaleOps design tokens and existing utility conventions.

## Forbidden Contents

- Module business logic, module services, API adapters, data fetching, or response normalization.
- Auth/session/token, role/permission, payment, admin-mutation, or private-data behavior.
- Route declarations, route constants, redirects, navigation configuration, dashboard shells, sidebars, or layouts.
- New HTTP clients, base URL handling, environment reads, or backend-only imports.
- Feature-specific cards, forms, workflows, copy, or validation rules.

## Existing Platform-Sensitive Exceptions

`Breadcrumbs.jsx`, `PageHeader.jsx`, and `UniversalBackButton.jsx` currently depend on platform routing metadata. Their location does not make route behavior shared UI. Do not copy or expand that pattern. Any relocation requires a separately approved, tested migration.

## Promotion and Consumer Requirements

- At least two independent real consumers must need the same stable abstraction.
- The abstraction must be product-agnostic and have a named shared UI owner.
- Shared UI must not import feature modules.
- Shared UI may import only lower-level neutral helpers and approved design-token interfaces.
- Accessibility, visual behavior, lint, build, boundary, and risk-appropriate tests must pass before production changes.

## Examples

Belongs here after approval: a generic button, input, modal, spinner, or caller-configured empty state.

Must remain module-owned: an offer card, challenge application form, proof summary, payment panel, profile workflow, or admin moderation control.

## Stop Conditions

Stop if ownership, consumers, accessibility behavior, dependency direction, or platform/module separation is unclear. Stop immediately if a proposed component imports module services, auth state, routing policy, API transport, or sensitive payment/admin logic.

This README is documentation-only and does not change runtime behavior.

