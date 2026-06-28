# Violation Detection and Stop-Ship Checklist

| Check | Signal | Detection | Required docs | Stop condition / response | Human |
|---|---|---|---|---|---|
| SS-01 | New app | Entry/app folder/package scan | ADR/authority locks | Stop; revert/document proposed runtime. | Yes |
| SS-02 | New package boundary | `package.json`/workspace/lock change | Stage 2 app audit | Stop; require ADR/approval. | Yes |
| SS-03 | New route tree | Router/Routes declaration outside owner | Route audit | Stop; register through existing tree. | Yes |
| SS-04 | New route constants | New path catalog/conflict | Route lock | Stop; use existing constants/metadata. | Yes |
| SS-05 | Duplicate public nav | New public/mobile/footer arrays | Nav audit | Stop; extend registry. | Yes |
| SS-06 | Duplicate dashboard nav | New role nav hierarchy | Nav/ownership locks | Stop; use role configs. | Yes |
| SS-07 | Duplicate sidebar logic | Independent state/config/renderer | Layout audit | Stop; reuse shell primitives/config. | Yes |
| SS-08 | New dashboard shell | New route-level shell | Layout authority | Stop; compose in existing role shell. | Yes |
| SS-09 | Duplicate API client | Axios instance/fetch wrapper/base/token logic | API contract | Stop; use canonical client. | Yes |
| SS-10 | Duplicate auth/roles | New provider/store/guard/middleware | Auth audit | Stop; use existing security path. | Yes |
| SS-11 | Config/deploy split | Product env/project/domain/deploy config | ADR/config controls | Stop; verify external topology and approval. | Yes |
| SS-12 | ADR ignored | Change conflicts with ADR-0001 | ADR adoption/rulebook | Stop; require superseding ADR. | Yes |
| SS-13 | Stage 2 locks ignored | Reuse/ownership/preflight not checked | Stage 2 final docs | Stop; run preflight and document disposition. | Yes |

Any failed check is stop-ship until the violating change is removed or an approved governance path explicitly authorizes it.

