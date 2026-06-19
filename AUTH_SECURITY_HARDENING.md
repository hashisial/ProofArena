# Auth Security Hardening

ScaleOps keeps authentication security centralized in the existing Express middleware stack. ProofArena auth routes reuse these controls instead of creating a separate security system.

## Security Middleware

Mounted from `server/src/middleware/security.middleware.js`:

- `app.disable("x-powered-by")`
- Helmet security headers
- CORS from `server/src/config/cors.js`
- JSON and URL-encoded body limits from `env.jsonLimit`
- cookie parsing for httpOnly refresh-token cookies
- compression
- general `/api` rate limiting

Helmet configuration:

- CSP is enabled in production with conservative API-safe defaults.
- CSP is disabled in development to avoid breaking local tooling.
- HSTS is enabled in production.
- Referrer policy is `no-referrer`.
- Cross-origin embedder policy is disabled to avoid breaking cross-origin API usage.

## CORS Rules

CORS is environment-driven:

- Production allows only origins configured in `CLIENT_URL` / `CLIENT_URLS`.
- Development includes localhost defaults from `server/src/config/env.js`.
- Credentials are enabled because refresh tokens use httpOnly cookies.
- Vercel preview origins are allowed only when `VERCEL_PREVIEW_ORIGINS_ENABLED=true`.

Cookie note:

- Frontend requests that rely on refresh cookies must use `withCredentials: true`.
- Production frontend/backend deployments must set matching HTTPS origins and compatible cookie `sameSite` settings.

## Rate Limits

Global API limiter:

- Mounted at `/api`.
- Production default: 300 requests per window.
- Development default: 1000 requests per window.

Auth general limiter:

- Mounted on every `/api/auth/*` and `/api/v1/auth/*` route through the auth router.
- Production default: 100 requests per 15 minutes.
- Development default: 300 requests per 15 minutes.

Strict auth limiters:

- `/login`: 5 requests per 15 minutes in production.
- `/forgot-password`: 5 requests per 15 minutes in production.
- `/resend-verification`: 5 requests per 15 minutes in production.
- `/reset-password`, `/verify-email`, and `/change-password` use strict auth limits.

Current limiter keys are IP-based.

TODO:

- Add email-hash and user-id based throttling after auth-event persistence exists.
- Add account lockout or step-up challenge only after the UX and support workflow are defined.

## Input Sanitization

Mounted from `server/src/middleware/sanitizeMiddleware.js`:

- Removes `__proto__`, `constructor`, and `prototype` keys.
- Removes keys starting with `$`.
- Removes dotted keys.
- Strips script tags and inline event handlers from string values.
- Removes protected body fields such as role/status/proof-score unless explicitly allowed.

This provides basic NoSQL injection and XSS input hardening without destroying normal user content.

## Abuse Logging

Safe logs are emitted for:

- Failed login attempts.
- Password reset requests.
- Refresh-token failures.
- Rate-limit exceeded events.

Logs may include:

- IP address.
- Route and method.
- User-agent.
- Hashed email identifier.
- Status code.

Logs must never include:

- Passwords.
- Raw access tokens.
- Raw refresh tokens.
- Raw password reset tokens.
- Raw email verification tokens.
- Cookie header values.

## Local Testing

Run the backend:

```bash
cd server
npm run dev
```

Test CORS:

- Browser requests from `http://localhost:5173` should work in development.
- Requests from a random browser origin should be blocked unless configured.

Test rate limits:

```bash
for i in {1..8}; do
  curl -i -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong-password"}'
done
```

Expected result:

- Early responses should be normal auth failures.
- Later responses should return `429` with the standard JSON error shape.
- Server logs should show rate-limit events without passwords or tokens.

Test body limit:

- Send a JSON payload larger than `JSON_LIMIT`.
- The server should reject it before route logic.

## Production Checklist

- Set `NODE_ENV=production`.
- Set `CLIENT_URL` / `CLIENT_URLS` exactly to deployed frontend origins.
- Keep `VERCEL_PREVIEW_ORIGINS_ENABLED=false` unless previews are explicitly needed.
- Set strong JWT secrets.
- Use HTTPS for frontend and backend.
- Confirm refresh cookie settings for the deployment topology.
- Review auth rate-limit values before launch traffic.
- Forward sanitized logs to a secure log sink.
