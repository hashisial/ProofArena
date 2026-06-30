# Stage 3.2 Final Hook Ownership Lock

| ID | Category/owner | Allowed/forbidden location | Dependencies/API/auth/shared rule | Risk/validation | Stop |
|---|---|---|---|---|---|
| FH-01 | Module data/module | Current feature hook; approved module later; not root shared by default | Module service/current adapter, query client, public types; no client creation | High; query/mutation/invalidation tests | Raw client/private module import |
| FH-02 | Module form/module | Owning module; shared only if generic | Module validation/types/services; no router/auth internals | Medium; form/race tests | Domain hook promoted as shared |
| FH-03 | Module UI state/module | Owning module; not global store without proof | React/module contracts; no API/auth/router state | Medium; reset/render tests | Global authority created |
| FH-04 | Platform auth/platform | Existing auth public API only | Platform provider/store/session; modules do not handle tokens/roles | Critical; auth/expiry/denial tests | Second auth/session hook |
| FH-05 | Route/navigation/platform | Routes/layout/navigation only | Route constants/platform navigation; no module registry | Critical; route/link tests | Module routing policy |
| FH-06 | API/query/module | Owning module hook | Calls module service/current request boundary; platform auth implicit | High; contract/cancel/error tests | New axios/fetch/client/token handling |
| FH-07 | Shared utility/shared | Approved shared hooks only | Generic React/platform-neutral; 2+ consumers | High; consumers/cycles tests | Product/API/auth semantics |
| FH-08 | Dashboard/platform composition | Existing dashboard/composition boundary | Public module hooks only; no private services | High; role/loading/failure tests | Module business owner becomes shell |
| FH-09 | Admin/admin under platform | Existing admin feature | Admin service + platform roles; backend authorization mandatory | Critical; negative-access tests | Role implementation in hook |
| FH-10 | Payment-sensitive/payments under platform | Approved payment module later | Approved payment service; no secrets/fake settlement | Critical; payment/race/security tests | Token/secret/fake state |

Hooks never instantiate clients, manually handle auth tokens, bypass roles, import backend code or create cycles.

