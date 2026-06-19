# Authentication Architecture Plan

## Purpose

This document is the Stage 2 authentication, roles, and security audit for the
existing ScaleOps platform. ProofArena remains a module inside ScaleOps.

This prompt does not implement new authentication behavior. It documents the
current system, identifies risks, and defines a safe implementation sequence.

### Stage 2 Prompt 2 Progress

The User model and auth-validator foundation has now been normalized:

- `support` is a valid stored account role but remains blocked from public
  registration;
- `banned` is a valid account status while legacy `deleted` remains supported;
- User JSON serialization strips password and token/session fields;
- the User model exposes a safe public mapper;
- registration usernames are optional and normalized;
- reusable role/account-status schemas are available through the auth module
  boundary.

Support permissions, support routes, and frontend support-role behavior remain
future Stage 2 work.

## Executive Assessment

ScaleOps already has a functional authentication foundation:

- public registration for client and provider accounts;
- login and logout;
- short-lived access JWTs;
- rotating opaque refresh tokens stored in an httpOnly cookie;
- password reset and email verification tokens stored as hashes;
- frontend session bootstrapping through the refresh cookie;
- protected and role-restricted frontend routes;
- backend authentication, role, permission, validation, rate-limit, CORS, and
  error middleware;
- admin, client, and provider role handling.

The correct Stage 2 approach is to harden and consolidate this system, not
replace it.

The system is not ready to be treated as production-complete authentication
yet. Its highest-priority gaps are:

1. no automated authentication or authorization tests;
2. the required `support` role is absent;
3. login-time environment-admin promotion creates a privileged mutation path;
4. refresh sessions support only one active session per user and do not detect
   refresh-token reuse;
5. password reset/change revokes refresh sessions but cannot immediately revoke
   already-issued access tokens;
6. frontend and backend contain compatibility auth paths that need contract
   tests before consolidation;
7. email verification exists but is not consistently required for sensitive
   operations;
8. cookie-backed refresh/logout routes need an explicit cross-site request
   protection policy;
9. concurrent frontend refresh requests are not coordinated through one
   single-flight refresh operation.

## 1. Current Auth Status

### 1.1 Current Backend Flow

Canonical backend flow:

```text
HTTP route
  -> validation/rate-limit middleware
  -> auth controller
  -> auth service
  -> User model
  -> standardized API response/error middleware
```

Canonical auth API is mounted at both:

- `/api/v1/auth`
- `/api/auth`

The second prefix is a compatibility mount. Both use the same underlying route
implementation.

Current auth endpoints:

| Method | Endpoint | Current behavior |
| --- | --- | --- |
| `POST` | `/auth/register` | Creates client/provider, creates refresh session, returns access token and user |
| `POST` | `/auth/login` | Validates credentials, creates refresh session, returns access token and user |
| `POST` | `/auth/logout` | Revokes current refresh session and clears auth cookies |
| `POST` | `/auth/refresh-token` | Validates and rotates refresh token |
| `POST` | `/auth/refresh` | Compatibility alias for refresh |
| `GET` | `/auth/me` | Returns current safe user projection |
| `POST` | `/auth/forgot-password` | Generates hashed reset token and returns generic response |
| `POST` | `/auth/reset-password` | Replaces password and increments refresh token version |
| `POST` | `/auth/verify-email` | Verifies hashed email token |
| `POST` | `/auth/resend-verification` | Sends or exposes a development-only verification link |
| `POST` | `/auth/change-password` | Requires access JWT, changes password, revokes refresh sessions |

### 1.2 Current Token Design

- Access token:
  - JWT;
  - default expiry `15m`;
  - returned in the response body;
  - held in frontend Zustand memory;
  - sent using `Authorization: Bearer <token>`.
- Refresh token:
  - opaque secure random token;
  - default expiry `7d`;
  - stored in an httpOnly cookie;
  - stored server-side only as a SHA-256 hash;
  - rotated during refresh;
  - one active refresh token per user.
