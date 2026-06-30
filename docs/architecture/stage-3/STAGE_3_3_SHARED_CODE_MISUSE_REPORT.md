# Shared Code Misuse Report

| ID | Evidence | Misuse/concern | Risk | Recommendation |
|---|---|---|---|---|
| MU-01 | `client/src/hooks/useMyProfile.js` imports profile/dashboard features | Shared-like root hook depends on features. | High | Future profile/dashboard owner or approved facade. |
| MU-02 | `client/src/hooks/useMyDashboard.js` imports dashboard feature | Root hook is feature-specific. | High | Keep platform/dashboard-owned. |
| MU-03 | `client/src/hooks/useAuth.js` re-exports feature auth hook | Shared-root auth bridge. | Critical | Freeze; platform auth migration only. |
| MU-04 | `client/src/services/api.js` imports auth/dashboard/profile feature services | Root service facade reverses feature dependency. | High | Trace consumers; do not expand. |
| MU-05 | Root admin/lead/outreach hooks | Feature logic under generic hooks root. | High | Assign module/platform owners later. |
| MU-06 | `utils/challengeNextAction.js` | Challenge-specific utility in generic root. | Medium | Future challenges owner. |
| MU-07 | `utils/proofReadiness.js`; provider/profile helpers | Domain-specific utilities in generic root. | High | Future domain ownership after tests. |
| MU-08 | `utils/constants.js` fallback product data | Product/mock data in shared-like constants utility. | High | Keep classified; retire with real data/empty states. |
| MU-09 | `types/profile.js`; profile readiness types | Module-specific types in root types. | Medium | Future profile types after ownership approval. |
| MU-10 | Common placeholder components | Product/page placeholders in `components/common`. | Medium | Not approved shared UI; retire per surface. |
| MU-11 | UI/common/navigation PageHeader/Footer/BackButton overlaps | Multiple shared-like visual owners. | High | Consumer/behavior comparison before consolidation. |
| MU-12 | Server target-domain services in root services | Module logic mixed with platform adapters. | High | Vertical module migration later, no copies. |
| MU-13 | Server auth/profile helper variants in utils/constants/services | Security/domain logic under broad roots. | Critical | Human/security ownership review. |
| MU-14 | Shared roots contain route/auth/API platform logic | Generic shared classification could duplicate governance. | Critical | Keep platform-owned; exclude from shared catalog. |

High-risk count: **10** (`MU-01` through `MU-05`, `MU-07`, `MU-08`, `MU-11` through `MU-14`); four are medium.

