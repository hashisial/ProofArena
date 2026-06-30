# Types, Validation, and Constants Contract

| Area | Module-local rule | Shared/platform promotion rule | Forbidden |
|---|---|---|---|
| Types | Keep domain entities, inputs, results, and UI props local. | Promote only with 2+ real module/platform consumers and an owner. | Premature global types or redefined auth/API contracts. |
| Validation | Keep domain schemas/rules with the owning module. | Share only a genuine cross-boundary contract with coordinated frontend/backend ownership. | Duplicated auth/security validation or UI-only enforcement. |
| Constants | Keep domain statuses, limits, labels, and defaults local. | Promote only truly platform-wide values. | Route constants, role constants, env/config, or endpoint catalogs in modules. |
| Routes | Consume platform route constants/metadata. | Owned by Stage 4 route governance. | Module route registry. |
| Roles | Consume platform auth/role contracts. | Owned by auth/security governance. | Hardcoded module role policy. |
| API endpoints | Consume approved endpoint governance through adapters. | Owned by Stage 5 API contract layer. | Module base URL/token/global endpoint catalog. |

JavaScript is currently dominant; documentation shapes and validation tests are required until typed contracts are formally adopted.

