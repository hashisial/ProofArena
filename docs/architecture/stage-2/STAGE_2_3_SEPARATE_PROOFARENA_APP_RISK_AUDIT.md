# Separate ProofArena App Risk Audit

## Result

No current separate ProofArena application was found. Risk is preventive and high impact, not an observed duplicate runtime.

| ID | Evidence | Summary | Risk type | Interpretation | Sev. | Action | Blocks closeout | Human |
|---|---|---|---|---|---|---|---|---|
| SA-01 | Root folders `client`, `server` | One frontend and one backend source root. | No-risk | Unified local repository. | Low | Preserve. | No | No |
| SA-02 | `client/src/main.jsx`; `App.jsx` | One frontend entry chain. | Separate-app-risk | No second ProofArena entry. | Critical if created | Stop on new entry. | No | Yes |
| SA-03 | `server/src/server.js`; `app.js` | One server listener/app. | Separate-app-risk | No second ProofArena server. | Critical if created | Stop on second app/listener. | No | Yes |
| SA-04 | `client/package.json`; `server/package.json` | Two runtime packages by tier, not by product. | No-risk | Client/server split is legitimate. | Low | Do not add product package. | No | Yes |
| SA-05 | Root `package-lock.json` | No workspace package graph. | No-risk | No ProofArena package boundary. | Low | Preserve; naming review only. | No | Yes |
| SA-06 | `client/src/modules/proofarena/README.md` | Explicitly rejects second router/API/layout/UI library. | Docs-only-risk | Strong prevention contract. | Low | Enforce. | No | No |
| SA-07 | `server/src/modules/proofarena/README.md` | Explicitly rejects second API/layer stack. | Docs-only-risk | Strong prevention contract. | Low | Enforce. | No | No |
| SA-08 | `client/src/routes/AppRoutes.jsx` | One route declaration tree. | Separate-router-risk | ProofArena routes are integrated. | Critical if forked | Keep one tree. | No | Yes |
| SA-09 | `client/src/layouts` | Shared public/auth/provider/client/admin layouts. | Separate-dashboard-risk | Role shells are not separate apps. | Critical if copied | Preserve ownership. | No | Yes |
| SA-10 | `client/src/config/navigation` | Public/provider/client/admin configs use shared metadata. | Separate-dashboard-risk | Specialized configs, one governance system. | High | Reuse/avoid product nav. | No | Yes |
| SA-11 | `client/src/services/apiClient.js` | One Axios transport owns base/auth/errors. | Separate-api-risk | No ProofArena API client. | Critical if copied | Use feature services through client. | No | Yes |
| SA-12 | `client/src/features/auth/AuthProvider.jsx`; auth store/guards | One frontend session/guard system. | Separate-auth-risk | No module auth provider. | Critical if copied | Reuse shared auth. | No | Yes |
| SA-13 | `server/src/app.js`; route registries | One Express composition with `/api` and `/api/v1`. | Separate-api-risk | Version groups share one app. | High | Preserve contract; do not fork server. | No | Yes |
| SA-14 | `client/vite.config.js`; client/server `vercel.json`; env config | Local config remains tier-based. | Separate-config-risk | No ProofArena-specific local deploy config found. | Critical/unknown | Verify external projects. | No | Yes |
| SA-15 | Product copy/assets/API health label | ProofArena branding is prominent. | Docs-only-risk | Branding can be misread as architecture authority. | Medium | Apply naming rule. | No | Yes |
| SA-16 | External GitHub/Vercel/domains | Not fully represented locally. | Unknown | Cannot prove external unification. | Unknown | Release-owner verification. | No | Yes |

