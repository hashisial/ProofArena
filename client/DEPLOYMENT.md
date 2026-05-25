# Frontend Deployment

The frontend is a Vite React app in `/client`.

## Required Environment Variable

Set this in Vercel or Netlify before production deploy:

```env
VITE_API_URL=https://your-backend-domain.com/api/v1
```

Use the deployed backend `/api/v1` URL, not `localhost`.

## Vercel

Deploy from the `/client` directory or set the Vercel project root directory to
`client`.

Build settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`

CLI flow:

```bash
cd client
vercel link
vercel env add VITE_API_URL production
vercel deploy --prod
```

The included `vercel.json` adds an SPA rewrite so `/admin` works on refresh.

## Netlify

Deploy from the `/client` directory or set the Netlify base directory to
`client`.

Build settings:

- Build command: `npm run build`
- Publish directory: `dist`

CLI flow:

```bash
cd client
netlify init
netlify env:set VITE_API_URL https://your-backend-domain.com/api
netlify deploy --build --prod
```

The included `netlify.toml` adds an SPA redirect so `/admin` works on refresh.
