# Stage 3.2 Internal Ownership Risk Register

| ID | Group | Risk | Source | Module/system | Severity | Likelihood | Blast radius | Status/reason | Expiry/action | Human | Blocks closeout | Blocks production |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| IR-01 | accepted temporarily | Existing feature/layered organization remains | Structure audit | All | Medium | High | Repository-wide | Accepted to preserve behavior | Expires after approved vertical migration | Yes | No | No by itself |
| IR-02 | deferred Prompt 6 | Missing five Stage 3.1 review/handoff docs | Trackers | Governance | High | Certain | Stage 3 handoff | Deferred; evidence gap is explicit | Complete or formally defer before final closeout | Yes | Yes | Yes |
| IR-03 | deferred Prompt 6 | Service versus adapter ownership remains mixed | Service/API verification | Client modules | High | High | Network layer | Current services work; split unproven | Lock executable authority and migration rule | Yes | Yes | Yes |
| IR-04 | later Stage 3 | Domain components dispersed in broad root | Component verification | UI modules | High | High | Imports/UI | Move requires vertical tests | Consumer graph and tested migration | Yes | No | Yes |
| IR-05 | later Stage 3 | Root hooks/services import features | Hook/service verification | Shared/platform | High | High | Dependency graph | Existing compatibility debt | Public APIs and cycle-free migration | Yes | No | Yes |
| IR-06 | human approval | Auth runtime and type authority variants | All verifications | auth | Critical | High | Security/system-wide | Blocked | Human authority decision and tests | Yes | No for docs | Yes |
| IR-07 | human approval | Profile/users/model/type overlap | Type/ownership verification | profile/users | Critical | High | Data/privacy | Blocked | Model/API/privacy decision | Yes | No for docs | Yes |
| IR-08 | human approval | Proof ownership and private-data rules | Ownership/component/API | proof | Critical | Medium | Data/security | Blocked | Visibility/storage/redaction contract | Yes | No for docs | Yes |
| IR-09 | human approval | Message/realtime/auth boundary | Service/API verification | messages | Critical | Medium | Security/realtime | Blocked | Platform realtime contract | Yes | No for docs | Yes |
| IR-10 | human approval | Payment/provider/webhook boundary | Service/type/API | payments | Critical | High | Financial/security | Blocked | Payment architecture and provider tests | Yes | No for docs | Yes |
| IR-11 | human approval | Admin role/domain dumping-ground risk | Component/service/API | admin | Critical | Medium | Privilege/all modules | Blocked | Permission/public domain contracts | Yes | No for docs | Yes |
| IR-12 | blocks production | API_BASE_URL endpoint construction in feature utils | API verification | Several modules | High | High | Request behavior | Existing debt; do not copy | Adapter migration with contract tests | Yes | No | Yes |
| IR-13 | blocks production | Private cross-feature query-key imports | Hook verification | plans/offers/profile/challenges | High | High | Cache/cycles | Existing violation | Public invalidation contracts | Yes | No | Yes |
| IR-14 | unknown | Complete raw request and cycle graph | Verification reports | Client/server | High | Unknown | Repository-wide | Targeted scans only | AST/lint/dependency tooling later | Yes | Unknown | Yes |
| IR-15 | blocks closeout | Module paths and internal README bases not approved | Scaffold decisions | All ten | High | Certain | Architecture | All scaffolds blocked | Formal path/human/test approval | Yes | Yes | Yes |

Prompt 6 may close Stage 3.2 governance with caution only if IR-02, IR-03 and IR-15 are explicitly resolved or formally retained as production blockers.

