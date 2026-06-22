# Stage 3 Architecture

Stage 3 establishes the ScaleOps / ProofArena public route and dashboard shell foundation. It is intentionally limited to routing, layout, navigation, route safety, placeholder states, accessibility baseline, and Stage 4 readiness. It does not implement profile, offers, challenges, proof vault, matching, payments, messaging, moderation, or AI business features.

## Scope

- Public layout and public navigation
- Provider dashboard shell
- Client dashboard shell
- Admin dashboard shell
- Centralized route constants and metadata
- Universal sidebar engine
- Collapsible desktop sidebar and mobile drawers
- Role-aware frontend navigation visibility
- Not Found and Not Authorized fallback pages
- PageHeader, breadcrumbs, and back button foundation
- Universal page state components
- Responsive, accessibility, and visual consistency baseline

## Route Architecture

Routes are centralized in `client/src/constants/routes.js`.

The route metadata registry lives in `client/src/config/routeMetadata.js`. Every required Stage 3 route has metadata for labels, descriptions, groups, protected/public state, role access, breadcrumbs, and future-facing metadata.

Required Stage 3 route groups:

- Public: `/`, `/about`, `/pricing`, `/providers`, `/challenges`, `/leaderboard`, `/contact`, `/login`, `/register`
- Provider: `/dashboard`, `/dashboard/profile`, `/dashboard/offers`, `/dashboard/challenges`, `/dashboard/proof-vault`, `/dashboard/opportunities`, `/dashboard/settings`
- Client: `/client`, `/client/challenges`, `/client/providers`, `/client/active`, `/client/settings`
- Admin: `/admin`, `/admin/users`, `/admin/providers`, `/admin/challenges`, `/admin/proofs`, `/admin/reports`, `/admin/settings`
- System: `/not-found`, `/not-authorized`

`client/src/routes/AppRoutes.jsx` mounts these routes through the correct public, auth, provider, client, and admin layout shells.

## Route Matrix

The Stage 3 route matrix is metadata-backed and validated through the route helper layer:

- `client/src/utils/routeHelpers.js`
- `client/src/utils/routeMetadata.js`
- `client/src/utils/routeValidation.js`

Unknown routes fall through to the Not Found system page. Restricted routes use existing auth and role guards, then fall back through role-aware safe paths.

Legacy later-stage dashboard routes can remain registered, but Stage 3 shell navigation must use the Stage 3 route constants and metadata.

## Layout Systems

Public layout:

- `client/src/layouts/PublicLayout.jsx`
- Uses public header, main landmark, and footer
- Does not nest dashboard shells

Provider layout:

- `client/src/layouts/DashboardLayout.jsx`
- Uses `DashboardSidebar`, `DashboardTopbar`, `DashboardContentShell`, and `MobileDashboardSidebar`

Client layout:

- `client/src/layouts/ClientLayout.jsx`
- Uses `ClientSidebar`, `ClientTopbar`, `ClientContentShell`, and `MobileClientSidebar`

Admin layout:

- `client/src/layouts/AdminLayout.jsx`
- Uses `AdminSidebar`, `AdminTopbar`, and admin content shell structure

Dashboard shells use CSS grid with `minmax(0, 1fr)` and sidebar CSS variables. They do not rely on fixed `margin-left` layout hacks.

## Public Navigation

Public navigation is configured in `client/src/config/navigation/publicNavigation.js` and rendered through `client/src/components/Header.jsx`.

Public nav supports:

- Direct priority links
- Resources and Company dropdowns
- Mobile accordion navigation
- Auth-aware dashboard CTA
- Safe disabled/future links
- Keyboard and Escape behavior

Footer navigation uses the same navigation configuration and renders disabled/future links as non-clickable states.

## Sidebar Engine

The universal sidebar engine lives in:

- `client/src/components/navigation/sidebar/SidebarCore.jsx`
- `client/src/components/navigation/sidebar/SidebarNavItem.jsx`
- `client/src/components/navigation/sidebar/SidebarSection.jsx`
- `client/src/components/navigation/sidebar/SidebarGroup.jsx`
- `client/src/components/navigation/sidebar/SidebarBadge.jsx`

