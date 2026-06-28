# Stage 2.1 Preflight Checklist

Generated: 2026-06-28

Use this checklist before any later Stage 2.1 production edit. A stop condition blocks the edit.

| Check ID | Required action | Pass condition | Fail condition | Stop condition |
| --- | --- | --- | --- | --- |
| S21-PF-01 | Read `STAGE_1_FINAL_HANDOFF_PACKAGE.md`. | Stage 1 limits and risk dispositions are acknowledged. | Work starts from an older summary. | Stop and read final handoff. |
| S21-PF-02 | Read `adr/ADR-0001-adoption-package.md`. | Boundary and adoption rules are understood. | ADR rules are skipped or disputed. | Stop and escalate. |
| S21-PF-03 | Read `adr/ADR-0001-final-codex-governance-rulebook.md`. | Mandatory future-prompt rules are applied. | Proposed change violates a rule. | Stop and redesign. |
| S21-PF-04 | Run `STAGE_2_MANDATORY_PREFLIGHT_CHECKLIST.md`. | All 15 Stage 2 checks pass. | Any check fails or is unknown. | Stop on first failure. |
| S21-PF-05 | Confirm ScaleOps parent boundary. | ScaleOps remains parent SaaS in scope/design. | ProofArena is treated as parent or peer app. | Stop immediately. |
| S21-PF-06 | Confirm ProofArena module boundary. | Target remains inside current ScaleOps client/server. | Separate ProofArena root/package/server is proposed. | Stop immediately. |
| S21-PF-07 | Confirm no separate app/repo/route/dashboard/API/auth/navigation system. | Existing owners are reused. | A duplicate platform system is proposed. | Stop and map current owner. |
| S21-PF-08 | Inspect live repository structure. | Target paths/imports match current code. | Docs and current repository differ materially. | Stop and refresh audit. |
| S21-PF-09 | Read final source-of-truth index. | Correct primary authority is cited. | Historical/superseded doc is treated as final. | Stop and correct authority. |
| S21-PF-10 | Read do-not-duplicate registry. | No equivalent existing system is overlooked. | Equivalent system exists. | Stop new creation. |
| S21-PF-11 | Read critical-file protection list. | Target classification, tests, rollback, and owner are known. | Critical target lacks evidence. | Stop before edit. |
| S21-PF-12 | Read remaining/final risk registers. | Related SR/BR risks and owners are cited. | Blocked/human risk is ignored. | Stop and obtain owner disposition. |
| S21-PF-13 | Record formal ADR approval or explicit deferral. | Architecture-owner evidence exists. | Approval/deferral remains unrecorded. | No production change allowed. |
| S21-PF-14 | Run client and server boundary checks. | Both pass; warnings are classified. | Boundary violation exists. | Stop and document violation. |
| S21-PF-15 | Keep production edits separately approved. | Prompt explicitly authorizes exact files/actions/checks/rollback. | Audit prompt attempts runtime edits. | Stop and split prompt. |

## Current Prompt 1 Result

- `S21-PF-01` through `S21-PF-12`: satisfied for documentation-only audit.
- `S21-PF-13`: **not satisfied**; formal ADR approval/deferral remains a human-review item.
- `S21-PF-14`: client and server checks passed; three server layering warnings are unrelated and remain documented.
- `S21-PF-15`: satisfied; no production edit was attempted.
