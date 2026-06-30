# Stage 4 Final Risk Acceptance and Deferment Register

| ID | System | Risk | Severity | Final status | Expiry/action | Owner | Blocks Stage 5 | Blocks production edits |
|---|---|---|---|---|---|---|---|---|
| FR-001 | Route constants | Nine aliases/final key policy | medium | accepted with caution | Architecture approval | human | no | yes |
| FR-002 | Route declarations | /offers undeclared | high | human review | Decide route intent | product/architecture | no | yes |
| FR-003 | Dynamic routes | ID/slug/profile semantics | high | deferred to Stage 5 | Contract audit | Stage 5 Prompt 1 | no | yes |
| FR-004 | Hardcoded paths | 72 route-context occurrences | medium | deferred | Reachability and migration batches | future route prompt | no | yes |
| FR-005 | Protected routes | Sixteen parent-only role intents | high | human review | Approved role matrix | product/security | no | yes |
| FR-006 | Metadata | Eight high-priority gaps; 34 total | high | deferred | Owner and role classification | route owner | no | yes |
| FR-007 | Auth/roles | Support/admin override/unknown role | high | human review | Security policy | security | no | yes |
| FR-008 | API authorization | Frontend/backend drift | critical | deferred to Stage 5 | Endpoint contract/security audit | Stage 5 Prompt 1 | no | yes |
| FR-009 | Redirects | Denial priority and state handling | high | human review | Approved redirect table | architecture/product | no | yes |
| FR-010 | Redirects | Loop/history baseline absent | high | required before edit | Browser regression suite | QA/engineering | no | yes |
| FR-011 | 404 | Explicit/wildcard URL policy | medium | accepted with caution | Preserve current behavior | future route prompt | no | yes |
| FR-012 | Legacy | Auth/Admin/guard reachability | medium | deferred | Import/runtime proof | lead engineer | no | yes for cleanup |
| FR-013 | Validation | Runtime matrices skipped | high | accepted for freeze only | Execute before any batch | QA | no | yes |
| FR-014 | Rollback | No exact runtime batch target | low | accepted for freeze | Bind plan at future gate | future prompt | no | yes |
| FR-015 | Stage 5 | API 404/auth errors may depend on route policy | high | deferred to Stage 5 | Record dependencies, do not assume resolution | Stage 5 Prompt 1 | no | yes |

No known risk blocks Stage 5's documentation-only audit. All unresolved policy and test risks block affected production edits.

