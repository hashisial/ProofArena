# Module vs Platform Responsibility Matrix

| Area | ProofArena responsibility | ScaleOps responsibility | Shared | Forbidden ownership | Future stage | Wrong-owner risk | Human review |
|---|---|---|---|---|---|---|---|
| Public ProofArena pages | Product content/composition | Router/layout/nav/accessibility | Shared UI/API | Own public shell | 22 | High | Yes |
| Provider discovery | Search/filter UX and domain rules | Transport/auth/public layout | Provider contracts | Own API client | 3/5 | High | Yes |
| Challenge discovery | Challenge domain behavior | Routing/API/security | UI/contracts | Own router/auth | 3/4 | High | Yes |
| Proof ledger | Proof-specific presentation/rules | Public layout, data/security contract | UI/response helpers | Fake ledger infrastructure | 3/8 | Critical | Yes |
| Leaderboard | Ranking product rules | Route/layout/API governance | UI/data contract | Static data as production | 3/8 | High | Yes |
| Offers | Offer domain behavior | Router/auth/API transport | Contracts | Own client/server runtime | 3/5 | High | Yes |
| Plans | Plan domain behavior | Role shells/auth/API | Contracts | Own dashboard shell | 3/36 | High | Yes |
| Matching | Matching algorithm/workflow | Auth/API/data governance | Contracts | Duplicate identity/data | 3/5 | Critical | Yes |
| Messages | Module entry points/context | Messaging platform/socket/auth | Conversation linkage | ProofArena messaging stack | Later | High | Yes |
| Payments | Product purchase intent | Billing/payment/security platform | Plan linkage | Module payment stack | Payments stage | Critical | Yes |
| Admin moderation | Module moderation rules | Admin shell/roles/audit API | Domain actions | Module admin app | Admin stage | Critical | Yes |
| Provider dashboard | Module widgets/workflows | Dashboard shell/sidebar/guard | Data queries | Module shell | 36 | Critical | Yes |
| Client dashboard | Module workflows | Client shell/sidebar/guard | Data queries | Module shell | Client stage | Critical | Yes |
| Auth | Consume identity | Own session/provider/store/middleware | User context | Module auth | 23 | Critical | Yes |
| Roles/permissions | Declare domain capability needs | Own policy/guards/middleware | Permission mapping | UI-only role system | 26 | Critical | Yes |
| Routing | Supply route components | Own declarations/constants/404 | Metadata | Parallel tree | 4 | Critical | Yes |
| Layouts | Supply composed content | Own shells | Shared UI | Module layout framework | 7/36 | High | Yes |
| Dashboard shell | Supply features | Own topbar/sidebar/responsive shell | Role navigation | Duplicate shell | 36 | Critical | Yes |
| API client | Supply feature service calls | Own transport/base/auth/errors | Endpoint contracts | Isolated client | 5 | Critical | Yes |
| Backend layers | Own domain use cases | Own app/security/error/DB conventions | Contracts/models | Second API stack | 3/5 | Critical | Yes |
| Shared UI | Compose components | Own generic primitives | Contribution review | Feature logic in UI library | 7 | Medium | No |
| Shared utilities | Use/contribute pure helpers | Own cross-cutting rules | Contribution review | Domain dumping/copies | 3 | Medium | No |
| Config/env | Declare needs | Own schema/secrets/build/deploy | Document variables | Module config/deploy fork | 6 | Critical | Yes |
| Documentation | Maintain module docs | Own authority/governance | Evidence updates | Parallel source of truth | 10 | High | No |

