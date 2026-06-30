# Stage 3.1 Module Interdependency Map

All module dependencies must use public contracts, the canonical API client, shared types/UI, or platform services. Direct private imports and cross-module model access are forbidden.

| Dependency ID | Source | Target | Allowed dependency | Forbidden dependency | Risk | Required future rule |
|---|---|---|---|---|---|---|
| MID-01 | auth | platform auth/users | Public identity contracts and platform auth services | Reimplementing provider/session/token/roles | Critical | Platform security remains authoritative |
| MID-02 | profile | auth/platform | Platform auth; shared identity identifiers | Credentials/session/private auth service imports | Critical | Profile consumes authenticated identity only |
| MID-03 | profile | proof | Reads public proof summaries through API/service contract | Direct ProofAsset model/private service access | High | Redacted public contract only |
| MID-04 | offers | profile | Reads public provider/profile contract | Direct profile model/private service import | High | Profile owns profile data |
| MID-05 | offers | proof | Reads proof summary or attaches proof identifiers through contract | Owning proof storage/verification | High | Proof remains independently owned |
| MID-06 | offers | payments | Requests approved payment workflow through a payment contract | Payment execution, secrets, Stripe calls | Critical | Payments owns financial behavior |
| MID-07 | challenges | profile | Reads public participant/profile data | Direct model access | High | Use API/service contract |
| MID-08 | challenges | offers | References offer identifiers/public offer interface | Importing private offer services/components | High | Keep lifecycle ownership separate |
| MID-09 | challenges | matching | Requests matching/recommendations through contract | Owning algorithm or direct MatchRecord access | High | Matching owns scoring |
| MID-10 | challenges | proof | Declares proof requirements through public schema | Owning proof records/storage | High | Proof owns evidence lifecycle |
| MID-11 | challenges | messages | Initiates conversation context through public command | Owning threads/socket/auth | High | Messages owns conversation lifecycle |
| MID-12 | plans | challenges | Reads challenge public contract | Direct Challenge model/private service access | High | Plans reference challenge IDs/contracts |
| MID-13 | plans | proof | Describes proof plan/requirements | Creating proof records outside proof contract | High | Proof owns evidence records |
| MID-14 | plans | payments | Exposes package terms through approved contract | Charging, invoicing, Stripe, fake paid state | Critical | Payment operations remain isolated |
| MID-15 | proof | profile | Uses profile identity/visibility contract | Owning credentials/profile model | Critical | Enforce privacy/redaction boundaries |
| MID-16 | matching | challenges/profile | Reads public challenge/profile features | Direct models/private services or auth bypass | High | Public typed/scoped inputs only |
| MID-17 | messages | auth/users/realtime platform | Uses platform identity, permissions and socket service | Session/token/socket server clone | Critical | Platform owns security and realtime runtime |
| MID-18 | payments | auth/platform | Uses authenticated actors, config, API/error platform | UI-only authorization, env/secrets in module | Critical | Backend authorization and payment platform required |
| MID-19 | payments | offers/plans | Accepts stable order/package identifiers and amounts through contracts | Importing private offer/plan models or inventing state | Critical | Validate contract server-side |
| MID-20 | admin | all domain modules | Calls public moderation/query commands with platform authorization | Direct private service/model imports; business logic dumping ground | Critical | Admin orchestrates but domains own rules |
| MID-21 | any module | shared UI/types/utils | Generic UI, stable shared types, pure utilities | Feature policy in shared or shared importing modules | High | Shared approval gate must pass |
| MID-22 | any frontend module | platform routes/API/auth/shell | Route constants, canonical client, guards and layouts | Backend imports, alternate client/router/guard/shell | Critical | One-way platform dependency only |
| MID-23 | any backend module | platform middleware/errors/DB/config | Approved middleware, errors, response and DB services | Frontend imports, duplicate middleware/DB/config/versioning | Critical | Platform runtime remains singular |
| MID-24 | modules | modules | Public interface or API adapter only; acyclic | Deep private import, cross-model access, circular dependency | High | Stop until owner and contract are explicit |

## Dependency Direction

`platform/shared -> no feature implementations`; `modules -> platform/shared public APIs`; `module -> module` only through explicit public contracts. Frontend never imports backend code, and backend never imports frontend code.

