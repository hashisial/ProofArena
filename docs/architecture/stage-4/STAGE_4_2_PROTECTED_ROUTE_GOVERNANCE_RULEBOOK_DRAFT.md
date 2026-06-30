# Stage 4.2 Protected Route Governance Rulebook Draft

| Rule ID | Rule | Reason | Required evidence | Forbidden action | Required validation | Stop condition |
|---|---|---|---|---|---|---|
| PR-001 | Do not duplicate AuthProvider/AuthContext or session state. | A second provider creates divergent principals. | Auth mount/import graph. | Create provider/store/token path. | Single provider and hydration tests. | Second active provider/store appears. |
| PR-002 | Do not duplicate the role or permission catalog. | Parallel roles drift across routing and APIs. | Frontend/backend role catalogs and approved contract. | Invent or infer role names. | Cross-tier role/permission parity. | Canonical role contract is unknown. |
| PR-003 | Do not duplicate ProtectedRoute, RoleRoute, admin-equivalent guards, or guest guards. | Multiple guard stacks create bypass and inconsistent redirects. | Active route import graph. | Adopt RequireRole/AdminGate as a new route authority. | Static import and direct-deep-link matrix. | A second active guard stack appears. |
| PR-004 | Protected routes must use platform auth governance. | Modules cannot own session validity. | Stage 2/3 locks and active guard stack. | Module-local auth wrapper. | Anonymous/authenticated/unverified tests. | Platform auth source is unclear. |
| PR-005 | Admin leaves require admin role or explicit approved permission enforcement. | Admin UI exposes trust and operational controls. | Admin parent composition and backend admin middleware. | Rely on hidden navigation. | Anonymous/non-admin/admin/backend tests. | Admin role hierarchy is unapproved. |
| PR-006 | Provider and client routes require approved role or permission checks. | Cross-role access can expose private work. | Per-route role matrix. | Guess role from component/path name. | All supported roles plus direct URLs. | Product role intent is unapproved. |
| PR-007 | Guest-only routes require authenticated-user redirect behavior appropriate to each flow. | Auth loops and trapped sessions damage access. | Per-flow auth route audit. | Wrap all auth pages uniformly. | Guest/authenticated success and recovery tests. | Flow semantics are unclear. |
| PR-008 | Onboarding routes require explicit auth, role, step, and completion-state contracts when supported. | Role alone does not validate workflow state. | Onboarding product/API contract. | Infer completion behavior. | Incomplete/complete/invalid-step/re-entry tests. | Completion-state authority is absent. |
| PR-009 | Redirect behavior must be documented before implementation. | Changing denial targets can cause loops or privilege confusion. | Redirect baseline and Stage 4.3 plan. | Ad hoc Navigate changes. | History, state.from, loop, and role landing tests. | Canonical denial matrix is unknown. |
| PR-010 | Navigation visibility must align with route protection but never replace it. | Hidden links do not block deep links. | 42-target nav matrix and route guards. | Treat menu filtering as security. | Nav/metadata/guard parity and direct URL tests. | Target has no guard evidence. |
| PR-011 | Use existing route constants only; Stage 4.1 deferral authorizes no new constant work. | Constant migration remains gated. | Prompt 4 gate and registry. | Mix guard hardening with constant centralization. | No literal delta and registry parity. | A constant change becomes necessary. |
| PR-012 | Guard hardening must not create a dashboard shell, sidebar, layout, or route-tree duplicate. | Protection is platform composition. | Single-router/shell evidence. | Add parallel protected route tree. | One BrowserRouter/Routes/shell check. | Parallel platform structure appears. |
| PR-013 | Every hardening batch requires validation and rollback. | Access regressions can lock out users or expose data. | Approved route-role matrix and baseline. | Broad untested wrapper rewrite. | Lint, boundaries, build, route-role tests, manual deep links. | Baseline or rollback is missing. |
| PR-014 | Unknown role names or hierarchy block implementation. | Implicit hierarchy can grant unauthorized access. | Frontend/backend role contract and human decision. | Treat super_admin/support as implied admin. | Supported/legacy/unknown role matrix. | Security owner has not approved hierarchy. |
| PR-015 | Missing auth or session source-of-truth blocks implementation. | Guards cannot be safely changed against ambiguous principal state. | Auth source audit and import graph. | Create a replacement auth path. | Hydration/refresh/logout/session-expiry tests. | Competing active authorities are unresolved. |
| PR-016 | Frontend route protection must never be represented as API authorization. | Browser code is bypassable. | Backend middleware and endpoint evidence. | Claim secure data from route wrapper alone. | Endpoint auth, permission, ownership tests. | Backend policy is unknown. |
| PR-017 | Parent guard changes are atomic policy changes across every child. | One wrapper affects 53 dashboard or 12 admin leaves. | Complete child inventory. | Edit parent based on one page. | All child/role/deep-link regression matrix. | Any child classification is missing. |
| PR-018 | Sensitive dynamic routes require backend ownership evidence in addition to role checks. | Role membership does not prove record ownership. | Endpoint/resource authorization contract. | Assume route param ownership. | Own/other/missing record tests. | Ownership enforcement is unknown. |

