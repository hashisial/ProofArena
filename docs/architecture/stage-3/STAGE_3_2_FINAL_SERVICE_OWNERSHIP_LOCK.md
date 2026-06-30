# Stage 3.2 Final Service Ownership Lock

| ID | Category/owner | Allowed/forbidden location | Dependencies and platform rules | Risk/validation | Stop |
|---|---|---|---|---|---|
| FS-01 | Frontend module service/module | Current feature service; approved module later; not shared root by convenience | Canonical client/current adapter, types, pure transforms; platform auth/errors | High; request/transform/error tests | New client/router/auth ownership |
| FS-02 | Backend module service/module | Existing service layer; not route/frontend | Domain models, platform DB/errors, public contracts; controller-service-model layering | Critical; unit/API/auth/transaction tests | Direct route business logic/duplicate DB |
| FS-03 | Platform service/platform | Existing platform boundaries | Cross-cutting auth/DB/config/error only with authority | Critical; integration/security tests | Module policy hidden as platform |
| FS-04 | Shared service/shared | Approved neutral helper only | Pure/lower-level, 2+ consumers; no domain models/rules | High; purity/cycle tests | Feature dumping/reverse import |
| FS-05 | API adapter service/module | Current feature service until tested split | Thin endpoint mapping through canonical client; no base/token/global normalization | Critical; contract tests | Adapter becomes client |
| FS-06 | Payment/security/platform plus domain | Existing protected chains only | Approved provider/auth/config/audit; no fake state/secrets | Critical; webhook/idempotency/security tests | Unapproved provider/security behavior |
| FS-07 | Admin/admin under platform | Existing admin service chain | Public domain commands + platform roles/audit; no private domain logic | Critical; permission/audit tests | Admin dumping ground |
| FS-08 | Auth-sensitive/platform auth | Selected existing auth authority | Platform token/session/error/middleware; no module clone | Critical; full auth tests | Authority unresolved or duplicated |

Current feature services remain executable request boundaries. A service/adapter split requires tests and must not duplicate API/auth/DB/config/response/error behavior.

