# Stage 3.3 Final Shared Hook, Utility, and Type Lock

| ID | Category | Final owner | Allowed location | Forbidden location | Product/platform/module rules | Import/export rules | Duplicate/drift prevention | Validation | Stop condition |
|---|---|---|---|---|---|---|---|---|---|
| HUL-001 | Shared hooks | candidate shared owner | Existing files pending approval | Module/platform behavior in shared | Generic only; no auth/route/module state | No module/service/adapter imports; stable public API only | Consumer/test map | Hook tests/boundary | Fewer than 2 consumers or module dependency |
| HUL-002 | Shared utility functions | candidate shared owner | Individual pure files | Mixed root blanket approval | Product-neutral/pure | No module/env/auth/API imports | Compare semantics before extraction | Purity/edge tests | Side effect/domain rule appears |
| HUL-003 | Formatters | candidate shared owner | Existing formatter files | Module calculations | Locale-neutral/configurable | File-level exports; no new barrel without approval | Snapshot/edge behavior | Locale/format tests | Product assumption hidden |
| HUL-004 | Date/currency helpers | candidate shared owner | Existing files | Payment processing/module pricing rules | Display only; no sensitive/payment operation | No payment provider imports | Currency/date contract tests | Human payment-display review | Processing/business rule appears |
| HUL-005 | Validation helpers | module or approved contract owner | Module validation; neutral shared only after gate | Speculative shared validation | Domain schemas remain module-owned | No security/backend bypass | Frontend/backend contract comparison | Validation/security tests | Authority/consumer unclear |
| HUL-006 | Constants | platform/module by semantic owner | Existing governed catalogs | Generic shared replacement | Routes/roles/API/config remain platform | Stable authoritative exports only | Duplicate catalog scan | Cross-client/server drift review | Second source proposed |
| HUL-007 | Shared types/interfaces | approved contract owner only | Approved contract path after gate | Mixed root promoted wholesale | Stable cross-module primitive only | Type-only/public contract; no runtime model import | Authoritative owner and generation/drift plan | Contract tests | Identity/profile/payment authority unclear |
| HUL-008 | User/session/role/profile/payment types | platform or sensitive module | Existing authoritative paths | Generic shared type library | Never duplicate sensitive/platform contracts | No competing exports | Repo-wide type/name inventory | Security/contract review | Duplicate shape/enum proposed |
| HUL-009 | Module DTOs | owning module/API contract | Module types/adapters | Shared until promoted | Module-specific by default | Public only through approved interface | Backend/API alignment | DTO contract tests | Cross-module use bypasses public contract |
| HUL-010 | API response wrappers | platform API contract | Canonical API client/contracts | Module/shared duplicate wrappers | Global wrapper remains platform-owned | Modules use platform type/interface | Client/server response drift scan | API contract tests | Second global wrapper appears |

Shared hooks cannot bypass auth/role or call module adapters. Shared utilities cannot import module logic. Sensitive platform types cannot be duplicated.

