# Stage 3.1 Safe Module Scaffolding Plan

## Decision

**NO-GO for all production module scaffolds in Prompt 1.** Strong domain signals do not equal permission to create parallel folders. Existing feature/layer locations, unresolved ownership, absent human approval, and missing vertical regression proof make even empty source folders misleading.

| Module | Scaffold needed now | Safe now | Minimal future scaffold | May be created later | Must not be created | Existing files to reuse | Risks | Pre-checks | Post-checks | Human | Earliest prompt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| auth | No | No | README-only contract inside the approved existing boundary | Approved internal folders only after auth authority lock | Provider, store, guards, router, client, middleware clones | `client/src/features/auth`, `server/src/modules/auth` | Duplicate session/security | Runtime authority, auth tests, human approval | Auth/redirect/negative-access/build | Yes | After security and authority decision |
| profile | No | No | README-only contract after profile/users ownership | Approved profile folders after model contract | Duplicate users/profile models, auth/storage/client | Existing profile feature and backend chain | Data/identity overlap | Model consumers, privacy/storage tests, owner decision | Profile/API/privacy/build | Yes | After dependency cleanup |
| offers | No | No | Empty approved module plus README only | Domain folders after vertical test plan | Router, client, auth, payment code | Outcome-offer feature and backend chain | Parallel feature/module ownership | Consumer graph, public API, human approval | Offer vertical tests, build, rollback | Yes | Prompt 4 only if gate passes |
| challenges | No | No | Empty approved module plus README only | Domain folders after vertical test plan | Router, shell, matching/plans copies | Challenge feature and backend chain | Cross-module coupling | Dependency graph, contracts, approval | Challenge/role/build tests | Yes | Prompt 4 only if gate passes |
| plans | No | No | Empty approved module plus README only | Domain folders after vertical test plan | Shell, router, payment execution | Execution-plan feature and backend chain | Challenge/proof cycles | Dependency graph, payment boundary, approval | Plan workflow/build tests | Yes | Prompt 4 only if gate passes |
| proof | No | No | One README contract after proof/proofAssets decision | Approved proof folders after security tests | Storage/auth/error/visibility platform code | Existing proof/proofAssets and backend chain | Sensitive-data exposure | Ownership, storage, redaction, access review | Security/data/public-private tests | Yes | After proof security decision |
| matching | No | No | Empty approved module plus README only | Domain folders after vertical test plan | Permission, identity, router copies | Match feature and backend chain | Algorithm/role regression | Contract, role and algorithm tests, approval | Matching/role/build tests | Yes | Prompt 4 only if gate passes |
| messages | No | No | README contract after realtime ownership | Domain folders after socket/auth contract | Session, socket runtime, guards, client | Existing message page/backend/socket chain | Realtime and authorization break | Socket topology, auth policy, test harness | Realtime/auth/failure tests | Yes | After realtime decision |
| payments | No | No | README contract after payment architecture approval | Domain folders after webhook/security plan | Stripe/env/webhook/client/DB copies | Existing billing/payment chains | Financial/security failure | Secret/webhook/idempotency ownership, approval | Payment/webhook/security tests | Yes | After payment review |
| admin | No | No | README contract under platform admin boundary | Moderation folders after policy contract | Roles, admin shell, router, cross-domain models | Existing admin feature and backend chain | Privilege escalation | Role matrix, admin ownership, negative tests | Admin authorization/shell/build tests | Yes | After role/admin review |

## Required Global Pre-Checks

1. Read Stage 1/2 handoffs, ADR-0001, Stage 3 final locks, and do-not-duplicate lists.
2. Select one existing module convention; do not introduce a second convention.
3. Prove candidate ownership and all dependents.
4. Record human approval and a test/rollback plan.
5. Confirm no router, navigation, shell, API client, auth, config, DB, or deployment ownership enters the module.

## Required Global Post-Checks

Run import-boundary checks, build/lint/tests available for the vertical slice, route/auth/API regression checks, and `git diff --name-status`. Any runtime change from a README-only scaffold is a failure.

## README Scaffold Result

No frontend or backend module README scaffold was created. The existing `STAGE_3_1_MODULE_README_TEMPLATE.md` remains documentation guidance only.

