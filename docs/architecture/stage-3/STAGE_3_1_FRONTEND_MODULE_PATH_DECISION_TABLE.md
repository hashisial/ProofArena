# Stage 3.1 Frontend Module Path Decision Table

## Convention Evidence

- Active domain convention: `client/src/features/*` plus domain components/pages in broad roots.
- Existing module convention: only `client/src/modules/proofarena`, with `@proofarena` alias and a small public index.
- Import aliases: `@/*`, `@proofarena`, and `@proofarena/*`; no generic module aliases.
- Barrels are limited, not universal: profile and ProofArena have indexes; most features do not.
- `app/`, `pages/`, `components/`, `features/`, and `modules/` coexist, so a new generic module tree would be a parallel convention.

| Module | Recommended frontend path now | Existing matching folder | Related files | Safe to create path now | Reason | Runtime impact if created | Duplicate risk | Validation required | Human |
|---|---|---|---|---|---|---|---|---|---|
| auth | Retain `client/src/features/auth` | Yes | Auth page/types plus platform store/routes | No | Active feature exists and platform auth is coupled | None if README-only, but false ownership signal | Critical | Import/consumer/auth authority | Yes |
| profile | Retain current profile feature/components/pages pending migration decision | Partial | Profile feature, components, pages, config, types | No | No single path owns full slice | Misleading parallel profile owner | High | Consumer graph and profile/users contract | Yes |
| offers | Retain `client/src/features/outcomeOffers` | Yes | Offer components/pages | No | Existing active feature is clear; new module duplicates it | Parallel imports later | High | Vertical tests and approved migration | Yes |
| challenges | Retain `client/src/features/challenges` | Yes | Challenge components/pages | No | Existing active feature is clear | Parallel imports later | High | Vertical tests and contracts | Yes |
| plans | Retain `client/src/features/executionPlans` | Yes | Plan components/pages | No | Existing active feature is clear | Parallel imports later | High | Vertical tests and contracts | Yes |
| proof | Retain proof/proofAssets until one owner is selected | Two partial folders | Proof components/pages | No | Split feature convention unresolved | Third proof boundary | Critical | Security, storage, consumer and owner review | Yes |
| matching | Retain `client/src/features/matches` | Yes | Match components/pages | No | Existing active feature is clear | Parallel imports later | High | Algorithm/role tests | Yes |
| messages | Retain current page/service locations | No | `pages/Messages.jsx`, messaging services/hooks | No | No existing feature/module boundary and realtime coupling | Premature ownership claim | Critical | Realtime/auth contract | Yes |
| payments | Retain current page/service locations | No | `pages/Payments.jsx`, billing calls | No | No existing feature/module boundary; sensitive platform coupling | Premature payment boundary | Critical | Payment/security architecture | Yes |
| admin | Retain `client/src/features/admin` under platform admin shell | Yes | Admin components/pages/layout/guard/nav | No | Feature exists but shell/security are platform-owned | Parallel admin authority | Critical | Role/shell/negative-access tests | Yes |

Decision: create no frontend module paths or READMEs in Prompt 2.