- Password reset and email verification:
  - generated using 32 random bytes;
  - stored as hashes;
  - time limited;
  - raw token is placed in the emailed URL.

This hybrid access-token-in-memory and refresh-token-in-cookie design is a
sound base. It avoids persistent browser storage for access credentials.

### 1.3 Current Frontend Flow

```text
AuthProvider mounts
  -> POST /auth/refresh-token using cookie
  -> store access token and user in Zustand memory
  -> GET /auth/me
  -> ProtectedRoute / RoleRoute permit navigation
```

Current frontend responsibilities:

- `authService` owns auth API calls.
- `AuthProvider` owns auth bootstrapping and auth actions.
- `useAuthStore` owns the in-memory access token and safe user session.
- `apiClient` attaches access tokens and attempts refresh after a `401`.
- `ProtectedRoute` requires an authenticated user.
- `RoleRoute` requires a permitted role.
- login, registration, forgot-password, reset-password, and email-verification
  pages already exist.

### 1.4 Current Strengths

- Passwords use bcrypt with cost factor 12.
- Password fields and token hashes use `select: false`.
- Public registration blocks admin creation.
- Login uses a generic invalid-credentials response.
- Forgot-password and resend-verification responses resist account
  enumeration.
- Suspended/deleted accounts are checked during authenticated requests.
- Refresh tokens are hashed and rotated.
- Reset/change password increments `refreshTokenVersion`.
- Production configuration requires separate access and refresh secrets.
- Production secrets must be at least 32 characters.
- CORS allowlists configured client origins.
- Helmet, request-size limits, request sanitization, rate limits, safe error
  handling, and sensitive logger redaction exist.
- Backend controllers are thin and delegate to services.
- Frontend access tokens are not persisted in localStorage or sessionStorage.

### 1.5 What Is Missing

- Required `support` role and support permission policy.
- Automated unit, integration, authorization-matrix, and browser auth tests.
- Multi-device/session records and session management.
- Refresh-token family/reuse detection.
- Logout-all-sessions endpoint.
- Immediate access-token invalidation after password or security changes.
- Explicit JWT issuer, audience, algorithm, and token-type validation.
- Consistent verified-email enforcement policy.
- Account lockout or progressive delay for repeated credential failures.
- Per-account plus per-IP auth abuse controls.
- Explicit CSRF/origin policy for cookie-backed auth actions.
- Single-flight refresh handling in the frontend API client.
- Security-event audit trail.
- Admin MFA or step-up authentication.
- A documented migration/removal plan for auth compatibility files and routes.

### 1.6 Current Risks

#### Critical

No current issue was proven to be an immediately exploitable critical
vulnerability during this static audit. Production release should still be
blocked until the high-priority items below have tests and remediation.

#### High

1. **No automated auth or authorization tests**

   Authentication behavior spans two route prefixes, compatibility exports,
   multiple middleware names, and role-specific feature routes. Regressions
   cannot currently be detected automatically.

2. **Environment admin promotion occurs during authentication**

   `ensureEnvironmentAdmin()` changes any existing account matching
   `ADMIN_EMAIL` into an admin and grants `all` permissions. Admin bootstrap
   must be moved to an explicit, audited provisioning command or migration.

3. **Single refresh session per user**

   Every login overwrites the user's prior refresh token hash. A new login can
   silently terminate another device session. There is no device visibility,
   selective revocation, or refresh-token reuse detection.

4. **Access tokens remain usable after password change/reset**

   Refresh tokens are revoked through `refreshTokenVersion`, but access tokens
   remain valid until their expiry. Add a security-version or
   `passwordChangedAt` check to invalidate older access tokens.

5. **Support authorization is incomplete**

   `support` is now a valid stored User role, but it is intentionally not yet a
   workspace role. Backend permissions, frontend role access, and route guards
   still need a least-privilege support policy. Support must not be treated as
   admin.

