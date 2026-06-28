# Duplicate Route Tree Audit

## Result

No parallel ProofArena frontend route tree exists. `AppRoutes.jsx` is the declaration owner; `constants/routes.js` plus route metadata provide route governance. Hardcoded references and legacy aliases remain cleanup concerns.

| ID | Route/group | Path | Type | Declared/referenced | Constant | Duplicate / parallel risk | Source candidate / action | Blocks closeout |
|---|---|---|---|---|---|---|---|---|
| RT-01 | Full frontend tree | `routes/AppRoutes.jsx` | Shared | All public/auth/dashboard/admin/client routes | Yes, primarily | High / none active | Declaration source; preserve. | No |
| RT-02 | Public group | `constants/routes.js`; `AppRoutes.jsx` | Public | Public pages/nav | Yes | Medium / no | Constants + metadata; link QA later. | No |
| RT-03 | Auth group | Same plus auth utils/guards | Auth | Login/register/recovery/verify | Yes | High / no | Shared auth routes. | No |
| RT-04 | Dashboard/provider group | Same | Dashboard/provider | Protected route nesting/nav | Yes | Critical / no | Shared tree/shell. | No |
| RT-05 | Client group | Same | Client | Client routes/nav | Yes | Critical / no | Shared tree/client shell. | No |
| RT-06 | Admin group | Same | Admin | Admin routes/nav/guard | Yes | Critical / no | Shared tree/admin shell. | No |
| RT-07 | Dynamic public profiles | `constants/routes.js` | Public | Profile/provider aliases | Yes | Medium / no | Preserve aliases until migration proof. | No |
| RT-08 | Dynamic challenge/offer | `constants/routes.js` | ProofArena module | Public and owner routes | Yes | High / no | Use builders/metadata. | No |
| RT-09 | Dynamic plan/match/proof | `constants/routes.js` | ProofArena dashboard | Role routes | Yes | High / no | Preserve contracts. | No |
| RT-10 | Redirects | `AppRoutes.jsx`; auth route utilities | Shared | Auth/legacy/role redirects | Mixed | High / no | Verify before consolidation. | No |
| RT-11 | 404/system | `AppRoutes.jsx`; system constants | Shared | NotFound/403/500 | Yes | Medium / no | One fallback source. | No |
| RT-12 | Route metadata | `config/routeMetadata.js` | Shared | Nav, labels, access metadata | Yes | High / no | Metadata source; do not fork. | No |
| RT-13 | Constants aggregator | `constants/index.js` | Shared | Re-exports route groups | Yes | Low / no | Aggregator, not second tree. | No |
| RT-14 | Route-shell components | `pages/RouteShells.jsx` | Mixed | Many public/admin placeholders | Yes | Medium / no | Partial pages, not route authority. | No |
| RT-15 | Backend legacy registry | `server/src/routes/index.js` | API | Mounted at `/api` | N/A | High overlap / no separate app | Preserve contracts; inspect per endpoint later. | No |
| RT-16 | Backend v1 registry | `server/src/routes/v1/index.js` | API v1 | Mounted at `/api/v1` | N/A | High overlap / no separate app | Versioned source for module domains. | No |
| RT-17 | ProofArena router file | Not found | ProofArena module | None | N/A | Critical if created | Register through RT-01. | No |
| RT-18 | Hardcoded paths | Pages/components/services from Stage 1.2 audit | Mixed | Scattered references | No/mixed | Medium / no | Stage 4 consolidation after tests. | No |

