# Shared Library Adapters

Use this directory only for small, framework- or vendor-facing adapters that
are shared across multiple features and are not domain business logic.

Current canonical ownership remains:

- `client/src/services/apiClient.js` for HTTP transport.
- `client/src/services/queryClient.js` for React Query configuration.
- `client/src/utils/` for framework-independent shared helpers.

Do not create a second API client, query client, or feature service here.
