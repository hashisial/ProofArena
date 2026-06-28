# ProofArena Standalone Drift Risk Register

| ID | Risk | Evidence/systems | Sev. | Likelihood | Blast radius | Prevention / detection | Owner | Blocks 2.3 | Blocks production edits | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| SD-01 | Separate ProofArena app/repo | Root, `client`, `server`, module READMEs | Critical | Medium | Entire product | ADR gate; package/entry scan | Architecture | Yes | Yes | Open |
| SD-02 | Parallel route tree | `AppRoutes.jsx`, route constants | Critical | Medium | Navigation/auth/404 | Route lock; route declaration scan | Stage 4 | Yes | Yes | Open |
| SD-03 | Parallel dashboard shell | Dashboard/client/admin layouts | Critical | Medium | All protected workflows | Layout ownership and visual QA | Stage 36 | Yes | Yes | Open |
| SD-04 | Separate public navigation | `publicNavigation.js`, public layout | High | Medium | Public discovery/mobile nav | Navigation source lock/link QA | Stage 22 | No | Yes | Open |
| SD-05 | Separate API client | `services/apiClient.js` | Critical | Medium | Auth/base URL/error handling | API source lock/request scan | Stage 5 | Yes | Yes | Open |
| SD-06 | Separate auth/role system | Auth feature/store/routes/server middleware | Critical | Low | Security and access | Guard/middleware audits | Stage 23/26 | Yes | Yes | Open |
| SD-07 | Separate backend service stack | Server route/controller/service/model layers | High | Medium | API contracts/business logic | Boundary check and flow map | Stage 3/5 | No | Yes | Open |
| SD-08 | Separate model/database namespace | Server models/config | Critical | Low | Stored data/integrity | Model usage review/migration gate | Data owner | No | Yes | Open |
| SD-09 | Separate config/deployment | Vite/env/server/Vercel config | Critical | Unknown | Build, secrets, release | External topology review; config diff | Release owner | Yes | Yes | Open |
| SD-10 | Branding implies architecture ownership | Health payload, public copy, asset names | Medium | High | Developer decisions | Identity audit and terminology rules | Product/architecture | No | No | Accepted temporarily |
| SD-11 | Future prompt creates duplicate systems | All protected systems | High | Medium | Cross-cutting | Mandatory preflight and stop-ship checklist | Every prompt | Yes | Yes | Open |

