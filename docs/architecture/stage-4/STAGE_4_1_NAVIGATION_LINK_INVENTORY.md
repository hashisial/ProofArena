# Stage 4.1 Navigation Link Inventory

## Configured Navigation

Configured navigation is metadata-derived through `client/src/constants/navigation.js` and `client/src/config/navigation/*`. Across the major exports there are 81 link occurrences, 69 enabled occurrences, 42 unique enabled IDs/paths, and 12 disabled future occurrences. Every enabled configured target matches a declared route.

Common fields for the table below: route constant use is `yes`, hardcoded path is `no` unless noted, related route declaration is `yes`, confidence is high, and broken-route risk is low. Protected/role status is stated in the item list.

| Nav ID | File/export | Type | Links (label -> target) | Protection/role | Duplicate navigation risk | Future action |
|---|---|---|---|---|---|---|
| NAV-001 | `publicNavigation.js` / `PUBLIC_NAV_LINKS` | header/public | Providers -> `/providers`; Challenges -> `/challenges`; Leaderboard -> `/leaderboard`; Pricing -> `/pricing` | public | low; reused by marketplace/footer | keep/reuse |
| NAV-002 | same / `RESOURCE_NAV_LINKS` | dropdown/footer | Blog -> `/blog`; Guides -> `/resources`; Help Center -> `/help`; Case Studies -> `/case-studies`; Proof System -> `/proof-ledger`; Trust & Safety -> `/trust-safety` | public | low | keep/reuse |
| NAV-003 | same / `COMPANY_NAV_LINKS` | dropdown/footer | Contact -> `/contact`; Privacy -> `/privacy`; Terms -> `/terms`; About/Careers disabled with empty path | public/future | low | keep disabled items non-routable |
| NAV-004 | same / `MARKETPLACE_NAV_LINKS` | public dropdown | Providers, Challenges, Leaderboard, Pricing (same targets as NAV-001) | public | intentional overlap | verify labels/surfaces only |
| NAV-005 | same / `PRODUCT_NAV_LINKS` | public dropdown/footer | Verified Outcomes -> `/proof-ledger`; Reputation Engine -> `/leaderboard`; four future items disabled | public/future | intentional overlap | keep future items disabled |
| NAV-006 | same / `PUBLIC_NAV_DROPDOWNS` | dropdown | Product and Resources groups, 11 occurrences | public | composed, not duplicate config | keep composed |
| NAV-007 | same / `PUBLIC_MOBILE_NAV_GROUPS` | mobile nav | 15 occurrences composed from public groups | public | shared source avoids second mobile config | keep composed |
| NAV-008 | same / `FOOTER_NAV_GROUPS`, `FOOTER_NAV_LINKS` | footer | 20 occurrences, 14 enabled, 6 disabled | public/future | repeated targets intentional | verify disabled rendering |
| NAV-009 | `providerNavigation.js` / `PROVIDER_NAV_LINKS` | provider sidebar | Overview `/dashboard`; Profile `/dashboard/profile`; Offers `/dashboard/offers`; Challenges `/dashboard/challenges`; Proof Vault `/dashboard/proof-vault`; Opportunities `/dashboard/opportunities`; Settings `/dashboard/settings` | provider except overview metadata has no role | medium | verify overview role semantics |
| NAV-010 | `clientNavigation.js` / `CLIENT_NAV_LINKS` | client sidebar | Overview `/client`; Challenges `/client/challenges`; Providers `/client/providers`; Active `/client/active`; Settings `/client/settings` | client | low | replace hardcoded legacy active pattern only after plan |
| NAV-011 | `adminNavigation.js` / `ADMIN_NAV_LINKS` | admin sidebar | Overview `/admin`; Users `/admin/users`; Providers `/admin/providers`; Challenges `/admin/challenges`; Proof Reviews `/admin/proofs`; Reports `/admin/reports`; Settings `/admin/settings` | admin | low | verify omitted admin routes are intentional |
| NAV-012 | `constants/navigation.js` / `DASHBOARD_NAV_LINKS` | shared dashboard/sidebar | 17 links covering dashboard, client workspace/challenges/providers, provider challenges/first-client/offers/plans/opportunities/proof-vault, profile/proof/messages/notifications/saved/billing/settings | mixed roles from metadata | medium | verify generic role-less links |
| NAV-013 | `Header.jsx` | header/mobile/account CTA | metadata-driven groups plus Dashboard, Profile, Login, role/intent register links | mixed | low configured; CTA query strings constructed locally | migrate only with tests |
| NAV-014 | `Footer.jsx` | footer | consumes filtered `FOOTER_NAV_GROUPS` | public | low | keep no local arrays |
| NAV-015 | `DashboardSidebar.jsx` | dashboard/provider sidebar | consumes role-filtered central groups | authenticated/role | low | verify all routes have metadata |
| NAV-016 | `ClientSidebar.jsx` | client sidebar | consumes `CLIENT_NAV_GROUPS` | client | low | keep current source |
| NAV-017 | `AdminSidebar.jsx` | admin sidebar | consumes `ADMIN_NAV_LINKS` | admin | low | verify route/nav coverage |

