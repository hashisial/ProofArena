# Stage 4.2 Protected Route and Auth Guard Inventory

| Guard ID | File | Guard | Type | Routes protected | Roles | Redirect | Constants | Auth source | Duplicate/bypass/coverage risk | Future action | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| G-001 | `routes/ProtectedRoute.jsx` | `ProtectedRoute` | auth-required | dashboard parent tree | none | login | yes | `useAuthStore`, access policy | low bypass; role coverage intentionally absent | retain; verify nesting | high |
| G-002 | `routes/RoleRoute.jsx` | `RoleProtectedRoute` / `RoleRoute` | role-required | client/provider/support/admin route groups and leaves | supplied list | login or not-authorized | yes | `useAuthStore`, access policy | low direct bypass; alias naming risk | choose canonical name later | high |
| G-003 | `routes/PublicOnlyRoute.jsx` | `PublicOnlyRoute` | guest-only | login/register | role-derived default | role dashboard | indirect helper | `useAuthStore` | forgot/reset/verify not wrapped | verify intended guest-only coverage | high |
| G-004 | `routes/EmailVerifiedRoute.jsx` | `EmailVerifiedRoute` | email-required | client/dashboard/admin parents | none | resend verification | yes | `useAuthStore` | supports three user flag names | verify canonical verification field | high |
| G-005 | `routes/AuthHydration.jsx` | `AuthHydration` | hydration/loading | client/admin parents | none | none | n/a | `useAuthStore` | dashboard uses ProtectedRoute loading instead | verify consistency | high |
| G-006 | `layouts/DashboardLayout.jsx` | metadata access check | layout defense | dashboard tree | metadata roles | unauthorized fallback | yes | feature auth + access policy | metadata absent for 8 generic routes | critical coverage gap if roles intended | Prompt 2 verify all 16 generic routes | high |
| G-007 | `layouts/ClientLayout.jsx` | metadata access check | layout defense | `/client/*` | client metadata | unauthorized fallback | yes | feature auth + access policy | duplicates parent checks defensively | retain until tests | high |
| G-008 | `layouts/AdminLayout.jsx` | metadata access check | admin defense | `/admin/*` | admin metadata | unauthorized fallback | yes | feature auth + access policy | `/admin/proof-review` metadata absent, parent guard still protects | add metadata only after plan | high |
| G-009 | `utils/accessPolicy.js` | access/fallback policy | role/auth policy | metadata-driven routes/navigation/layouts | admin/client/provider/support | role dashboard/login/not-authorized | yes | user/role values | central policy but metadata incomplete | primary policy candidate | high |
| G-010 | `features/auth/RequireRole.jsx` | `RequireRole` | role/permission | no importer found | configured | renders Forbidden/login CTA | yes | alternate auth hook | duplicate guard risk; apparently unused | verify reachability, do not remove | high |
| G-011 | `components/AdminGate.jsx` | `AdminGate` | admin-only | no importer found | admin | hardcoded auth links | no | alternate auth surface | duplicate/stale guard risk | verify reachability | high |
| G-012 | `pages/Dashboard.jsx` | role dispatch | role redirect/render | `/dashboard`, aliases | client/provider/support/admin | support/admin/not-authorized | yes | feature auth | component-level redirect duplicates policy shape | verify against access policy | high |
| G-013 | `pages/DashboardChallenges.jsx` | role dispatch | role render/redirect | `/dashboard/challenges` | client/provider/admin | admin/not-authorized | yes | feature auth | component-level role handling | verify parity | high |

## Coverage Result

- Client routes: all five protected by client role and email verification at the parent.
- Admin routes: all twelve protected by admin role and email verification at the parent; one lacks metadata.
- Provider/client workflow leaves inside DashboardLayout: explicit role wrappers exist for 37 of 53 dashboard routes.
- Sixteen DashboardLayout routes rely on parent auth/email protection rather than explicit role wrappers. Eight of those have no metadata: `/account`, `/connections`, `/leads`, `/network`, `/payments`, `/projects`, `/provider-services`, `/scraper`.
- No confirmed unguarded admin route was found.
- Role intent for the eight metadata-less authenticated routes is `HUMAN REVIEW REQUIRED` before protection changes.