Provider, client, and admin sidebars are thin wrappers around this engine. They pass navigation sections, icon maps, current path, collapsed state, user, and role context.

The sidebar engine supports:

- Expanded and collapsed desktop modes
- Mobile drawer rendering
- Active route state
- `aria-current` for active links
- Accessible labels in collapsed mode
- Tooltip support as visual aid only
- Disabled/future items as non-clickable states
- Future role, permission, and feature-flag filtering

## Dashboard Shells

Provider dashboard:

- Provider acquisition-focused navigation
- Routes through `/dashboard`
- Uses provider route metadata and provider navigation config

Client dashboard:

- Buyer workflow-focused navigation
- Routes through `/client`
- Uses client route metadata and client navigation config

Admin dashboard:

- Platform operations-focused navigation
- Routes through `/admin`
- Uses admin route metadata and admin navigation config

Each shell waits for auth checking before rendering protected content and uses the centralized access policy helpers for layout-level hardening.

## Role-Aware Access

Frontend access policy is centralized in `client/src/utils/accessPolicy.js`.

Navigation filtering is centralized in `client/src/utils/navigationFilter.js`.

Dashboard CTA routing is centralized in `client/src/utils/getDashboardPathForRole.js`.

Rules:

- Guest users see public navigation and auth CTAs only.
- Providers route to `/dashboard`.
- Clients route to `/client`.
- Admin users route to `/admin`.
- Admin links are not exposed to provider, client, guest, or unknown roles.
- Frontend checks improve UX only; backend authorization remains the security authority.

## Route Safety

System pages:

- `client/src/pages/NotFound.jsx`
- `client/src/pages/NotAuthorized.jsx`
- `client/src/components/system/SystemStatePage.jsx`

Route safety responsibilities:

- Unknown routes render a polished Not Found page.
- Unauthorized routes render a safe Not Authorized page or redirect through guards.
- Disabled/future navigation items do not navigate.
- Breadcrumbs and back button use route-safe helpers.
- Private admin details are not exposed in system page copy.

## State Components

Universal page states live in `client/src/components/states/`.

Components:

- `AppStateShell`
- `EmptyState`
- `ComingSoonState`
- `ModulePlaceholder`
- `PageLoadingState`
- `DashboardSkeleton`
- `ErrorState`

These components are used for placeholder, loading, empty, coming-soon, error, and module-not-ready states. They should remain product-aware without fake data, fake metrics, or fake API calls.

## Accessibility Notes

Stage 3 shells include:

- Header, main, footer, nav, and sidebar landmarks
- Skip links
- Keyboard-accessible dropdowns and mobile drawers
- `aria-expanded` and `aria-controls` for disclosure controls
- `aria-current` for active navigation and breadcrumb state
- Visible focus states
- Non-clickable disabled/future items
- Reduced-motion compatible transition classes

Future features must preserve these baseline patterns.

## Responsive Notes

Dashboard layouts use grid columns and `minmax(0, 1fr)` to prevent sidebar/content collisions.

Mobile drawers are separate from desktop collapsed state. Drawer open state is not persisted. Desktop collapsed state is persisted through `scaleops.sidebar.collapsed`.

State components, breadcrumbs, buttons, topbars, and placeholders are built to wrap instead of causing horizontal overflow.

## Stage 4 Readiness

Stage 4 can build the enhanced profile system on top of:

- Provider profile route: `/dashboard/profile`
- Public profile dynamic route metadata
- PageHeader, breadcrumbs, and UniversalBackButton
- Provider dashboard shell and sidebar active state
- Role-aware dashboard CTA and layout protection
- ModulePlaceholder and EmptyState components
- Responsive dashboard content shell

Stage 4 should add profile-specific pages, forms, data fetching, and onboarding inside this shell instead of replacing the route or layout architecture.

## Known Limitations

- Backend module-boundary checks currently pass with warnings in `server/src/controllers/adminController.js` where controller code imports models directly. This is backend architecture debt outside the Stage 3 frontend shell scope.
- Vite build reports large chunk warnings for the main bundle and the 3D proof ecosystem scene. The build succeeds, but future performance work should consider additional code splitting.
- Several later-stage feature files already exist in the repository. Stage 3 shell architecture should avoid expanding those features until their dedicated roadmap stages.
