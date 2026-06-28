# ADR-0001 Final Codex Governance Rulebook

Generated: 2026-06-27
Revalidated: 2026-06-28

Every failed rule is a stop condition. Rules may be changed only by documented evidence, alternatives, migration/rollback planning, human approval where required, and a superseding or amended ADR.

## 1. Global Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-01 | Keep ProofArena inside ScaleOps. | Prevent product and architecture fragmentation. | ADR-0001; Stage 1.1 summary/invariants | Separate app, repo, router, shell, API client, auth, or nav stack | Repository and architecture scan | Any parallel ProofArena system appears. |
| G-02 | Use current repository owners as the starting point. | Preserve mapped dependencies and working behavior. | Source map; source locks; evidence map | Replacement system without migration evidence | Import, dependency, behavior, and ownership proof | Existing owner is ignored or unknown. |
| G-18 | Identify candidate IDs, prechecks, postchecks, and rollback before execution. | Keep changes isolated and reversible. | Candidate ledger; execution contracts; QA matrix | Mixed unrelated refactor | Isolated diff plus target tests and manual QA | Scope, evidence, validation, or rollback is missing. |
| G-19 | Unknown evidence blocks destructive action. | Prevent guesses from becoming irreversible changes. | Blocker register; risk register | Guessing ownership or runtime use | Human decision or runtime evidence | Any required fact remains unknown. |

## 2. Route Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-03 | Read route inventory and locks before route edits. | One executable route tree already exists. | Route inventory; route lock; ADR confidence matrix | Duplicate route tree/constants | Route, redirect, guard, role, and catch-all matrix | Route owner or alias behavior is unknown. |
| G-04 | Preserve compatibility paths until policy and telemetry exist. | Bookmarks and external consumers may use aliases. | Route blockers; safe-delete policy | Delete or silently redirect aliases | Direct-load, navigation, redirect, role, and telemetry checks | Canonical path or support window is unapproved. |

## 3. Layout And Dashboard Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-05 | Preserve Public/Auth/provider/client/admin role wrappers. | Layouts own distinct access, lifecycle, and semantics. | Layout lock; blast-radius report | New or merged role-policy shell | Desktop/mobile, role, focus, overflow, and direct-load QA | Protected behavior changes or lacks baseline. |
| G-06 | Reuse SidebarCore and existing sidebar state contracts. | A universal navigation engine already exists. | Layout analysis; navigation map | Duplicate sidebar, drawer, or collapse engine | Active, disabled, collapsed, mobile, accessibility QA | Role links leak or shell behavior diverges. |

## 4. API Client Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-07 | Reuse `apiClient` for browser HTTP. | It owns base URL, credentials, token, refresh, errors, and envelopes. | API inventory; API lock; critical files | New Axios instance or browser fetch wrapper | Base URL, token, refresh, credentials, error, envelope, upload tests | Transport semantics are bypassed or unknown. |
| G-08 | Use `apiEndpoints` and feature services as the direction while preserving compatibility. | Endpoint and domain ownership must converge safely. | API analysis; blocker register; backend flow | Bulk facade removal or new endpoint literal spread | Export-to-caller-to-endpoint and backend method/path map | API version, caller, response, or support window is unknown. |

## 5. Auth And Role Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-09 | Frontend guards govern UX; backend middleware remains authoritative security. | UI visibility cannot protect APIs or data. | Auth architecture; backend flow; critical files | UI-only authorization, middleware bypass, raw token exposure | Login/logout/refresh/recovery/verification and role/API E2E | Security owner, policy, or backend enforcement is unclear. |

## 6. Module Ownership Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-10 | Keep feature behavior in its mapped owner and document legacy exceptions. | Prevent scattered business logic and forced unsafe moves. | Ownership map; boundary report; ADR D-07 | Random shared dumping or blind legacy relocation | Owner, importer, route/API, and boundary checks | Owner cannot be established. |

## 7. Shared Code Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-11 | Share only stable, behavior-equivalent cross-module contracts. | Avoid semantic loss and circular dependencies. | Reusable-code map; dependency graph | Premature generic abstraction | All-importer scan, equivalence tests, build, boundary checks | Similar implementations have different behavior or policy. |

## 8. Placeholder And Mock Data Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-12 | Check the WPH risk class before replacement. | Disclosed previews differ from fake production truth. | Placeholder classification; risk acceptance table | Fake data, fake mutation, or unsupported security/commercial claim | Disclosure, empty/error, accessibility, mutation, product/legal/security review | Real contract or approved replacement is absent. |

## 9. Safe Deletion Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-13 | Apply safe-delete policy in a separate deletion prompt. | Static unused appearance does not prove runtime safety. | Safe-delete policy; critical-file list | Delete during discovery or batch cleanup | Import, route, config, docs, runtime, replacement, tests, rollback, approval | Any proof field is unknown or approval is missing. |

## 10. Dependency And Package Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-14 | Add or change dependencies only with explicit stage approval. | Dependency changes alter security, build, lockfile, and deployment risk. | Forbidden actions; config critical list | Casual install, removal, or version change | Lockfile, lint, build, boundary, security, deployment checks | Approval or migration evidence is absent. |

## 11. Config And Environment Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-15 | Protect config/env/build files and never expose secrets. | These files control runtime, ports, aliases, security, and deployment. | Config critical list; environment docs | Unapproved package/config/env/build edit or secret disclosure | Environment matrix, build, startup, deployment checks | Approval is absent or a secret may be exposed. |

## 12. Documentation Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-16 | Preserve historical evidence and machine-readable manifests. | Later decisions depend on traceable audit history. | Official source map; manifest audits | Rewrite history or erase findings | Link, JSON, count, and contradiction consistency | Evidence becomes contradictory or untraceable. |
| G-17 | Audit-only prompts modify documentation only. | Audit authority does not authorize behavior changes. | Prompt contract; no-production-change proof | Source, config, package, env, or dependency edits | Git status/diff scope check | Any non-doc file changes. |

## 13. Final Response Rules

| Rule ID | Rule | Why it exists | Required docs | Forbidden action | Required validation | Stop condition |
| --- | --- | --- | --- | --- | --- | --- |
| G-20 | Report changed files, commands, failures, unknowns, rollback, and production scope honestly. | Governance requires an auditable handoff. | Applicable execution contract and validation docs | False clean claim or omitted failure | Git status/diff plus command and QA results | Report cannot be reconciled with evidence. |

Absolute reporting rule: never claim production code was untouched if any source, package, config, environment, build, or runtime-behavior file changed.
