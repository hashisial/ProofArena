# Module Import/Export Policy

## Allowed

- Same-module relative imports within the module boundary.
- Platform public APIs for auth consumption, routing metadata consumption, API transport, query/runtime services, and configuration readers.
- Approved shared UI primitives, pure utilities, types, validation, and test helpers.
- Another module's public contract only when a documented dependency exists and no cycle results.

## Restricted

- Cross-module imports require the target module's public export and dependency-map entry.
- Deep imports into another module are forbidden unless an explicit temporary migration exception is documented.
- Existing feature/layer paths remain in place until a migration prompt updates all dependents atomically.
- Barrels (`index.js`/`index.ts`) are allowed only where the repository pattern and ownership gate approve them; barrels must not hide cycles or re-export platform internals.

## Forbidden

- Shared code importing feature/module private code.
- Module imports of app entry, route declarations, navigation renderers, layouts/shells, API-client internals, auth-provider internals, env/deploy files, or another module's private implementation.
- Circular module dependencies.
- API adapters exporting base URL, token, interceptor, or global response-normalization behavior.

## Public Export Rules

1. Export the smallest stable module surface.
2. Separate UI, hooks, service operations, types, and adapter functions logically.
3. Do not export implementation-only validation/helpers by default.
4. API adapters expose module endpoint operations, never the underlying client.
5. A module public API cannot re-export another module or platform system.
6. Every new public export needs a consumer and tests or a recorded test plan.

