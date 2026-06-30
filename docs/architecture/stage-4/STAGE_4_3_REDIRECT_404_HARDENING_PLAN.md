# Stage 4.3 Redirect and 404 Hardening Plan

1. Approve a deterministic denial and fallback priority table.
2. Resolve unknown-role, support, admin-override, and authenticated recovery-page behavior.
3. Resolve /offers and service ID/slug semantics.
4. Establish browser tests for role state, attempted location, query/hash, replace history, back button, loops, explicit NotFound, and wildcard.
5. Classify each page-level imperative redirect as router-internal, external, reload, or legacy.
6. Migrate one low-risk internal redirect at a time to an existing constant or approved builder.
7. Preserve the single NotFound component and terminal wildcard.
8. Keep server API 404 contract work separate for Stage 5.

Stop on any unexplained URL, state, history, access, or fallback change.

