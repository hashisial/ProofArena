# Stage 3.2 Safe Internal Scaffolding Decision

| Module | Components README | Hooks README | Services README | Types README | API-adapter README | Reason | Validation required | Human | Stop condition |
|---|---|---|---|---|---|---|---|---|---|
| auth | No | No | No | No | No | Auth base/runtime authority unresolved | Auth/import/security suite | Yes | Any second auth/client/session authority |
| profile | No | No | No | No | No | Profile base and users/model ownership unresolved | Consumer/model/privacy tests | Yes | Ambiguous owner or duplicate profile contract |
| offers | No | No | No | No | No | Existing active feature; migration not approved | Vertical/import/API tests | Yes | Parallel feature/module structure |
| challenges | No | No | No | No | No | Existing active feature; contracts/tests pending | Vertical/role/dependency tests | Yes | Router/shell/cycle risk |
| plans | No | No | No | No | No | Existing active feature; cross-domain/payment risk | Vertical/cycle/payment tests | Yes | Payment or private-module coupling |
| proof | No | No | No | No | No | Split roots and sensitive visibility/storage | Security/storage/redaction tests | Yes | Privacy or ownership uncertainty |
| matching | No | No | No | No | No | Existing active feature; role/algorithm tests pending | Algorithm/role/import tests | Yes | Permission bypass or duplicate path |
| messages | No | No | No | No | No | Realtime/auth boundary unresolved | Realtime/auth/event tests | Yes | Session/socket duplication |
| payments | No | No | No | No | No | Payment architecture/security unresolved | Webhook/idempotency/security tests | Yes | Fake state, secret or provider duplicate |
| admin | No | No | No | No | No | Admin feature depends on platform shell/roles | Permission/negative-access tests | Yes | Shell/role/business ownership leak |

Prompt 5 may not create internal README scaffolds unless the missing Stage 3.1 review/handoff documents are completed, the module base is approved, and the relevant human/test gates pass.

