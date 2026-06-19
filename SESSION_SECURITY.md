# Session Security

ScaleOps keeps ProofArena authentication split between short-lived access tokens and an httpOnly refresh-token cookie.

## Access Token Flow

- Login and register return a short-lived access token in the API response.
- The frontend stores the access token only in the in-memory auth store.
- API requests attach the access token with `Authorization: Bearer <token>`.
- `/api/auth/me` verifies the access token and returns the safe user projection.

## Refresh Token Flow

- Login and register set the refresh token as an httpOnly cookie.
- The cookie is scoped to `/api/auth/refresh`, so it is only sent to the refresh endpoint.
- The backend stores only a hash of the refresh token in `User.refreshTokenHash`.
- The raw refresh token is never returned to the frontend and must not be logged.

Cookie settings:

- `httpOnly: true`
- `secure: true` in production
- `sameSite: lax` by default, configurable with `REFRESH_COOKIE_SAME_SITE`
- `path: /api/auth/refresh`
- `maxAge` derived from `JWT_REFRESH_EXPIRES_IN`

## Refresh Rotation

Every successful refresh rotates the session:

1. Read the refresh token from the httpOnly cookie.
2. Validate the token format.
3. Hash the incoming token and find the matching user session.
4. Reject missing, expired, inactive, or mismatched sessions.
5. Generate a new access token.
6. Generate a new refresh token.
7. Store only the new refresh token hash.
8. Set a new httpOnly refresh cookie.

The old refresh token is invalid after rotation because its hash is replaced.

## Logout Flow

- The frontend calls `/api/auth/logout` with the current access token when available.
- The backend clears the user's stored refresh token hash when the authenticated user is available.
- The backend clears the refresh cookie using both the current path-scoped cookie options and legacy root-path options.
- The frontend clears local auth state after the logout request finishes.
- Logout is idempotent; local sign-out still completes when the backend session is already expired.

## Frontend Retry Behavior

- The API client detects `401` responses from protected requests.
- It calls `/auth/refresh` once and shares that refresh promise across concurrent failed requests.
- If refresh succeeds, it updates the access token and retries the original request once.
- If refresh fails, it clears local auth state and triggers the unauthorized handler.
- Auth endpoints and refresh requests do not recursively trigger refresh.

## Multi-Tab Sync

- Logging out writes a small localStorage event marker.
- Other open tabs listen for that marker and clear local auth state.
- No tokens or user data are written into localStorage.

## Common Failure Cases

- Missing refresh cookie: refresh returns a generic unauthorized response.
- Expired refresh session: backend clears the stored hash and returns unauthorized.
- Reused old refresh token after rotation: backend rejects it.
- Missing or expired access token: frontend attempts one refresh before redirecting or clearing auth.
- Suspended or inactive account: protected routes reject access even if a token exists.
