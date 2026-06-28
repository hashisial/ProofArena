# Stage 2.1 Final Boundary Risk Acceptance Table

Generated: 2026-06-28

| Risk | Title | Source | Systems | Severity | Likelihood | Final status | Reason / expiry | Future action | Owner | Blocks Stage 2.2 | Blocks production changes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BR-01 | Separate app/repository | Boundary risk register | Root/workspace | critical | medium | accepted temporarily under controls | No active system; expires on root/package proposal. | Apply prevention rules/ADR gate. | Architecture | no for docs | yes |
| BR-02 | Duplicate route tree | Risk/drift reports | Router/constants | high | medium | accepted temporarily under controls | No active duplicate; expires on route proposal. | Use central routes/checks. | Stage 4 | no | yes for route changes |
| BR-03 | Duplicate dashboard shell | Risk/system map | Layouts/shells | high | medium | accepted temporarily under controls | No active duplicate. | Preserve role shells. | Stages 3/36 | no | yes |
| BR-04 | Duplicate navigation | Risk/system map | Nav/sidebar | high | medium | accepted temporarily under controls | Central configs exist. | Reuse central navigation. | Frontend architecture | no | yes |
| BR-05 | Duplicate API client | Risk/system map | Transport/services | high | medium | accepted temporarily under controls | Canonical client exists. | Preserve transport contract. | Stage 5 | no | yes |
| BR-06 | Duplicate auth/role | Risk/system map | Auth/guards/middleware | critical | medium | accepted temporarily under controls | Shared auth exists. | Security review before auth changes. | Stages 23/26 | no | yes |
| BR-07 | Naming ambiguity | Naming audit | README/packages/API labels | medium | high | deferred to Stage 2.2 | Module identity audit needs naming context. | Adopt/defer naming matrix. | Product/architecture | no | yes for renames |
| BR-08 | Historical doc authority | Final source index | Documentation | high | low | accepted temporarily under controls | Authority order is locked. | Keep citation preflight. | Docs governance | no | no |
| BR-09 | Proposed ADR ignored | ADR package | All systems | critical | medium | human approval required | Rules active but ratification absent. | Approve or explicitly defer. | Architecture owner | no for docs | yes |
| BR-10 | Production work without approval | Start conditions | All production systems | high | high | blocks production-bearing Stage 2.2 | Human gate absent. | Record owner approval/deferral. | Architecture owner | yes for production scope | yes |
| BR-11 | Wildcard alias policy | Alias/checker evidence | Module imports | high | medium | deferred to Stage 2.2 | Checker mitigates; policy intent unresolved. | Verify checker coverage and lock policy. | Frontend architecture | no | yes for config edits |
| BR-12 | External topology unknown | Local deployment evidence | Hosted projects/domains/repos | high | unknown | unknown/human review | Local repo cannot prove external state. | Verify with release owner. | Release/architecture | unknown | yes for deployment edits |

## Disposition Counts

- Accepted temporarily under controls: **7** (`BR-01` through `BR-06`, `BR-08`).
- Deferred to Stage 2.2: **2** (`BR-07`, `BR-11`).
- Human approval required / production block: **2** (`BR-09`, `BR-10`).
- Unknown: **1** (`BR-12`).

No risk is accepted as permission to create duplicate architecture.
