# ADR-0001 Codex Enforcement Checklist

| Check | Rule | Pass | Fail | Required action |
| --- | --- | --- | --- | --- |
| EC-01 | No separate ProofArena system | Work stays in existing repo/app/modules | New repo/app/router/shell/client/auth/nav | Stop and redesign within ScaleOps |
| EC-02 | No duplicate routes | Existing routes/constants reused | Parallel constants/tree | Read route lock and remove proposal |
| EC-03 | No duplicate layouts/shell | Existing role wrapper/SidebarCore reused | New dashboard shell | Stop; inspect layout ownership |
| EC-04 | No duplicate HTTP client | apiClient/feature services reused | New Axios/fetch wrapper | Stop; map existing client |
| EC-05 | Auth/roles preserved | Guards/backend middleware remain authoritative | UI-only bypass | Stop and security-review |
| EC-06 | Critical files protected | Protection docs/prechecks read | Casual edit | Stop; establish tests/rollback |
| EC-07 | Placeholders classified | Real contract or honest planned/empty state | Fake production data/workflow | Stop; use classification |
| EC-08 | Safe deletion | Safe-delete checklist and approval pass | "Unused-looking" deletion | Stop; verify ownership |
| EC-09 | Config/deps approved | Explicit stage approval | Casual package/config/env edit | Stop and request approval |
| EC-10 | Source docs read | Stage 1 sources cited in plan | Existing architecture ignored | Stop and perform preflight |

Failure of any check blocks production edits.

