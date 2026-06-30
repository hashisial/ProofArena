# Stage 4.2 Unauthorized, Forbidden, And Login Redirect Baseline

| ID | File | Trigger | Source category | Target | Constant | Hardcoded | Auth/role dependency | Security risk | UX risk | Missing risk | Duplicate risk | Required action | Review |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PRD-001 | client/src/routes/ProtectedRoute.jsx | unauthenticated protected access | dashboard/authenticated | ROUTES.LOGIN | yes | no | auth store + accessPolicy | low | intended path kept in state.from | low | low | test all protected parents and state shape | no |
| PRD-002 | client/src/routes/RoleRoute.jsx | unauthenticated role route | client/admin/role-specific | ROUTES.LOGIN | yes | no | auth store | low | state.from preserved | low | low | test client/provider/admin/support deep links | no |
| PRD-003 | client/src/routes/RoleRoute.jsx | authenticated wrong role | role-specific | ROUTES.SYSTEM.NOT_AUTHORIZED | yes | no | role normalization | medium hierarchy drift | not-authorized flow depends on fallback policy | low | medium | approve role hierarchy; test denial page | yes |
| PRD-004 | client/src/routes/EmailVerifiedRoute.jsx | unverified authenticated user | client/dashboard/admin | ROUTES.RESEND_VERIFICATION | yes | no | three verification aliases | medium field drift | reason/from state preserved | low | medium | contract verification field and resend access | yes |
| PRD-005 | client/src/routes/PublicOnlyRoute.jsx | authenticated login/register access | guest-only | role default | yes | no | accessPolicy | unknown-role fallback | does not retain attempted auth path | low | low | test all supported/unknown roles | yes |
| PRD-006 | client/src/pages/Login.jsx | login success | auth | validated state.from or role default | yes | no | authRouteUtils | open-redirect validation present | intended destination behavior | low | low | regression-test query/search/hash and role default | no |
| PRD-007 | client/src/pages/Register.jsx | registration success | auth | validated state.from or role default | yes | no | authRouteUtils | role assignment policy | intent preservation | low | low | test client/provider intent | yes |
| PRD-008 | client/src/components/Header.jsx; *Topbar.jsx | logout success | authenticated UI | ROUTES.LOGIN | yes | no | AuthProvider.logout | distributed caller drift | replace navigation | low | low | inventory and test every logout surface | no |
| PRD-009 | client/src/utils/accessPolicy.js | layout/metadata denial | protected metadata route | role dashboard or not-authorized | yes | no | route metadata + normalized role | high policy coordination | caller-specific fallback | medium | high | approve canonical denial matrix | yes |
| PRD-010 | client/src/pages/NotAuthorized.jsx | forbidden recovery | /not-authorized | safe role fallback, login, or home | yes | no | accessPolicy + state.from | fallback can differ from RoleRoute intent | recovery actions vary by principal | medium | medium | define /403 versus /not-authorized authority | yes |
| PRD-011 | client/src/routes/AppRoutes.jsx | explicit forbidden alias | /403 | Forbidden page | yes | no | none | duplicate semantic destination | legacy alias UX | medium | medium | approve retention/redirect semantics in Stage 4.3 | yes |
| PRD-012 | client/src/routes/authRouteUtils.js | unknown role landing | auth/default | ROUTES.DASHBOARD | yes | no | accessPolicy | unknown principal may reach generic dashboard parent | ambiguous landing | medium | high | approve fail-closed or support policy | yes |
| PRD-013 | client/src/pages/NotFound.jsx | authenticated invalid route recovery | fallback | role dashboard/home | yes | no | auth store + accessPolicy | low | contextual recovery | low | low | coordinate with Stage 4.3 only | no |

## Baseline Decision

Core anonymous, wrong-role, unverified-email, guest-only, login-success, registration-success, logout, and recovery behavior is observable. Canonical semantics among `/403`, `/not-authorized`, role-dashboard fallback, and unknown-role fallback are not approved. Redirect changes remain Stage 4.3-coordinated and blocked in Prompt 5.
