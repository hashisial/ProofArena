# Authentication Service Architecture

## Scope

ScaleOps owns one backend authentication implementation. ProofArena consumes
that platform capability through the auth module boundary.

Canonical implementations:

- service: `server/src/services/authService.js`
- token utilities: `server/src/utils/token.utils.js`
- cookie utilities: `server/src/utils/cookie.utils.js`
- user model: `server/src/models/User.js`

Module-boundary exports:

- `server/src/modules/auth/index.js`
- `server/src/modules/auth/auth.controller.js`
- `server/src/modules/auth/auth.routes.js`
- `server/src/modules/auth/auth.service.js`
- `server/src/modules/auth/auth.utils.js`

The module controller and routes own the auth HTTP boundary. Existing
controller and route files are compatibility exports and do not create a
second auth system.

## HTTP Routes

The canonical auth router is mounted through the existing route registries at:

- `/api/auth`
- `/api/v1/auth` for compatibility

Required endpoints:

| Method | Route | Validation | Service method |
| --- | --- | --- | --- |
| `POST` | `/register` | `registerSchema` | `registerUser` |
| `POST` | `/login` | `loginSchema` | `loginUser` |
| `POST` | `/logout` | `logoutSchema` | `logoutUser` |
| `POST` | `/refresh` | `refreshTokenSchema` | `refreshAccessToken` |
| `POST` | `/forgot-password` | `forgotPasswordSchema` | `requestPasswordReset` |
| `POST` | `/reset-password` | `resetPasswordSchema` | `resetPassword` |
| `POST` | `/verify-email` | `verifyEmailSchema` | `verifyEmail` |
| `POST` | `/resend-verification` | `resendVerificationSchema` | `resendVerificationEmail` |

Existing compatibility endpoints such as `/refresh-token`, `/me`,
`/change-password`, and auth status routes remain available.

Controllers:

- use `asyncHandler`;
- rely on route-level validators;
- call auth services for business behavior;
- own cookie setting/clearing and standardized API responses;
- never return raw refresh, reset, or verification tokens.

## Protected Backend Routes

Canonical middleware remains in:

- `server/src/middleware/auth.middleware.js`
- `server/src/middleware/role.middleware.js`

Compatibility imports remain available from `authMiddleware.js` and
`roleMiddleware.js`.

Authentication middleware:

- `protect` / `authenticate` requires a Bearer access token, verifies it,
  reloads the database user, requires an active account, and attaches a safe
  projection to `request.user`;
- `optionalAuth` / `optionalAuthenticate` attaches a safe active user when a
  valid token exists and otherwise continues anonymously;
- `requireVerifiedEmail` requires a protected user with verified email;
- `requireActiveAccount` provides an explicit active-account guard.

Authorization middleware:

- `authorizeRoles(...roles)` / `requireRole(...roles)` authorizes only the
  database-loaded principal role;
- supported roles are admin, client, provider, and support;
- frontend role values and access-token role claims are never the final source
  of authorization truth.

## Token Design

### Access Token

The access token is a short-lived HS256 JWT. Its payload contains:

```json
{
  "userId": "user id",
  "role": "client | provider | support | admin",
  "accountStatus": "active | pending | suspended | banned",
  "tokenType": "access"
}
```

The default expiry is `15m` and is configured through
`JWT_ACCESS_EXPIRES_IN`. Verification requires the expected algorithm, access
token type, user id, role, and account status.

### Refresh Token

The refresh token is an opaque, cryptographically secure random value rather
than a JWT. It is generated from 48 random bytes and encoded as base64url.

- The raw token is sent only through the httpOnly refresh cookie.
- Only its SHA-256 hash is stored in `User.refreshTokenHash`.
- The stored session has an explicit `refreshTokenExpiresAt`.
- Comparison uses constant-time equality.
- Successful refresh rotates the raw token and stored hash.
- The default lifetime is `7d` and is configurable through
  `JWT_REFRESH_EXPIRES_IN` between 7 and 30 days.

`JWT_REFRESH_SECRET` remains in environment configuration only to verify prior
signed refresh tokens during migration. A successful legacy refresh rotates
the session to the opaque token format. It is not used to generate new refresh
tokens and can be removed after the migration window.

## Public User Mapping

`sanitizeUser()` and `sanitizeAuthUser()` return safe account projections.
Model serialization also strips sensitive fields.

Never return:

- password hashes;
- refresh token hashes;
- password reset tokens or expiry;
- email verification tokens or expiry;
- refresh token expiry/version.

## Service Methods

The canonical auth service exposes:

- `registerUser(payload)`
- `loginUser(payload)`
- `logoutUser(refreshToken)`
- `refreshAccessToken(refreshToken)`
- `requestPasswordReset(payload)`
- `resetPassword(payload)`
- `verifyEmail(payload)`
- `resendVerificationEmail(payload)`

Existing compatibility methods remain exported because current controllers and
services use them.

## Authentication Flows

### Registration

```text
validated payload
  -> normalize identity and public role
  -> create User (model hashes password)
  -> create auth session
  -> store refresh-token hash and expiry
  -> return access JWT, raw refresh token for cookie handling, safe user
```

Public registration permits only client and provider roles.

### Login

```text
email/password
  -> find User with password selected
  -> compare bcrypt password
  -> reject suspended, banned, or deleted account
  -> update last login
  -> rotate refresh session
  -> return access JWT, raw refresh token for cookie handling, safe user
```

Invalid credentials use one generic error response.

### Refresh

```text
opaque refresh cookie
  -> validate token format
  -> hash token
  -> find User by stored hash
  -> verify expiry, account status, and constant-time hash match
  -> rotate refresh token and hash
  -> issue new access JWT
```

Only one refresh session per user exists in the current model. A future
`AuthSession` model is required for multi-device sessions and token-family
reuse detection.

### Logout

```text
opaque refresh cookie
  -> locate current refresh session by hash
  -> clear stored hash and expiry
  -> controller clears auth cookies
```

Logout is idempotent when the token is missing, invalid, or already revoked.

### Password Reset

```text
request email
  -> always return enumeration-safe response
  -> generate random reset token
  -> store only token hash and expiry
  -> send reset link

valid reset token + new password
  -> replace password
  -> clear reset token
  -> clear refresh-token hash and expiry
  -> require fresh login
```

### Email Verification

```text
request/resend email
  -> always return enumeration-safe response
  -> generate random verification token
  -> store only token hash and expiry
  -> send verification link

valid token
  -> mark canonical and compatibility verification fields
  -> clear verification token and expiry
  -> return safe user
```

## Security Boundaries

- Controllers own HTTP cookies and response formatting.
- The service owns authentication workflows and database mutations.
- Token utilities own token generation, hashing, comparison, and verification.
- The User model owns password hashing and sensitive-field serialization.
- Raw refresh, reset, and verification tokens must never be logged or stored.
- High-level recovery and verification service methods return only generic,
  enumeration-safe messages and never return raw tokens or URLs.
- Frontend code must never receive the refresh token in response JSON.

## Known Risks

- Valid existing refresh JWTs are accepted during migration and rotate to the
  opaque format on their next refresh.
- The current User model supports one refresh session per user.
- Refresh rotation is not yet backed by token-family reuse detection.
- Access tokens remain valid until their short expiry after logout.
- `JWT_REFRESH_SECRET` is now a migration-only environment variable.

## Focused Verification

Run from `server/`:

```powershell
npm run check:boundaries
node -e "import('./src/app.js').then(() => console.log('SERVER_APP_IMPORT_OK'))"
```

Token helper behavior should also be tested with dedicated automated tests in
a later Stage 2 prompt.