#### Medium

1. **Cookie-backed auth actions lack an explicit CSRF/origin check**

   Production defaults can use `SameSite=None` for cross-origin deployments.
   Refresh and logout should validate allowed origin and/or a CSRF token.

2. **Concurrent refresh race**

   Multiple simultaneous `401` responses can each attempt refresh. Because
   refresh tokens rotate, later requests can invalidate or fail the session.

3. **Email verification is not consistently enforced**

   Accounts receive a session immediately after registration, and
   `requireVerifiedEmail` is not broadly applied. A clear operation-level
   verification policy is required.

4. **Admin authentication has parallel frontend/backend paths**

   Normal role routes and `AdminGate` coexist. The latter carries an additional
   in-memory admin-token flow and legacy service calls. Admin access should
   converge on the same session source and route guards.

5. **JWT claims are underspecified**

   Tokens do not explicitly set and enforce issuer, audience, algorithm, or
   token type. These claims should be added during token hardening.

6. **Rate limiting is broad rather than risk-specific**

   One auth limiter covers several endpoints. Login, registration, reset,
   verification, and refresh need endpoint-specific and account-aware abuse
   controls.

7. **Security tokens remain in browser history**

   Reset and verification tokens are delivered in query strings. This is
   normal for email links, but pages should capture then remove the token from
   the visible URL and apply a strict referrer policy.

#### Low / Architectural Debt

- Duplicate safe-user serializers can drift.
- User identity and verification fields have legacy duplicates.
- `authService` creates subscriptions during registration, coupling auth to a
  billing concern.
- Compatibility exports and dual API prefixes increase maintenance surface.
- Role checks exist in both middleware and some controllers/services.
- Permission-denied responses sometimes disclose internal permission names.

## 2. Recommended Auth Flow

### 2.1 Register

```text
Client submits fullName, username, email, password, role
  -> endpoint-specific registration limiter
  -> strict Zod validation
  -> normalize email/username
  -> allow public roles: client/provider only
  -> create unverified active user
  -> generate and send verification token
  -> issue limited session or require login based on product policy
  -> return one canonical safe-user contract
```

Recommended policy:

- Continue allowing only `client` and `provider` for public registration.
- Never allow `admin` or `support` through public registration.
- Keep a single safe response contract.
- Move subscription initialization to a post-registration domain event or
  separate onboarding service.
- Decide before implementation whether unverified accounts may enter the
  dashboard. Recommended: allow limited onboarding access but block sensitive
  marketplace actions until verified.

### 2.2 Login

```text
Client submits email and password
  -> login-specific IP and account limiter
  -> generic credential validation response
  -> verify active account
  -> verify password
  -> create AuthSession record
  -> issue short-lived access token
  -> issue rotating refresh cookie
  -> record security event and last login
  -> return safe user
```

Recommended additions:

- Remove login-time admin promotion.
- Add progressive delay or temporary lock after repeated failures.
- Record login success/failure without logging credentials.
- Add optional MFA/step-up capability for admin and support accounts.

### 2.3 Logout

```text
POST logout
  -> validate allowed origin/CSRF policy
  -> revoke current AuthSession
  -> clear refresh cookie
  -> clear frontend in-memory auth state
```

Also add:

- logout all sessions;
- revoke one selected device/session.

### 2.4 Refresh Token

```text
POST refresh
  -> validate allowed origin/CSRF policy
  -> read httpOnly refresh cookie
  -> validate the opaque token format
  -> locate the session by its token hash and verify expiry
  -> detect reuse or revoked family
  -> rotate refresh token atomically
  -> issue new access token
  -> return canonical safe user
```

Frontend refresh must use one shared in-flight promise so concurrent requests
wait for the same refresh result.

### 2.5 Forgot Password

```text
Submit email
  -> endpoint-specific limiter
  -> always return generic response
  -> invalidate prior reset token
  -> generate hashed, single-use reset token
  -> send email
  -> record security event
```

