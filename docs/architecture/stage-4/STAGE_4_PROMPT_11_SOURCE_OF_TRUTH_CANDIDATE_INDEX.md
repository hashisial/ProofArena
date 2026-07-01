# Stage 4 Prompt 11 Source-of-Truth Candidate Index

Authority labels are scoped. "Final authority" means evidence-backed authority for current runtime behavior or Stage 4 documentation history; it does not authorize a future migration.

| Candidate ID | System | File path | Authority status | Evidence | Required before production edits | Required before future prompt | Human review needed |
|---|---|---|---|---|---|---|---|
| SOT-001 | router mount | client/src/main.jsx | final authority | single BrowserRouter authority file | yes | yes | no |
| SOT-002 | route declarations | client/src/routes/AppRoutes.jsx | final authority | single active Routes tree and all route leaves | yes | yes | no |
| SOT-003 | route constants | client/src/constants/routes.js | candidate authority | current runtime registry with 117 entries/108 values/9 aliases; governance promotion blocked | yes | yes | yes |
| SOT-004 | route metadata | client/src/config/routeMetadata.js and metadata helpers | candidate authority | current consumers but incomplete coverage/gaps | yes | yes | yes |
| SOT-005 | navigation links | client/src/constants/navigation.js; client/src/config/navigation*; component link consumers | supporting evidence | multiple governed consumers; no single approved universal registry | yes | yes | yes |
| SOT-006 | protected route composition | client/src/routes/AppRoutes.jsx | final authority | active parent/child guard composition | yes | yes | no |
| SOT-007 | auth guards | ProtectedRoute.jsx; PublicOnlyRoute.jsx; EmailVerifiedRoute.jsx; AuthHydration.jsx | final authority | active current runtime guard definitions | yes | yes | no |
| SOT-008 | role guard | client/src/routes/RoleRoute.jsx | final authority | active role-gated route definition | yes | yes | yes for role policy edits |
| SOT-009 | auth state | AuthProvider/useAuthStore/authService current files | final authority | active provider/store/service path verified in Stage 4.2 | yes | yes | yes for auth behavior edits |
| SOT-010 | role/permission policy | statuses/USER_ROLES; accessPolicy.js; route metadata; backend auth middleware | candidate authority | distributed current sources with hierarchy/parity gaps | yes | yes | yes |
| SOT-011 | redirect behavior | AppRoutes composition; guards; authRouteUtils.js; accessPolicy.js; layouts/pages | candidate authority | current topology verified but evaluator policy is distributed/unapproved | yes | yes | yes |
| SOT-012 | browser 404/NotFound | AppRoutes explicit route plus pages/NotFound.jsx | final authority | one browser page used by explicit and wildcard routes | yes | yes | yes for behavior changes |
| SOT-013 | wildcard/fallback | terminal path=* in AppRoutes.jsx | final authority | exactly one terminal browser wildcard | yes | yes | no |
| SOT-014 | API 404 | server/src/app.js plus errors/notFoundHandler.js | final authority | one terminal backend handler, separate scope | yes | yes | no |
| SOT-015 | validation commands | client/package.json and server/package.json scripts; Prompt 3/6/9 plans | supporting evidence | lint/build/boundary scripts exist; behavioral/typecheck/test scripts absent | yes | yes | yes |
| SOT-016 | route-constant rollback | STAGE_4_ROUTE_CENTRALIZATION_ROLLBACK_PLAN.md; Prompt 4 report | supporting evidence | future plan exists; no runtime batch rehearsed | yes | no | yes |
| SOT-017 | protected-route rollback | STAGE_4_2_PROTECTED_ROUTE_ROLLBACK_PLAN.md; Prompt 7 report | supporting evidence | future plan exists; no runtime batch rehearsed | yes | no | yes |
| SOT-018 | redirect/404 rollback | STAGE_4_3_REDIRECT_404_ROLLBACK_PLAN.md; Prompt 10 report | supporting evidence | future plan exists; no runtime batch rehearsed | yes | no | yes |
| SOT-019 | machine-readable history | stage-4-route-governance-manifest.json | final authority | cumulative Prompt 1-11 flags/doc references after reconciliation | yes | yes | no |
| SOT-020 | narrative progress history | STAGE_4_MASTER_TRACKER.md | final authority | cumulative prompt summaries and status distinctions | yes | yes | no |

## Result

Final runtime authorities are limited to currently executing sources with strong repository evidence. Route constants governance, role/permission policy, navigation unification, and redirect policy remain candidate/supporting authorities until their human and validation blockers are resolved.
