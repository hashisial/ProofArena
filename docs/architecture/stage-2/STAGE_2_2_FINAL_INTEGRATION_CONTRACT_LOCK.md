# Final Integration Contract Lock

The twenty `IC-*` rules in `STAGE_2_2_PROOFARENA_INTEGRATION_CONTRACT.md` are final Stage 2.2 guidance.

| Contract area | IDs | Final rule | Allowed | Forbidden | Required validation | Stop condition | Owner |
|---|---|---|---|---|---|---|---|
| Product identity | IC-01, IC-02, IC-20 | One repository; ProofArena module; reversal only by ADR. | Module features | Separate app/repo | Package/entry/ADR scan | New runtime boundary | Architecture |
| Routing | IC-03 | Existing router/constants govern. | Governed registrations | Parallel tree/catalog | Route/link/guard/404 QA | Unknown owner/conflict | Stage 4 |
| Layout/dashboard | IC-04, IC-05 | Shared public/provider/client/admin shells govern. | Page composition | Module shell | Responsive/role QA | Duplicate shell | Stages 7/36 |
| Navigation | IC-06 | Existing nav/sidebar governance. | Governed entries | Parallel nav | Link/mobile/access QA | Duplicate config | Stage 22 |
| API client | IC-07, IC-08 | Shared transport and endpoints govern. | Feature services | Raw isolated client/catalog | Base/auth/error/contract QA | Divergent transport | Stage 5 |
| Auth/roles | IC-09, IC-10 | Shared client guards and server middleware enforce access. | Declare requirements | Bypass/UI-only security | Positive/negative tests | Unauthorized path | Stages 23/26 |
| Backend | IC-11, IC-12, IC-13 | Existing app/layers and public module boundary govern. | Domain use cases | Second stack/private imports/copies | Tests/boundary check | Boundary failure | Stages 3/5 |
| Shared code | IC-14 | Generic reusable code only. | Reviewed contributions | Feature dumping | Dependency review | Ownership unclear | Stages 3/7 |
| Placeholder/mock | IC-15 | Temporary data stays explicit. | Honest fallback/empty state | Fake sensitive production data | Data-source QA | Sensitive fake state | Stage 8 |
| Naming/branding | IC-16, IC-17 | Branding may vary; config/package/deploy ownership stays platform. | Approved branding | Architecture fork/rename | Diff/build/external review | Approval absent | Product/release |
| Safe future features | IC-18, IC-19 | Test by blast radius; delete only with proof. | Tested vertical work | Broad untested change/casual deletion | Test and safe-delete gates | Evidence missing | Every stage |

Required docs before edits: ADR adoption/rulebook, Stage 1 authority/critical/safe-delete docs, this lock, relevant route/API/model/layout maps, and the Stage 2.2 ownership/surface locks.