Do not disclose whether the account exists.

### 2.6 Reset Password

```text
Submit token and new password
  -> validate strong password
  -> consume valid single-use token atomically
  -> update passwordChangedAt/securityVersion
  -> revoke all AuthSession records
  -> clear cookies
  -> notify account owner
  -> require fresh login
```

### 2.7 Email Verification

```text
Submit verification token
  -> validate hashed, single-use token
  -> mark canonical emailVerifiedAt value
  -> clear token
  -> update current safe-user session response
```

Resend verification must remain enumeration-safe and rate limited.

### 2.8 Protected Dashboard Routing

Frontend guards provide navigation UX only:

```text
AuthProvider bootstraps session
  -> ProtectedRoute checks authenticated session
  -> RoleRoute checks current role
  -> page renders
```

Backend remains the source of truth:

```text
authenticate
  -> requireActiveAccount
  -> requireVerifiedEmail when policy requires it
  -> requireRole / requirePermission
  -> owner/resource authorization in service
```

Every protected API route must be included in an authorization matrix test.

## 3. Role System

Required roles:

| Role | Purpose | Public registration | Baseline access |
| --- | --- | --- | --- |
| `admin` | Platform administration and privileged moderation | No | Explicit admin permissions; step-up/MFA recommended |
| `support` | Customer support and limited investigations | No | Support-specific permissions only; no billing release or role escalation |
| `client` | Create/manage challenges and select providers | Yes | Client workspace and client-owned resources |
| `provider` | Offers, plans, proof, opportunities, and delivery work | Yes | Provider workspace and provider-owned resources |

### Role Rules

- Backend role/permission checks are authoritative.
- Frontend role guards are usability controls, not security controls.
- `support` must be a separate least-privilege role, not an admin permission
  alias.
- Admin and support accounts must be provisioned through an explicit audited
  command or admin workflow.
- Role changes must:
  - require privileged permission;
  - create a security audit event;
  - revoke active sessions or increment a security version;
  - never be accepted from public registration/profile payloads.
- Ownership checks remain separate from role checks.
- Permissions should be additive and named by domain action.

Recommended initial support permissions:

- `support:conversations:read`
- `support:conversations:reply`
- `support:users:read-limited`
- `support:reports:read`
- `support:reports:update`

Support should not receive:

- `admin:users:manage`
- role mutation;
- password reset for another user;
- payment release/refund;
- secret/config access;
- unrestricted private proof access.

## 4. Security Rules

### Passwords

- Continue bcrypt hashing with cost factor 12 or benchmarked equivalent.
- Enforce 8-128 characters with uppercase, lowercase, and number at minimum.
- Reject commonly breached passwords in a later hardening step.
- Never log, return, or select passwords except inside credential verification.
- Add `passwordChangedAt` or a general `securityVersion`.

### Access Tokens

- Target expiry: 10-15 minutes.
- Store only in frontend memory.
- Send only through the Authorization header.
- Add and verify:
  - `iss` and `aud` when deployment identifiers are finalized;
  - `sub`;
  - `tokenType: access`;
  - explicit HS256/RS256 algorithm policy;
  - `securityVersion`.

### Refresh Tokens

- Target expiry: 7-30 days based on product policy.
- Keep only in `Secure`, `httpOnly` cookie.
- Store only a hash server-side.
- Use one AuthSession record per device/session.
- Rotate atomically on every use.
- Detect reuse and revoke the token family.
- Support current-session and all-session revocation.

### Cookies and Cross-Site Requests

- Production cookies must be `Secure` and `httpOnly`.
- Prefer `SameSite=Lax` when client and API deployment topology permits.
- If `SameSite=None` is required, validate Origin and implement a CSRF token or
  equivalent defense for cookie-authenticated state-changing endpoints.
- Scope cookie domain/path as narrowly as deployment permits.

### Input Validation and Errors

