# Final Shared Code Governance Lock

## Approved Categories

`shared/ui`, `shared/hooks`, `shared/utils`, `shared/types`, `shared/constants`, `shared/validation`, approved `shared/config-readers`, and `shared/test-utils` when a test framework exists.

## Locked Rules

- Modules/platform may import approved shared public APIs; shared must not import feature/module implementations.
- Shared UI contains generic visual primitives only.
- Shared hooks are generic and own no module/auth/router/API state.
- Shared utilities are pure or explicitly platform-approved.
- Shared types/constants/validation require 2+ consumers and cannot duplicate route/auth/API/config governance.
- All ten approval gates in `STAGE_3_3_SHARED_CODE_APPROVAL_GATE.md` must pass.
- Use the shared-vs-module decision tree before promotion.
- Every file on the do-not-move list remains in place.
- Run the eight-check enforcement checklist and dependency/cycle validation.

## Stop Conditions

Feature import from shared, API/auth/route/config duplication, circular dependency, unknown owner/consumer graph, absent tests, absent high-risk approval, or blind shared folder/barrel creation.

No shared library or file move is authorized by this lock.

