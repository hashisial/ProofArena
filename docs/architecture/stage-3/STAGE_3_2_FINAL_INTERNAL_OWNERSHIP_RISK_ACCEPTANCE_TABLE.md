# Stage 3.2 Final Internal Ownership Risk Acceptance Table

| ID | Group/risk | Source | Module/system | Sev/Likelihood/Blast radius | Status/reason | Expiry/action | Human | Blocks 3.3 | Blocks production |
|---|---|---|---|---|---|---|---|---|---|
| FR-01 | accepted temporarily: current feature/layered layout | Structure audit | All | Medium/High/repository | Preserve working behavior | Approved vertical migration | Yes | No | No by itself |
| FR-02 | deferred Stage 3.3: shared UI/common ambiguity | Component/shared docs | Shared UI | High/High/frontend | Shared audit owns classification | Consumer and product-neutral proof | Yes | No | Yes |
| FR-03 | deferred Stage 3.3: root hooks/services/utils/types | Verification docs | Shared candidates | High/High/import graph | Shared governance must classify | Owner/consumer/cycle evidence | Yes | No | Yes |
| FR-04 | later Stage 3: domain components dispersed | Component verification | Modules | High/High/frontend | Migration requires vertical tests | Tested move/rollback | Yes | No | Yes |
| FR-05 | later Stage 3: service/adapter split | Service/API verification | Client modules | High/High/network | Current services remain authority | Contract tests and one selected path | Yes | No | Yes |
| FR-06 | human: auth authority variants | All verifications | auth | Critical/High/system | Blocked | Human decision/full auth suite | Yes | No | Yes |
| FR-07 | human: profile/users/models | Type/ownership | profile | Critical/High/data | Blocked | Model/privacy/API decision | Yes | No | Yes |
| FR-08 | human: proof privacy/storage | Ownership/API | proof | Critical/Medium/security | Blocked | Visibility/redaction/storage contract | Yes | No | Yes |
| FR-09 | human: messages/realtime | Service/API | messages | Critical/Medium/security | Blocked | Realtime/auth contract | Yes | No | Yes |
| FR-10 | human: payments/provider/webhook | Service/type/API | payments | Critical/High/financial | Blocked | Payment architecture/security tests | Yes | No | Yes |
| FR-11 | human: admin roles/domain contracts | Component/service/API | admin | Critical/Medium/all modules | Blocked | Permission/public commands | Yes | No | Yes |
| FR-12 | blocks production: endpoint builders in utils | API verification | Several modules | High/High/request behavior | Existing debt | Adapter migration tests | Yes | No | Yes |
| FR-13 | blocks production: private cross-feature imports/cycles | Hook verification | Several modules | High/High/import graph | Existing violation | Public contracts/dependency graph | Yes | No | Yes |
| FR-14 | governance gap: four missing Stage 3.1 docs | Closeout report | Documentation | High/Certain/handoff | Accepted only for documentation Stage 3.3 | Complete/formally supersede before production | Yes | No | Yes |
| FR-15 | unknown: complete consumer/cycle/test graph | Risk register | Repository | High/Unknown/repository | Unknown | Automated graph and regression baseline | Yes | No | Yes |

Risk result: Stage 3.3 documentation may proceed with caution. All module/internal/shared production edits remain blocked unless their specific risk expires.

