# Stage 1 Prompts 13 to 15 Execution Plan

Generated: 2026-06-27

## Prompt 13 - Cross-Stage Consistency

Goal: compare Stage 1.1, 1.2, and 1.3 facts/counts/owners/statuses; detect contradictions, stale references, duplicate docs, missing files/manifests, and broken links.

Read: official source map, all primary manifests, final trackers, ADR final package.

Forbidden: production edits, cleanup, ADR acceptance, deleting historical docs.

Create/update: consistency report, doc-reference validator report, manifest reconciliation, tracker.

Stop: any claim cannot be traced; mark unknown.

Final response: files, contradictions corrected/documented, broken references, counts, production-scope proof.

## Prompt 14 - Final Repository Safety Check

Goal: prove audit prompts changed documentation only; validate docs/JSON; verify manifests and Stage 2 preflight inputs.

Read: Prompt 13 report, Git baseline, final docs/manifests, no-production confirmations.

Forbidden: source/config/package/env edits, dependency install, cleanup.

Create/update: repository safety checklist, documentation completeness report, Stage 2 preflight package draft, tracker.

Stop: any non-doc diff or invalid manifest; report blocked.

Final response: Git scope, validation commands/results, missing items, readiness.

## Prompt 15 - Final Stage 1 Handoff

Goal: create final Stage 1 completion/handoff and Stage 2 mandatory preflight; lock complete or complete-with-caution.

Read: all final Stage 1 primary docs, Prompt 13/14 results, ADR status/gate, remaining risks.

Forbidden: changing ADR status without approval, production edits, Stage 2 implementation.

Create/update: Stage 1 final report, Stage 2 readiness/handoff, mandatory checklist, final manifest/index/tracker.

Stop: unresolved documentation inconsistency, non-doc diff, missing required manifest.

Final response: Stage 1 verdict, ADR status, residual risks, Stage 2 readiness/conditions, production-scope proof.

## Prompt 15 Completion Notes

- Prompt 13 cross-stage consistency check completed.
- Prompt 14 repository safety check completed.
- Prompt 15 final handoff completed.
- Final Stage 1 decision: complete-with-caution.
- Final Stage 2 start recommendation: start with caution after mandatory preflight and human boundary approval or explicit deferral.
- Remaining conditions: human approval, canonical route decisions, and regression baseline clarity.
- No production code was modified.
