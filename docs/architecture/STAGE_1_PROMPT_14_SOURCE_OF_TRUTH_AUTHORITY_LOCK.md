# Stage 1 Prompt 14 Source-of-Truth Authority Lock

Generated: 2026-06-28

This lock identifies documentary authority. It does not change runtime ownership or approve production edits.

| Architecture area | Primary source-of-truth | Supporting docs | Superseded / historical docs | Human-review doc | Machine manifest | Confidence | Required before Stage 2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Product boundary | `adr/ADR-0001-scaleops-proofarena-architecture-boundary.md` | Stage 1.1 invariants; ADR adoption package | ADR candidate list | ADR final human approval brief | `adr/adr-0001-manifest.json` | high | Approval or explicit deferral; keep ProofArena inside ScaleOps. |
| Repository boundary | ADR-0001 + Stage 1.1 source summary | Repo inventory; critical-file list | Early inventory prose where less specific | ADR approval dossier | ADR manifest | high | Preserve existing repository; no parallel app/repo. |
| Route governance | `STAGE_1_2_FINAL_SOURCE_OF_TRUTH_LOCK_TABLE.md` | Route inventory, dependency map, Prompt 13 authority check | Prompt 5/6 route audits are evidence only | Stage 1.2 human review pack | Stage 1.2 final closure manifest | high | Preserve aliases; no consolidation without Stage 4 proof. |
| Layout/dashboard governance | Stage 1.2 final lock table | Layout ownership, duplicate layout audit, control board | Earlier candidate tables | Stage 1.2 human review pack | Stage 1.2 final closure manifest | high | Preserve role shells and `SidebarCore`; no duplicate shell. |
| API client governance | Stage 1.2 final lock table | API inventory, flow map, API source analysis | Prompt 5 API audit is evidence only | Stage 1.2 human review pack | Stage 1.2 final closure manifest | high | Preserve transport, builders, services, facade until Stage 5. |
| Auth/role governance | ADR-0001 governance rulebook | Backend flow, guards, critical-file list, control board | Early role assumptions | ADR human dossier | ADR manifest | high | Frontend UX guards do not replace backend security. |
| Module ownership | ADR-0001 + Stage 1.1 ownership maps | Frontend ownership, source summary | ADR candidate list | ADR human dossier | ADR manifest | medium | Stage 2 may clarify boundaries, not create parallel systems. |
| Shared code ownership | ADR-0001 governance rulebook | Reusable-code map, boundary report | Broad early duplicate candidates | ADR human dossier | ADR manifest | medium | Share only behavior-equivalent contracts after dependency proof. |
| Placeholder/mock governance | `STAGE_1_2_FINAL_FINDINGS_CONSOLIDATED.md` | Placeholder classification, risk acceptance, Stage 1.1 baseline | Stage 1.1 total of 48 is historical baseline | Stage 1.2 human review pack | Stage 1.2 final closure manifest | high | Use final total 60 and preserve class/status. |
| Critical-file protection | `STAGE_1_1_CRITICAL_FILE_PROTECTION_LIST.md` | Architecture control board; preflight checklist | None | Escalation to architecture owner | Stage 1.1 guardrail manifest | high | Run category-specific prechecks before any edit. |
| Safe-delete governance | `STAGE_1_2_SAFE_DELETE_CANDIDATE_POLICY.md` | Cleanup backlog, zero-break sequence | Candidate-only lists are not deletion authority | Human review required for high risk | Stage 1.2 cleanup blueprint | high | No deletion from an unused-looking-file assumption. |
| Future Codex prompt governance | `adr/ADR-0001-final-codex-governance-rulebook.md` | ADR adoption package, enforcement checklist, control board | Earlier future-Codex rules are supporting | ADR final approval brief | ADR manifest | high | Mandatory read set and stop conditions apply. |
| Stage 2 preflight governance | Prompt 15 final Stage 2 checklist and start conditions (pending) | Stage 2 snapshot, Prompt 14 readiness check, remaining risk register | 74/100 snapshot is historical, not start authority | Architecture owner boundary disposition | Prompt 15 completion manifest (pending) | medium | Prompt 15 must publish final authority before Stage 2 starts. |

## Authority Rules

1. Newer final/closure/lock documents govern over earlier audit candidates.
2. Earlier documents remain supporting evidence and are not deleted.
3. Machine manifests support, but do not override, explicit human-review gates.
4. ADR-0001 remains `Proposed`; mandatory no-duplicate and safety rules still apply.
5. The Stage 2 pre-readiness score of 74/100 is historical until Prompt 15 publishes the final decision.

## Result

All **13** required architecture areas have an identified documentary authority. Twelve are high-confidence or medium-confidence with known conditions. Stage 2 preflight authority remains intentionally pending Prompt 15.
