# Stage 4 Prompt 3 Handoff

Prompt 3 must create a documentation-only centralization plan around the strong candidate client/src/constants/routes.js while preserving AppRoutes runtime behavior, accessPolicy semantics, metadata/navigation consumers, aliases, and legacy routes.

Read all Prompt 1 and Prompt 2 audits, blocker/readiness reports, rulebook, manifest, Stage 3 start packet, Stage 2 locks, and ADR-0001.

Plan:
- canonical schema and key normalization without creating files;
- treatment of 117 entries, 9 aliases, /offers, 34 metadata gaps, and 72 hardcoded occurrences;
- router/navigation migration batches;
- special handling for protected routes and redirects/404;
- validation and rollback per batch.

Exclude from centralization until approved: wildcard *, API routes, role-ambiguous routes, legacy paths pending compatibility decisions, and dynamic paths with unresolved parameter semantics.

Prompt 3 must remain documentation-only and report source candidate, scope, batches, tests, rollback, risks, human decisions, and implementation readiness.

Prompt 3 may plan route constant centralization only. Do not centralize, edit routes, edit navigation, edit guards, edit redirects, or edit 404 behavior until the plan is reviewed and an implementation prompt explicitly authorizes a safe migration.

