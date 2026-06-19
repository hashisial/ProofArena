# Email Auth Flow

ScaleOps uses a shared SMTP-backed email service for ProofArena account verification and password reset delivery. The service lives under `server/src/services/email/`, with `server/src/services/emailService.js` kept as a compatibility facade for existing imports.

## Environment Setup

Configure these server variables:

```bash
EMAIL_ENABLED=true
EMAIL_FROM="ScaleOps <no-reply@example.com>"
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=http://localhost:5173
```

Rules:

- Do not commit real SMTP credentials.
- `EMAIL_USER` and `EMAIL_PASS` must be provided together when the provider requires authentication.
- `EMAIL_SECURE=true` is normally used with port `465`.
- `CLIENT_URL` is used to build `/verify-email?token=...` and `/reset-password?token=...` links.

## Email Verification Flow

1. A user registers through `/api/auth/register`.
2. The backend creates the user with `emailVerified=false`.
3. The auth service generates a crypto-random verification token.
4. Only the hashed token is stored in `emailVerificationToken`.
5. `emailVerificationExpires` is set to 24 hours.
6. The email service sends a verification link to `/verify-email?token=...`.
7. `/api/auth/verify-email` accepts the token, hashes it, finds the matching unexpired token, marks the account verified, and clears token fields.

Security notes:

- Raw verification tokens are never returned in API responses.
- Raw verification tokens are never logged.
- Resend verification uses a generic response and does not reveal whether an email exists.

## Password Reset Flow

1. A user submits `/api/auth/forgot-password`.
2. The backend always returns a generic success response.
3. If the account exists, the auth service generates a crypto-random reset token.
4. Only the hashed token is stored in `passwordResetToken`.
5. `passwordResetExpires` is set to 30 minutes.
6. The email service sends a reset link to `/reset-password?token=...`.
7. `/api/auth/reset-password` validates the token, updates the password, clears reset token fields, and clears refresh-token session fields.

Security notes:

- Forgot-password does not reveal whether the email exists.
- Raw reset tokens are never returned in API responses.
- Raw reset tokens are never logged.
- Resetting a password invalidates existing refresh sessions.

## Local Testing

Recommended local SMTP options:

- Mailtrap sandbox inbox
- Ethereal SMTP test account
- Local SMTP catcher such as MailHog

Example Mailtrap-style `.env`:

```bash
EMAIL_ENABLED=true
EMAIL_FROM="ScaleOps <no-reply@scaleops.local>"
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_mailtrap_user
EMAIL_PASS=your_mailtrap_pass
CLIENT_URL=http://localhost:5173
```

Test sequence:

1. Start the backend and frontend.
2. Register a new account.
3. Confirm the verification email arrives in the test inbox.
4. Open the `/verify-email?token=...` link.
5. Submit forgot password for the same account.
6. Confirm the reset email arrives.
7. Open `/reset-password?token=...` and set a new password.
8. Confirm old sessions are logged out and login works with the new password.

## Production Provider Notes

- Use a transactional email provider with SPF, DKIM, and DMARC configured.
- Use a verified sender domain in `EMAIL_FROM`.
- Keep SMTP credentials only in deployment environment variables.
- Monitor failed email delivery from provider dashboards.
- Do not log full email links because they include one-time tokens.
