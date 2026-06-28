# Stage 2 Mandatory Preflight Checklist

Generated: 2026-06-28

Stage 2 is **ScaleOps Parent Project Boundary**. This checklist is mandatory before any Stage 2 action. A failed stop condition means no production edit may begin.

| Check ID | Required action | Required document | Pass condition | Fail condition | Stop condition | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| S2-PF-01 | Read ADR-0001 adoption package. | `adr/ADR-0001-adoption-package.md` | Scope and governance rules are acknowledged. | ADR rules are unread or disputed. | Stop and escalate to architecture owner. | ADR remains Proposed. |
| S2-PF-02 | Read final Stage 1 handoff. | `STAGE_1_FINAL_HANDOFF_PACKAGE.md` | Completion limits and Stage 2 gate are understood. | Work starts from an older tracker. | Stop and use final handoff. | Final handoff overrides summary trackers. |
| S2-PF-03 | Read final authority index. | `STAGE_1_FINAL_SOURCE_OF_TRUTH_DOC_INDEX.md` | Primary/supporting/superseded roles are clear. | Competing docs are treated as co-equal. | Stop and resolve authority. | Historical docs remain evidence. |
| S2-PF-04 | Read architecture control board. | `STAGE_1_ARCHITECTURE_CONTROL_BOARD.md` | Applicable controls and owners are identified. | Target system lacks a control owner. | Stop and assign owner. | Apply system-specific validation. |
| S2-PF-05 | Read remaining risk register. | `STAGE_1_REMAINING_RISK_REGISTER.md` | Related risk IDs are identified. | Target touches an unreviewed risk. | Stop and classify risk. | Do not hide unknowns. |
| S2-PF-06 | Read final risk disposition. | `STAGE_1_FINAL_RISK_ACCEPTANCE_AND_DEFERMENT_TABLE.md` | Risk status, expiry, and owner are understood. | Blocked/human item is treated as accepted. | Stop until owner action. | Final disposition governs. |
| S2-PF-07 | Confirm ScaleOps parent boundary. | ADR-0001; final completion decision | ScaleOps remains the parent SaaS. | A parallel parent/product architecture is proposed. | Stop immediately. | Reversal requires a future ADR. |
| S2-PF-08 | Confirm ProofArena module boundary. | ADR-0001; final handoff | ProofArena remains inside ScaleOps. | Separate app/repository ownership is proposed. | Stop immediately. | No separate ProofArena project. |
| S2-PF-09 | Confirm no parallel app/repo/route tree. | Do-not-duplicate registry | Existing repository and route systems are reused. | New parallel root, app, repo, or route tree is proposed. | Stop and redesign. | Inventory first. |
| S2-PF-10 | Confirm no duplicate navigation/dashboard/API/auth system. | Stage 1.2 lock; ADR rulebook | Existing owners are identified and reused. | A competing shell/client/provider/guard is proposed. | Stop and map the existing system. | No convenience duplicates. |
| S2-PF-11 | Inspect current repository before editing. | Stage 1.1 repo inventory plus live read-only scan | Target paths/imports still match evidence. | Docs and current code differ materially. | Stop and refresh documentation. | Current code wins over stale docs. |
| S2-PF-12 | Check critical-file protection. | `STAGE_1_1_CRITICAL_FILE_PROTECTION_LIST.md` | Target is classified and prechecks are defined. | Critical file is unclassified or lacks tests/rollback. | Stop before editing. | Applies to routes/auth/API/data/config. |
| S2-PF-13 | Check do-not-duplicate registry. | `STAGE_1_1_DO_NOT_DUPLICATE_REGISTRY.md` | No existing equivalent system is found or reuse is planned. | Equivalent system already exists. | Stop creating the new file/system. | Extend ownership instead. |
| S2-PF-14 | Check authority lock. | `STAGE_1_PROMPT_14_SOURCE_OF_TRUTH_AUTHORITY_LOCK.md` | Target system's documentary authority is identified. | Source-of-truth remains unknown. | Stop and request human review. | Do not infer ownership. |
| S2-PF-15 | Keep first Stage 2 prompt documentation-only. | `STAGE_2_START_CONDITIONS.md` | First prompt verifies boundary, exact scope, checks, rollback, and stops. | First prompt proposes production edits. | Stop and split the prompt. | Production edits require separate explicit approval. |

## Preflight Result Recording

Every Stage 2 prompt must record pass/fail for `S2-PF-01` through `S2-PF-15`, cite the relevant risk IDs, and stop on the first failed stop condition.
