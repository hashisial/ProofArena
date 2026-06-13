# ScaleOps / ProofArena Navigation System

## Canonical Navigation Owner

Navigation constants are centralized in:

`client/src/constants/navigation.js`

The client is an existing JavaScript React/Vite application, so the current
`.js` constants module remains canonical. A parallel `navigation.ts` system
was not created.

All navigation destinations reuse route constants from:

`client/src/constants/routes.js`

Active navigation components consume the centralized constants through
`client/src/constants/index.js`.

## Navigation Item Contract

Each navigation item has:

- `label`
- `href`

Items may also have:

- `iconKey`
- `description`
- `badge`
- `comingSoon`
- `requiredRole`

Temporary compatibility fields remain available:

- `path` mirrors `href`
- `iconName` mirrors `iconKey`
- `roles` is derived from `requiredRole`

New navigation consumers should use `href`, `iconKey`, and `requiredRole`.
The compatibility fields should be removed only after all existing consumers
have migrated.

## Public Navigation

Owned by:

- Constants: `PUBLIC_NAV_LINKS`
- Component: `Header`
- Route shell: `PublicLayout`

Links:

- Home
- How It Works
- Challenges
- Providers
- Proof Ledger
- Leaderboard
- Pricing
- Contact

The wordmark also links to Home. Public desktop and mobile menus consume the
same constants.

## Footer Navigation

Owned by:

- Required footer link set: `FOOTER_NAV_LINKS`
- Rendered groups: `FOOTER_NAV_GROUPS`
- Component: `Footer`
- Route shell: `PublicLayout`

Required footer links:

- Resources
- Blog
- Case Studies
- Help Center
- Privacy
- Terms
- Trust & Safety

`FOOTER_NAV_GROUPS` also reuses relevant public links to preserve the existing
Platform and Company / Trust footer sections. `Footer.jsx` must not define
local link arrays.

## Dashboard Navigation

Owned by:

- Constants: `DASHBOARD_NAV_LINKS`
- Future-module constants: `DASHBOARD_FUTURE_NAV_LINKS`
- Component: `DashboardSidebar`
- Route shell: `DashboardLayout`

Shared dashboard links include:

- Dashboard
- Profile
- Proof
- Messages
- Notifications
- Saved
- Billing
- Settings

The same group also includes established client and provider workflow links.
Role-specific items use `requiredRole`. `DashboardSidebar` uses
`canAccessNavigationItem(item, role)` rather than duplicating role-filtering
logic.

## Admin Navigation

Owned by:

- Constants: `ADMIN_NAV_LINKS`
- Component: `AdminSidebar`
- Route shell: `AdminLayout`

Required admin links:

- Admin Overview
- Users
- Providers
- Challenges
- Proof Review
- Reports
- Disputes
- Settings

Established admin links for Outcome Offers, Proof Assets, and Verification are
retained. Admin routes remain protected by the existing route guard; the
navigation item `requiredRole` metadata is descriptive and reusable.

## Navigation Groups Export

`NAVIGATION_GROUPS` exposes:

- `PUBLIC`
- `FOOTER`
- `FOOTER_GROUPS`
- `DASHBOARD`
- `DASHBOARD_FUTURE`
- `ADMIN`

Use focused exports in application components. Use `NAVIGATION_GROUPS` only
for tooling, audits, or generic navigation utilities.

## Route Coverage and Page Shells

Every visible centralized navigation link currently resolves to a registered
route. The following links intentionally resolve to professional foundation
shells rather than complete product or legal pages:

- How It Works
- Proof Ledger
- Leaderboard
- Blog
- Contact
- Resources
- Case Studies
- Help Center
- Pricing
- Privacy
- Terms
- Trust & Safety
- Proof
- Billing
- Admin Proof Review
- Admin Disputes
- Admin Settings

No additional page shells were created in this prompt.

## Rules for Avoiding Duplicate Navigation

1. Add destinations to `routes.js` before referencing them from navigation.
2. Add shared menu items to `navigation.js`; do not define link arrays inside
   navbar, footer, or sidebar components.
3. Use `href`, `iconKey`, and `requiredRole` for new consumers.
4. Keep role authorization in route guards. Navigation filtering is not an
   authorization boundary.
5. Do not expose a visible link until its route resolves to a complete page or
   an approved professional shell.
6. Keep public, dashboard, and admin navigation owned by their existing route
   layouts. Pages must not render duplicate navigation shells.

## Known Risks

1. Topbar account menus still contain a small number of contextual links
   directly in their components. They already use centralized route constants
   and are not shared menu arrays.
2. Compatibility fields remain necessary while older consumers use `path`,
   `iconName`, or `roles`.
3. Several visible links intentionally lead to foundation shells and require
   complete content or legal review later.
