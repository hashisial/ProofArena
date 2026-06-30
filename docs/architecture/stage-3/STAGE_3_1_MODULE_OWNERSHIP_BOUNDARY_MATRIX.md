# Module Ownership Boundary Matrix

| Module | Pages | Components | Hooks | FE services/API | Routes | Controllers | BE services | Models | Types | Shared UI/utils | Must not own | Platform dependency | Risk | Human |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| auth | Partial | Yes | Yes | Yes | Partial | Partial | Partial | Partial | Yes | Yes/Yes | router, API client, global role/config | auth store, guards, middleware | Critical | Yes |
| profile | Yes | Yes | Yes | Yes | Partial | Partial | Partial | Partial | Yes | Yes/Yes | auth credentials, router/storage platform | auth, API, storage | High | Yes |
| offers | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | Yes/Yes | router/payments/auth | API, auth, profile/proof | High | Yes |
| challenges | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | Yes/Yes | route/nav/shell | auth, API, profile | High | Yes |
| plans | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | Yes/Yes | route/shell/auth | challenges/proof/API | High | Yes |
| proof | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | Yes/Yes | auth/storage platform | storage, API, profile | Critical | Yes |
| matching | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | Yes/Yes | identity/route policy | challenges/profile/auth | High | Yes |
| messages | Yes | Partial | Partial | Partial | Yes | Yes | Partial | Yes | Partial | Yes/Yes | auth identity/socket platform | auth/users/realtime | Critical | Yes |
| payments | Yes | Partial | Partial | Partial | Yes | Yes | Yes | Yes | Partial | Yes/Yes | env/Stripe/webhook/global billing | auth/API/config | Critical | Yes |
| admin | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Partial | Partial | Yes/Yes | role system/router/admin shell | auth/roles/all domains | Critical | Yes |

