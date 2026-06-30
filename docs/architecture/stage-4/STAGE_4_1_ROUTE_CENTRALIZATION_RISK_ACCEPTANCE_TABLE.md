# Stage 4.1 Route Centralization Risk Acceptance Table

| Risk | Status | Reason | Expiry/action | Blocks implementation |
|---|---|---|---|---|
| existing aliases | accepted temporarily | compatibility | consumer map and tests | yes for removal |
| /offers base | human review | intent unknown | product decision | yes |
| metadata gaps | blocked | access/visibility unknown | classify 34 routes | yes |
| hardcoded paths | deferred by batch | active/legacy mix | per-file plan | yes |
| dynamic semantics | blocked | ID/slug/profile contracts | domain approval | yes |
| legacy routes/guards | accepted in place | reachability unknown | prove before changes | yes |
| route regression gap | blocked | no behavior proof | test baseline | yes |
| duplicate architecture | prohibited | ADR/Stage 2 | never without superseding ADR | yes if proposed |

Final planning status: complete with caution. Implementation status: blocked.

## Full Risk Fields

| ID | Risk | Source | System | Severity | Likelihood | Blast radius | Status | Reason | Expiry | Next action | Owner | Blocks P4 | Blocks edits |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RA-01 | Nine aliases | Constants inventory | routes.js | high | high | application imports | accepted for planning | Current compatibility | Canonical keys/tests | Retain/map | architecture/human | no for B0 | yes for removal |
| RA-02 | /offers intent | Prompt 2 | public offers | medium | medium | public/SEO | human approval | Base vs index unknown | Product decision | Record only | product | no for B0 | yes |
| RA-03 | 34 metadata omissions | Gap analysis | policy/nav/layout | critical | high | access/discovery | blocked | Policy source incomplete | All classified | Owner/role ledger | Stage 4.2 | no for planning | yes |
| RA-04 | 16 parent-only routes | Protection gaps | dashboard | critical | high | authorization | deferred | Role intent unknown | Approved matrix | Preserve access | Stage 4.2/security | no for B0 | yes |
| RA-05 | 72 classified literals | Hardcoded analysis | 28 consumers | high | high | links/redirects | deferred by batch | Uses differ | Occurrence ledger/tests | Exact migration | later prompt | no for B0 | yes |
| RA-06 | Service ID/slug ambiguity | HP-005 | marketplace dynamic | critical | high | wrong resource | blocked | Contract unknown | API/domain approval | Preserve URL | API/domain owner | yes for dynamic | yes |
| RA-07 | Profile compatibility | HP-006 | public profile/SEO | high | medium | inbound links | human approval | Canonical/retention unknown | Product decision | Keep routes | product | no for B0 | yes |
| RA-08 | Legacy route/guards | HP-008 | auth/admin | critical | medium | security/session | accepted in place | Reachability unproven | Runtime graph | Do not delete | later/human | no for B0 | yes |
| RA-09 | Distributed redirects | Redirect report | guards/layout/pages | critical | high | auth/history | Stage 4.3 deferred | Priority/state risk | Policy/tests | Targets only | Stage 4.3 | no for B0 | yes |
| RA-10 | Hidden-route intent | Navigation report | navigation | high | medium | discovery/security | human approval | Omission may be intentional | Hidden ledger | Do not expose | product/security | no for B0 | yes |
| RA-11 | Regression baseline absent | Blockers | entire router | critical | high | platform-wide | blocked | No behavior proof | Harness exists | Execute validation | QA | yes runtime | yes |
| RA-12 | Browser/API merge | HP-012 | architecture | critical | medium | system-wide | prohibited | Boundary violation | Never absent ADR | Keep separate | architecture/API | yes if crossed | yes |
| RA-13 | Separate ProofArena routing | ADR/locks | architecture | critical | low | entire SaaS | prohibited | Absolute rule | Superseding ADR only | Stop proposal | architecture | yes | yes |
| RA-14 | Wildcard order | HP-011 | fallback | high | medium | invalid URLs | Stage 4.3 deferred | Order is behavior | 404 tests | Keep terminal | Stage 4.3/QA | no for B0 | yes |

Planning risks are accepted only for documentation. No risk acceptance authorizes runtime work.
