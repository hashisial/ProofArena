# Module Ownership Checklist

| ID | Check | Pass | Fail/stop |
|---|---|---|---|
| OC-01 | Does the file belong to this module's business capability? | Purpose matches lock. | Owner ambiguous. |
| OC-02 | Is it platform-owned? | No, or module only consumes public platform API. | Entry/router/shell/auth/API/config ownership. |
| OC-03 | Is it shared-governed? | No, or approved shared contribution. | Module claims shared governance. |
| OC-04 | Does an equivalent file/system already exist? | No duplicate or migration plan exists. | Compatibility copy. |
| OC-05 | Does it create an API client/base/token layer? | No. | Immediate stop. |
| OC-06 | Does it bypass auth/role policy? | Shared guards/middleware retained. | Immediate stop/security review. |
| OC-07 | Does it add route/nav/dashboard behavior? | No; dedicated stage owns it. | Stop and defer. |
| OC-08 | Does it introduce a circular/cross-private import? | Dependency direction passes. | Stop and redesign contract. |
| OC-09 | Are tests required and defined? | Tests/test plan matches risk. | No production migration. |
| OC-10 | Does it need human review? | Approval recorded or work remains docs-only. | Stop high-risk work. |