## Authority

This draft inherits Stage 1-3 platform ownership locks and Prompt 4's documentation-only gate. It is a planning control, not permission to edit runtime guards.

## Prompt 6 Verification Lock

| Rule ID | Verification status | Prompt 6 evidence | Implementation gate |
|---|---|---|---|
| PR-001 | verified and hardened | Auth mount/import graph.; Prompt 6 correction/planning package | Second active provider/store appears. |
| PR-002 | verified and hardened | Frontend/backend role catalogs and approved contract.; Prompt 6 correction/planning package | Canonical role contract is unknown. |
| PR-003 | verified and hardened | Active route import graph.; Prompt 6 correction/planning package | A second active guard stack appears. |
| PR-004 | verified and hardened | Stage 2/3 locks and active guard stack.; Prompt 6 correction/planning package | Platform auth source is unclear. |
| PR-005 | verified and hardened | Admin parent composition and backend admin middleware.; Prompt 6 correction/planning package | Admin role hierarchy is unapproved. |
| PR-006 | verified and hardened | Per-route role matrix.; Prompt 6 correction/planning package | Product role intent is unapproved. |
| PR-007 | verified and hardened | Per-flow auth route audit.; Prompt 6 correction/planning package | Flow semantics are unclear. |
| PR-008 | verified and hardened | Onboarding product/API contract.; Prompt 6 correction/planning package | Completion-state authority is absent. |
| PR-009 | verified and hardened | Redirect baseline and Stage 4.3 plan.; Prompt 6 correction/planning package | Canonical denial matrix is unknown. |
| PR-010 | verified and hardened | 42-target nav matrix and route guards.; Prompt 6 correction/planning package | Target has no guard evidence. |
| PR-011 | verified and hardened | Prompt 4 gate and registry.; Prompt 6 correction/planning package | A constant change becomes necessary. |
| PR-012 | verified and hardened | Single-router/shell evidence.; Prompt 6 correction/planning package | Parallel platform structure appears. |
| PR-013 | verified and hardened | Approved route-role matrix and baseline.; Prompt 6 correction/planning package | Baseline or rollback is missing. |
| PR-014 | verified and hardened | Frontend/backend role contract and human decision.; Prompt 6 correction/planning package | Security owner has not approved hierarchy. |
| PR-015 | verified and hardened | Auth source audit and import graph.; Prompt 6 correction/planning package | Competing active authorities are unresolved. |
| PR-016 | verified and hardened | Backend middleware and endpoint evidence.; Prompt 6 correction/planning package | Backend policy is unknown. |
| PR-017 | verified and hardened | Complete child inventory.; Prompt 6 correction/planning package | Any child classification is missing. |
| PR-018 | verified and hardened | Endpoint/resource authorization contract.; Prompt 6 correction/planning package | Ownership enforcement is unknown. |

Additional lock: no separate ProofArena protection stack; no Prompt 7 runtime batch is authorized while the readiness decision remains HUMAN APPROVAL REQUIRED.
