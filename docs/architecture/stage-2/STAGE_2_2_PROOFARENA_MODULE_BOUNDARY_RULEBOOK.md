# ProofArena Module Boundary Rulebook

| Rule | Requirement | Reason | Required docs | Forbidden action | Validation | Stop condition |
|---|---|---|---|---|---|---|
| PM-01 | ProofArena remains the flagship module inside ScaleOps. | Preserves product boundary. | ADR adoption package | Treating ProofArena as standalone | Repository/package scan | Any second app/repo proposal |
| PM-02 | Module-specific features may exist only inside ScaleOps-owned runtime systems. | Product specialization does not require infrastructure duplication. | Stage 2.1 authority lock | New app/server/deployment | Entry-point scan | New runtime boundary |
| PM-03 | ProofArena routes use the existing router and route governance. | Prevents route divergence. | Route inventory and lock | Parallel router/tree | Route/link QA | Unmapped route owner |
| PM-04 | ProofArena dashboards reuse existing role shells. | Protects navigation and auth behavior. | Layout lock; critical list | New dashboard shell | Dashboard/role QA | Shell ownership unknown |
| PM-05 | Public ProofArena branding uses shared public layout/navigation. | Separates brand from runtime ownership. | Navigation/layout maps | Branded duplicate nav | Responsive nav QA | Duplicate nav config |
| PM-06 | Module API calls use the shared API client. | Preserves base URL, cookies, refresh, and errors. | API client lock | Raw client/axios instance | Network/auth/error QA | Token path differs |
| PM-07 | Module auth and roles reuse platform providers, guards, and middleware. | UI checks alone are not security. | Auth architecture; ADR rules | Module auth store or bypass | Positive/negative auth QA | Guard bypass found |
| PM-08 | Backend ProofArena routes compose through the existing Express app. | Preserves one API boundary. | API inventory | ProofArena server/app | Server route scan | Second listener/app |
| PM-09 | Feature services remain in current owners until a tested vertical migration. | Avoids compatibility copies. | Module READMEs | Empty/copy services under module | Import and boundary checks | Migration lacks tests |
| PM-10 | Shared UI and utilities remain ScaleOps-owned. | Avoids duplicate libraries. | Reusable code map | ProofArena shared library clone | Import/duplicate scan | Ownership unclear |
| PM-11 | Module code may depend on shared/platform code; shared/platform code must not depend on private module files. | Maintains dependency direction. | Boundary docs | Private cross-boundary imports | `check:boundaries` | Boundary check fails |
| PM-12 | Product-facing ProofArena names do not create package/deployment authority. | Branding is not architecture evidence. | Identity audit | Inferring standalone ownership from copy | Package/entry scan | New package based on branding |
| PM-13 | Placeholders stay classified and cannot impersonate real auth, payment, verification, or admin state. | Prevents fake production behavior. | Placeholder report | Promoting fake state | Data-source and empty-state QA | Sensitive fake data found |
| PM-14 | Existing route, API, and data contracts remain stable during audit-only prompts. | Stage 2.2 is documentation-only. | Prompt contract | Production edits | Git diff | Any non-doc change |
| PM-15 | Naming changes require explicit approval and impact analysis. | Names cross product, package, route, and deploy surfaces. | Risk register | Audit-time rename | Reference scan/build | Approval absent |
| PM-16 | New dependencies require explicit stage approval. | Prevents hidden architecture changes. | Governance rulebook | Package/lock edits | Git diff | Dependency file changes |
| PM-17 | Deletion follows the Stage 1 safe-delete policy. | “Unused” is not proof. | Safe-delete policy | Casual delete | Import/route/runtime proof | Multi-source proof missing |
| PM-18 | Reversing the unified boundary requires a formal future ADR and human approval. | Makes separation explicit and reviewable. | ADR-0001 | Informal separation | ADR index review | No approved superseding ADR |

## Absolute Stop Conditions

Stop immediately on a proposed second ProofArena entry point, package, router, dashboard shell, API client, auth provider, database connection, deployment target, or on any production edit made under a documentation-only prompt.