## Hardcoded Navigation and Redirect Consumers

Static scanning found 72 route-context path-literal occurrences across 28 files outside `constants/routes.js`. Some are generic path parsing or intentional compatibility checks; the following are actionable route consumers.

| ID | File | Label/context | Target | Type | Constant | Declared | Protection | Risk | Action | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| HN-001 | `components/AdminGate.jsx` | admin forgot-password/home | `/forgot-password?role=admin`, `/` | CTA | no | yes | auth/admin component | medium; component appears unreferenced | verify reachability; do not delete | high |
| HN-002 | `components/SaaSLayout.jsx` | back fallback | `/dashboard` | module internal | no | yes | protected target | medium | verify active use |
| HN-003 | `features/dashboard/dashboardContent.js` | dashboard quick actions | `/providers`, `/projects`, `/messages`, `/profile`, `/marketplace` | dashboard CTA | no | yes | mixed | high | migrate only after role/metadata audit |
| HN-004 | `features/profile/profileOnboarding.js` | step builder | `/dashboard/profile/onboarding/${step}` | dynamic | no | yes pattern | provider | high | compare with route builder |
| HN-005 | `pages/Account.jsx` | login/home redirect | `/login`, `/` | CTA/redirect | no | yes | mixed | high | replace in future plan |
| HN-006 | `pages/Admin.jsx` | admin cards/actions | five `/admin/*` paths | admin nav | no | yes | admin | high; page appears unreferenced | verify reachability |
| HN-007 | `pages/Auth.jsx` | auth path detection/redirect | `/register`, `/forgot-password`, `/reset-password`, `/dashboard`, `/admin`, `/login`, `/` | auth/redirect | no | yes | mixed | critical if reachable; appears unreferenced | prove dead/live before action |
| HN-008 | `pages/Marketplace.jsx` | marketplace/category/provider/projects/login CTAs | multiple declared targets | public/CTA | no | yes | mixed | high | inventory exact consumers in Prompt 2 |
| HN-009 | `pages/Profile.jsx` | settings/dashboard/public URL | `/settings`, `/dashboard`, `/profile/${username}` | CTA/dynamic | no | yes | protected/public | high | compare public-profile builder semantics |
| HN-010 | `pages/ServiceDetail.jsx` | login/messages redirects | `/login`, `/messages?conversation=...` | redirect | no | yes | auth-sensitive | critical | migrate only after redirect contract |
| HN-011 | `pages/Connections.jsx` | network fallback/messages redirect | `/network`, `/messages` | link/redirect | no | yes | protected | high | future constant migration |
| HN-012 | `pages/Saved.jsx` | service detail | `/marketplace/service/${service.slug}` | dynamic link | no | shape only | public | high; route param is named `serviceId` | human semantic review |
| HN-013 | `sections/CTASection.jsx`, `Services.jsx`, `Blogs.jsx`, `PortfolioPreview.jsx` | marketing CTAs | `/contact`, `/services`, `/portfolio` | public CTA | no | yes | public | medium | batch after audit |
| HN-014 | `sections/MarketplacePreview.jsx` | marketplace/provider-services/category CTAs | three route families | public CTA | no | yes | mixed | high | compare dynamic builder |
| HN-015 | `config/navigation/clientNavigation.js` | legacy active pattern | `/dashboard/client` | role nav | no | yes | client | medium; compatibility | document retention/removal criteria |
| HN-016 | `utils/routeValidation.js` | auth prefix detection | `/login`, `/register` | guard utility | no | yes | auth | high | centralization blocker |

## Result

- Central navigation configs are internally coherent and point to declared routes.
- Hardcoded route consumers remain material and block safe centralization.
- No navigation was changed.

