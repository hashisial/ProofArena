# Stage 1 Remaining Risk Register

Generated: 2026-06-27

| Risk | Title | Source | Files/systems | Severity | Likelihood/blast | Mitigation | Remaining action | Human | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SR-01 | Boundary not ratified | 1.3 | Product/repo | High | Medium/entire product | ADR enforcement | Owner approval | Yes | Architecture | Open |
| SR-02 | Client alias undecided | 1.2 | routes.js/AppRoutes/client nav | High | Medium/client | Preserve aliases | Decide/telemetry/tests | Yes | Stage 4 | Open |
| SR-03 | Admin proof alias undecided | 1.2 | admin routes/pages/nav | High | Medium/admin | Preserve all | Owner/API map | Yes | Admin/Stage 4 | Open |
| SR-04 | API version undecided | 1.1/1.2 | server indexes/feature builders | High | High/all APIs | Preserve mounts | ADR/telemetry/contracts | Yes | Stage 5 | Open |
| SR-05 | Legacy facade broad | 1.1/1.2 | api.js/29 importers | High | High/client APIs | Compatibility freeze | Method map/migrate | No | Stage 5 | Open |
| SR-06 | Protected shell repetition | 1.2 | three layouts/topbars/drawers | High | Medium/dashboards | Preserve wrappers | Tests then primitives | Yes | Stage 3/36 | Open |
| SR-07 | RootLayout ownership unknown | 1.2 | RootLayout/Layout | Unknown | Low/public | No deletion | Runtime/external proof | Yes | Stage 4 | Unknown |
| SR-08 | Six page owners unknown | 1.1/1.2 | WPH-042..047 | Unknown | Medium/features | No reuse/delete | Human/runtime proof | Yes | Feature owners | Unknown |
| SR-09 | Missing tests | 1.2 | Whole repo | High | High/all cleanup | Cleanup blocked | Add target suites | Yes | Stage 9 | Open |
| SR-10 | No compatibility telemetry | 1.2 | Aliases/mounts/facades | High | Medium/contracts | Preserve compatibility | Add/inspect telemetry | Yes | Stage 4/5 | Open |
| SR-11 | Email delivery incomplete | 1.1/1.2 | auth controller/provider config | High | High/auth users | Development-only claim | Provider/E2E | Yes | Stage 23 | Blocked |
| SR-12 | Auth throttling incomplete | 1.1/1.2 | auth routes | High | High/security | Existing general limiter | User/email policy/tests | Yes | Stage 23 | Blocked |
| SR-13 | Auth generations overlap | 1.1 | auth services/middleware aliases | High | Medium/auth | Do-not-merge rule | Dedicated dependency review | Yes | Stage 23 | Open |
| SR-14 | Business fallbacks | 1.2 | constants/api.js/reviews | High | High/public trust | Not accepted as truth | Empty/error UX/tests | Yes | Stage 8/features | Open |
| SR-15 | Metadata gaps | 1.1/1.2 | routeMetadata/AppRoutes | Medium | High/route UX | Current fallback | Add after alias decision | No | Stage 4 | Open |
| SR-16 | Production model/index unknown | 1.1 | Mongoose models/deployed DB | Unknown | Medium/data | No casual model change | Query/migration evidence | Yes | Data stage | Unknown |
| SR-17 | Config/deploy drift risk | 1.1/1.3 | env/package/build files | High | Medium/deploy | Critical controls | Explicit approval/validation | Yes | Stage 6 | Mitigated |
| SR-18 | ADR human gate pending | 1.3 | ADR-0001 | High | Medium/governance | Keep Proposed | Answer/defer questions | Yes | Architecture owner | Open |

Remaining risk count: **18**.

## Prompt 15 Final Status Addendum

| Risk | Prompt 15 status | Final owner | Final required action | Blocks Stage 2 | Blocks production code changes |
| --- | --- | --- | --- | --- | --- |
| SR-01 | Human review required | Architecture owner | Record approval or explicit deferral | Yes | Yes |
| SR-02 | Deferred to later stage | Stage 4 | Decide canonical client route later | No | No |
| SR-03 | Deferred to later stage | Admin / Stage 4 | Decide canonical admin proof route later | No | No |
| SR-04 | Deferred to later stage | Stage 5 | Set API version / facade window later | No | No |
| SR-05 | Accepted temporarily | Stage 5 | Preserve compatibility until migration is proven | No | No |
| SR-06 | Deferred to Stage 2 | Stage 3 / 36 | Revisit after the Stage 2 preflight boundary check | No | No |
| SR-07 | Human review required | Architecture owner | Prove or retire RootLayout ownership | Yes | Yes |
| SR-08 | Human review required | Feature owners | Confirm runtime ownership for the six page owners | Yes | Yes |
| SR-09 | Blocked | Stage 9 | Add target suites before cleanup or code edits | Yes | Yes |
| SR-10 | Deferred to Stage 2 | Stage 4 / 5 | Add or inspect telemetry before cleanup | No | No |
| SR-11 | Blocked | Stage 23 | Complete provider/E2E evidence before change work | Yes | Yes |
| SR-12 | Blocked | Stage 23 | Complete user/email policy and tests before change work | Yes | Yes |
| SR-13 | Deferred to later stage | Stage 23 | Run dedicated dependency review later | No | No |
| SR-14 | Accepted temporarily | Stage 8 / features | Keep as disclosed temporary fallback only | No | No |
| SR-15 | Deferred to Stage 2 | Stage 4 | Add metadata after alias decisions land | No | No |
| SR-16 | Human review required | Data stage | Obtain query/migration evidence before edits | Yes | Yes |
| SR-17 | Accepted temporarily | Stage 6 | Keep config/deploy controls in place | No | No |
| SR-18 | Human review required | Architecture owner | Record human approval or explicit deferral | Yes | Yes |
