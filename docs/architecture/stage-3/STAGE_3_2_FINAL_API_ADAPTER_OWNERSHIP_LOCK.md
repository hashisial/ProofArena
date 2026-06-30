# Stage 3.2 Final API Adapter Ownership Lock

Global rules for every row: use `client/src/services/apiClient.js`; never instantiate axios/fetch; base URL, tokens, global errors/normalization and API versioning remain platform-owned; request/response contracts must match real APIs.

| ID | Owner/category | Allowed/forbidden location | Specific security/normalization rule | Risk/validation | Stop | Human |
|---|---|---|---|---|---|---|
| FA-01 | Platform API client/ScaleOps | Existing client/contracts/endpoints only; never module copy | Sole token/base/interceptor/global error owner | Critical; auth/base/error/network tests | Second client/manual transport | Yes |
| FA-02 | Auth API/auth under platform | Current auth service/selected module; not business modules | Platform session/token handling; no local normalization drift | Critical; login/refresh/logout tests | Auth authority unclear | Yes |
| FA-03 | Profile adapter/profile | Current profile service; approved adapter later | Privacy/upload contracts; central auth/errors | High; public/private tests | Storage/client duplication | Yes |
| FA-04 | Offers adapter/offers | Current outcomeOffer service | Offer endpoints only; no payment/auth behavior | High; lifecycle tests | Parallel adapter/client | Yes |
| FA-05 | Challenges adapter/challenges | Current challenge service | Challenge endpoints only; no router/shell internals | High; role/status tests | Parallel adapter/client | Yes |
| FA-06 | Plans adapter/plans | Current executionPlan service | Plan endpoints only; no payment/proof internals | High; decision/contract tests | Parallel adapter/client | Yes |
| FA-07 | Proof adapter/proof | Current proofAsset service | Visibility/security types; no storage/auth logic | Critical; upload/access/redaction tests | Privacy/storage uncertainty | Yes |
| FA-08 | Matching adapter/matching | Current match service | Match endpoints; platform permissions | High; role/algorithm tests | Permission bypass | Yes |
| FA-09 | Messages adapter/messages | Approved HTTP boundary later; not socket/auth platform | HTTP contracts only; realtime remains platform | Critical; API/realtime/auth tests | Socket/session duplication | Yes |
| FA-10 | Payments adapter/payments | Existing payment facade only after approval | No secrets/provider config/fake state; server authoritative | Critical; webhook/idempotency tests | Payment authority unclear | Yes |
| FA-11 | Admin adapter/admin | Current admin service | Platform roles/backend auth; verify local normalization | Critical; negative-access/audit tests | Role/business ownership leak | Yes |

The platform API client source-of-truth is confirmed. No new adapter file is approved because current feature services already own executable request mapping.

