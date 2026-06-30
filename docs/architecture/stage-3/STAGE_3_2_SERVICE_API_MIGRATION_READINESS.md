# Service and API Migration Readiness

| Module | Existing services/API/raw usage | Adapter readiness | Blockers/tests | Human | Recommendation |
|---|---|---|---|---|---|
| auth | Client service plus multiple backend variants | Low | Security authority; full auth tests | Yes | Blocked |
| profile | Client service; backend profile/users variants | Medium | Model/users/storage; profile/auth tests | Yes | Dependency cleanup first |
| offers | Clear client/backend services | High | Vertical API/status tests | Yes | Ready after tests |
| challenges | Clear client/backend services | High | Role/lifecycle tests | Yes | Ready after tests |
| plans | Clear client/backend services | High | Cross-domain decision tests | Yes | Ready after tests |
| proof | Clear services but split client ownership/storage | Medium | Security/upload/model tests | Yes | Blocked |
| matching | Clear client/backend services | High | Role/algorithm tests | Yes | Ready after tests |
| messages | Page/API/socket/auth mix | Low | Realtime/identity ownership tests | Yes | Blocked |
| payments | Root billing/payment/Stripe paths | Low | Webhook/config/security tests | Yes | Blocked |
| admin | Clear service but cross-domain privileged API | Low | Role/audit/negative tests | Yes | Blocked |

Overall: four modules are adapter-ready after tests; one needs dependency cleanup; five remain blocked. No raw request migration or service move is authorized.

