# Stage 3.2 Module Internal Structure Standard

This is a future structure contract, not permission to create folders.

| Folder | Purpose | Allowed | Forbidden | Imports/exports | Platform/shared dependencies | Tests |
|---|---|---|---|---|---|---|
| `components/` | Module-specific UI | Presentational and approved container components | Generic primitives, shells, nav, auth policy | Import module public APIs; export intentional components only | shared UI, module hooks/types | Render, accessibility, states |
| `hooks/` | Module state/data composition | Query/mutation/composition hooks | Global auth/session, router ownership, API client creation | Same module; public hooks via barrel if approved | platform query/auth consumers, shared hooks | Hook behavior and error states |
| `services/` | Module business operations | Domain orchestration and transforms | Global transport, auth/session, cross-module workflow without owner | Call module API adapter; export business operations | platform logging/errors if approved | Unit/contract tests |
| `api/` | Module endpoint adapters | Calls through canonical ScaleOps API client | Base URL, tokens, interceptors, global normalization | Export module request functions only | `client/src/services/apiClient.js` and endpoint governance | Request/response contract tests |
| `types/` | Module contracts | Domain-local types/interfaces | Platform auth/route/global API contracts | Export only stable module contracts | shared types only when approved | Typecheck/fixtures |
| `validation/` | Module input/domain schemas | Module-local validation | Global request/auth policy | Same module exports; shared only after approval | approved validation library/helpers | Valid/invalid cases |
| `constants/` | Domain constants | Statuses, limits, labels local to module | Routes, roles, global API endpoints, env | Export stable constants | platform constants by import | Value/compatibility tests where material |
| `tests/` | Module verification | Unit, adapter, integration fixtures | Production fake behavior | May import module public/private test subjects | approved test utilities | Required before migration |
| `README.md` | Ownership contract | Purpose, boundaries, dependencies, migration state | Claims of behavior not present | N/A | Links to governance docs | Review on ownership change |

## Module-Specific Scope

| Module | Components/hooks/services/api/types/validation/constants may own | Must remain external |
|---|---|---|
| auth | Auth forms and approved identity use cases | Router, global API client, role system, config, session duplication |
| profile | Profile editing/public profile/readiness | Credentials, auth session, storage infrastructure |
| offers | Offer lifecycle and offer-domain contracts | Payments platform, router, auth policy |
| challenges | Challenge lifecycle and challenge contracts | Matching/plans internals, route shell |
| plans | Execution-plan lifecycle | Challenge/proof internals, dashboard shell |
| proof | Proof asset/readiness domain | Storage client, auth, global response handling |
| matching | Match scoring/workflow contracts | User identity and route policy |
| messages | Conversation/message domain | Auth identity, socket platform, global notifications |
| payments | Product payment operations | Stripe client/config/webhook runtime, global billing policy |
| admin | Moderation operations | Role system, admin shell, global audit/security platform |

