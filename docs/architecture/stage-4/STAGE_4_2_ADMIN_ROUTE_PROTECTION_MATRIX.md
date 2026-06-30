# Stage 4.2 Admin Route Protection Matrix

## Common Protection Boundary

All 12 admin leaves are children of `AuthHydration -> RoleRoute([USER_ROLES.ADMIN]) -> EmailVerifiedRoute -> AdminLayout`. This is the active browser equivalent of an admin guard; there is no separate active `AdminGuard` in the route tree. Anonymous users go to login, non-admin users go to `ROUTES.SYSTEM.NOT_AUTHORIZED`, and unverified admins go to resend verification. Backend `protectAdmin` and permission middleware remain independent security boundaries.

| Admin ID | Path | Component | Guard / admin requirement | Platform role | Metadata | Navigation | Sensitive access risk | Status | Severity | Required action | Human review |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AD-096 | `/admin` | AdminDashboard | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | admin sidebar | platform administration | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |
| AD-097 | `/admin/users` | AdminUsers | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | admin sidebar | high-value moderation or identity surface | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |
| AD-098 | `/admin/providers` | AdminProviders | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | admin sidebar | high-value moderation or identity surface | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |
| AD-099 | `/admin/challenges` | AdminChallenges | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | admin sidebar | platform administration | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |
| AD-100 | `/admin/offers` | AdminOffers | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | none detected / deep link | platform administration | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |
| AD-101 | `/admin/proof-assets` | AdminProofAssets | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | none detected / deep link | high-value moderation or identity surface | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |
| AD-102 | `/admin/proofs` | AdminProofReview | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | admin sidebar | high-value moderation or identity surface | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |
| AD-103 | `/admin/proof-review` | AdminProofReview | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | missing | none detected / deep link | high-value moderation or identity surface | protected with caution | high | decide compatibility metadata/retention; do not alter guard | yes |
| AD-104 | `/admin/reports` | AdminReports | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | admin sidebar | platform administration | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |
| AD-105 | `/admin/verification` | AdminVerification | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | none detected / deep link | high-value moderation or identity surface | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |
| AD-106 | `/admin/disputes` | AdminDisputes | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | none detected / deep link | high-value moderation or identity surface | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |
| AD-107 | `/admin/settings` | AdminSettings | parent RoleRoute(admin); auth yes | yes: USER_ROLES.ADMIN | present | admin sidebar | platform administration | protected | medium | test anonymous, non-admin, unverified, and admin deep links | yes |

## Findings

- No unguarded admin browser declaration was found.
- `/admin/proof-review` is parent-guarded but lacks route metadata; it is the highest-priority route-governance gap in this group.
- Frontend `accessPolicy` treats `super_admin` as an admin override, while backend `protectAdmin` requires the literal `admin` role. That cross-tier hierarchy requires human/security review before any change.
- Admin navigation exposes 7 of 12 leaves; omission from navigation is not evidence of missing route protection.
- No admin route or backend permission middleware was modified.
