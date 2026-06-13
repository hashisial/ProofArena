# Error Handling Architecture

ScaleOps uses one error contract across the ProofArena frontend and backend:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Email is invalid"
    }
  ]
}
```

`errors` is always safe, structured detail intended for client consumption. Stack traces and
raw database, JWT, Axios, or runtime errors are never sent in production.

## Backend Error Flow

```text
Route -> middleware/controller -> service -> throw/next(AppError)
      -> server/src/errors/errorHandler.js -> safe JSON response
```

Canonical backend files:

- `server/src/errors/AppError.js`: operational error class with `message`, `statusCode`,
  `code`, and `details`.
- `server/src/errors/errorCodes.js`: stable machine-readable error codes.
- `server/src/errors/errorHandler.js`: Express error normalization and response middleware.
- `server/src/errors/notFoundHandler.js`: safe unknown-API-route handler.

Existing imports from `server/src/utils/AppError.js` and
`server/src/middleware/errorMiddleware.js` remain compatibility facades. New backend code
should import from `server/src/errors/`.

### Throwing Service Errors

```js
import { AppError } from "../errors/AppError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

throw new AppError(
  "Validation failed",
  400,
  [{ field: "email", message: "Email is invalid" }],
  ERROR_CODES.VALIDATION_ERROR,
);
```

Services throw operational errors. Controllers and middleware pass errors to `next`, normally
through the existing `asyncHandler`. Controllers must not build ad hoc error responses.

### Backend Normalization

The central middleware formats:

- `AppError`
- Zod and Mongoose validation errors
- Mongoose cast and duplicate-key errors
- JWT expired/invalid errors
- Multer file-size errors
- invalid JSON request bodies
- unknown runtime errors

Unexpected production errors return `INTERNAL_ERROR`, an empty `errors` array, and no stack.
Development responses may include a stack to support diagnosis. Server logging uses the
secret-redacting logger.

## Frontend Error Flow

```text
Axios failure -> API client interceptor -> normalizeError -> AppError
             -> feature service / React Query hook -> UI-safe message
```

Canonical frontend files:

- `client/src/errors/AppError.js`: stable frontend error shape.
- `client/src/errors/errorMessages.js`: default user-facing messages by code/status.
- `client/src/errors/normalizeError.js`: API, network, timeout, and validation normalization.

`client/src/services/apiErrors.js` remains a compatibility facade for current imports.

Services and hooks receive an `AppError` with:

- `message`: safe message suitable for UI
- `code`: stable machine-readable code
- `status` / `statusCode`: HTTP status
- `details` / `errors`: normalized validation details
- `cause`: original technical error for controlled diagnostics, not UI rendering

### Displaying Errors

```js
import { getUserErrorMessage, getValidationErrors } from "../errors/index.js";

const message = getUserErrorMessage(error, "The request could not be completed.");
const fieldErrors = getValidationErrors(error);
```

UI components should display `message` or `getUserErrorMessage`. They must not render
`cause`, Axios response objects, stack traces, database errors, or raw backend internals.
A future toast system can consume the same normalized `AppError`.

## Rules

- Add stable codes to `errorCodes.js` and user defaults to `errorMessages.js`.
- Use `AppError` for expected failures; let unexpected failures reach the central handler.
- Keep validation details shaped as `{ field, message }`.
- Never return secrets, environment values, tokens, stack traces, or raw exception objects.
- Do not create feature-specific error classes unless behavior genuinely differs from
  `AppError`.
- Do not parse raw Axios error structures inside components.

## Manual Verification

1. Request an unknown route such as `GET /api/not-a-route`; expect a safe 404 JSON envelope.
2. Submit invalid data to a validated route; expect `VALIDATION_ERROR` with field details.
3. In development, trigger an unexpected server error and confirm a stack is present.
4. In production mode, confirm the same unexpected error returns `INTERNAL_ERROR` without a
   stack.
5. Stop the API and make a client request; expect a normalized `NETWORK_ERROR`.

