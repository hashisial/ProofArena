# Stage 3.3 Final Shared API Helper and Service Lock

`client/src/services/apiClient.js` is the locked frontend API transport source-of-truth.

| ID | Category | Final owner | Allowed location | Forbidden location | Use platform client | Client instantiation | Token/base URL/error/normalization/version rules | Security / human review | Stop condition |
|---|---|---|---|---|---|---|---|---|---|
| APL-001 | Platform API client | ScaleOps platform | `client/src/services/apiClient.js` | Module/shared copies | n/a, it is the client | sole verified client | Owns token, base URL, interceptors, global errors, unwrap/version policy | required | Second client or authority appears |
| APL-002 | Shared API response helpers | shared helper governance | Existing `services/shared` | New transport/global service layer | yes indirectly through callers | never | Neutral mapping only; no token/base URL/global errors/versioning | review expansions | Transport/domain behavior appears |
| APL-003 | Shared error helpers | platform API/error owner | Existing platform contracts | Module/shared global error copies | yes | never | Global normalization remains platform-owned | required | Competing global error format |
| APL-004 | API output formatters | module or candidate shared | Module/file-level candidate | Platform client internals | yes through adapter/service | never | Presentation-only; no response contract replacement | review payment/admin output | API semantics hidden |
| APL-005 | Shared service helpers | shared only when neutral | Existing neutral helper folder | Root global business layer | yes | never | No token/base URL/global error/version/domain workflow | required | Imports module or orchestrates use case |
| APL-006 | Token/base URL helpers | ScaleOps platform auth/API | Canonical platform files | Shared/module helpers | n/a | never outside platform | Platform-only token/base URL ownership | security review required | Manual token/base URL outside authority |
| APL-007 | Generic backend service helpers | backend platform | Approved backend utilities/services | Frontend/shared cross-runtime | not frontend client | provider-specific only under platform | Canonical response/error/config/DB rules | backend/security review | Module copies platform infrastructure |
| APL-008 | Module API adapters | owning module | Module API path when authorized | Shared/global facade | yes, mandatory | never | Thin endpoint wrapper; no global normalization/version policy | sensitive modules reviewed | Adapter becomes client |
| APL-009 | Auth-sensitive helpers | platform auth | Approved auth paths | Generic shared | approved platform interface | never | Auth platform owns tokens/session/errors | mandatory | Auth logic hidden in shared |
| APL-010 | Payment-sensitive helpers | payments/platform provider owner | Approved payment paths | Generic shared | approved platform/provider interface | never | No card/bank/storage/provider behavior in shared | mandatory | Sensitive behavior/ownership unclear |
| APL-011 | Admin-sensitive helpers | admin/platform authorization owner | Approved admin paths | Generic shared | platform client/guards | never | Authorization remains platform/admin contract | mandatory | Privileged mutation hidden in shared |

Shared API helpers never become clients. Shared services never become a global business layer. If canonical API authority becomes unclear, all new helper work stops.

