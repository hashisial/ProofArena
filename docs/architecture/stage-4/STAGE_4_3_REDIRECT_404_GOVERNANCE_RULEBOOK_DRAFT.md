# Stage 4.3 Redirect and 404 Governance Rulebook Draft

| Rule | Requirement | Forbidden action | Validation | Stop condition |
|---|---|---|---|---|
| R4-001 | Existing constants govern internal destinations | New hardcoded path | Static scan | Constant authority unclear |
| R4-002 | Anonymous, wrong-role, unverified, and not-found states remain distinct | One fallback for all failures | Full state matrix | Product policy unapproved |
| R4-003 | Redirect priority is documented before edits | Isolated guard change | Ordered flow tests | Competing evaluator unknown |
| R4-004 | Attempted destination is validated and loop-safe | Blind state redirect | Open-redirect and loop tests | Destination semantics unknown |
| R4-005 | Wildcard stays terminal | Moving wildcard earlier | Route ordering test | Declaration inventory incomplete |
| R4-006 | Explicit and wildcard 404 behavior share one platform component | Module NotFound stack | Deep-link tests | Separate ProofArena fallback proposed |
| R4-007 | Browser and API 404 governance remain separate | Merging response and page handling | Frontend/backend tests | Boundary unclear |
| R4-008 | External checkout URLs are classified separately | Treating external URL as app route | Origin/allowlist review | Provider contract unknown |
| R4-009 | Dynamic internal links use approved builders | ID/slug string guessing | Parameter contract test | Contract unknown |
| R4-010 | No redirect edit without before/after history and role matrix | Broad replacement | Build/browser regression | Baseline absent |

## Prompt 9 Hardening

- R4-011: Evaluation priority is hydration, auth/role, email verification, child role, layout policy, page validation, then wildcard.
- R4-012: Layout fallbacks and child guard destinations require parity tests.
- R4-013: Full-page internal redirects, external navigation, reloads, and hash changes are separate categories.
- R4-014: Dynamic destinations require an approved identifier contract and route builder.
- R4-015: Browser and API 404 systems remain separate governance domains.
- R4-016: No runtime change without loop, state, query/hash, and history regression coverage.
