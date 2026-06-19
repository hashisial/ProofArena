# Client Contracts

The current client is JavaScript. Shared contracts use JSDoc until TypeScript
or generated API contracts are introduced.

Do not place feature-specific shapes here. Those belong to their owning
feature or ProofArena module.

Current shared contracts:

- `auth.js`: authentication user, payload, response, and store-state contracts.
