# Stage 3.2 Final Type Ownership Lock

| ID | Category/owner | Allowed/forbidden location | Promotion/naming/export rule | Risk/validation | Stop |
|---|---|---|---|---|---|
| FT-01 | Module domain types/module | Current contract or approved module; not shared by default | Domain-prefixed; promote with 2+ real consumers; stable public export only | High; consumer/API fixture tests | Owner/contract unknown |
| FT-02 | Module DTOs/module | Beside current request boundary or approved types; never UI primitive root | Mirror real request/response; no backend runtime import | High drift; contract/schema tests | API contract absent |
| FT-03 | Shared platform types/platform/shared | Existing shared types only | Neutral, stable, no module assumptions/imports | High over-generalization; compatibility tests | Product semantics present |
| FT-04 | User/session/auth/platform | Existing auth/types/store | One canonical identity/session language; modules import public contract | Critical; auth tests | Duplicate User/session type |
| FT-05 | Role/permission/platform | Existing access/role contracts | Platform names; no module enums | Critical; permission matrix | Duplicate role/permission type |
| FT-06 | API wrapper/platform API | API contracts/errors/envelope | One global response/error language | High; API contract tests | Module wrapper redefinition |
| FT-07 | Payment-sensitive/payments plus platform | Approved payment contracts only | No secrets/raw provider objects; explicit amount/currency | Critical; provider/security tests | Unsafe/duplicate Payment type |
| FT-08 | Admin/admin plus platform | Admin request/result/view contracts | Reuse platform permission types; no domain model takeover | High; negative-access tests | Admin owns domain types |
| FT-09 | Backend model/schema/backend domain | Existing model/schema layer | Expose DTO, never frontend model import | Critical; model/API tests | Frontend/backend runtime cross-import |
| FT-10 | Public-safe display/module or shared after proof | Module-local redacted display contract | Promote only stable privacy-safe shape | Critical privacy; redaction tests | Private fields exposed |

Auth/session/role types remain platform-governed. Duplicate User/Profile/Role/Payment contracts are blocked until existing definitions and frontend/backend drift are documented.

