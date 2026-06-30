# Stage 3.2 Final Human Decision Log

| ID | Question | Source | Module/system | Why | Default | Unanswered risk | Blocks 3.3 | Blocks production | Status |
|---|---|---|---|---|---|---|---|---|---|
| HD-01 | Which auth variant is executable authority? | Verification/risk docs | auth | Security and type ownership | Preserve all; create nothing | Critical divergence | No | Yes | required before production edit |
| HD-02 | Which profile/users models/contracts are canonical? | Type/ownership docs | profile/users | Data/privacy integrity | Preserve and block moves | Critical drift | No | Yes | required before production edit |
| HD-03 | How do proof ownership, privacy and storage divide? | Ownership/API docs | proof | Private evidence protection | Block internals | Data exposure | No | Yes | required before production edit |
| HD-04 | Who owns messaging realtime/auth boundaries? | Service/API docs | messages | Session/socket security | Platform retains runtime | Auth bypass | No | Yes | required before production edit |
| HD-05 | Which payment/provider/webhook architecture is canonical? | Service/type/API docs | payments | Financial security | Block internals/fake state | Financial/security failure | No | Yes | required before production edit |
| HD-06 | What admin commands and role policy are public contracts? | Component/service docs | admin | Privilege and domain ownership | Platform roles; domains keep rules | Privilege/business leakage | No | Yes | required before production edit |
| HD-07 | What module base convention will future internals use? | Scaffold/path docs | all | Prevent parallel architecture | Keep current paths | Duplicate modules | No | Yes | deferred |
| HD-08 | Should current feature services split into services and adapters? | Service/API docs | client modules | Avoid duplicate request layers | Keep current combined services | Duplicate adapter/client | No | Yes | deferred |
| HD-09 | What consumer/cycle/test baseline is mandatory? | Risk/acceptance docs | repository | Safe migrations | Require graph + vertical tests | Hidden breakage | No | Yes | required before production edit |
| HD-10 | How are four missing Stage 3.1 docs resolved? | Closeout report | governance | Complete authority chain | Treat as missing and keep production blocked | Handoff inconsistency | No | Yes | deferred |

No unanswered human item blocks documentation-only Stage 3.3. All block or constrain related production edits.

