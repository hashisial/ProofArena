# Module Creation Readiness Matrix

| Module | Files | FE | BE/API/model | Routes/auth/shared clarity | Risk/tests | Human | Recommendation |
|---|---|---|---|---|---|---|---|
| auth | Yes | Existing mixed | Existing module + variants | Platform/security unclear | Critical; full auth suite | Yes | Blocked |
| profile | Yes | Strong | Variant-heavy | Auth/users/storage unclear | Critical; profile/auth tests | Yes | Create after dependency cleanup |
| offers | Yes | Strong | Strong chain | Moderate clarity | High; vertical tests | Yes | Empty folders later with caution only if approved |
| challenges | Yes | Strong | Strong chain | Moderate clarity | High; vertical tests | Yes | Empty folders later with caution only if approved |
| plans | Yes | Strong | Strong chain | Cross-domain | High; vertical tests | Yes | Empty folders later with caution only if approved |
| proof | Yes | Split features | Strong sensitive chain | Storage/auth unclear | Critical; security/data tests | Yes | Blocked |
| matching | Yes | Strong | Strong chain | Cross-domain | High; algorithm/role tests | Yes | Empty folders later with caution only if approved |
| messages | Partial | Page-centric | Realtime mixed | Auth/users/socket unclear | Critical; realtime/security tests | Yes | Blocked |
| payments | Partial | Page/service | Billing/payment mixed | Config/webhook/auth unclear | Critical; payment tests | Yes | Blocked |
| admin | Yes | Strong | Cross-domain chain | Role/shell critical | Critical; admin access tests | Yes | Blocked |

