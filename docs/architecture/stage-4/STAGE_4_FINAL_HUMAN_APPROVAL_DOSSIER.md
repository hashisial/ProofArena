# Stage 4 Final Human Approval Dossier

| Decision ID | Source doc | Related system | Question | Why it matters | Recommended default | Risk if unanswered | Final status | Blocks Stage 5 | Blocks production edits |
|---|---|---|---|---|---|---|---|---|---|
| HD-001 | Stage 4.1 source/readiness docs | route constants | Which aliases and keys are canonical? | Migration can break every route consumer | Preserve current exports | Divergent paths and broken links | required before production edit | no | yes |
| HD-002 | Centralization blocker register | route declarations | Is `/offers` stale, missing, or an alias? | Declaration/navigation intent is ambiguous | Do not declare or delete | Broken or duplicate route | required before production edit | no | yes |
| HD-003 | Dynamic route plans | routes/API | Is marketplace service identity an ID or slug? | Frontend route and API contracts may diverge | Preserve current behavior and audit | Wrong resource lookup/deep links | required before production edit | no | yes |
| HD-004 | Protected-route risk table | protected routes | Which roles may access 16 shared dashboard routes? | Current authentication does not prove intended authorization | Preserve current access | Over- or under-authorized users | required before production edit | no | yes |
| HD-005 | Role source verification | auth/roles | What are support, admin override, and unknown-role rules? | Privileged access requires explicit policy | Fail closed; preserve current code | Authorization bypass or lockout | required before production edit | no | yes |
| HD-006 | Redirect coordination plans | redirects | What is canonical denial and redirect priority? | Competing guards can loop or mask denials | Preserve current destinations/order | Loops, history bugs, information leakage | required before production edit | no | yes |
| HD-007 | NotFound/wildcard docs | 404 | Should wildcard retain the unknown URL or redirect to `/not-found`? | Changes browser history and SEO semantics | Preserve render-in-place behavior | Broken deep links/SEO drift | optional before Stage 5; required before behavior edit | no | yes |
| HD-008 | Legacy forensics | guards/auth | Are `Auth`, `AdminGate`, and `RequireRole` intentionally retained? | Cleanup without reachability proof may break access | Do not delete | Runtime regression | deferred | no | yes for cleanup |
| HD-009 | Validation plans | validation | Who accepts route, role, history, and deep-link regression? | Production gates need accountable acceptance | QA lead plus security reviewer | Untested release | required before production edit | no | yes |
| HD-010 | Backend authorization gaps | Stage 5/API auth | Which endpoint permissions correspond to frontend route roles? | UI guards are not server authorization | Audit in Stage 5; do not infer | Data exposure or false denials | required before production edit | no | yes |
| HD-011 | Onboarding flow docs | auth/onboarding | What state authorizes completion and revisit? | Redirect and route eligibility depend on it | Preserve current state handling | Redirect loops/incorrect access | required before production edit | no | yes |
| HD-012 | Broken-route verification | deployment/404 | What host rewrite/direct-link behavior is supported? | SPA deep links can fail outside client routing | Test current deployment before edit | Production-only 404 failures | required before production edit | no | yes |
| HD-013 | Payment redirect evidence | security/payment | Which external session URL origins and schemes are trusted? | Unvalidated redirects are security-sensitive | Reject unapproved targets; preserve code | Open redirect/payment failure | required before production edit | no | yes |
| HD-014 | Validation tooling | engineering/QA | May missing behavioral/type/test harnesses be added and who owns them? | Route changes lack repeatable acceptance evidence | Approve a minimal governed harness first | Unverifiable regressions | required before production edit | no | yes |

## Summary

- **Human approval required before Stage 5 documentation audit:** no.
- **Human approval required before production edits:** yes.
- **Recommended reviewer roles:** product owner, lead engineer, security reviewer, architecture owner, QA lead, and payment/security owner where external redirects are involved.

