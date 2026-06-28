# Duplicate Dashboard, Sidebar, and Layout Shell Audit

| ID | Path | Type/purpose | Uses platform | Similar/overlap | Duplicate / early-merge risk | Recommendation |
|---|---|---|---|---|---|---|
| DL-01 | `layouts/PublicLayout.jsx` | Public layout | Yes | `components/Layout.jsx` | High / high | Keep current route owner; investigate legacy wrapper. |
| DL-02 | `layouts/AuthLayout.jsx` | Auth layout | Yes | None material | High / high | Keep. |
| DL-03 | `layouts/DashboardLayout.jsx` | Provider/dashboard shell | Yes | `WorkspaceLayout`, SaaSLayout | Critical / critical | Preserve as route shell. |
| DL-04 | `layouts/ClientLayout.jsx` | Client shell | Yes | Dashboard/Workspace layouts | Critical / critical | Keep role-specific. |
| DL-05 | `layouts/AdminLayout.jsx` | Admin shell | Yes | Dashboard layout | Critical / critical | Keep role/security-specific. |
| DL-06 | `layouts/RootLayout.jsx` | Root composition | Yes | Public/root app wrappers | Medium / high | Trace current route use. |
| DL-07 | `layouts/WorkspaceLayout.jsx` | Workspace composition | Yes | Dashboard/client layouts | High / critical | Investigate composition role; no merge yet. |
| DL-08 | `components/Layout.jsx` | Legacy/public wrapper | Unknown | PublicLayout | Medium / high | Candidate only; verify reachability. |
| DL-09 | `components/SaaSLayout.jsx` | Page-level content wrapper | Yes | Workspace/dashboard shells | Medium / high | Not a full shell; keep semantic role. |
| DL-10 | `components/navigation/DashboardSidebar.jsx` | Dashboard sidebar | Yes | Mobile dashboard sidebar | High / high | Shared renderer; responsive QA. |
| DL-11 | `components/dashboard/MobileDashboardSidebar.jsx` | Mobile drawer | Yes | DashboardSidebar | Medium / critical | Responsive counterpart, not duplicate by default. |
| DL-12 | `components/client/ClientSidebar.jsx` | Client sidebar | Yes | Mobile client sidebar | High / high | Keep role-specific. |
| DL-13 | `components/client/MobileClientSidebar.jsx` | Client mobile drawer | Yes | ClientSidebar | Medium / high | Keep responsive counterpart. |
| DL-14 | `components/navigation/AdminSidebar.jsx` | Admin sidebar | Yes | Other role sidebars | Critical / critical | Preserve admin access context. |
| DL-15 | `layouts/useSidebarShell.js` | Shell state hook | Yes | `hooks/useSidebarState.js` | Medium / high | Trace dependents before unification. |
| DL-16 | Page-level wrappers in dashboard pages | Content wrappers | Yes/partial | SaaSLayout/PageHeader | Medium / medium | Reuse primitives; avoid new shell. |
| DL-17 | ProofArena-specific layout/shell | Not found | N/A | Existing layouts | Critical if created | Stop creation. |
| DL-18 | `components/firstClient/FirstClientDashboard.jsx`; dashboard components | Feature dashboards | Yes | Provider/client dashboard components | High / high | Product composition, not shell authority. |

No item is safe to delete or merge from this audit. Role and responsive differences are behaviorally significant.