- Continue strict Zod request schemas.
- Reject unknown auth fields.
- Keep login, forgot-password, and resend-verification responses
  enumeration-safe.
- Do not expose token hashes, stack traces, internal permissions, or secrets.
- Apply output shaping through one canonical safe-user serializer.

### Abuse Protection

- Separate rate limiters for login, registration, refresh, forgot-password,
  reset-password, verification, and resend-verification.
- Combine IP, normalized account identifier, and device/session signals where
  appropriate.
- Add progressive delays or temporary lockout.
- Add CAPTCHA only after measured abuse requires it.

### Operational Security

- Use independent, strong access and refresh secrets.
- Remove deprecated `JWT_SECRET` after migration.
- Rotate access-token secrets through a documented procedure.
- Provision admin/support through an explicit audited command.
- Add authentication/security event logging with redaction.
- Require MFA or step-up authentication for privileged accounts before
  production administration.

## 5. Backend Files Needed

### Existing Canonical Files To Upgrade

These files already exist and should be improved rather than duplicated:

| File | Planned responsibility |
| --- | --- |
| `server/src/models/User.js` | Continue canonical verification-field and password/security-version migration |
| `server/src/routes/v1/auth.routes.js` | Canonical auth endpoints and endpoint-specific middleware |
| `server/src/controllers/auth.controller.js` | Thin HTTP/cookie response orchestration |
| `server/src/services/authService.js` | Credential, recovery, verification, and session orchestration |
| `server/src/middleware/auth.middleware.js` | Access-token authentication and verified-email policy helpers |
| `server/src/middleware/role.middleware.js` | Admin/support/client/provider roles and permissions |
| `server/src/middleware/adminMiddleware.js` | Temporary compatibility path to consolidate |
| `server/src/middleware/rateLimitMiddleware.js` | Endpoint-specific auth abuse controls |
| `server/src/validators/auth.validator.js` | Canonical strict auth payload contracts |
| `server/src/utils/token.utils.js` | Explicit JWT claims and verification policy |
| `server/src/utils/cookie.utils.js` | Refresh-cookie and clearing policy |
| `server/src/constants/roles.js` | Canonical role values including support |
| `server/src/config/env.js` | JWT claims, cookie, security, and optional MFA configuration |
| `server/src/services/emailService.js` | Auth email delivery boundaries |
| `server/src/errors/errorHandler.js` | Safe normalized auth errors |

### New Backend Files Recommended During Implementation

| File | Reason |
| --- | --- |
| `server/src/models/AuthSession.js` | Multi-device refresh sessions, token families, revocation, reuse detection |
| `server/src/services/authSessionService.js` | Session issue/rotate/revoke logic separated from credentials |
| `server/src/services/authAuditService.js` | Redacted auth/security event recording |
| `server/src/validators/session.validator.js` | Session revoke/list request validation |
| `server/src/routes/v1/session.routes.js` | List/revoke current user's sessions |
| `server/src/controllers/session.controller.js` | Thin session HTTP controller |
| `server/tests/integration/auth.routes.test.js` | Auth endpoint contracts |
| `server/tests/integration/auth.authorization.test.js` | Role/permission/ownership matrix |
| `server/tests/unit/token.utils.test.js` | JWT claim and verification behavior |
| `server/tests/unit/authSessionService.test.js` | Rotation, reuse, expiry, and revocation |

### Compatibility Files To Retain Until Tests Pass

- `server/src/routes/authRoutes.js`
- `server/src/controllers/authController.js`
- `server/src/services/auth.service.js`
- `server/src/models/User.model.js`
- `server/src/middleware/authMiddleware.js`
- `server/src/middleware/roleMiddleware.js`

These should remain compatibility exports during Stage 2. Remove them only
after import usage is migrated and tests prove both API prefixes are no longer
required.

## 6. Frontend Files Needed

### Existing Files To Upgrade

