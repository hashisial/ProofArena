# Stage 4.1 Route Centralization Implementation Batch Plan

| Batch | Scope | Files | Preconditions | Expected behavior | Rollback | Status |
|---|---|---|---|---|---|---|
| B0 | no-op snapshots and machine comparisons | none runtime | none | unchanged | not needed | approved documentation only |
| B1 | low-risk public CTA literal migration | exact files TBD | consumer map, tests, approval | unchanged | per-file revert | not approved |
| B2 | metadata completeness | routeMetadata only | role/visibility decisions | unchanged access | revert records | blocked |
| B3 | protected navigation/guards | exact files TBD | Stage 4.2 lock | unchanged access | batch revert | blocked |
| B4 | redirects/404 constants | exact files TBD | Stage 4.3 lock | unchanged history/state | batch revert | blocked |
| B5 | alias deprecation | imports/constants | full consumer graph | unchanged paths | restore aliases | blocked |

Prompt 4 may execute B0 documentation validation only. No runtime batch is approved.

## Full Batch Contract

| Batch | Purpose | Likely files | Routes | Allowed | Forbidden | Before validation | After validation | Rollback | Risk | Human review | Automatable |
|---|---|---|---|---|---|---|---|---|---|---|---|
| B0 | No-op snapshot/comparison | None runtime | All 108 leaves and consumers | Read-only counts/parity | Any source edit | Capture 117/108/73/42 | Zero source diff | Not applicable | low | no | yes |
| B1 | Schema/authority confirmation | Existing routes.js only if later approved | Static groups/facade | Exact reviewed diff | New registry/export deletion | Consumer graph/key approval | Import/build parity | Revert routes.js batch | high | architecture | partial |
| B2 | Public static consumer migration | Exact CTA files | Static public | Existing constants only | Router/guards/dynamic links | Link ledger/tests | Public deep links/build | Per-file revert | medium | product | yes |
| B3 | Navigation alignment | Exact nav consumers | Header/mobile/footer/role nav | Approved literals only | New arrays/role changes | Target/role matrix | Visibility/deep links | Revert nav batch | high | product/security | partial |
| B4 | Dashboard consumers | Exact cards/pages | Shared authenticated | Existing constants after role approval | Guard/layout changes | Stage 4.2 decisions | Role/deep-link matrix | Revert consumers | critical | security/product | partial |
| B5 | Admin/provider/client consumers | Exact sensitive files | Role-specific | Constant substitution only | Guard weakening/shell duplication | Stage 4.2 lock | Role/unauthorized tests | Revert batch | critical | security | no |
| B6 | Dynamic builders | Exact link producers | Profile/marketplace/challenge/plan/offer/proof | Existing approved builders | Identifier guessing | Domain/API contracts | URL/deep-link tests | Restore interpolation | critical | domain/API | partial |
| B7 | Redirect/404 targets | Exact guards/pages | Auth/system/fallback | Preserve behavior using approved constants | Policy/history/wildcard changes | Stage 4.3 policy/tests | Loop/state/history tests | Revert redirect batch | critical | auth/security | no |
| B8 | Alias/stale cleanup | routes.js and consumers | Nine aliases, /offers, legacy | Proven-unused removal only | Early deletion/new redirects | Consumer graph/compatibility | Build/inbound links | Restore aliases | critical | architecture/product | partial |
| B9 | Final audit | Tests/docs | Entire browser routing | Full validation/reconciliation | Opportunistic source fixes | Prior batches green | Zero unexplained mismatch | Roll back latest batch | high | QA/architecture | yes |

Only B0 is allowed as documentation/no-op validation. B1 through B9 remain unapproved.
