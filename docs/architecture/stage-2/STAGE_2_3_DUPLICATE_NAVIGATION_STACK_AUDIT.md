# Duplicate Navigation Stack Audit

## Result

No separate ProofArena navigation stack is confirmed. Current public/provider/client/admin configurations are intentional role/product views over shared route metadata. Legacy rendering components require investigation before consolidation.

| ID | Path | Type/purpose | Paths/source candidate | Overlap | Scope | Duplicate / early-merge risk | Docs / recommendation |
|---|---|---|---|---|---|---|---|
| NV-01 | `config/navigation/publicNavigation.js` | Public/mobile/dropdown/footer registry | Route metadata; primary public source | `constants/navigation.js` aggregator | ScaleOps-wide | High / high | Keep and reuse. |
| NV-02 | `config/navigation/providerNavigation.js` | Provider groups | Route metadata/provider constants | Dashboard aggregate | ScaleOps-wide role config | High / high | Keep role-specific. |
| NV-03 | `config/navigation/clientNavigation.js` | Client groups | Route metadata/client routes | Dashboard aggregate | ScaleOps-wide role config | High / high | Keep role-specific. |
| NV-04 | `config/navigation/adminNavigation.js` | Admin links | Route metadata/admin routes | Admin sidebar | ScaleOps-wide role config | High / high | Keep role-specific. |
| NV-05 | `constants/navigation.js` | Public aggregation and dashboard list | Source candidate: aggregator only | All four configs | ScaleOps-wide | High / high | Reuse exports; do not duplicate arrays. |
| NV-06 | `components/navigation/PublicNavbar.jsx` | Header/mobile/dropdowns | `PUBLIC_NAV_*` | `components/Header.jsx` | ScaleOps-wide | Medium / high | Keep current public renderer; investigate legacy header. |
| NV-07 | `components/Header.jsx` | Legacy/general header | Hardcoded/imported shared links | PublicNavbar | Unknown/legacy | Medium / high | Investigate reachability; do not delete. |
| NV-08 | `components/Footer.jsx` | Public footer | Shared navigation | `components/common/Footer.jsx` | ScaleOps-wide/legacy | Medium / high | Determine active owner. |
| NV-09 | `components/common/Footer.jsx` | Common footer | Unknown/legacy paths | Footer | Unknown | Medium / high | Investigate only. |
| NV-10 | `components/navigation/DashboardSidebar.jsx` | Provider/dashboard sidebar | Provider/dashboard nav groups | MobileDashboardSidebar | ScaleOps-wide shell | High / high | Keep shared desktop owner. |
| NV-11 | `components/dashboard/MobileDashboardSidebar.jsx` | Mobile dashboard renderer | Same shell/nav intent | DashboardSidebar | ScaleOps-wide responsive | Medium / critical | Do not merge without responsive QA. |
| NV-12 | `components/client/ClientSidebar.jsx` | Client sidebar | Client nav config | MobileClientSidebar | ScaleOps-wide role shell | High / high | Keep role-specific. |
| NV-13 | `components/client/MobileClientSidebar.jsx` | Mobile client sidebar | Client nav config | ClientSidebar | ScaleOps-wide responsive | Medium / high | Do not merge without QA. |
| NV-14 | `components/navigation/AdminSidebar.jsx` | Admin sidebar | Admin nav config | Admin topbar/layout | ScaleOps-wide role shell | High / high | Keep role-specific. |
| NV-15 | `components/navigation/DashboardTopbar.jsx` | Dashboard topbar | Shell actions | Client/Admin topbars | ScaleOps-wide | Medium / high | Keep context-specific. |
| NV-16 | `components/client/ClientTopbar.jsx` | Client topbar | Client shell | DashboardTopbar | ScaleOps-wide role shell | Medium / high | Investigate shared primitives, not wholesale merge. |
| NV-17 | `components/navigation/AdminTopbar.jsx` | Admin topbar | Admin shell | DashboardTopbar | ScaleOps-wide role shell | Medium / high | Keep role security/context. |
| NV-18 | `layouts/useSidebarShell.js`; `hooks/useSidebarState.js` | Shell/sidebar state | Existing shell source | Similar state helpers | ScaleOps-wide | Medium / high | Trace consumers before consolidation. |
| NV-19 | `utils/navigationActive.js`; `navigationFilter.js` | Shared active/access logic | Shared utilities | Component-local checks | ScaleOps-wide | Medium / medium | Reuse and reduce later only with tests. |
| NV-20 | ProofArena-specific nav config | Not found | Existing configs remain source | None | None | Critical if introduced | Stop creation; use NV-01..04. |

