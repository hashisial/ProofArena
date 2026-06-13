# Backend Deployment

This backend is prepared for Railway or Render.

## Required Environment Variables

Set these in the hosting provider dashboard:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
CLIENT_URL=https://your-frontend-domain.com
SERVER_URL=https://your-backend-domain.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<strong-password>
JWT_ACCESS_SECRET=<long-independent-random-secret>
JWT_REFRESH_SECRET=<different-long-independent-random-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JSON_LIMIT=1mb
```

`PORT` is usually provided by the host. The centralized environment validator
requires it in production and reads it before the server starts.

## Railway

Use the repository root as the service source. `railway.json` builds and starts
only the `/server` package:

```bash
npm ci --prefix server
npm start --prefix server
```

Health check path:

```text
/api/health
```

## Render

Use the root `render.yaml` Blueprint. It sets:

- `rootDir: server`
- `buildCommand: npm ci`
- `startCommand: npm start`
- `healthCheckPath: /api/health`

Render will ask for the secret environment variable values because the Blueprint
uses `sync: false` for secrets.

## Production Checks

Before deploy:

```bash
cd server
npm start
```

Then verify:

```bash
curl http://localhost:5000/api/health
```
