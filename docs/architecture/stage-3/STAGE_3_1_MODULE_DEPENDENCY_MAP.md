# Module Dependency Map

| Module | Routes | Shell | Auth/role | API client | Backend layers | Shared UI/utils | Config | Other modules | Duplication risk | Required docs |
|---|---|---|---|---|---|---|---|---|---|---|
| auth | Yes | Auth layout | Yes | Yes | Yes | Yes | Yes | users/profile | Critical | Auth/Stage 2 locks |
| profile | Yes | Public/dashboard | Yes | Yes | Yes | Yes | Storage | auth/users/proof | High | Profile/model maps |
| offers | Yes | Public/dashboard | Yes | Yes | Yes | Yes | No direct | profile/proof/payments | High | Route/API maps |
| challenges | Yes | Public/client | Yes | Yes | Yes | Yes | No direct | profile/plans/matching | High | Route/API maps |
| plans | Yes | Dashboard/client | Yes | Yes | Yes | Yes | No direct | challenges/proof/profile | High | Route/API maps |
| proof | Yes | Public/dashboard | Yes | Yes | Yes | Yes | Storage | profile/plans | Critical | Model/storage/security maps |
| matching | Yes | Dashboard/client | Yes | Yes | Yes | Yes | No direct | challenges/profile | High | Role/API maps |
| messages | Yes | Dashboard | Yes | Yes | Yes/socket | Yes | Realtime | auth/users | Critical | Messaging/auth maps |
| payments | Yes | Dashboard | Yes | Yes | Yes/webhook | Yes | Env/Stripe | auth/offers | Critical | Payment/config maps |
| admin | Yes | Admin shell | Yes | Yes | Yes | Yes | No direct | all domains | Critical | Admin/role maps |

Warnings: auth remains platform-governed; messages cannot own identity; profile cannot own credentials; payments remain decoupled from unrelated UI; admin cannot bypass guards; proof/challenges/offers/plans/matching may integrate only through explicit contracts, never circular imports.

