# Stage 3.2 API Adapter Ownership Contract

An API adapter is a thin module-specific wrapper around `client/src/services/apiClient.js`; it is not a new client.

| ID | Owner/category | Allowed location | Forbidden location | Platform client | Base/token/error/normalization/version/type/security rule | Duplicate risk | Validation |
|---|---|---|---|---|---|---|---|
| AC-01 | Platform API client/ScaleOps | `client/src/services/apiClient.js` and platform contracts | Any module copy | N/A | Sole base URL, token/cookie, interceptor, global error/envelope owner | Critical | Auth/base/error/network tests |
| AC-02 | Generic module adapter/module | Current feature service; approved `api`/`adapters` later | Components/shared UI/new client root | Required | No base/token/manual auth/global normalization/version root; typed real contract | Critical | Request/response/error/auth tests |
| AC-03 | Auth adapter/auth under platform | Existing auth service/module authority | Business modules | Required | Platform session/token handling only; sensitive human review | Critical | Login/refresh/logout/security tests |
| AC-04 | Profile adapter/profile | Current profile service; approved adapter later | Components/storage client | Required | Profile endpoints/types; platform auth/errors; privacy rules | High | Public/private/upload tests |
| AC-05 | Offers adapter/offers | Current outcomeOffer service | Payments/auth/router | Required | Offer endpoints/types only | High | Public/protected lifecycle tests |
| AC-06 | Challenges adapter/challenges | Current challenge service | Router/shell/other internals | Required | Challenge endpoints/types only | High | Role/status/application tests |
| AC-07 | Plans adapter/plans | Current executionPlan service | Payment execution/other internals | Required | Plan endpoints/types only | High | Provider/client decision tests |
| AC-08 | Proof adapter/proof | Current proofAsset service | Storage/auth/global error logic | Required | Proof endpoints/types with visibility/security | Critical | Upload/access/redaction tests |
| AC-09 | Matching adapter/matching | Current match service | Permission/identity logic | Required | Match endpoints/types; platform roles | High | Role/algorithm tests |
| AC-10 | Messages adapter/messages | Existing message service boundary after review | Socket/auth platform | Required | HTTP message endpoints only; socket platform remains external | Critical | API/realtime/auth tests |
| AC-11 | Payments adapter/payments | Existing billing/payment service after approval | Components/shared/secrets/provider client | Required | No secrets/provider config/fake state; server authoritative | Critical | Payment/webhook/idempotency tests |
| AC-12 | Admin adapter/admin | Existing admin service | Shared/unrelated modules | Required | Admin endpoints/types; platform roles and backend authorization | Critical | Negative-access/audit tests |

No adapter may instantiate axios/fetch, manually handle tokens, bypass centralized errors, define a second API version, or invent request/response behavior.

