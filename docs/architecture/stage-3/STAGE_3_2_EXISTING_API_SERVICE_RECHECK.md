# Existing API and Service Recheck

| File/path | Current purpose | Proposed module/owner | API client dependency | Duplicate risk | Move readiness | Future action |
|---|---|---|---|---|---|---|
| `client/src/services/apiClient.js` | Canonical Axios/base/auth/error transport | platform | Self | Critical if copied | Do not move | Keep sole client. |
| `client/src/services/api.js` | Broad service facade/legacy exports | platform/shared mixed | Canonical client | High overlap | Blocked | Trace consumers and split later. |
| `client/src/services/apiContracts.js`; `apiErrors.js` | Global response/error semantics | platform | Canonical client | High | Do not move | Preserve. |
| `client/src/features/auth/authService.js` | Auth API operations | auth/platform | Canonical client | High | Blocked | Keep until security migration. |
| `features/profile/profileService.js` | Profile API operations | profile | Canonical client | Medium | Tests + review | Future adapter candidate. |
| `features/outcomeOffers/outcomeOfferService.js` | Offer API operations | offers | Canonical client | Low | Tests first | Future adapter candidate. |
| `features/challenges/challengeService.js` | Challenge API operations | challenges | Canonical client | Low | Tests first | Future adapter candidate. |
| `features/executionPlans/executionPlanService.js` | Plan API operations | plans | Canonical client | Low | Tests first | Future adapter candidate. |
| `features/proofAssets/proofAssetService.js` | Proof API operations | proof | Canonical client | Medium | Blocked | Security/storage review. |
| `features/matches/matchService.js` | Match API operations | matching | Canonical client | Low | Tests first | Future adapter candidate. |
| `features/admin/adminService.js` | Admin API operations | admin/platform | Canonical client | High | Blocked | Role/security review. |
| Message/billing functions in root services/hooks/pages | Messaging/payment calls | messages/payments/platform | Canonical helpers | High | Blocked | Identify owned adapters later. |
| Target pages found by request grep | Direct helper use from pages/components | target modules | Usually imported API helpers | Medium | Blocked | Move behind hooks/services only during tested migration. |
| `server/src/services/auth.service.js`; `authService.js`; module auth service | Auth business variants | auth/platform | N/A | Critical | Blocked | Runtime authority/security review. |
| `server/src/services/profile.service.js`; `userProfileService.js` | Profile/user operations | profile/users | N/A | High | Blocked | Resolve model/service ownership. |
| `server/src/services/outcomeOffer.service.js` | Offer operations | offers | N/A | Low | Tests first | Vertical candidate. |
| `server/src/services/challenge.service.js` | Challenge operations | challenges | N/A | Low | Tests first | Vertical candidate. |
| `server/src/services/executionPlan.service.js` | Plan operations | plans | N/A | Low | Tests first | Vertical candidate. |
| `server/src/services/proofAsset.service.js` | Proof operations | proof | N/A | Medium | Blocked | Security/data tests. |
| `server/src/services/match.service.js` | Match operations | matching | N/A | Low | Tests first | Vertical candidate. |
| `server/src/services/messagingAuthService.js` and message controller/socket | Messaging authorization/operations | messages/platform | N/A | High | Blocked | Realtime/auth contract. |
| `server/src/services/marketplacePaymentService.js`; billing controller logic | Payment operations | payments/platform | N/A | Critical | Blocked | Stripe/webhook review. |
| `server/src/services/admin.service.js` | Admin operations | admin/platform | N/A | High | Blocked | Privilege/policy review. |
| Other `server/src/services/*` | Mixed platform/domain adapters | shared/platform/unknown | N/A | High | Blocked | Stage 3.3 consumer inventory. |

No new API client is required or allowed.

