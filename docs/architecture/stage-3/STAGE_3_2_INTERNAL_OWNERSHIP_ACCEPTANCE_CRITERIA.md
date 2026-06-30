# Stage 3.2 Internal Ownership Acceptance Criteria

| ID | Requirement | Pass | Fail | Evidence | Status | Future action | Blocks Prompt 6 |
|---|---|---|---|---|---|---|---|
| IA-01 | Prompt 4 findings verified | All 26 dispositioned | Omitted/assumed finding | Findings verification | pass with caution | Resolve one partial service pattern | No |
| IA-02 | Component contract verified | Owners and violations mapped | Shell/shared/module ambiguity hidden | Component verification | pass with caution | Public composition contracts | No |
| IA-03 | Hook contract verified | Hook locations/coupling/client scan documented | Raw client/auth bypass ignored | Hook verification | pass with caution | Fix private query-key contracts later | No |
| IA-04 | Service contract verified | Frontend/backend/platform services mapped | Duplicate client/business layers accepted | Service verification | pass with caution | Lock service/adapter executable authority | Yes |
| IA-05 | Type contract verified | Platform/module/model risks mapped | Duplicate User/Profile/Role/Payment type allowed | Type verification | pass with caution | Human model/type decisions | No for docs |
| IA-06 | API adapter contract verified | One client and current service patterns proven | New client/adapters assumed safe | API verification | pass with caution | Keep adapter creation blocked | No |
| IA-07 | Platform API client not duplicated | One axios instance; no raw fetch found | Second instance/manual transport | API verification | pass | Add automated boundary rule later | No |
| IA-08 | Auth/role not duplicated | Platform ownership retained | Module provider/guard/role logic | Ownership/risk docs | pass | Security authority remains blocker | No |
| IA-09 | Router/nav/shell not duplicated | Platform contracts retained | Module platform system | Stage 3.1/Prompt 4 locks | pass | Recheck every future prompt | No |
| IA-10 | Internal folder decisions documented | 90 Prompt 4 and 80 README targets blocked | Unreviewed folder | Folder/readme decisions | pass | None until approval changes | No |
| IA-11 | README scaffolds documentation-only | Zero created | Runtime-bearing scaffold | README audit | pass | Re-audit future proposals | No |
| IA-12 | No runtime files created | Docs-only diff | Source/runtime file | Git/path check | pass | Repeat at Prompt 6 | No |
| IA-13 | No imports updated | No source diff | Import change | Git/path check | pass | Repeat at Prompt 6 | No |
| IA-14 | No package/config/env/build changes | No such diff | Any platform config change | Git/path check | pass | Repeat at Prompt 6 | No |
| IA-15 | Unknown ownership escalated | Missing docs and sensitive items explicit | Assumed decision | Risk register | pass with caution | Formal human decisions | No for docs |
| IA-16 | Prompt 6 has closeout evidence | Reports, risks and criteria exist | Missing authority/status decision | All Prompt 5 docs | partial | Resolve/formally defer IR-02, IR-03, IR-15 | Yes |

Acceptance result: Prompt 5 verification package is complete with caution. Prompt 6 can close documentation governance only after explicitly retaining production/scaffold blockers.

