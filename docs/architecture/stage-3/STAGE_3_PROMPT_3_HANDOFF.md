# Stage 3 Prompt 3 Handoff

## Prompt 3 Objective

Finalize Stage 3.1 ownership locks, define a formal scaffold approval gate, decide whether any conditional module can proceed to a later documentation-only scaffold execution prompt, and preserve every platform protection.

## Ownership Still Requiring Human Decision

- Auth runtime authority across module, legacy and versioned variants.
- Profile versus users model/service ownership.
- Proof versus proofAssets plus storage, visibility and redaction.
- Messages versus auth/users/socket/realtime platform.
- Billing versus marketplace payments, Stripe/webhook/config ownership.
- Admin moderation versus role/shell/domain authority.
- Public cross-module contracts and the required vertical regression baseline.

## Module Status

- Conditional future candidates after tests and approval: offers, challenges, plans, matching.
- Blocked: auth, profile, proof, messages, payments, admin.
- Approved now: none.

## Protected Platform Systems

Router, route constants/metadata, navigation, dashboard shell, sidebar, layouts, auth/session/guards/roles, API client, API versioning/registration, response/errors, DB connection, config/env, shared UI/utilities, design tokens, and documentation authority remain ScaleOps-owned.

## README Scaffolds

No target-module README scaffold exists from Prompt 2. Existing auth and ProofArena READMEs were not changed. Prompt 3 must not create source scaffolds; it may only approve or block a later Prompt 4 decision.

## Required Reading

Read all Prompt 1 and Prompt 2 Stage 3.1 documents, the Stage 2 final handoff and prevention locks, ADR-0001, and Stage 1 critical-file/safe-delete controls.

## Forbidden Changes

Do not create, move, rename, delete, import, export, register, or implement source files. Do not change routes, navigation, layouts, dashboards, API clients, auth/roles, backend runtime, models, config/env, packages, build/deployment, database, or dependencies.

## Closeout Path

Prompt 3 can finalize the ownership and approval gate. Stage 3.1 still needs Prompt 4 to record either a gate-approved documentation-only scaffold result or a formal no-go result. Production migration remains unauthorized.

**Do not create separate ProofArena app, duplicate API client, duplicate router, duplicate auth system, duplicate dashboard shell, or duplicate navigation stack.**
