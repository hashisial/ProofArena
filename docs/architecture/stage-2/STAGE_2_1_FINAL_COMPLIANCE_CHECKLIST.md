# Stage 2.1 Final Compliance Checklist

Generated: 2026-06-28

| Check | Required action | Required doc | Pass condition | Fail condition | Stop condition |
| --- | --- | --- | --- | --- | --- |
| FC-01 | Confirm ScaleOps parent SaaS. | Authority lock | Parent ownership explicit. | ProofArena treated as parent/peer. | Stop. |
| FC-02 | Confirm ProofArena remains inside ScaleOps. | Final closeout/handoff | Module ownership only. | Standalone ownership proposed. | Stop. |
| FC-03 | Confirm no separate app/package/repo. | Repository verification | No new root/package. | Separate root/package found. | Stop. |
| FC-04 | Confirm no parallel route tree. | Route lock/protection table | Central routes reused. | Module router/constants proposed. | Stop. |
| FC-05 | Confirm no ProofArena dashboard shell. | Layout lock | Existing role shells reused. | New shell/layout proposed. | Stop. |
| FC-06 | Confirm no ProofArena API client. | API lock | Canonical transport reused. | New transport/token stack. | Stop. |
| FC-07 | Confirm no ProofArena auth/role system. | Auth/ADR rules | Shared provider/guards/middleware. | Fork/bypass proposed. | Stop. |
| FC-08 | Read current source-of-truth docs. | Final source index | Correct authority cited. | Historical doc used as permission. | Stop and correct. |
| FC-09 | Respect ADR-0001. | Adoption package/rulebook | Mandatory rules applied. | Proposed status used to ignore rules. | Stop/escalate. |
| FC-10 | Check boundary-sensitive systems. | Protection table | Target owner/checks known. | Target unclassified. | Stop. |
| FC-11 | Require explicit production permission. | Stage 2 start conditions | Exact files/actions/tests/rollback approved. | Audit prompt edits runtime. | Stop/split prompt. |
| FC-12 | Escalate ambiguity. | Human decision log | Unknown has owner/status. | Assumption replaces evidence. | Stop for human review. |

This checklist is mandatory before Stage 2.2 and every later Stage 2 prompt.
