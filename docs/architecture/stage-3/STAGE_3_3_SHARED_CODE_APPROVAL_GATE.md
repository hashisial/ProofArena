# Shared Code Approval Gate

| Gate | Pass condition | Fail/stop condition |
|---|---|---|
| SG-01 Reuse | Used by 2+ real modules or platform. | Single-module use. |
| SG-02 Specificity | Behavior is domain-neutral. | Feature/module naming or rules. |
| SG-03 Platform ownership | No hidden auth, API-client, router, navigation, shell, config, or env ownership. | Platform logic detected. |
| SG-04 Dependency direction | No feature/module imports. | Reverse/private import. |
| SG-05 Coupling | Promotion reduces duplication without coupling modules. | New cross-module dependency/cycle. |
| SG-06 Owner | Named shared/platform owner exists. | Ownership unknown. |
| SG-07 Public API | Small stable export surface. | Broad barrel/deep export. |
| SG-08 Tests | Tests exist or approved test plan matches risk. | No verification path. |
| SG-09 Naming | Generic language accurately describes behavior. | Module-specific semantics hidden by generic name. |
| SG-10 Human approval | High-risk/shared-platform promotion approved. | Required approval absent. |

All ten gates must pass. Failure keeps code in its current module/location pending review.

