# ScaleOps / ProofArena API Architecture

## Purpose

ScaleOps has one frontend HTTP transport and one Express API. ProofArena
domains use these shared foundations rather than creating a separate client or
server.

## Request Flow

Frontend:

```text
React component
  -> React Query hook
  -> feature service
  -> client/src/services/apiClient.js
  -> Express API
```

Backend:

```text
Route registry
  -> route middleware
  -> controller wrapped by asyncHandler
  -> service
  -> model or external adapter
  -> response helper
```

## Frontend API Foundation

Canonical files:

- HTTP client: `client/src/services/apiClient.js`
- Runtime environment: `client/src/config/env.js`
- Response parsing: `client/src/services/apiContracts.js`
- Error normalization: `client/src/services/apiErrors.js`
- Endpoint constants: `client/src/constants/apiEndpoints.js`
- Compatibility facade: `client/src/services/api.js`

The API client owns:

- API base URL resolution from `VITE_API_BASE_URL`
- JSON and `FormData` requests
- 15-second request timeout
- cookie credentials
- access-token attachment
- refresh-token request structure
- network and timeout error normalization
- optional unauthorized-response notification through
  `registerUnauthorizedHandler`

The default request helpers return the response `data` field. For compatibility,
an envelope with `data: null` is returned intact so older consumers can still
read its top-level message. New code that needs the full contract should use
`parseApiResponse`.

### Frontend Error Contract

All transport errors are normalized to `ApiError`:

```js
{
  message,
  status,
  statusCode,
  code,
  errors
}
```

Network failures use `NETWORK_ERROR`; timeouts use `REQUEST_TIMEOUT`. Backend
error codes are preserved when supplied.

### Example Feature Service

```js
import { API_ENDPOINTS } from "../../constants/index.js";
import { api } from "../../services/apiClient.js";

export const exampleService = {
  getCurrentUser() {
    return api.get(API_ENDPOINTS.ME);
  },
};
```

UI components should call a React Query hook rather than calling this service
directly when a hook exists.

## API Response Contract

Successful request:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": {}
}
```

`meta` is optional and is used for pagination or other response metadata.

Error response:

```json
{
  "success": false,
  "message": "Request could not be completed",
  "errors": [],
  "code": "OPTIONAL_MACHINE_CODE"
}
```

`code` is optional. Production responses do not expose unexpected internal
error messages.

## Backend API Foundation

Canonical files:

- Legacy API route registry: `server/src/routes/index.js`
- Versioned API route registry: `server/src/routes/v1/index.js`
- Express app composition: `server/src/app.js`
- Response helpers: `server/src/utils/apiResponse.js`
- Async controller wrapper: `server/src/utils/asyncHandler.js`
- Operational errors: `server/src/utils/AppError.js`
- Error middleware: `server/src/middleware/errorMiddleware.js`

Available response helpers:

- `sendSuccess` and `successResponse`
- `sendCreated` and `createdResponse`
- `sendNoContent` and `noContentResponse`
- `sendError` and `errorResponse`
- `paginatedResponse`

Existing compatibility signatures remain supported. New controllers should use
the focused `send*` aliases or their established response equivalents.

## Route Registration

`server/src/app.js` mounts exactly two API composers:

```text
/api     -> server/src/routes/index.js
/api/v1  -> server/src/routes/v1/index.js
```

Add a new live route by:

1. Creating the domain route/controller/service/model files.
2. Adding the route module to the correct registry.
3. Adding a frontend endpoint constant.
4. Adding a feature service and React Query hook.
5. Documenting and testing the route contract.

Current ProofArena domains such as outcome offers, challenges, execution plans,
proof assets, and matches belong in the versioned registry. Future proof-vault,
payments, notifications, and admin routes should reuse their existing domain
routes where possible. Do not mount placeholder routes for unavailable
features.

## Health Check

Both health routes use the standard response contract:

- `GET /api/health`
- `GET /api/v1/health`

The response includes environment, timestamp, uptime, service status, and
database connection status. It does not expose secrets or configuration
values.

Test locally:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

## Rules

1. Do not create another Axios or fetch client.
2. Do not hardcode origins or `/api` prefixes in feature services.
3. Do not call Axios directly from UI components.
4. Keep endpoint constants API-relative.
5. Use `asyncHandler` for async controllers.
6. Return standard response envelopes through shared helpers.
7. Add routes only when their real service contract exists.
8. Preserve public-safe errors and never expose secrets.
