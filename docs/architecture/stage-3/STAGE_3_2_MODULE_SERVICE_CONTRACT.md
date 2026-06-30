# Module Service Contract

1. A module service exposes business operations in the module's language.
2. It may call that module's API adapter and transform module-specific data.
3. It may coordinate same-module validation, constants, and types.
4. It cannot create or configure a global API client.
5. It cannot own auth/session state, token refresh, routing, navigation, layouts, environment, or global errors.
6. Cross-module workflows require an explicit orchestrator owner and public contracts; direct private imports and cycles are forbidden.
7. Backend services remain domain use cases and cannot bypass controller validation, auth/role middleware, model ownership, or response/error conventions.
8. Results should use project-supported typed contracts; current JavaScript modules require documented shapes until TypeScript adoption is approved.
9. Migration must replace, not copy, an existing operation and update all dependents in one tested slice.
10. Service tests must cover domain transforms, adapter failures, permission-sensitive outcomes, and idempotency where applicable.

Sensitive constraints: auth/admin/payments/messages/proof services remain blocked until security/data/realtime ownership is approved.

