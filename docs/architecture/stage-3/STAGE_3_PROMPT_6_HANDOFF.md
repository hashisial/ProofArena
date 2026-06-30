# Stage 3 Prompt 6 Handoff

## Prompt 6 Must Finalize

- Final Stage 3.2 ownership and enforcement lock for components, hooks, services, types and API adapters.
- Explicit executable authority: current feature services remain the request boundary until a tested migration is approved.
- Final no-scaffold decision and production-edit blockers.
- Formal disposition of IR-02, IR-03, IR-15 and acceptance criteria IA-04/IA-16.
- Whether Stage 3.2 closes with caution despite five missing Stage 3.1 prerequisite documents.

## Remaining Unknowns and Violations

- Missing Stage 3.1 acceptance/human/readiness/handoff documents.
- Final module base path convention.
- Root hook/service reverse imports and private query-key imports.
- Dashboard/first-client cross-feature orchestration.
- Endpoint construction in feature utils and service/adapter role mixing.
- Auth/profile/proof/messages/payments/admin sensitive ownership.
- Complete cycle/consumer graph and regression baseline.

## API Adapter Risks

There is one canonical platform client. Current feature services already call it. Creating module adapters now would duplicate request ownership. `API_BASE_URL` endpoint construction in feature utils and compatibility behavior in `services/api.js` require later tested migration, not parallel files.

## Scaffold Status

- Internal README scaffolds created: none.
- Blocked targets: all 80 module/folder combinations.

## Required Reading

Read all available Stage 3.1 final locks, every Prompt 4 and Prompt 5 Stage 3.2 document, both Stage 3.2 manifests if relevant, Stage 2 prevention locks, ADR-0001 and Stage 1 critical-file/do-not-duplicate controls.

## Forbidden Changes

Prompt 6 remains documentation-only. Do not create, move, rename, delete, import, export or implement folders, READMEs, components, hooks, services, types, adapters, clients, mocks, validation, routes, auth, models, layouts, config, package/build/deployment or dependencies.

Stage 3.2 can close after Prompt 6 only with explicit caution and all production/scaffold blockers retained.

**Module API adapters must not become duplicate API clients, and modules must not duplicate auth, routing, navigation, dashboard, or layout systems.**

