# ADR-0001 Final Human Approval Brief

Generated: 2026-06-27

ADR-0001 keeps ScaleOps as the parent platform, ProofArena inside it, and the existing repository/current systems as the starting point. It prevents parallel route, layout, dashboard, API client, auth, navigation, and fake production systems.

Safe to approve: unified boundary; no-duplicate rule; current source locks; backend authorization principle; placeholder classification; preflight, critical-file, validation, rollback, and safe-delete governance.

Uncertain: client/admin canonical aliases, API version/deprecation, facade window, shell primitive scope, legacy file ownership, fallback UX, email/throttling, and minimum tests.

Human approval is required to ratify the boundary and either answer or explicitly defer those decisions.

Top questions:

1. Approve unified ScaleOps/ProofArena boundary?
2. Canonical client route?
3. Canonical admin proof route?
4. Canonical API version/deprecation?
5. api.js compatibility window?
6. Shared shell primitive limits?
7. Legacy layout/page ownership?
8. Fallback replacement UX?
9. Email/rate-limit policy?
10. Minimum regression baseline?

Recommended decision: **keep proposed until approval; then accept with recorded conditions if unresolved choices are explicitly deferred.**

“ProofArena must remain inside ScaleOps unless a future ADR formally reverses this decision.”

