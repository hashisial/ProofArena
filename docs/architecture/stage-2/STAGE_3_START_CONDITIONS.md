# Stage 3 Start Conditions

## Required State

- Stage 2 status: `COMPLETE WITH CAUTION`.
- ADR-0001: governance is usable, but formal acceptance/human approval remains conditional; no reversal is permitted.
- Required docs: final Stage 2 decision, handoff, source index, parent/module/prevention locks, risk table, compliance checklist, and Stage 3 preflight all exist.
- Risks: no active duplicate runtime; unresolved overlaps are assigned and production-gated.
- Source-of-truth: final lock hierarchy is explicit.
- No-production-code proof: final validation must show Stage 2 changed docs only.
- Preflight: all 15 checks must pass before Stage 3 work.

## Required Approvals

Documentation-only Stage 3 boundary verification requires no additional production approval. Creating, moving, renaming, deleting, or refactoring production modules requires explicit later prompt authorization, human review of affected high-risk owners, and a validation/rollback plan.

## Blocking Conditions

- Any proposed separate ProofArena app/package/router/navigation/shell/API/auth/config/deploy/data boundary.
- Missing mandatory source docs or failed preflight.
- Ambiguous high-risk ownership treated as fact.
- Production edit without explicit authorization.
- Active violation of ADR-0001 or Stage 2 locks.

## Start-With-Caution Conditions

Stage 3 may proceed while naming, external topology, overlap cleanup, and ADR acceptance remain open only when work is documentation-first, records unknowns, and preserves all existing production files.

## Recommendation

**START WITH CAUTION.** First prompt: audit existing feature directories, dependencies, public import surfaces, platform dependencies, and candidate module ownership. Do not move or create production modules.

