# Stage 1 Final Risk Acceptance and Deferment Table

Generated: 2026-06-27

## Final Risk Statuses

| Risk ID | Title | Final status | Final owner | Final required action | Blocks Stage 2 | Blocks production code changes |
| --- | --- | --- | --- | --- | --- | --- |
| SR-01 | Boundary not ratified | Human review required | Architecture owner | Record approval or explicit deferral | Yes | Yes |
| SR-02 | Client alias undecided | Deferred to later stage | Stage 4 | Decide canonical client route later | No | No |
| SR-03 | Admin proof alias undecided | Deferred to later stage | Admin / Stage 4 | Decide canonical admin proof route later | No | No |
| SR-04 | API version undecided | Deferred to later stage | Stage 5 | Set API version / facade window later | No | No |
| SR-05 | Legacy facade broad | Accepted temporarily | Stage 5 | Preserve compatibility until migration is proven | No | No |
| SR-06 | Protected shell repetition | Deferred to Stage 2 | Stage 3 / 36 | Revisit after the Stage 2 preflight boundary check | No | No |
| SR-07 | RootLayout ownership unknown | Human review required | Architecture owner | Prove or retire RootLayout ownership | Yes | Yes |
| SR-08 | Six page owners unknown | Human review required | Feature owners | Confirm runtime ownership for the six page owners | Yes | Yes |
| SR-09 | Missing tests | Blocked | Stage 9 | Add target suites before cleanup or code edits | Yes | Yes |
| SR-10 | No compatibility telemetry | Deferred to Stage 2 | Stage 4 / 5 | Add or inspect telemetry before cleanup | No | No |
| SR-11 | Email delivery incomplete | Blocked | Stage 23 | Complete provider/E2E evidence before change work | Yes | Yes |
| SR-12 | Auth throttling incomplete | Blocked | Stage 23 | Complete user/email policy and tests before change work | Yes | Yes |
| SR-13 | Auth generations overlap | Deferred to later stage | Stage 23 | Run dedicated dependency review later | No | No |
| SR-14 | Business fallbacks | Accepted temporarily | Stage 8 / features | Keep as disclosed temporary fallback only | No | No |
| SR-15 | Metadata gaps | Deferred to Stage 2 | Stage 4 | Add metadata after alias decisions land | No | No |
| SR-16 | Production model/index unknown | Human review required | Data stage | Obtain query/migration evidence before edits | Yes | Yes |
| SR-17 | Config/deploy drift risk | Accepted temporarily | Stage 6 | Keep config/deploy controls in place | No | No |
| SR-18 | ADR human gate pending | Human review required | Architecture owner | Record human approval or explicit deferral | Yes | Yes |

## Final Counts
- Accepted temporarily: 3
- Deferred to Stage 2: 3
- Deferred to later stage: 4
- Human review required: 5
- Blocked: 3
- Unknown: 0

