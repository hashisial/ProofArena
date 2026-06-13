# ScaleOps / ProofArena Environment Setup

ScaleOps uses separate runtime environments for the Vite client and Express
server. The repository root does not load a `.env` file.

## Safety Rules

- Commit example files only. Never commit `.env`, `.env.local`, database
  connection strings, signing secrets, API keys, payment credentials, or mail
  credentials.
- All `VITE_` values are embedded into the client build and are public.
- Server secrets belong only in `server/.env` or the deployment platform's
  encrypted environment settings.
- Error and warning messages identify variable names only. They never print
  secret values.
- Refresh tokens remain backend-managed HTTP-only cookies.

## Configuration Owners

| Area | Canonical owner |
| --- | --- |
| Client runtime configuration | `client/src/config/env.js` |
| Client API URL resolution | `client/src/services/apiClient.js` |
| Server runtime configuration and validation | `server/src/config/env.js` |
| Dotenv loading | `server/src/config/loadEnv.js` |
| Client example variables | `client/.env.example` |
| Server example variables | `server/.env.example` |

Do not read `import.meta.env` or `process.env` directly outside these config
owners unless the platform itself requires it.

## Client Variables

Create `client/.env` from `client/.env.example`:

```powershell
cd client
Copy-Item .env.example .env
```

| Variable | Requirement | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Required for production builds | Express origin or explicit `/api` base |
| `VITE_REALTIME_URL` | Optional | Socket.IO origin; derived from API URL when empty |
| `VITE_APP_NAME` | Optional | Public application name |
| `VITE_APP_ENV` | Optional | Public environment label |
| `VITE_ANALYTICS_KEY` | Optional | Public analytics identifier |

`VITE_API_URL` remains a temporary compatibility alias for
`VITE_API_BASE_URL`. New environments should use `VITE_API_BASE_URL`.

Supported API URL forms:

| Value | Resolved API base |
| --- | --- |
| `http://localhost:5000` | `http://localhost:5000/api` |
| `http://localhost:5000/api` | `http://localhost:5000/api` |
| `https://api.example.com` | `https://api.example.com/api` |
| `/api` | Same-origin `/api` |

Production builds reject loopback API URLs. Changing a `VITE_` variable
requires rebuilding the client.

## Server Variables

Create `server/.env` from `server/.env.example`:

```powershell
cd server
Copy-Item .env.example .env
```

### Critical Runtime Variables

The server validates these variables centrally:

- `NODE_ENV`
- `PORT`
- `CLIENT_URL` or `CLIENT_URLS`
- `SERVER_URL`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`

In development, missing recommended variables produce warnings and safe local
fallbacks where supported. In production, missing critical variables stop
startup immediately. Production secrets must be at least 32 characters.

The server may run without MongoDB in development for public fallback pages,
but persistence-backed functionality requires `MONGODB_URI`.

### Optional Integration Variables

- AI: `OPENAI_API_KEY`, `OPENAI_MODEL`
- Email: `EMAIL_ENABLED`, `EMAIL_FROM`, `EMAIL_HOST`, `EMAIL_PORT`,
  `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, `LEAD_NOTIFICATION_EMAIL`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs, Connect
  country, marketplace commission, and feature flags
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`
- Queues/uploads: `QUEUE_DRIVER`, `QUEUE_CONCURRENCY`, `REDIS_URL`,
  `UPLOAD_DIR`

Cloudinary credentials must be supplied together. Email and Stripe variables
are required only when their corresponding integration is enabled.

### Compatibility Aliases

These legacy names remain readable during migration:

- `MONGO_URI` -> `MONGODB_URI`
- `JWT_SECRET` -> separate access and refresh secrets
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
  `SMTP_FROM` -> corresponding `EMAIL_*` variables

The server reports deprecated variable names without printing their values.
Migrate deployment settings to the canonical names before removing aliases.

## Local Development

Server:

```powershell
cd server
npm install
npm run dev
```

Client:

```powershell
cd client
npm install
npm run dev
```

Defaults:

- Client: `http://localhost:5173`
- Server: `http://localhost:5000`
- Health: `http://localhost:5000/api/health`

## Validation Checks

Validate server configuration without starting the HTTP listener:

```powershell
cd server
node -e "import('./src/config/env.js').then(() => console.log('Server environment valid'))"
```

Validate the client environment and production bundle:

```powershell
cd client
npm run lint
npm run build
```

## Production Deployment

- Store secrets in the deployment platform, not repository files.
- Set deployed frontend origins in `CLIENT_URL` or `CLIENT_URLS`.
- Set `SERVER_URL` to the public API origin.
- Use long, independent JWT access and refresh secrets.
- Use HTTPS for secure cross-site cookies.
- Enable AI, email, Stripe, Cloudinary, and queues only after all required
  integration variables are configured.

Before committing:

```powershell
git status --short
git ls-files "*env*"
```

Only reviewed example files and environment-loading source files should be
tracked. Rotate any credential that was ever committed or shared publicly.
