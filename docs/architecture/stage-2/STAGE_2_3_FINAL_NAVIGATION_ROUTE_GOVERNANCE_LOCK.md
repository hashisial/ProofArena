# Final Navigation and Route Governance Lock

| ID | Area / source candidate | Supporting docs | Forbidden duplicate | Required pre-read / validation | Duplicate / early-merge risk | Human | Final rule |
|---|---|---|---|---|---|---|---|
| NR-01 | Public navigation: `config/navigation/publicNavigation.js` | Prompt 7 nav audit | ProofArena public nav config | Nav/route locks; link/mobile QA | High/high | Yes | Extend registry only. |
| NR-02 | Header: `components/navigation/PublicNavbar.jsx` | Nav audit | New branded header framework | Reachability/import/visual QA | Medium/high | Yes | Reuse active renderer; investigate legacy Header. |
| NR-03 | Footer: public registry plus active Footer owner | Nav audit | New footer link arrays | Import/link/responsive QA | Medium/high | Yes | Determine active renderer before consolidation. |
| NR-04 | Mobile: `PUBLIC_MOBILE_NAV_GROUPS` and PublicNavbar | Nav audit | Separate mobile catalog | Mobile visual/access QA | High/high | Yes | Same route registry. |
| NR-05 | Dropdowns: `PUBLIC_NAV_DROPDOWNS` | Nav audit | Component-local route arrays | Link/keyboard QA | Medium/high | No | Reuse config. |
| NR-06 | Dashboard navigation: `constants/navigation.js` aggregate | Nav/ownership locks | Product dashboard nav | Role/link QA | Critical/high | Yes | Compose existing role groups. |
| NR-07 | Sidebar renderers: existing role components | Layout audit | New sidebar framework | Responsive/role QA | Critical/critical | Yes | Reuse role shell/state. |
| NR-08 | Admin nav: `adminNavigation.js` | Nav audit | ProofArena admin nav | Admin access/link QA | Critical/high | Yes | Keep admin-specific under platform governance. |
| NR-09 | Provider nav: `providerNavigation.js` | Nav audit | Module provider nav | Provider role/link QA | High/high | Yes | Keep role config. |
| NR-10 | Client nav: `clientNavigation.js` | Nav audit | Module client nav | Client role/link QA | High/high | Yes | Keep role config. |
| NR-11 | Route declarations: `routes/AppRoutes.jsx` | Route audit/inventory | Parallel route tree | Route/guard/404/build QA | Critical/critical | Yes | One declaration tree. |
| NR-12 | Route constants: `constants/routes.js` | Route lock | New route catalog | Constant/reference scan | Critical/high | Yes | One governed catalog. |
| NR-13 | Redirects: AppRoutes/auth route utilities | Route audit | Module redirect policy | Login/logout/legacy QA | High/high | Yes | Preserve shared redirect behavior. |
| NR-14 | 404/fallback: AppRoutes/system routes | Route audit | Module fallback router | Unknown-path QA | Medium/high | No | One fallback path. |
| NR-15 | Protected routes: shared guard nesting | Auth/route audits | Module guard wrappers | Positive/negative access QA | Critical/critical | Yes | Use shared guards. |
| NR-16 | ProofArena module routes: existing route groups | Surface/route locks | `modules/proofarena` router tree | Ownership/route QA | Critical/critical | Yes | Register through NR-11/12 only. |

