# Stage 1.2 Final Cleanup Execution Backlog

Generated: 2026-06-27

Backlog counts are finding-level and mutually exclusive: **P0 11, P1 43, P2 23, P3 4, PARKED 13, HUMAN REVIEW 6**.

## Backlog Register

| Backlog ID | Priority/finding IDs | Category/files | Why it exists / cleanup goal | Why it may break | Prerequisite docs/checks | Likely future edits | Forbidden edits | Manual QA | Rollback | Recommended prompt/order |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BL-P0-01 | P0: LAY-003, LAY-004 | Protected shells | Test then isolate shared non-policy primitives | Role/admin exposure, drawer/focus/grid regression | Layout analysis, blast report, role/browser tests | Three layouts/primitives | Role guard/policy merge | All protected desktop/mobile routes | Restore inline blocks | Protected shell regression baseline; 1 |
| BL-P0-02 | P0: RTE-004, RTE-011, RTE-012, RTE-016 | Auth/alias/fallback routes | Decide canonical/compatibility behavior | Redirect loops, broken bookmarks, wrong shell | Route lock, route/role matrix, telemetry | Constants/metadata/redirects later | Immediate alias deletion | Auth/client/admin direct loads | Restore aliases/old policy | Route ADR and tests; 2 |
| BL-P0-03 | P0: API-001, API-002 | HTTP/auth surfaces | Preserve one transport and map auth facade | Session refresh and all protected requests | API lock, method contracts, auth E2E | api.js callers/services later | New client/interceptor removal | Login/logout/refresh/recovery | Keep facade shim | API/auth contract baseline; 3 |
| BL-P0-04 | P0: WPH-035, WPH-036, WPH-037 | Auth email/security | Complete approved delivery/throttle design later | Account recovery/verification abuse/failure | Auth/security review, E2E tests | Auth routes/controllers/provider later | Raw token exposure/fake delivery | Verification/recovery/rate limits | Disable safely/revert provider change | Security implementation prompt; 4 |
| BL-P1-01 | P1: remaining 43 blocked findings | Routes/layouts/API/placeholders | Candidate-specific planning after P0 evidence | Broad S1/S2 blast radius | Candidate ledger and target contract | Only one candidate family | Bulk cleanup/deletion | Target QA matrix | Isolated revert | Dedicated prompts after P0 |
| BL-P2-01 | P2: 23 ready-with-caution findings | Hardcoded links, helper overlap, S2 product/temporary states | Align one caller/label/helper | Semantic drift despite small diff | Relevant source lock and focused checks | One caller/file | Alias/policy/transport changes | Affected route/state | Revert one file | Low-scope migration prompts |
| BL-P3-01 | P3: RTE-017 | Dashboard-path wrapper | Normalize imports only after zero callers | External/barrel consumer | Import search/build | Wrapper callers | Delete without proof | Public/system dashboard CTA | Restore wrapper | Utility normalization |
| BL-P3-02 | P3: WPH-038, WPH-039, WPH-041 | Generated/runtime artifacts | Repository-hygiene decision | Local workflows may depend on locations | Ignore/config/owner review | Docs/ignore only if approved | Production source | Build/browser/temp workflow | Restore artifact convention | Hygiene prompt |
| BL-PARK-01 | PARKED: LAY-009, API-009, API-010 | Intentional adapters/transports | Keep; no cleanup goal | Consolidation would erase valid boundaries | Source lock | None | Merge/delete | Existing sidebar/socket/scraper checks | N/A | Park |
| BL-PARK-02 | PARKED: disclosed preview findings among WPH class A | Public previews | Keep visibly disclosed until real data exists | Blanket mock cleanup harms product explanation | Placeholder classification | Copy only if approved | Fake live data | Homepage disclosure | Restore copy | Park/public content stage |
| BL-HR-01 | HUMAN: WPH-042..047 | Six unmapped page files | Determine owner/runtime status | Reuse or deletion may revive/break legacy behavior | Import/route/build/runtime/human review | None until decision | Delete/route/reuse | Any discovered route/action | Restore exact file | Ownership decision prompt |

## Finding-Level Priority Rules

- P0: protected shell/auth/route/API/security items that must not be touched before tests and decisions.
- P1: other blocked findings requiring high-risk planning.
- P2: limited, reversible cleanup with focused checks.
- P3: low-risk import/hygiene candidates, still not deletion-approved.
- PARKED: intentional adapters, distinct transports, or useful disclosed previews.
- HUMAN REVIEW: ownership cannot be established statically.

## Required Future Backlog Item Template

Every execution prompt must restate file paths, purpose, break risk, prerequisite docs/tests, exact goal, forbidden files, QA, rollback, and order. No batch may mix priority groups.
