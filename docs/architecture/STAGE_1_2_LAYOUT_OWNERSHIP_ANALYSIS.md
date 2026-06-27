# Stage 1.2 Layout Ownership Analysis

Generated: 2026-06-27

## Ownership Summary

The repository has one executable public layout, one auth layout, three protected role shells, one shared sidebar engine, and one inner SaaS page wrapper. Repetition is real, but similarity does not make every file a duplicate.

| Layout/shell | File path | Routes/pages using it | Children pattern | Navigation/sidebar dependency | Auth/role dependency | Similar files | Ownership | Risk if changed | Future recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PublicLayout | `client/src/layouts/PublicLayout.jsx` | Public/system route branch in `client/src/routes/AppRoutes.jsx` | `children ?? <Outlet />` | PublicNavbar and common Footer | No guard; public/system pages | Legacy Layout/RootLayout | Clear executable ownership | High: public pages, auth-adjacent system pages, skip/back/footer behavior | Keep canonical; investigate legacy compatibility path separately. |
| RootLayout compatibility export | `client/src/layouts/RootLayout.jsx` | No direct runtime importer found; exported by `client/src/layouts/index.js` | Re-export only | Delegates to legacy Layout | Legacy path classification in Layout | PublicLayout | Unknown/compatibility | Medium: deletion could break external/barrel consumers not visible statically | Candidate only; require runtime/package import proof. |
| Legacy Layout | `client/src/components/Layout.jsx` | Re-exported by RootLayout; no direct AppRoutes ownership | Explicit `children` | Header/Footer and local `appRoutes` set | UI-only protected-shell inference | PublicLayout | Overlapping legacy responsibility | High if unexpectedly imported at runtime; local route set can drift | Freeze; resolve ownership before any removal. |
| AuthLayout | `client/src/layouts/AuthLayout.jsx` | Login, register, recovery, verification route branch | `children ?? <Outlet />` | Brand/back navigation; no dashboard sidebar | PublicOnlyRoute/other auth wrappers are outside layout | PublicLayout | Clear | High: login/recovery access and redirect UX | Keep separate from public/dashboard shells. |
| Provider/shared DashboardLayout | `client/src/layouts/DashboardLayout.jsx` | Shared/provider dashboard branch | `children ?? <Outlet />` | DashboardSidebar, MobileDashboardSidebar, DashboardTopbar, DashboardContentShell | useAuth, accessPolicy, route metadata | ClientLayout, AdminLayout | Clear role ownership with repeated shell markup | Critical: protected rendering, grid, role access, sidebar state | Extract tested primitives later; preserve provider/shared policy wrapper. |
| ClientLayout | `client/src/layouts/ClientLayout.jsx` | Dedicated `/client` branch | `children ?? <Outlet />` | ClientSidebar, MobileClientSidebar, ClientTopbar, ClientContentShell | useAuth, accessPolicy, client metadata | DashboardLayout | Clear role ownership with repeated shell markup | Critical: buyer shell and role access | Share low-level shell primitives later, not role policy. |
| AdminLayout | `client/src/layouts/AdminLayout.jsx` | `/admin` branch | `children ?? <Outlet />` | AdminSidebar/AdminTopbar; inline content shell and mobile overlay lifecycle | useAuth, accessPolicy, admin metadata | DashboardLayout, ClientLayout | Clear role ownership; implementation fork | Critical: admin content exposure and keyboard/drawer behavior | First align/test drawer/content primitives; never merge admin policy casually. |
| DashboardContentShell | `client/src/components/dashboard/DashboardContentShell.jsx` | DashboardLayout | Content wrapper | None | None | ClientContentShell; inline AdminLayout wrapper | Duplicate-risk primitive | Medium: width/spacing regressions | Consolidate only after visual/layout tests. |
| ClientContentShell | `client/src/components/client/ClientContentShell.jsx` | ClientLayout | Content wrapper | None | None | DashboardContentShell | Duplicate-risk primitive | Medium | Candidate for shared content shell after snapshot/browser checks. |
| Provider mobile drawer | `client/src/components/dashboard/MobileDashboardSidebar.jsx` | DashboardLayout | Conditional overlay/dialog | DashboardSidebar and shared shell state | Indirect through protected layout | Client drawer; Admin inline drawer | Duplicate-risk primitive | High: focus, Escape, route-close, scroll lock | Extract lifecycle only after keyboard/browser tests. |
| Client mobile drawer | `client/src/components/client/MobileClientSidebar.jsx` | ClientLayout | Conditional overlay/dialog | ClientSidebar and shared shell state | Indirect through protected layout | Provider drawer; Admin inline drawer | Duplicate-risk primitive | High | Same drawer-lifecycle candidate as provider. |
| Admin inline mobile drawer | `client/src/layouts/AdminLayout.jsx` | AdminLayout | Conditional overlay plus sidebar | AdminSidebar and useSidebarShell | Admin protected shell | Provider/client drawer components | Duplicate-risk inline implementation | Critical | Move only through a tested admin-preserving migration. |
| DashboardTopbar | `client/src/components/navigation/DashboardTopbar.jsx` | DashboardLayout | Header with mobile trigger/account actions | useSidebarShell, route constants | Auth/user logout | ClientTopbar, AdminTopbar | Clear provider/shared ownership; repeated primitives | High: mobile opening, logout, account navigation | Share account/menu lifecycle and retain action slots. |
| ClientTopbar | `client/src/components/client/ClientTopbar.jsx` | ClientLayout | Buyer header/actions | useSidebarShell | Auth/user logout | DashboardTopbar | Clear buyer ownership; repeated primitives | High | Same primitive extraction candidate. |
| AdminTopbar | `client/src/components/navigation/AdminTopbar.jsx` | AdminLayout | Operational header/account/search | useSidebarShell | Auth/user logout | Dashboard/Client topbars | Clear admin ownership; implementation fork | High; search is visibly nonfunctional | Preserve admin action semantics; classify search separately. |
| Role sidebar wrappers | `DashboardSidebar.jsx`, `ClientSidebar.jsx`, `AdminSidebar.jsx` | Their role shells | Thin SidebarCore adapters | `client/src/components/navigation/sidebar/SidebarCore.jsx` | Navigation filtering/access policy | Each other | Intentional role wrappers | High if flattened: labels, role filtering, and destinations differ | Keep wrappers; consolidate only generic brand/footer helpers. |
| SidebarCore | `client/src/components/navigation/sidebar/SidebarCore.jsx` | All three role sidebar wrappers | Renders sections/groups/items | Shared sidebar component family | Receives filtered items/context | None | Clear shared engine | Critical: all dashboard navigation | Do not duplicate or replace; extend through its typed contract. |
| SaaSLayout | `client/src/components/SaaSLayout.jsx` | Ten legacy/shared dashboard pages | Inner page header plus content wrapper | PageHeader only | Relies on outer DashboardLayout | WorkspaceLayout alias | Clear inner content-wrapper ownership | Medium: page headings/back fallback | Keep distinct from protected shell; normalize imports later. |
| WorkspaceLayout alias | `client/src/layouts/WorkspaceLayout.jsx` | `client/src/pages/Saved.jsx` | Re-export only | Delegates to SaaSLayout | Relies on outer DashboardLayout | SaaSLayout | Compatibility/import alias | Low/medium | Candidate import normalization only after caller proof. |
| Header/Footer adapters | `client/src/components/navigation/PublicNavbar.jsx`, `client/src/components/common/Footer.jsx` | PublicLayout | Re-export adapters | Header/Footer implementations | Header uses auth-aware nav | Header/Footer | Intentional compatibility adapters | Medium | Keep until caller imports are intentionally normalized. |

## Confirmed Repeated-Implementation Clusters

Six clusters warrant later cleanup planning:

1. `LAY-003`: provider/client protected shell markup.
2. `LAY-004`: admin shell markup and embedded drawer/content behavior.
3. `LAY-005`: provider/client/admin content wrappers.
4. `LAY-006`: provider/client drawers plus admin inline equivalent.
5. `LAY-007`: provider/client topbar account/menu lifecycle.
6. `LAY-008`: admin topbar repetition plus operational differences.

These are not deletion approvals. `LAY-001`, `LAY-002`, `LAY-009`, and `LAY-010` are compatibility or intentional-adapter cases.

## Safest Consolidation Boundary

A future shared primitive may own grid variables, auth-loading slot, skip link, content column, and drawer lifecycle. Provider/client/admin wrappers must continue owning:

- Role/access policy and permitted route metadata.
- Role-specific navigation configuration and accessible labels.
- Topbar copy and action surfaces.
- Admin confidentiality and operational behavior.
- Provider/client content semantics.

No shell consolidation is safe until guest/provider/client/admin route tests and mobile keyboard tests exist.

