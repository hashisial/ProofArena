# Stage 1.2 Cleanup Risk Register

Generated: 2026-06-27

| Risk ID | Description | Candidates/files | Severity | Likelihood | Blast radius | Trigger | Prevention/detection | Rollback | Owner/stage | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CR-01 | Separate ProofArena architecture introduced | All architecture systems | S0 | Low if guardrails followed | Entire product | New app/repo/router/client/shell | Stage 1.1 invariant/preflight review | Stop and remove isolated duplicate after approval | ADR/Stage 1.3 | Blocked |
| CR-02 | Route alias removed before usage known | RTE-011/012 | S1 | Medium | Client/admin links/bookmarks | Canonical path chosen without telemetry | Route matrix and deprecation policy | Restore alias/redirect | Route governance | Open |
| CR-03 | Legacy public wrapper deleted while externally used | LAY-001/RTE-002 | S1 | Low/unknown | Public shell | Static "unused" assumption | Runtime/barrel/external consumer proof | Restore files/export | Layout cleanup | Unknown |
| CR-04 | Role wrappers over-consolidated | LAY-003/004 | S1 | Medium | All protected shells | Shared component absorbs policy | Role matrix and wrapper-preservation rule | Revert primitive extraction | Dashboard stage | Blocked |
| CR-05 | Drawer/focus behavior regresses | LAY-006 | S1 | Medium | Mobile protected UX | Lifecycle extraction | Keyboard/browser tests | Restore role drawer | Layout/accessibility | Blocked |
| CR-06 | Wrong admin/provider/client actions appear | LAY-007/008 | S1 | Medium | Protected navigation | Topbar merge | Role/action snapshot tests | Restore role topbar | Dashboard | Blocked |
| CR-07 | API auth refresh/error handling bypassed | API-001/002 | S0/S1 | Medium | All authenticated requests | New client/direct transport | One-client rule and interceptor tests | Restore apiClient path | API/auth | Blocked |
| CR-08 | api.js facade removed before callers migrate | API-001..005/RTE-018 | S1 | High | 29 importers | File-level deletion | Method-level caller map and compatibility shim | Restore export/facade | API Stage 5 | Blocked |
| CR-09 | API version prefix changed incorrectly | API-006/RTE-014 | S1 | Medium | Seven feature domains | Premature /v1 extraction | Version ADR and contract tests | Restore builders/mount | API Stage 5 | Blocked |
| CR-10 | Profile upload behavior changes | API-008 | S2 | Medium | Profile media | Direct-call migration | Multipart/progress/response tests | Restore component adapter | Profile/API | Blocked |
| CR-11 | Fake fallback data masks outage | WPH-028..030 | S1 | High | Public trust/marketplace | Empty/network/server response | Empty/error tests and monitoring | Restore explicit safe placeholder, not fake records | Feature/API | Ready with caution |
| CR-12 | Security placeholders treated as production-ready | WPH-035..037 | S0/S1 | High | Verification/recovery | Release without provider/throttle completion | Security gate and E2E delivery/rate-limit tests | Disable affected production flow safely | Auth/security | Blocked |
| CR-13 | Unknown pages deleted or revived incorrectly | WPH-042..048 | UNKNOWN | Medium | Auth/content/profile/admin | Ownership assumption | Runtime/import/human owner review | Restore file/route | Human review | Unknown |
| CR-14 | Metadata additions encode wrong aliases | RTE-019 | S1 | Medium | Headers/breadcrumbs/access | Fill gaps before route policy | Route ID/path review | Revert metadata entries | Route governance | Blocked |
| CR-15 | Browser and API paths merged into one registry | RTE-013 | S2 | Low | Navigation and HTTP contracts | Misreading similar strings | Separate-namespace rule | Split registry changes | ADR | Mitigated |
| CR-16 | Marketing previews removed as fake data | WPH-031..034/060 | S3 | Medium | Homepage product explanation | Blanket mock cleanup | Placeholder classification | Restore disclosed preview | Public content | Ready with caution |
| CR-17 | Config/package/env changed during cleanup | Critical config files | S1 | Low | Build/deploy/runtime | Cleanup scope creep | Explicit approval and git-scope check | Revert config atomically | Release engineering | Blocked |
| CR-18 | No tests make a safe-looking refactor unverifiable | All S1/S2 systems | S1 | High | Cross-cutting | Cleanup before baseline | Test-gap gate | Revert isolated change | Stage 1.2/9 | Open |

