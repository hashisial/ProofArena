# Final Module Ownership Enforcement Checklist

| ID | Check | Pass | Stop condition |
|---|---|---|---|
| EC-01 | File purpose matches one module lock. | Clear single owner. | Ambiguous owner. |
| EC-02 | No platform logic duplication. | Platform consumed via public API. | Router/shell/auth/API/config copied. |
| EC-03 | No shared UI duplication. | Existing primitive reused. | Module design-system copy. |
| EC-04 | No API client creation. | Adapter uses canonical client. | Base/token/interceptor wrapper. |
| EC-05 | No auth/role bypass. | Shared guards/middleware remain. | UI-only or module security policy. |
| EC-06 | No route/nav/dashboard ownership. | Dedicated platform stages own it. | Module registration/shell config. |
| EC-07 | No circular/private cross-module dependency. | Public acyclic contract. | Cycle or deep import. |
| EC-08 | Shared governance applied where needed. | 2+ consumers and approval. | Shared promotion without evidence. |
| EC-09 | Risk-proportional tests exist. | Test plan and rollback approved. | Production migration untested. |
| EC-10 | Required human approval recorded. | Approval evidence exists. | High-risk decision assumed. |

