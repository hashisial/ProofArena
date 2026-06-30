# Stage 3.3 Shared Code Promotion Criteria

All criteria are mandatory. A single failed or unknown stop condition keeps code in its current module or platform location.

| ID | Requirement | Pass condition | Fail condition | Evidence required | Required validation | Human review | Stop condition |
|---|---|---|---|---|---|---|---|
| SCP-001 | At least two real consumers need the abstraction | Two independent modules or one module plus a platform surface use the same stable behavior | One consumer, speculative roadmap use, or copied placeholder | Import/consumer list and use-case comparison | Search consumer graph and verify semantics | no unless high risk | Consumer count or independence is unknown |
| SCP-002 | Product-agnostic behavior | Name, inputs, outputs, and behavior contain no module workflow assumptions | Feature vocabulary, status transitions, or business decisions are embedded | Source review and examples from each consumer | Semantic comparison across consumers | yes when semantics differ | Abstraction requires module conditionals |
| SCP-003 | No module business logic | Shared artifact provides presentation, neutral transformation, or generic behavior only | Pricing, matching, proof, challenge, profile, payment, messaging, or moderation rules appear | Ownership mapping to Stage 3.1/3.2 locks | Boundary review | yes | Business owner is not the shared owner |
| SCP-004 | No unapproved auth/session/token logic | Artifact consumes approved platform interface or has no auth behavior | Reads/stores tokens, determines roles, or replaces session/provider logic | Auth dependency map | Security review and boundary scan | yes | Any security authority would move into shared |
| SCP-005 | No unapproved payment-sensitive logic | Artifact is presentation-neutral and contains no payment processing/data handling | Provider logic, card/bank data, payouts, invoices, or sensitive calculations are hidden | Payment data-flow evidence | Security/payment owner review | yes | Payment scope or storage is unclear |
| SCP-006 | No hidden API client behavior | Helper accepts/returns neutral data or wraps the canonical client without transport ownership | Creates client, handles base URL/token/retries/global errors/versioning | API-client scan and adapter contract | Confirm sole `axios.create` remains platform client | yes | Transport policy appears outside platform client |
| SCP-007 | No circular dependency | Dependency graph remains acyclic and shared does not import modules | Shared imports a module/private service or cycle is detected | Import graph before/after | Boundary script plus targeted search | no | Any cycle or reverse dependency appears |
| SCP-008 | Stable naming | Name describes generic behavior without disguising feature meaning | Generic name hides module-specific semantics or likely churn | Candidate API and examples | Naming/contract review | yes for public APIs | Accurate generic name cannot be defined |
| SCP-009 | Clear owner | Named shared or platform owner accepts maintenance and scope | Owner is unknown or every module is assumed to own it | Ownership record | Human confirmation for new shared surface | yes | No accountable owner |
| SCP-010 | Clear import rules | Public import path and forbidden dependencies are documented | Consumers rely on private deep imports or broad catch-all exports | Import policy and consumer inventory | Lint/boundary feasibility review | yes for new barrel | Stable public surface is unclear |
| SCP-011 | Allowed/forbidden contents documented | Scope, non-goals, and stop conditions are explicit | Folder name alone is treated as governance | README/governance entry | Documentation review | no | Forbidden contents are not enforceable |
| SCP-012 | Rollback/deprecation plan exists | Promotion can be reverted without deleting source-of-truth or breaking all consumers | Move is one-way, destructive, or mixes behavior changes | Migration and rollback sequence | Build/lint/tests and consumer rollback check | yes | Rollback requires production redesign |

## Additional Gates

- Existing behavior tests or an approved risk-proportionate test plan are required before production promotion.
- Promotion must be behavior-neutral; extraction and behavior changes cannot be combined.
- No route, navigation, layout, dashboard, auth, API client, config/env, database, design-system authority, or backend response/error authority may be promoted to shared.
- This document authorizes no file creation, move, import update, or barrel export.

