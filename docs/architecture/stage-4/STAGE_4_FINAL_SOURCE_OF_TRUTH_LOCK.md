# Stage 4 Final Source-of-Truth Lock

"Final authority" below means authority for current observed behavior or Stage 4 governance history. It does not authorize a future migration. Candidate authority is not final authority.

| Lock ID | System | File path | Final authority status | Evidence | Required before Stage 5 | Required before production edits | Human review needed | Stop condition |
|---|---|---|---|---|---|---|---|---|
| STL-001 | Router mount | `client/src/main.jsx` | final authority | Single active `BrowserRouter` mount | yes | yes | no | A second router is proposed |
| STL-002 | Route declarations | `client/src/routes/AppRoutes.jsx` | final authority with caution | Single active `Routes` tree and route leaves | yes | yes | yes for edits | Inventory or reachability conflicts |
| STL-003 | Route constants | `client/src/constants/routes.js` | candidate authority | Current registry has 117 entries, 108 values, and 9 aliases; promotion is blocked | yes | yes | yes | Alias, key, or dynamic intent remains unclear |
| STL-004 | Route metadata | `client/src/config/routeMetadata.js` and metadata helpers | candidate authority | Current consumers exist but coverage has 34 gaps, including 8 high-priority gaps | yes | yes | yes | Missing ownership affects a change |
| STL-005 | Navigation links | `client/src/constants/navigation.js`, `client/src/config/navigation*`, component consumers | supporting evidence | Multiple current sources; no approved universal registry | yes | yes | yes | Navigation is treated as a single final registry |
| STL-006 | Protected-route composition | `client/src/routes/AppRoutes.jsx` | final authority | Active parent/child guard composition is declared here | yes | yes | no for reading; yes for edits | Composition is bypassed or duplicated |
| STL-007 | Auth guards | `ProtectedRoute.jsx`, `PublicOnlyRoute.jsx`, `EmailVerifiedRoute.jsx`, `AuthHydration.jsx` | final authority | Active current guard definitions | yes | yes | yes for behavior edits | Parallel guard or auth handling is proposed |
| STL-008 | Role guard | `client/src/routes/RoleRoute.jsx` | final authority with caution | Active role-gated route definition | yes | yes | yes | Unapproved role hierarchy is inferred |
| STL-009 | Auth source of truth | `AuthProvider`, `useAuthStore`, and `authService` current files | final authority with caution | Active provider/store/service path verified in Stage 4.2 | yes | yes | yes | Alternate auth source is introduced |
| STL-010 | Role/permission policy | status/role constants, `accessPolicy.js`, route metadata, backend auth middleware | candidate authority | Policy is distributed and frontend/backend parity is unproven | yes | yes | yes | Candidate set is called a unified policy |
| STL-011 | Redirect behavior | route composition, guards, `authRouteUtils.js`, `accessPolicy.js`, layouts, pages | candidate authority | Current topology is mapped; evaluator priority is distributed and unapproved | yes | yes | yes | A single redirect authority is claimed prematurely |
| STL-012 | Browser NotFound/404 | `AppRoutes.jsx`, `client/src/pages/NotFound.jsx` | final authority | One browser page serves explicit and wildcard routes | yes | yes | yes for behavior changes | A module-specific NotFound is proposed |
| STL-013 | Wildcard/fallback | Terminal `path="*"` in `AppRoutes.jsx` | final authority | Exactly one terminal browser wildcard was verified | yes | yes | no for reading; yes for behavior changes | Another wildcard/fallback is proposed |
| STL-014 | API 404 | `server/src/app.js`, `server/src/errors/notFoundHandler.js` | final authority | One terminal backend handler, separate from browser scope | yes | yes | yes for API contract changes | Browser and API 404 semantics are conflated |
| STL-015 | Validation commands | package scripts plus Prompt 3/6/9 plans and gate reports | supporting evidence | Lint/build/boundary scripts exist; behavioral/typecheck/test coverage is incomplete | no | yes | yes for acceptance ownership | Runtime batch lacks an approved baseline |
| STL-016 | Route-constant rollback | centralization rollback plan and Prompt 4 reports | supporting evidence | Future plan exists; no runtime batch was rehearsed | no | yes | yes | Exact batch/files are undefined |
| STL-017 | Protected-route rollback | protected-route rollback plan and Prompt 7 reports | supporting evidence | Future plan exists; no runtime batch was rehearsed | no | yes | yes | Exact security batch is undefined |
| STL-018 | Redirect/404 rollback | redirect/404 rollback plan and Prompt 10 reports | supporting evidence | Future plan exists; no runtime batch was rehearsed | no | yes | yes | Exact behavior batch is undefined |
| STL-019 | Manifest | `stage-4-route-governance-manifest.json` | final authority | Cumulative Prompt 1-12 flags and references | yes | yes | no | Runtime flags contradict evidence |
| STL-020 | Tracker | `STAGE_4_MASTER_TRACKER.md` | final authority | Cumulative prompt history and status distinctions | yes | yes | no | History is erased or rewritten |

Earlier inventories, drafts, plans, matrices, and correction documents remain supporting evidence unless the final document index explicitly assigns a stronger category.

