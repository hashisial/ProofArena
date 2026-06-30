# Shared Code Enforcement Checklist

| ID | Check | Pass | Stop condition |
|---|---|---|---|
| SE-01 | Used by more than one module/platform? | Real consumers documented. | Single-module only. |
| SE-02 | Feature-specific? | No domain naming/rules. | Keep in module. |
| SE-03 | Imports modules/features? | No reverse import. | Reject shared placement. |
| SE-04 | Duplicates platform logic? | No API/auth/route/nav/config ownership. | Immediate stop. |
| SE-05 | Duplicates constants/contracts? | Existing platform sources reused. | Reject duplicate. |
| SE-06 | Creates cycle/coupling? | Acyclic lower-level dependency. | Reject promotion. |
| SE-07 | Tests/test plan exist? | Risk-proportional verification. | No migration. |
| SE-08 | Human approval required? | Approval recorded for high risk. | Keep in place. |

