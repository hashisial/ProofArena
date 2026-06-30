# Stage 3.3 Shared Code Acceptance Criteria

| ID | Requirement | Pass condition | Fail condition | Evidence | Status | Future action | Blocks Prompt 9 |
|---|---|---|---|---|---|---|---|
| ACC-001 | Prompt 7 findings verified | All 28 retained and evidence-checked | Findings silently accepted/removed | Prompt 7 verification | pass with caution | Resolve five partial and one unknown before production promotion | no |
| ACC-002 | Shared candidates corrected | All 12 have explicit corrected status | Candidate treated as approved by folder name | Candidate correction report | pass | Maintain status register | no |
| ACC-003 | Shared folders classified | All discovered shared-like roots have owner/status | Mixed root unclassified | Folder classification | pass with caution | Resolve mixed server/client roots before moves | no |
| ACC-004 | Consumer evidence mapped | Counts and representative consumers recorded | Two-consumer claim lacks imports/usages | Consumer evidence map | pass | Recheck dynamic/unused paths before production work | no |
| ACC-005 | Dependency violations audited | Reverse imports, transport, cross-runtime, cycles checked | Dependency direction unknown | Dependency violation audit | pass with caution | Remediate only in later tested migrations | no |
| ACC-006 | Shared UI verified | Generic subset separated from platform/module UI | Whole UI folder approved blindly | Shared UI verification | pass with caution | Review route-aware exceptions and duplicate states | no |
| ACC-007 | Hooks/utilities/types verified | File groups have corrected ownership | Root folders treated as shared | HUT verification | pass with caution | Resolve owners/tests/contracts | no |
| ACC-008 | API helpers/services verified | Sole client and neutral helpers identified | Duplicate client or hidden transport approved | API/helper verification | pass | Preserve canonical client | no |
| ACC-009 | Approved libraries evidence-backed | Approval requires consumers, neutrality, owner, direction | Speculative library approved | Candidate/consumer/status docs | pass with caution | Add tests before runtime expansion | no |
| ACC-010 | Candidate-only not treated as approved | Candidate statuses explicit | Candidate receives production shared code | Approval register | pass | Enforce promotion gate | no |
| ACC-011 | Blocked libraries clearly blocked | Validation/types/tests/tokens statuses explicit | Blocked path is scaffolded | Approval register | pass | Keep blocked | no |
| ACC-012 | README scaffolds documentation-only | Only Markdown in existing folders; restrictive scope | Runtime file/import/export/path created | README decision/audit | pass | Revalidate filesystem scope | no |
| ACC-013 | No runtime shared files created | No JS/TS/JSX/TSX runtime file created | Runtime artifact added | Final filesystem audit | pass | Repeat final check | no |
| ACC-014 | No imports updated | Source imports unchanged | Import or barrel changed | Git/filesystem audit | pass | Repeat final check | no |
| ACC-015 | No module code moved into shared | No production move/copy | Domain file promoted | Git/filesystem audit | pass | Keep migration blocked | no |
| ACC-016 | No platform code moved into shared | Platform sources unchanged | Router/auth/API/config/etc. relocated | Git/filesystem audit | pass | Preserve locks | no |
| ACC-017 | No API client duplicated | Sole client-side `axios.create` remains canonical | Second client/transport helper exists | API verification | pass | Re-scan every prompt | yes if failed |
| ACC-018 | Unknown ownership escalated | Missing doc and mixed owners are explicit | Unknown converted to approval | Tracker/status/verification docs | pass | Human review before production changes | no |
| ACC-019 | Prompt 9 has closeout evidence | Findings, statuses, risks, README audit, and handoff exist | Final dispositions unavailable | Entire Prompt 8 package | pass with caution | Prompt 9 finalizes risk acceptance and locks | no |

## Acceptance Result

- Pass: 12.
- Pass with caution: 7.
- Partial/fail/unknown: 0 for documentation-only Prompt 8.
- Production shared-code promotion remains blocked until tests, owners, sensitive reviews, and all promotion gates pass.

