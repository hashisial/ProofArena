# Stage 4.1 Route Source-of-Truth Planning Decision

| Area | Planning decision |
|---|---|
| Candidate | client/src/constants/routes.js |
| Status | PLAN AROUND CANDIDATE WITH GAPS |
| Runtime declaration constraint | AppRoutes.jsx remains unchanged behavior authority |
| Policy constraint | accessPolicy.js and routeMetadata.js remain supporting policy sources |
| Navigation constraint | existing metadata-derived configs remain consumers |
| Exclusions | wildcard, API registries, unresolved legacy and role-sensitive paths |
| Final authority selected | no |
| Human review | required before implementation |

Reason: the candidate covers every non-wildcard declaration but aliases, metadata gaps, hardcoded consumers, and parameter semantics are unresolved.

## Candidate Planning Matrix

This matrix is planning-only and does not promote a production authority.

| ID | Candidate | Current role | Prompt 1 status | Prompt 2 status | Coverage | Strengths | Weaknesses | Duplicate risk | Migration risk | Human review | Prompt 3 status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| C-001 | client/src/constants/routes.js | Grouped route registry/facade | primary candidate | strong candidate with gaps | Public, auth, dashboard, admin, provider, client, dynamic, system, redirect targets; wildcard excluded | Covers every non-wildcard declaration | Nine aliases, /offers, facade overlap, hardcoded alternatives | Low if reused; critical if copied | high | yes | primary planning candidate |
| C-002 | client/src/routes/AppRoutes.jsx | Runtime declarations, nesting, guards, wildcard | runtime authority | verified supporting source | All 108 leaves and route classes | Complete behavior map | Not constants owner | low | critical if rewritten | yes | supporting planning candidate |
| C-003 | client/src/config/routeMetadata.js | Policy/labels/roles/navigation input | supporting | verified incomplete | 73 of 107 non-wildcard paths | Structured policy data | 34 omissions | medium | critical for access | yes | requires deeper audit |
| C-004 | constants/navigation.js and config/navigation | Navigation composition | navigation source | verified supporting | 42 enabled unique targets | Targets resolve | Subset; hidden intent incomplete | medium | high | yes | supporting planning candidate |
| C-005 | client/src/utils/accessPolicy.js | Access/fallback policy | policy source | strong supporting | Roles, visibility, fallback | Central policy functions | Metadata dependency and caller options | medium | critical | yes | supporting planning candidate |
| C-006 | routeValidation/metadata utilities | Validation/group/breadcrumb helpers | supporting | overlapping support | Prefix/group/derived paths | Existing reusable helpers | Hardcoded prefixes and metadata gaps | medium | high | yes | requires deeper audit |
| C-007 | Route/navigation docs | Documentation | supporting/stale risk | not runtime authority | Intended architecture | Useful context | May lag code | low | medium | no | excluded from authority planning |
| C-008 | server route registries | Backend API routing | excluded | separate domain verified | API only | Correct backend ownership | Textual path overlap is not browser routing | critical if merged | critical | yes | excluded from planning |

### Planning Lock

- Plan around C-001.
- Preserve C-002 as the runtime behavior constraint.
- Treat C-003 through C-006 as supporting consumers/policy sources.
- Exclude C-007 as authority and C-008 from browser centralization.
- Final authority remains blocked until migration readiness, tests, and approvals are complete.
