# Safe Module Folder Structure Proposal

No production folders are created by this proposal.

## Standard

Future client path: `client/src/modules/<module>/`; future server path: `server/src/modules/<module>/`.

Allowed client children: `README.md`, `components/`, `hooks/`, `services/`, `types/`, `api/`, `validation/`, `constants/`, and `pages/` only after route ownership approval. Allowed server children: `README.md`, `routes/`, `controllers/`, `services/`, `models/`, `validation/`, `policies/`, `types/`.

Forbidden in every module: app entry, router, navigation stack, dashboard/layout shell, API client, auth/session clone, config/env/deploy, fake behavior, or compatibility copies.

| Module | Proposed client/server paths | Depends on | Readiness | Migration risk | Required prompt before creation |
|---|---|---|---|---|---|
| auth | `client/src/modules/auth`; existing `server/src/modules/auth` | platform auth/API/users | Blocked | Critical | Prompt 3 ownership and human review |
| profile | `client/src/modules/profile`; `server/src/modules/profile` | auth/API/storage/users | Human review | High | Prompt 3 gate |
| offers | `client/src/modules/offers`; `server/src/modules/offers` | auth/profile/proof/API | Caution | High | Prompt 3 gate and tests |
| challenges | `client/src/modules/challenges`; `server/src/modules/challenges` | auth/profile/plans | Caution | High | Prompt 3 gate and tests |
| plans | `client/src/modules/plans`; `server/src/modules/plans` | challenges/proof/profile | Caution | High | Prompt 3 gate and tests |
| proof | `client/src/modules/proof`; `server/src/modules/proof` | auth/storage/profile/plans | Human review | Critical | Security/data gate |
| matching | `client/src/modules/matching`; `server/src/modules/matching` | challenges/profile/auth | Caution | High | Prompt 3 gate and tests |
| messages | `client/src/modules/messages`; `server/src/modules/messages` | auth/users/socket | Human review | Critical | Realtime/security gate |
| payments | `client/src/modules/payments`; `server/src/modules/payments` | auth/API/env/Stripe | Blocked | Critical | Payment/security approval |
| admin | `client/src/modules/admin`; `server/src/modules/admin` | roles/all domains/shell | Blocked | Critical | Admin/security approval |

