# Stage 4 Route Centralization Rollback Plan

| ID | Scenario | Trigger | Rollback | Validation | Owner |
|---|---|---|---|---|---|
| RB-01 | configured link breaks | unresolved target/build failure | revert exact consumer file | link/deep-link tests | implementation prompt |
| RB-02 | role access changes | allowed/denied matrix differs | revert metadata/consumer batch | role tests | security owner |
| RB-03 | redirect changes | target/state/history differs | revert redirect batch | auth/redirect tests | auth owner |
| RB-04 | dynamic path fails | ID/slug mismatch | restore old builder/literal | deep links/API contract | domain owner |
| RB-05 | alias removal breaks import | build/runtime error | restore alias/export | build/import scan | architecture owner |
| RB-06 | duplicate system appears | second router/constants source | remove new source and stop | repository scan | architecture owner |

Batches must be independently revertible. No rollback is required for documentation-only Prompts 1-3.

## Rollback Controls

- Preserve old constants, aliases, declarations, navigation sources, and guard targets until each batch passes.
- Keep batches exact-file and independently revertible.
- Never delete stale-looking constants in the same batch that migrates consumers.
- Stop on access expansion, authorized-user denial, redirect loop, wrong dynamic URL, wildcard interception, or duplicate architecture.

| ID | Scenario | Detection | Immediate action | Revert target | Post-rollback validation | Human review |
|---|---|---|---|---|---|---|
| RB-07 | Constants import/build failure | Build/lint/module error | Stop batch | Exact routes.js/export changes | Build/lint/import scan | architecture |
| RB-08 | Public link regression | 404 or wrong page | Preserve evidence, revert | Exact consumer files | Public deep links | product/QA |
| RB-09 | Navigation visibility drift | Wrong-role link visibility | Stop; no ad hoc guard patch | Exact nav/config batch | Visibility plus direct URLs | security/product |
| RB-10 | Protected access drift | Bypass or false denial | Security stop | Exact metadata/consumer batch | Full role matrix | security |
| RB-11 | Wildcard/404 regression | Explicit route intercepted | Restore prior order/target | Exact AppRoutes change if approved | System/invalid paths | architecture/QA |
| RB-12 | Browser/API boundary crossed | Endpoint added to wrong registry | Quarantine and revert | Exact boundary-crossing change | Separate inventories | architecture/API |
