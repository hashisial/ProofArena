# Standalone Drift Blast Radius Report

| Risk | Drift/type and paths | What breaks / affected surfaces | User impact | Developer impact | Detection / prevention | Future action | Blocks 2.3 |
|---|---|---|---|---|---|---|---|
| SD-01 | Separate app/repo: root, client, server | All routes/layouts/auth/API/models/docs diverge | Split identity/data/session | Duplicate releases and migrations | Package/entry scan; IC-01/02 | Human-approved ADR only | Yes |
| SD-02 | Route tree: `AppRoutes.jsx`, constants | Links, redirects, guards, 404, public/dashboard routes | Broken or unauthorized navigation | Two route authorities | Route declaration scan; IC-03 | Stage 4 governance | Yes |
| SD-03 | Dashboard shell: role layouts | Provider/client/admin navigation and guard context | Inconsistent access/workflows | Duplicate shell maintenance | Layout import scan/visual QA; IC-05 | Test before shell work | Yes |
| SD-04 | Public nav: navigation config/layout | Header/mobile/footer route discovery | Dead or conflicting links | Multiple nav catalogs | Link/config scan; IC-06 | Stage 22 governance | No |
| SD-05 | API client: `services/apiClient.js` | Base URL, refresh, cookies, errors, all domain APIs | Failed sessions/data calls | Divergent request behavior | Fetch/axios scan; IC-07/08 | Stage 5 contract work | Yes |
| SD-06 | Auth/roles: client guards/store, server middleware | Protected routes/endpoints/admin/payment/proof | Security exposure or lockout | Conflicting identity state | Guard/middleware scan; IC-09/10 | Stage 23/26 review | Yes |
| SD-07 | Backend stack: app/routes/services/models | `/api/v1`, domain contracts, errors, DB ownership | Data inconsistency/outages | Parallel domain implementation | App/listener/import scan; IC-11/13 | Vertical migrations only | No |
| SD-08 | DB/model boundary: server config/models | Challenge/offer/proof/provider relationships | Lost or split data | Migration/index drift | Connection/model scan; model map | Data-owner approval | No |
| SD-09 | Config/deploy: Vite/env/Vercel/external | Domains, secrets, CORS, release topology | Wrong backend or inaccessible app | Split environments | Local diff plus external review; IC-17 | Release-owner verification | Yes |
| SD-10 | Branding confusion: copy/assets/API label | Docs and future architecture decisions | Mostly indirect | Engineers infer wrong ownership | Terminology review; IC-16 | Human naming decision | No |
| SD-11 | Future prompt duplication: all controls | Any protected route/layout/API/auth/navigation system | Regression varies by system | Repeated cleanup and authority drift | Preflight/stop-ship; all IC rules | Enforce Prompt 6/Stage 2.3 locks | Yes |

