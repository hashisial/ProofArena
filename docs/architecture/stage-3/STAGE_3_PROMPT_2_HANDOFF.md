# Stage 3 Prompt 2 Handoff

## Required Verification

Prompt 2 must verify the 30 candidate groups against current imports and registrations, classify files as module/platform/shared/marketing/unknown, map all ten module dependencies, confirm frontend and backend vertical slices, score creation readiness, record conflicts, and produce a do-not-move list and safe sequence.

## Boundaries Requiring Deeper Inspection

- Auth feature/module/legacy/versioned route-service-middleware authority.
- Profile versus users models, services, privacy, and storage ownership.
- Proof versus proofAssets plus storage, visibility, and redaction policy.
- Messages versus auth/users/socket/realtime ownership.
- Billing versus marketplace payments, Stripe, webhooks, config, and secrets.
- Admin moderation versus platform roles, shell, navigation, and domain ownership.
- Challenge/plans/matching and offers/proof/payment cross-module contracts.
- Root hooks/services/utils/types/constants and broad component directories.

## Scaffold Status

- Safe now: none.
- Conditional future candidates after dependency proof, tests, and human approval: offers, challenges, plans, matching.
- Blocked: auth, profile, proof, messages, payments, admin.
- README scaffolds: Prompt 2 may recommend them but must not create them unless every Prompt 1 gate passes and explicit human approval is recorded. Later Stage 3 locks remain controlling.

## Existing Ownership Requiring Confirmation

Confirm `server/src/modules/auth`, `server/src/modules/users`, client/server `modules/proofarena`, auth/profile compatibility variants, the canonical API client, route constants/declarations, navigation/layouts, and root shared-like directories.

## Required Reading

Read the Stage 1 and Stage 2 final handoffs, ADR-0001 and its governance rulebook, all Prompt 1 foundation documents, the Stage 3 preflight/start conditions, and current critical-file/do-not-duplicate controls.

## Forbidden Changes

Do not move, rename, delete, import, export, scaffold, register, or implement production files. Do not change routes, navigation, dashboard/layout, API clients, auth/roles, backend runtime, models, config/env, package/build/deployment, or database behavior.

Prompt 2 remains documentation-only.

**Do not create separate ProofArena app, duplicate architecture, duplicate API client, duplicate router, duplicate auth system, or duplicate dashboard shell.**
