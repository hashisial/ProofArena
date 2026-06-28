# Stage 2.1 to Stage 2.2 Handoff Brief

Generated: 2026-06-28

Stage 2.2 is **Keep ProofArena as the flagship module inside ScaleOps**.

## What Stage 2.1 Established

- ScaleOps is parent SaaS and repository/platform owner.
- ProofArena is a module/product area, not a platform peer.
- One shared client/server architecture owns routes, layouts, navigation, API, auth, config, and deployment tiers.
- No active standalone ProofArena system exists.
- Parent authority, risks, protected systems, enforcement, violation response, and compliance checks are locked.

## Stage 2.2 Must Verify

- Which existing domains and workflows comprise ProofArena.
- Which files are ProofArena-owned versus ScaleOps-wide.
- How ProofArena integrates with routes, layouts, auth, API, shared UI, and backend layers.
- Which feature surfaces are real, partial, placeholder, or unknown.
- Whether any module code is drifting toward platform ownership.

## Mandatory Read Set

- Final Stage 2.1 closeout, authority lock, risk table, protection table, compliance checklist, human log, and confidence score.
- Stage 1 final handoff/source index/risk table.
- ADR-0001 adoption package and final rulebook.
- Prompt 1/2 audit, verification, drift, naming, sensitive-system, rulebook, and manifest docs.

## Rules and Systems Stage 2.2 Must Respect

No duplicate repository/package, app entry, router/constants, dashboard/layout/sidebar/navigation, API transport, auth/role system, backend server/config/database, shared UI/utilities, or deployment boundary.

## Inherited Human Questions and Risks

- ADR acceptance/deferral remains required before production work.
- Naming/package/API labels are deferred.
- Wildcard alias remains checker-governed.
- External deployment/domain topology remains unknown.

## Recommended First Prompt

Perform a documentation-only ProofArena module identity and feature-surface audit. Map current files and integrations; do not move, rename, scaffold, or modify production code.

## Exact Warning

ProofArena is a flagship module inside ScaleOps, not a separate app.
