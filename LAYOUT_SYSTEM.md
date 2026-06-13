# ScaleOps / ProofArena Layout System

## Canonical Route Layouts

Active route-level layouts live in:

`client/src/layouts/`

The canonical layouts are:

- `PublicLayout`
- `AuthLayout`
- `DashboardLayout`
- `AdminLayout`

`client/src/routes/AppRoutes.jsx` assigns these layouts to route groups. Pages
must not render route-level navigation shells themselves.

The layout barrel file is:

`client/src/layouts/index.js`

Direct imports remain valid for existing routes.

## PublicLayout

Use for:

- Public marketing and content pages
- Public provider profiles
- Public challenge and outcome-offer pages
- Public error and not-found pages

Owns:

- Public navbar
- Public footer
- Public page quick actions
- Main-content landmark and skip link

Must not include:

- Dashboard sidebar or topbar
- Admin sidebar or topbar
- Auth-only presentation

The layout uses a flexible minimum viewport height so short pages keep the
footer at the bottom. Public pages and sections remain responsible for their
own contained widths using the shared `Container` or `Section` UI components.

Optional props:

- `children`
- `className`
- `mainClassName`
- `showNavbar`
- `showFooter`

## AuthLayout

Use for:

- Login
- Register
- Forgot password
- Reset password
- Verify or resend verification

Owns:

- Responsive auth presentation
- Desktop ProofArena brand/context panel
- Centered main auth-content region
- Main-content landmark and skip link

Must not include:

- Public navbar or footer
- Dashboard sidebar or topbar
- Admin sidebar or topbar

Auth pages remain responsible for their form and card contents. The layout
provides the centered responsive region without adding a second card around
existing auth cards.

Optional props:

- `children`
- `className`
- `contentClassName`

## DashboardLayout

Use for:

- Authenticated client pages
- Authenticated provider pages
- Shared authenticated account pages

Owns exactly once:

- `DashboardSidebar`
- `DashboardTopbar`
- Mobile drawer backdrop
- Independent main-content scroll container

The shell is viewport-height constrained with overflow hidden. The sidebar is
fixed on mobile and sticky on desktop. Only the main content region scrolls.
The mobile drawer closes on navigation, backdrop click, sidebar-link click, or
Escape.

Optional props:

- `children`
- `title`
- `className`
- `mainClassName`
- `contentClassName`

Must not include:

- Public navbar or footer
- Admin sidebar or topbar
- A second dashboard shell inside a page

## AdminLayout

Use for:

- Admin-only routes

Owns exactly once:

- `AdminSidebar`
- `AdminTopbar`
- Mobile admin drawer backdrop
- Independent admin main-content scroll container

Admin routes are currently wrapped by `RoleRoute` in `AppRoutes.jsx`. The
layout itself remains presentation-only so authorization stays in the route
guard layer.

Optional props:

- `children`
- `title`
- `className`
- `mainClassName`
- `contentClassName`

Must not include:

- Dashboard sidebar or topbar
- Public navbar or footer
- Admin authorization business logic

## Sidebar and Topbar Ownership

| Component | Sole owner |
| --- | --- |
| `PublicNavbar` | `PublicLayout` |
| `Footer` | `PublicLayout` |
| `DashboardSidebar` | `DashboardLayout` |
| `DashboardTopbar` | `DashboardLayout` |
| `AdminSidebar` | `AdminLayout` |
| `AdminTopbar` | `AdminLayout` |

Sidebars expose stable IDs and topbar menu buttons use `aria-controls` and
reactive `aria-expanded` values. Dashboard and admin shells share only the
small `useSidebarShell` behavior hook; they do not share navigation content.

## Compatibility and Page-Level Layouts

### `RootLayout`

`client/src/layouts/RootLayout.jsx` is a compatibility export for the legacy
`client/src/components/Layout.jsx`. It is not used by active route
composition. Do not wrap `AppRoutes` with it because that would duplicate
public navigation and footer behavior.

### `WorkspaceLayout`

`client/src/layouts/WorkspaceLayout.jsx` is a compatibility export for
`SaaSLayout`.

### `SaaSLayout`

`client/src/components/SaaSLayout.jsx` is a page-level content wrapper. It
provides a `PageHeader` and content spacing inside `DashboardLayout`; it does
not render a sidebar or topbar. It may remain nested inside dashboard pages
until a dedicated page-wrapper migration is justified.

## Known Risks

1. Dashboard and admin shells currently share the same Zustand
   `sidebarCollapsed` preference. This is acceptable for now, but separate
   preferences may be useful if admin and workspace navigation widths diverge.
2. Legacy `Layout`, `RootLayout`, `WorkspaceLayout`, and `SaaSLayout` names can
   be mistaken for active route shells. Remove or rename them only through a
   dedicated import migration with regression checks.
3. The public navbar owns its own mobile menu state. It must not be mixed with
   authenticated sidebar state.
4. Global styles remain broad and can still influence content inside route
   layouts. Layout-specific styling should stay minimal.
5. There is no automated browser test suite for asserting sidebar count,
   independent scrolling, or mobile drawer behavior.

## Future Improvements

- Add route-level browser tests for public, auth, dashboard, and admin shells.
- Add automated assertions that authenticated pages render one sidebar and one
  topbar.
- Evaluate separate dashboard/admin collapsed-sidebar preferences if required.
- Migrate legacy page-level layout names after all consumers and route behavior
  are covered by tests.

## Rules for New Pages

1. Assign the page to an existing route layout in `AppRoutes.jsx`.
2. Do not render route sidebars, topbars, public navbar, or footer from pages.
3. Use `PageHeader`, `Container`, and `Section` for page composition.
4. Keep role protection in route guards, not in visual layouts.
5. Do not create a new layout merely to change padding or max width; use the
   existing layout override props.
