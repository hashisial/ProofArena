# Module API Adapter Contract

Every frontend adapter must call the approved ScaleOps client in `client/src/services/apiClient.js` and endpoint governance in `client/src/constants/apiEndpoints.js`.

| Module | Allowed adapter responsibility | Forbidden responsibility | Required validation |
|---|---|---|---|
| auth | Approved auth endpoint operations only | New client, token/session/interceptor logic | Login/refresh/logout/error/security tests |
| profile | Profile CRUD/media/privacy/verification operations | Credentials or storage-client ownership | Public/private/auth/upload contract tests |
| offers | Offer CRUD/lifecycle endpoint mapping | Payments/auth/global normalization | Public/protected offer tests |
| challenges | Challenge CRUD/lifecycle endpoint mapping | Route ownership or plan/match internals | Role/status contract tests |
| plans | Plan CRUD/decision endpoint mapping | Challenge/proof business internals | Client/provider decision tests |
| proof | Proof asset endpoint mapping | Storage client/token/global errors | Upload/authorization/data tests |
| matching | Match query/action endpoint mapping | Identity/session or challenge persistence | Role/algorithm contract tests |
| messages | Conversation/message endpoint mapping | Socket platform/auth identity | Realtime/API/auth tests |
| payments | Billing/payment endpoint mapping | Stripe configuration/webhook/token logic | Payment/webhook/security tests |
| admin | Moderation endpoint mapping | Role policy/admin shell/global API | Admin negative-access/audit tests |

Rules: adapters never own base URL, headers, cookies, refresh, interceptors, global response normalization, global error classes, routing, or UI state. UI components call hooks/services when those abstractions exist; direct backend calls from components are forbidden.

