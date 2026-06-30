# Stage 3.2 Service Contract Verification

| ID | Path | Pattern | Correct owner | Status | Risk | Future action | Human |
|---|---|---|---|---|---|---|---|
| SV-01 | `client/src/services/apiClient.js` | Sole axios instance, token/base/error handling | platform service/client | compliant | Critical if duplicated | Protect | Yes |
| SV-02 | Feature `*Service.js` files | Use API_ENDPOINTS and platform `api` | module service/API adapter | compliant with caution | High duplicate adapter risk | Keep combined until tested split | Yes |
| SV-03 | `client/src/services/api.js` | Compatibility facade imports features and normalizes some payloads | platform compatibility | violation/suspicious | High reverse dependency | Trace consumers; no new callers/templates | Yes |
| SV-04 | `client/src/services/shared/*` | Neutral query/collection mapping | shared service helper | compliant with caution | High if domain rules enter | Purity/consumer tests | Yes |
| SV-05 | `features/auth/authService.js` | Uses canonical client/error normalization | auth under platform | compliant with caution | Critical security | Preserve authority; auth tests | Yes |
| SV-06 | `features/admin/adminService.js` | Uses canonical client; resource maps and list normalization | admin | compliant with caution | High admin dumping-ground risk | Keep moderation-only; contract tests | Yes |
| SV-07 | `pages/Payments.jsx` via `services/api.js` | UI consumes payment facade functions | payment/platform compatibility | suspicious | Critical payment boundary | Move only after payment adapter contract | Yes |
| SV-08 | Server route files | Target scan found no direct model imports | backend route/controller layering | compliant | Medium incomplete scan risk | Maintain thin routes | Yes |
| SV-09 | `server/src/services/challenge.service.js` | Imports multiple domain/account models and DB helper | backend module service | suspicious | High cross-domain coupling | Public contracts/transaction review | Yes |
| SV-10 | Backend target services | Business logic remains in service layer | backend module services | compliant with caution | High partial-move risk | Service-by-service graph and tests | Yes |
| SV-11 | Auth service/controller/middleware variants | Multiple compatibility authorities | platform auth | violation/blocked | Critical security divergence | Select runtime authority | Yes |
| SV-12 | Messaging auth/service/socket boundaries | Domain and platform concerns mixed | message plus platform service | suspicious | Critical auth/realtime | Architecture/security review | Yes |
| SV-13 | Billing/marketplace payment services | Sensitive provider/webhook operations | payment-sensitive | blocked | Critical financial/security | Provider/idempotency/webhook review | Yes |
| SV-14 | Admin backend service | Cross-domain moderation | admin orchestration | suspicious | Critical privilege/business leakage | Public domain commands only | Yes |
| SV-15 | Client-wide scan | No second axios instance and no raw fetch found | platform client | compliant | Low current duplicate-client risk | Add boundary/lint checks later | No |

