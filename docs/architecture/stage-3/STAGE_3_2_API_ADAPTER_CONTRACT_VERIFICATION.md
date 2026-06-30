# Stage 3.2 API Adapter Contract Verification

| ID | Path/pattern | Platform client | Duplicate client | Manual token | Manual base | Manual error/response | Correct owner/status | Severity | Future action | Human |
|---|---|---|---|---|---|---|---|---|---|---|
| AV-01 | `client/src/services/apiClient.js` | Yes, source | No | Yes, centrally | Yes, centrally | Yes, centrally | platform API client/compliant | Critical | Protect | Yes |
| AV-02 | Feature `*Service.js` request objects | Yes | No | No | No | Some domain mapping | module adapter-service/compliant with caution | High | Keep; do not duplicate with `api` folder | Yes |
| AV-03 | `features/auth/authService.js` | Yes | No | No | No | Uses central normalization | auth API/compliant with caution | Critical | Auth authority tests | Yes |
| AV-04 | `features/profile/profileService.js` | Yes | No | No | No | Central client response | profile adapter/compliant with caution | High | Contract/privacy tests | Yes |
| AV-05 | Offer/challenge/plan/proof/match services | Yes | No | No | No | Shared/domain mapping | module adapters/compliant with caution | High | Preserve until tested split | Yes |
| AV-06 | `features/admin/adminService.js` | Yes | No | No | No | Local list normalization | admin API/suspicious | High | Verify normalization contract | Yes |
| AV-07 | Payment calls exported by `services/api.js` | Yes indirectly/unknown per function | No new instance | No observed outside client | No | Local payload handling | payment API/suspicious | Critical | Method-level trace/security review | Yes |
| AV-08 | `client/src/services/api.js` | Uses feature services/client | Implies compatibility layer, not second instance | No | No | Yes, local payload handling | platform compatibility/violation risk | High | Freeze and migrate callers with tests | Yes |
| AV-09 | Feature utils importing `API_BASE_URL` to build endpoints | Reuses value | No | No | Yes, manually composes paths | Local error helpers | module utility/violation risk | High | Move endpoint construction to approved adapter later | Yes |
| AV-10 | Profile components importing `getRealtimeBaseUrl` | Reuses helper | No | No | Indirect | No | profile UI/suspicious | Medium | Approved media/realtime URL adapter | Yes |
| AV-11 | Raw fetch/axios scan | N/A | No; only one `axios.create`, no raw fetch found | No | No | No | repository/compliant | Low | Add automated boundary scan later | No |
| AV-12 | `constants/apiEndpoints.js` | Yes | No | No | Paths only | No | platform endpoint registry/compliant | Critical | Protect; no module registry copies | Yes |
| AV-13 | Server `/api/v1` and `/api` registries | N/A | N/A | Backend middleware | Platform app | Platform errors | platform versioning/compliant with caution | Critical | Preserve compatibility; Stage 5 decides | Yes |
| AV-14 | ProofArena module paths | No ProofArena-specific client found | No | No | No | No | product composition/compliant | High | Never create ProofArena client layer | Yes |
| AV-15 | Messaging socket service | Separate realtime transport, not HTTP client | Unknown boundary | Platform auth expected | Platform realtime URL | Realtime-specific | platform realtime/suspicious | Critical | Realtime/auth contract review | Yes |

Final API decision: the platform client source-of-truth is known. Module adapters may be designed but not created; current feature services remain the executable request boundary.

