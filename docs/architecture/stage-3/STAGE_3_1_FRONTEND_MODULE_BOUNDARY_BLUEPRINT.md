# Stage 3.1 Frontend Module Boundary Blueprint

Authority note: this is a future structure proposal, not a source-edit authorization.

## Allowed Internal Structure

When a module passes its approval gate, its existing-convention path may contain `components/`, `pages/` or `views/`, `hooks/`, `services/`, `api/` or `adapters/`, `types/`, `utils/`, `constants/`, `validation/`, and an `index` export only after barrel usage is verified. Every item must be module-specific. API adapters must use `client/src/services/apiClient.js`.

## Forbidden Frontend Patterns

- Module-owned router, route tree, route catalog, navigation, dashboard shell, sidebar, layout, auth provider/store/guard, API client instance, config/env, or deployment boundary.
- Backend imports, hardcoded route paths where governed constants exist, feature logic in shared UI, fake production data, deep imports into another module, circular dependencies, or unapproved barrels.

| Module | Recommended future path | Existing candidate files | Safe to create now | Protected files/systems | Validation before production changes |
|---|---|---|---|---|---|
| auth | Existing `client/src/features/auth` until an approved migration path exists | Auth feature, `pages/Auth.jsx`, auth types; platform store/routes remain external | No | AuthProvider/store, guards, routes, API client | Session hydration, redirects, negative role tests, build/lint |
| profile | Existing profile feature boundary pending one approved module convention | Profile feature/components/pages/config/types/utils | No | Auth, routes, storage, API client | Public/private profile, onboarding, upload/privacy, import graph |
| offers | Existing `features/outcomeOffers` boundary pending vertical migration approval | Outcome-offer feature/components/pages | No; later candidate after tests and approval | Routes, auth, API client, payments | Offer CRUD/status/public/protected tests and build |
| challenges | Existing `features/challenges` boundary pending vertical migration approval | Challenge feature/components/pages | No; later candidate after tests and approval | Routes, dashboard shell, auth, API client | Discovery/create/apply/role tests and build |
| plans | Existing `features/executionPlans` boundary pending vertical migration approval | Plan feature/components/pages | No; later candidate after tests and approval | Routes, shell, auth, payments | Builder/review/status/cross-module tests and build |
| proof | Existing proof/proofAssets locations until ownership is consolidated | Proof and proofAssets features, proof components/pages | No | Auth, storage, routes, API client, visibility policy | Upload/access/redaction/public-private/security tests |
| matching | Existing `features/matches` boundary pending vertical migration approval | Match feature/components/pages | No; later candidate after tests and approval | Auth/roles, routes, API client | Scoring/recommendation/role/empty-state tests and build |
| messages | Existing page/service locations until realtime contract exists | `pages/Messages.jsx` and message-facing hooks/services | No | Auth/session, socket runtime, routes, API client | Reconnect, authorization, thread/message and failure tests |
| payments | Existing payment/billing locations until payment architecture is approved | `pages/Payments.jsx` and billing/payment calls | No | Auth, API client, env/config, Stripe/webhook systems | Payment intent/webhook/idempotency/error/security tests |
| admin | Existing admin feature/components/pages under platform admin shell | Admin feature, admin components/pages | No | AdminLayout, AdminGate, navigation, roles, routes, API client | Negative authorization, route guard, moderation and shell tests |

No frontend module folder or README scaffold is approved by Prompt 1.

