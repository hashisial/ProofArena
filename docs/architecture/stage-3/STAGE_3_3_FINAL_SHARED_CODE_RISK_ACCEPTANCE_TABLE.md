# Stage 3.3 Final Shared Code Risk Acceptance Table

| ID | Risk | Source | System | Severity / likelihood | Blast radius | Status / reason | Expiry | Future action | Human review | Blocks Stage 4 | Blocks production edits |
|---|---|---|---|---|---|---|---|---|---|---|---|
| RSK-001 | Premature abstraction | Prompt 7 risk register | Candidate libraries | high/high | Shared APIs/imports | accepted temporarily; no promotions authorized | Two consumers/tests exist | Reapply promotion gate | yes | no | yes |
| RSK-002 | Dumping-ground roots | Folder classification | Client mixed roots | high/high | Frontend ownership | accepted temporarily in place; frozen | Owners/migration plan approved | File-level migration | yes | no | yes |
| RSK-003 | Platform duplication | Stage 2/3 locks | Routes/auth/API/config/design | critical/medium | Whole platform | deferred to Stage 4 controls; prohibited | Relevant platform stage closes | Audit source-of-truth | yes | no | yes |
| RSK-004 | Module leakage into shared | Dependency audit | Hooks/utils/types/facade | high/high | Modules/cycles | accepted temporarily; no copying | Tested vertical migration | Resolve reverse imports | yes | no | yes |
| RSK-005 | API client duplication | API lock | Frontend transport | critical/medium | All requests/security | prohibited; no duplicate found | Never unless superseding ADR | Re-scan each prompt | yes | yes if found | yes |
| RSK-006 | Auth/payment/admin sensitivity | HUT/API locks | Sensitive domains | critical/medium | Security/financial/admin | human approval required | Owner/security approval | Explicit contracts/tests | yes | no | yes |
| RSK-007 | Circular dependency | Dependency lock | Shared/module graph | critical/medium | Build/runtime | prohibited; no checker cycle found | Never | Full graph before moves | yes | yes if found | yes |
| RSK-008 | Shared type drift | HUT lock | Identity/profile/payment/API | high/medium | Contracts/authorization | blocked | Authoritative contract strategy | Drift inventory/tests | yes | no | yes |
| RSK-009 | Naming ambiguity | Folder lock | common/shared/root names | medium/high | Developer placement | accepted temporarily | Owners and migration complete | Use final locks, not names | yes | no | yes for moves |
| RSK-010 | Unclear ownership/missing doc | Closeout report | Mixed roots/Stage 3.1 | high/medium | Governance confidence | human review required | Acceptance doc restored/owner decided | Resolve before edits | yes | no | yes |
| RSK-011 | Placeholder/static truth | Anti-pattern lock | Common placeholders/fallbacks | high/medium | User-visible behavior | deferred to later feature/data stage | Real data/empty-state authority exists | Keep out of shared | yes | no | yes |
| RSK-012 | Over-generalized UI | UI lock | UI/common/state surfaces | high/medium | UX/accessibility | accepted with caution | Tests/consumer comparison complete | Item-level review | yes | no | yes |
| RSK-013 | Backend global service layer | Folder/API locks | Server services/admin controller | high/high | Backend domains/data | deferred to later tested migration | Service owners/tests exist | Resolve layering warnings | yes | no | yes |
| RSK-014 | Test-governance gap | Consumer/acceptance docs | Client/server | high/high | All refactors | blocks production promotion | Test baseline approved | Establish framework/tests | yes | no | yes |
| RSK-015 | New shared folder/barrel | Promotion/README locks | Source architecture | high/medium | Imports/ownership | prohibited | Explicit approval gates pass | Exact-path review | yes | yes if attempted | yes |
| RSK-016 | ScaleOps/ProofArena boundary dilution | ADR/anti-pattern lock | Product architecture | critical/medium | Entire SaaS boundary | prohibited | Superseding formal ADR | Preserve module/platform rule | yes | yes if challenged | yes |

## Summary

- Remaining risks: 16.
- Documentation-only Stage 4 blockers: none if all preflight controls pass.
- Production edit blockers: all affected promotions/migrations until owner, tests, security, and source-of-truth conditions pass.