| File | Planned responsibility |
| --- | --- |
| `client/src/features/auth/authService.js` | Canonical auth API service |
| `client/src/features/auth/AuthProvider.jsx` | One session bootstrap and auth action provider |
| `client/src/features/auth/useAuth.js` | Canonical auth context hook |
| `client/src/features/auth/roleAccess.js` | Roles/permissions including support |
| `client/src/store/useAuthStore.js` | In-memory safe user/access-token state only |
| `client/src/store/authSession.js` | Remove remaining legacy admin/user token helpers after migration |
| `client/src/services/apiClient.js` | Single-flight refresh and normalized unauthorized handling |
| `client/src/routes/ProtectedRoute.jsx` | Authenticated route guard |
| `client/src/routes/RoleRoute.jsx` | Role-aware route guard including support |
| `client/src/routes/AppRoutes.jsx` | Explicit admin/support/client/provider route matrix |
| `client/src/pages/Login.jsx` | Login form and safe return-route behavior |
| `client/src/pages/Register.jsx` | Client/provider registration only |
| `client/src/pages/ForgotPassword.jsx` | Enumeration-safe recovery request |
| `client/src/pages/ResetPassword.jsx` | Token capture, URL cleanup, and password reset |
| `client/src/pages/VerifyEmail.jsx` | Token capture, URL cleanup, and resend flow |
| `client/src/constants/apiEndpoints.js` | Canonical auth/session endpoints |
| `client/src/constants/statuses.js` | Canonical frontend role values including support |

### Existing Frontend Path To Consolidate

- `client/src/components/AdminGate.jsx`

Admin access should use the same `AuthProvider`, `useAuthStore`, and
`RoleRoute` session source as the rest of the application. Remove `AdminGate`
only after its consumers and legacy admin service calls have migrated.

### New Frontend Files Recommended During Implementation

| File | Reason |
| --- | --- |
| `client/src/features/auth/authQueries.js` | Optional React Query mutations/queries if adopted consistently |
| `client/src/features/auth/SessionManager.jsx` | User-visible session/device list and revoke controls |
| `client/src/features/auth/AuthRequiredNotice.jsx` | Reusable auth/verification requirement state |
| `client/src/features/auth/authRedirect.js` | Validate and resolve safe post-login internal redirects |
| `client/src/features/auth/__tests__/roleAccess.test.js` | Role and permission unit contracts |
| `client/src/routes/__tests__/routeGuards.test.jsx` | Protected/role route behavior |
| `client/src/features/auth/__tests__/authFlow.test.jsx` | Bootstrap, refresh, logout, and recovery behavior |

Do not create a second auth store, API client, or auth context.

## 7. Stage 2 Prompt Plan

### Stage 2 Prompt 2: Auth Contract Tests and Authorization Matrix

Goal:

- add a test runner and focused auth tests;
- document all public/protected/role/permission routes;
- pin current `/api/auth` and `/api/v1/auth` behavior;
- test safe response fields and error formats.

Why first:

- every later auth change affects security-sensitive compatibility behavior.

### Stage 2 Prompt 3: Role and Permission Hardening

Goal:

- add `support` role end to end;
- define least-privilege support permissions;
- centralize role values;
- test admin/support/client/provider authorization;
- prevent public privileged-role creation.

### Stage 2 Prompt 4: Session and Token Hardening

Goal:

- add `AuthSession`;
- implement atomic refresh rotation and reuse detection;
- add JWT issuer/audience/type/algorithm/security-version checks;
- add current-session and all-session logout;
- implement frontend single-flight refresh.

### Stage 2 Prompt 5: Registration and Email Verification Policy

Goal:

- define unverified-account capabilities;
- decouple subscription creation from credential registration;
- send verification after registration;
- apply verified-email middleware to selected sensitive operations;
- consolidate safe-user projections.

### Stage 2 Prompt 6: Password Recovery and Credential Security

Goal:

- harden reset/change-password flows;
- invalidate access and refresh sessions after credential changes;
- remove token from browser URL after capture;
- add security notifications and event records.

