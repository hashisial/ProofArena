# Module Ownership Risk Acceptance

| Disposition | Risk | Scope | Reason / expiry | Blocks production migration | Owner |
|---|---|---|---|---|---|
| Accepted temporarily | Current feature/layer locations remain | All modules | Safer than premature moves; expires on approved vertical migration. | No by itself | Architecture |
| Accepted temporarily | JavaScript contracts lack compile-time types | All modules | Documented shapes until typed strategy approved. | No; tests required | Stage 3/technical owner |
| Deferred to Stage 3.3 | Shared UI/common ownership | Shared components | Requires consumer/misuse audit. | Yes for shared moves | Stage 3.3 |
| Deferred to Stage 3.3 | Root hooks/utils/types/constants/services | Shared/platform/mixed | Ownership and consumers unclear. | Yes | Stage 3.3 |
| Deferred to Stage 3.3 | Generic backend services/utils | Shared/platform/mixed | Cross-domain use unclear. | Yes | Stage 3.3 |
| Deferred to Stage 4/5 | Route and API contract migration | All modules | Dedicated governance stages. | Yes | Stages 4/5 |
| Deferred to Stage 23/26 | Auth/role/module security boundaries | auth/admin/all protected | Dedicated security stages. | Yes | Stages 23/26 |
| Human approval | Profile/users, proof/storage, messages/realtime, payments, admin | Sensitive modules | Ownership/security decisions unresolved. | Yes | Product/architecture/security |
| Human approval | Scaffold and production migration | All modules | Prompt 3 gate has no approval. | Yes | Project owner |
| Unknown | Runtime authority of legacy backend variants | auth/profile | Import/route evidence incomplete. | Yes | Backend owner |

Stage 3.2 decision: **CLOSE WITH CAUTION** for documentation governance; production migration remains blocked.

