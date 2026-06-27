# Stage 1.2 Final Validation Command Checklist

Generated: 2026-06-27

No command was added to package scripts. Run commands from the repository root unless noted.

| Command | Directory | Validates | When | Failure means | Script available | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `npm ci` | `client` | Exact client lockfile install | Clean CI/baseline only | Lockfile/dependency/environment issue | Standard npm command; lockfile present | Installation is not part of this audit. |
| `npm ci` | `server` | Exact server lockfile install | Clean CI/baseline only | Lockfile/dependency/environment issue | Standard npm command; lockfile present | Node >=20 required by server. |
| `npm run lint` | `client` | ESLint rules | Before/after frontend cleanup | Syntax/style/hooks/import issue | Yes | No server lint script found. |
| `npm run build` | `client` | Vite production bundle/import resolution | Before/after frontend cleanup | Build/import/env/client compile regression | Yes | Not a behavioral test. |
| `npm run check:boundaries` | `client` | Module boundary script | Before/after frontend architecture change | Boundary violation | Yes | Executes `scripts/check-module-boundaries.mjs client`. |
| `npm run check:boundaries` | `server` | Server module boundary script | Before/after backend architecture change | Boundary violation | Yes | No server build/lint/test script found. |
| `npm run dev` | `client` | Local Vite runtime | Manual browser QA | Runtime/env/UI issue | Yes | Use only when performing an approved implementation/QA prompt. |
| `npm run preview` | `client` | Built client preview | Post-build browser QA | Build artifact/runtime issue | Yes | Requires successful build. |
| `npm run dev` | `server` | Local nodemon API runtime | Manual API QA | Runtime/env/database issue | Yes | Requires environment/services; do not expose secrets. |
| `npm start` | `server` | Production-style Node startup | Approved release check | Startup/env/database issue | Yes | Not run by this audit. |
| Test command | Client/server | Behavioral regression | Required before risky cleanup | Test gap remains | **Not found** | Must be added only in an approved future testing prompt. |
| Typecheck command | Client/server | Static type validation | Desirable baseline | Typecheck gap remains | **Not found** | Project source is primarily JS/JSX. |
| Root aggregate command | Root | Full-stack validation | Desired future CI | No aggregate runner exists | **Not found** | Root has an empty package-lock but no package.json. |

## Minimum Future Validation

Frontend-only low-risk change: client lint, build, boundary check, affected manual QA.

Backend-only change: server boundary check, startup/API checks, target contract tests once available.

Route/layout/auth/API cleanup: all relevant commands plus the full QA matrix and newly created behavioral tests. A green build alone is insufficient.

