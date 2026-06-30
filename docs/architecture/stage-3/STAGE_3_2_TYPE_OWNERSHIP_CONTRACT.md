# Stage 3.2 Type Ownership Contract

The repository currently uses JavaScript contract modules rather than a universal TypeScript convention. “Type” includes documented shapes, schemas and exported contract constants; no new language/tooling is implied.

| ID | Category/owner | Allowed location | Forbidden location | Promotion and naming rule | Import/export rule | Duplication risk | Validation |
|---|---|---|---|---|---|---|---|
| TC-01 | Module domain types/module | Current feature contract; approved module `types` later | Global shared by default | Promote only with 2+ consumers; domain-prefixed names | Public stable exports only after approval | High semantic drift | Consumer/API fixture tests |
| TC-02 | Module DTOs/module | Beside adapter/service or approved types path | UI primitive/shared root | Must mirror real request/response contract | No backend runtime imports into frontend | High frontend/backend drift | Contract/schema tests |
| TC-03 | Shared platform types/platform/shared | Existing shared types | Single module | Neutral, stable, owned by platform/shared | No feature implementation imports | High over-generalization | Consumer and compatibility tests |
| TC-04 | User/session/auth types/platform | Existing auth/types/store contracts | Business modules | One canonical identity/session/role language | Modules import public platform contract | Critical security divergence | Auth/permission tests |
| TC-05 | Role/permission types/platform | Auth/role constants and middleware contracts | Modules | Platform naming only | No module role enums | Critical authorization drift | Permission matrix tests |
| TC-06 | API wrapper types/platform API | API contracts/errors/response conventions | Module redefinition | One global envelope/error contract | Adapters use, never redefine | High normalization drift | API contract tests |
| TC-07 | Payment-sensitive types/payments plus platform | Approved payment contracts | Shared or unrelated modules | Exclude secrets/raw provider objects; explicit units/currency | Human-reviewed public export | Critical financial/data risk | Provider/schema/security tests |
| TC-08 | Admin types/admin plus platform | Admin request/result/view contracts | Shared unless neutral | No domain model takeover | Uses platform permission types | High privilege leakage | Negative-access/contract tests |
| TC-09 | Database/model types/backend domain | Existing model/schema layer | Frontend runtime/shared UI | Domain model remains backend; expose DTO contract | No frontend model imports | Critical persistence coupling | Model/API migration tests |

Check existing User, Profile, Role and Payment contracts before creating any type. No duplicate type is authorized.

