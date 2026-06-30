# Shared Service Helper Governance

This existing folder contains narrow, transport-neutral helpers used by multiple module services. It is not an API client or a global business-service layer.

## Allowed Contents

- Pure query-string construction from caller-provided values.
- Neutral collection/result transformations after the platform API client has handled transport and global response behavior.
- Product-agnostic helpers with at least two independent module consumers.

## Forbidden Contents

- `axios.create`, raw HTTP client construction, fetch wrappers, base URL resolution, retries, interceptors, token storage, token refresh, or authorization headers.
- Global error/response policy or API versioning.
- Module endpoint ownership, domain normalization, pricing, proof, challenge, matching, profile, payment, admin, or auth business rules.
- Imports from feature modules, module services, UI code, routes, navigation, configuration, environment readers, or backend runtime files.
- Cross-module workflow orchestration.

## Required Platform Reuse

Module API adapters and services must continue using `client/src/services/apiClient.js` as the canonical ScaleOps HTTP transport. These helpers may process values supplied to or returned from that client, but must never replace it.

## Promotion and Consumer Requirements

- At least two independent real module consumers must need the same stable helper.
- The helper must remain pure, product-agnostic, and acyclic.
- Inputs, outputs, owner, allowed contents, forbidden contents, rollback, and tests must be documented.
- Client-instantiation, token/base URL, reverse-import, lint, build, boundary, and risk-appropriate tests must pass before production changes.

## Examples

Belongs here after approval: generic query-string serialization or collection extraction from an already-normalized result.

Must remain module-owned: an offers endpoint adapter, challenge response mapper, payment workflow, admin mutation, auth refresh flow, or profile-specific transformation.

## Stop Conditions

Stop if a helper needs the API client instance, module types/services, auth/session state, environment configuration, sensitive payment/admin behavior, or domain-specific branching. Stop if consumer independence or ownership cannot be proved.

This README is documentation-only and does not change runtime behavior.

