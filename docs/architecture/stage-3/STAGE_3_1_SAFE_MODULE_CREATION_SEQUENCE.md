# Safe Module Creation Sequence

| Step | Goal | Allowed later | Forbidden | Required docs/validation | Rollback | Stop condition |
|---|---|---|---|---|---|---|
| SQ-01 | Confirm authorities | Read/record | Production edit | Final locks | N/A | Missing authority |
| SQ-02 | Check duplicates | Path/import scan | Parallel platform system | Do-not list | Remove uncommitted scaffold | Existing equivalent |
| SQ-03 | Lock ownership | Decision docs | Guess owner | Ledgers/conflicts | Revert docs decision | Ambiguous critical owner |
| SQ-04 | Start lowest risk | README-only if approved | Business files | Approval gate | Delete new README/folder | Approval absent |
| SQ-05 | Create minimal scaffold | README; barrel only if proven | Fake services/models | Prompt 3 contract | Remove scaffold | Nonbehavioral rule fails |
| SQ-06 | Map all imports | Documentation | File move | Dependency maps | N/A | Unknown dependent |
| SQ-07 | Migrate one vertical slice | Approved complete slice | Compatibility copy | Tests/migration plan | Commit rollback | Partial slice |
| SQ-08 | Validate each move | Build/lint/typecheck/tests | Batch untested move | Package scripts/manual QA | Revert isolated commit | Validation fails |
| SQ-09 | Separate route/API/auth work | Dedicated prompts | Mixed contract changes | Stage 4/5/23 docs | Revert contract change | Cross-system scope |
| SQ-10 | Detect circular dependencies | Boundary/import checks | Merge through cycle | Dependency graph | Revert move | Cycle appears |

