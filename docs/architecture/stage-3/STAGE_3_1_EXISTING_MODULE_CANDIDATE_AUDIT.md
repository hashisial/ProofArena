# Stage 3.1 Existing Module Candidate Audit

Authority note: this is Prompt 1 supporting evidence. Later Stage 3 ownership and closeout locks remain controlling where they are stricter.

All paths were inspected in the current unified repository. Path groups describe candidates only; they do not authorize moves, copies, imports, or module creation.

| Candidate ID | File or folder | Current purpose | Suggested owner | Confidence | Reason | Current dependencies | Risk if moved later | Remain platform-owned | Human review |
|---|---|---|---|---|---|---|---|---|---|
| MC-01 | `client/src/features/auth/*` | Auth provider, service, role checks, hooks, forms | auth/platform | High | Direct identity and session behavior | auth store, API client, routes, guards | Critical: session or guard divergence | Yes, security core | Yes |
| MC-02 | `server/src/modules/auth/*` | Existing backend auth module | auth/platform | High | Already organized as a module | app registration, users, middleware | Critical: duplicate auth runtime | Yes, security core | Yes |
| MC-03 | `server/src/routes/authRoutes.js`, `routes/v1/auth.routes.js`, auth controller/service/middleware variants | Compatibility and versioned auth paths | auth/platform | Medium | Multiple runtime candidates exist | route registry, users, middleware | Critical: unknown authority and compatibility break | Yes until selected | Yes |
| MC-04 | `client/src/features/profile/*`, `components/profile/*`, `pages/profile/*`, profile pages | Profile workflows and presentation | profile | High | Cohesive profile language and consumers | auth, API, routes, shared UI | High: public/private profile regression | No, except platform dependencies | Yes |
| MC-05 | Server profile routes/controllers/services/validators/models | Profile API and persistence | profile/users | Medium | Domain chain exists but has duplicate variants | auth, users, storage, models | Critical: data-contract divergence | Unknown pending users decision | Yes |
| MC-06 | `client/src/features/outcomeOffers/*`, `components/outcomeOffers/*`, offer pages | Outcome-offer lifecycle | offers | High | Cohesive feature/service/hook/UI chain | auth, profile, proof, routes, API | High: partial vertical move | No | Yes |
| MC-07 | Server outcome-offer route/controller/service/model/validator files | Outcome-offer API and data | offers | High | Full backend chain exists | auth, profile, challenge, proof | High: route/model mismatch | No | Yes |
| MC-08 | `client/src/features/challenges/*`, `components/challenges/*`, challenge pages | Challenge lifecycle | challenges | High | Cohesive domain chain | profile, plans, matching, auth, API | High: cross-domain break | No | Yes |
| MC-09 | Server challenge route/controller/service/model/validator files | Challenge API and persistence | challenges | High | Full backend chain exists | auth, profile, plans | High: API/model mismatch | No | Yes |
| MC-10 | `client/src/features/executionPlans/*`, `components/executionPlans/*`, plan pages | Execution-plan lifecycle | plans | High | Cohesive plan feature chain | challenges, proof, profile, API | High: partial slice or cycle | No | Yes |
| MC-11 | Server execution-plan route/controller/service/model/validator files | Plan API and persistence | plans | High | Full backend chain exists | challenge, profile, proof | High: workflow regression | No | Yes |
| MC-12 | `client/src/features/proof/*`, `features/proofAssets/*`, `components/proof/*`, proof pages | Proof readiness, assets, vault UI | proof | High | Two feature signals describe one sensitive domain | auth, storage, profile, plans | Critical: visibility or storage regression | No, but platform storage remains external | Yes |
| MC-13 | Server proof-asset route/controller/service/model/validator files | Proof API and data | proof | High | Full sensitive backend chain exists | auth, storage, profile | Critical: private data exposure | No, except storage/security | Yes |
| MC-14 | `client/src/features/matches/*`, `components/matches/*`, match pages | Matching workflows | matching | High | Cohesive feature chain | challenges, profile, auth, API | High: role or scoring regression | No | Yes |
| MC-15 | Server match route/controller/service/model/validator files | Match API and persistence | matching | High | Full backend chain exists | challenge, profile, auth | High: algorithm/data mismatch | No | Yes |
| MC-16 | `client/src/pages/Messages.jsx`; message backend and socket files | Messaging UI, API, realtime events | messages/platform | Medium | Domain and realtime platform concerns are mixed | auth, users, socket, API | Critical: authorization or realtime break | Partially | Yes |
| MC-17 | `server/src/services/messagingAuthService.js`, messaging middleware | Messaging authorization | auth/messages platform contract | Medium | Crosses module and security boundaries | auth middleware, users, socket | Critical: bypass or duplicate policy | Yes until contract exists | Yes |
| MC-18 | `client/src/pages/Payments.jsx`; billing/payment frontend calls | Payment-facing workflow | payments/platform | Medium | Product UI exists without a clean module boundary | auth, API, billing | Critical: unsafe financial behavior | Partially | Yes |
| MC-19 | Billing and marketplace-payment routes/controllers/services/models/webhooks | Billing and marketplace payment processing | payments/platform | Medium | Multiple payment contexts and webhook constraints | Stripe, auth, env, raw-body handling | Critical: payment or webhook failure | Partially | Yes |
| MC-20 | `client/src/features/admin/*`, `components/admin/*`, `pages/Admin*` | Moderation and admin UI | admin/platform | High | Cohesive admin surface uses privileged platform systems | roles, API, layouts, all domains | Critical: privilege or shell regression | Partially | Yes |
| MC-21 | Admin routes/controllers/services/validators/middleware | Admin API and moderation | admin/platform | High | Cross-domain privileged chain | auth, roles, all domain services | Critical: authorization regression | Partially | Yes |
| MC-22 | `client/src/routes/*`, `constants/routes.js`, route metadata | Route declaration and path governance | platform routing | High | Global composition used by all modules | pages, auth, navigation, layouts | Critical: parallel route tree | Yes | Yes |
| MC-23 | `client/src/config/navigation/*`, navigation components, `client/src/layouts/*` | Public and dashboard navigation/shells | platform shell/navigation | High | Global role-aware composition | routes, auth, dashboard | Critical: duplicate shell/navigation | Yes | Yes |
| MC-24 | `client/src/services/apiClient.js` and platform API contracts/errors | HTTP transport | platform API | High | Owns shared base URL, auth, errors, response behavior | env, auth, all services | Critical: transport divergence | Yes | Yes |
| MC-25 | `client/src/components/ui/*`, `components/common/*` | Generic and mixed reusable UI | shared-governed | Medium | Consumer scope varies | pages, features, styles | High: feature leakage or duplicate UI | Shared-governed | Yes for ambiguous items |
| MC-26 | Root `hooks`, `services`, `utils`, `types`, `constants` | Mixed platform, compatibility, and domain helpers | shared/platform/unknown | Medium | Confirmed reverse imports and mixed consumers | features, pages, API, routes | High: cycles and ownership inversion | Unknown by file | Yes |
| MC-27 | Server `utils`, `constants`, `config`, errors, middleware | Backend platform/shared concerns | platform/shared | High | Cross-cutting runtime behavior | all routes and services | Critical: response/security/config split | Yes | Yes |
| MC-28 | `client/src/sections/home/*` and public marketing pages | ScaleOps public and ProofArena flagship composition | public marketing | High | Public product presentation, not a target domain module | public layout, navigation, shared UI | Medium: branding/platform confusion | No, but outside target modules | No |
| MC-29 | `client/src/modules/proofarena/*`, `server/src/modules/proofarena/*` | Existing ProofArena composition boundary | ProofArena composition | High | Existing module identity must not be duplicated by domain modules | stores, shared platform, docs | High: nested standalone architecture | No separate domain copies | Yes |
| MC-30 | `server/src/modules/users/*` | Existing user account/identity boundary | platform/users with profile overlap | Medium | Overlaps auth and profile ownership | auth, profile, models | Critical: duplicate identity/profile models | Yes until human decision | Yes |

## Audit Result

- Candidate groups: 30.
- Target modules with strong domain signals: all ten.
- Safe production moves authorized: none.
- Missing mandatory authority documents: none.
- Primary blockers: auth/profile variants, proof security, realtime ownership, payments/webhooks, admin authorization, cross-module tests, and human approval.

