# ADR-0001 Violation Response Plan

Generated: 2026-06-27

| Violation | Detection | Immediate action | Documentation/rollback | Human review | Prevention |
| --- | --- | --- | --- | --- | --- |
| V-01 Separate ProofArena app | New repo/app/router/shell/client/auth/nav | Stop work | Record files/reason; remove/revert after approval | Required | G-01 preflight |
| V-02 Duplicate route constants/tree | New registry or parallel router | Stop route edits | Compare route lock; revert duplicate | Route owner | G-03 |
| V-03 Duplicate dashboard shell | New protected shell/sidebar state | Stop | Restore existing wrapper/SidebarCore use | Required if migration intended | G-05/06 |
| V-04 Duplicate HTTP client | New Axios instance/browser fetch wrapper | Stop requests | Revert and map to apiClient/service | API owner | G-07 |
| V-05 Auth/role bypass | UI-only access or middleware removal | Disable/stop immediately | Security incident note; revert atomic diff | Required | G-09 |
| V-06 Fake production logic | Placeholder becomes invented data/status/mutation | Disable state | Restore honest placeholder/empty state | Product/security | G-12 |
| V-07 Critical file without preflight | Diff touches protected file with no checks | Stop commit | Add preflight/tests or revert | As protection list states | G-18 |
| V-08 Unapproved config/package/env | Diff/lock/env change | Stop deployment | Revert; document approval need; never expose secret | Required | G-14/15 |
| V-09 Unsafe deletion | File removed without full proof | Restore immediately | Complete safe-delete checklist | Required for high risk | G-13 |
| V-10 Frontend/backend boundary violation | Cross-source import or security moved client-side | Stop | Restore boundary; document intended contract | Architecture/security | G-02/09/10 |

Every violation response records detection, affected files, commands/QA, rollback status, and whether production behavior may have changed.