### Stage 2 Prompt 7: Frontend Auth and Admin Consolidation

Goal:

- converge admin access on the canonical auth provider/store;
- remove legacy browser token helpers when safe;
- add safe return-route handling;
- improve loading/error/expired-session states;
- add support route guards.

### Stage 2 Prompt 8: Abuse Protection and Privileged Access

Goal:

- add endpoint-specific limits and progressive login controls;
- add explicit Origin/CSRF policy;
- add privileged account provisioning command;
- add admin/support step-up or MFA foundation;
- add redacted security audit events.

### Stage 2 Prompt 9: Final Authentication Regression and Documentation

Goal:

- run the full auth/authorization matrix;
- confirm no sensitive fields leak;
- verify client/server builds and runtime;
- remove proven-unused compatibility paths only;
- create Stage 2 completion report.

## 8. Implementation Guardrails

- Keep ScaleOps as the parent application.
- Keep ProofArena inside the existing module architecture.
- Do not create a separate auth app or duplicate server.
- Do not replace the current auth system wholesale.
- Do not remove compatibility exports before tests cover their consumers.
- Do not trust frontend role checks as authorization.
- Do not store access or refresh tokens in persistent browser storage.
- Do not place auth business logic in controllers, middleware, or React
  components.
- Do not log credentials, tokens, cookies, reset links, or secrets.
- Do not let public payloads control privileged roles or permissions.

## 9. Files Inspected During This Audit

### Backend

- `server/src/app.js`
- `server/src/config/cors.js`
- `server/src/config/env.js`
- `server/src/constants/index.js`
- `server/src/constants/roles.js`
- `server/src/controllers/auth.controller.js`
- `server/src/middleware/adminMiddleware.js`
- `server/src/middleware/auth.middleware.js`
- `server/src/middleware/messagingAuthMiddleware.js`
- `server/src/middleware/rateLimitMiddleware.js`
- `server/src/middleware/role.middleware.js`
- `server/src/middleware/security.middleware.js`
- `server/src/models/User.js`
- `server/src/routes/index.js`
- `server/src/routes/v1/auth.routes.js`
- `server/src/routes/v1/index.js`
- `server/src/services/authService.js`
- `server/src/services/messagingAuthService.js`
- `server/src/utils/cookie.utils.js`
- `server/src/utils/logger.js`
- `server/src/utils/token.utils.js`
- `server/src/validators/auth.validator.js`
- `server/.env.example`
- `server/package.json`

### Frontend

- `client/src/components/AdminGate.jsx`
- `client/src/constants/apiEndpoints.js`
- `client/src/constants/routes.js`
- `client/src/constants/statuses.js`
- `client/src/features/auth/AuthProvider.jsx`
- `client/src/features/auth/RequireRole.jsx`
- `client/src/features/auth/authService.js`
- `client/src/features/auth/roleAccess.js`
- `client/src/features/auth/useAuth.js`
- `client/src/pages/ForgotPassword.jsx`
- `client/src/pages/Login.jsx`
- `client/src/pages/Register.jsx`
- `client/src/pages/ResetPassword.jsx`
- `client/src/pages/VerifyEmail.jsx`
- `client/src/routes/AppRoutes.jsx`
- `client/src/routes/ProtectedRoute.jsx`
- `client/src/routes/RoleRoute.jsx`
- `client/src/services/apiClient.js`
- `client/src/store/authSession.js`
- `client/src/store/useAuthStore.js`
- `client/.env.example`
- `client/package.json`

### Architecture Context

- `ARCHITECTURE.md`
- `STAGE_1_COMPLETION_REPORT.md`
- repository auth/role/token/storage/test searches

## 10. Readiness Decision

Stage 2 implementation can begin safely, but the next prompt must establish
authentication contract tests and the authorization matrix before modifying
roles, tokens, sessions, or compatibility routes.

No authentication code was changed during this audit.
