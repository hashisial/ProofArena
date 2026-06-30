# Stage 4.2 Navigation-To-Protected-Route Alignment Audit

## Enabled Configured Targets

All 42 unique enabled configured targets resolve to active declarations. Visibility is derived through central metadata and `canViewNavItem`; hiding a link is never treated as authorization.

| ID | File path | Label(s) | Target | Protection | Surface | Visibility role | Mismatch | Security | UX | Required action | Review |
|---|---|---|---|---|---|---|---|---|---|---|---|
| NP-001 | client/src/config/navigation/*; constants/navigation.js | Admin Overview | /admin | admin protected | admin | admin | none | low | low | retain and test | no |
| NP-002 | client/src/config/navigation/*; constants/navigation.js | Challenges | /admin/challenges | admin protected | admin | admin | none | low | low | retain and test | no |
| NP-003 | client/src/config/navigation/*; constants/navigation.js | Proof Reviews | /admin/proofs | admin protected | admin | admin | none | low | low | retain and test | no |
| NP-004 | client/src/config/navigation/*; constants/navigation.js | Providers | /admin/providers | admin protected | admin | admin | none | low | low | retain and test | no |
| NP-005 | client/src/config/navigation/*; constants/navigation.js | Reports | /admin/reports | admin protected | admin | admin | none | low | low | retain and test | no |
| NP-006 | client/src/config/navigation/*; constants/navigation.js | Settings | /admin/settings | admin protected | admin | admin | none | low | low | retain and test | no |
| NP-007 | client/src/config/navigation/*; constants/navigation.js | Users | /admin/users | admin protected | admin | admin | none | low | low | retain and test | no |
| NP-008 | client/src/config/navigation/*; constants/navigation.js | Billing | /billing | authenticated protected | dashboard | authenticated | none | low | low | retain and test | no |
| NP-009 | client/src/config/navigation/*; constants/navigation.js | Blog | /blog | public | resources | public | none | low | low | retain and test | no |
| NP-010 | client/src/config/navigation/*; constants/navigation.js | Case Studies | /case-studies | public | resources | public | none | low | low | retain and test | no |
| NP-011 | client/src/config/navigation/*; constants/navigation.js | Challenges | /challenges | public | public | public | none | low | low | retain and test | no |
| NP-012 | client/src/config/navigation/*; constants/navigation.js | Client Overview | /client | client protected | client | client | none | low | low | retain and test | no |
| NP-013 | client/src/config/navigation/*; constants/navigation.js | Active Work | /client/active | client protected | client | client | none | low | low | retain and test | no |
| NP-014 | client/src/config/navigation/*; constants/navigation.js | My Challenges | /client/challenges | client protected | client, dashboard | client | none | low | low | retain and test | no |
| NP-015 | client/src/config/navigation/*; constants/navigation.js | Find Providers | /client/providers | client protected | client, dashboard | client | none | low | low | retain and test | no |
| NP-016 | client/src/config/navigation/*; constants/navigation.js | Settings | /client/settings | client protected | client | client | none | low | low | retain and test | no |
| NP-017 | client/src/config/navigation/*; constants/navigation.js | Contact | /contact | public | company | public | none | low | low | retain and test | no |
| NP-018 | client/src/config/navigation/*; constants/navigation.js | Overview / Dashboard | /dashboard | authenticated protected | provider, dashboard | authenticated | wrong role visibility / roleless target ambiguity | medium | high | approve dashboard root role semantics | yes |
| NP-019 | client/src/config/navigation/*; constants/navigation.js | Matched Challenges | /dashboard/challenges | provider protected | provider, dashboard | provider | none | low | low | retain and test | no |
| NP-020 | client/src/config/navigation/*; constants/navigation.js | First Client Mode | /dashboard/first-client | provider protected | dashboard | provider | none | low | low | retain and test | no |
| NP-021 | client/src/config/navigation/*; constants/navigation.js | Outcome Offers | /dashboard/offers | provider protected | provider, dashboard | provider | none | low | low | retain and test | no |
| NP-022 | client/src/config/navigation/*; constants/navigation.js | Opportunities / Opportunity Pipeline | /dashboard/opportunities | provider protected | provider, dashboard | provider | none | low | low | retain and test | no |
| NP-023 | client/src/config/navigation/*; constants/navigation.js | Execution Plans | /dashboard/plans | provider protected | dashboard | provider | none | low | low | retain and test | no |
| NP-024 | client/src/config/navigation/*; constants/navigation.js | Profile | /dashboard/profile | provider protected | provider | provider | none | low | low | retain and test | no |
| NP-025 | client/src/config/navigation/*; constants/navigation.js | Proof Vault | /dashboard/proof-vault | provider protected | provider, dashboard | provider | none | low | low | retain and test | no |
| NP-026 | client/src/config/navigation/*; constants/navigation.js | Settings | /dashboard/settings | provider protected | provider | provider | none | low | low | retain and test | no |
| NP-027 | client/src/config/navigation/*; constants/navigation.js | Workspace | /dashboard/workspace | client protected | dashboard | client | none | low | low | retain and test | no |
| NP-028 | client/src/config/navigation/*; constants/navigation.js | Help Center | /help | public | resources | public | none | low | low | retain and test | no |
| NP-029 | client/src/config/navigation/*; constants/navigation.js | Leaderboard / Reputation Engine | /leaderboard | public | public, product | public | none | low | low | retain and test | no |
| NP-030 | client/src/config/navigation/*; constants/navigation.js | Messages | /messages | authenticated protected | dashboard | authenticated | none | low | low | retain and test | no |
| NP-031 | client/src/config/navigation/*; constants/navigation.js | Notifications | /notifications | authenticated protected | dashboard | authenticated | none | low | low | retain and test | no |
| NP-032 | client/src/config/navigation/*; constants/navigation.js | Pricing | /pricing | public | public | public | none | low | low | retain and test | no |
| NP-033 | client/src/config/navigation/*; constants/navigation.js | Privacy | /privacy | public | company | public | none | low | low | retain and test | no |
| NP-034 | client/src/config/navigation/*; constants/navigation.js | Profile | /profile | authenticated protected | dashboard | authenticated | none | low | low | retain and test | no |
| NP-035 | client/src/config/navigation/*; constants/navigation.js | Proof | /proof | authenticated protected | dashboard | authenticated | none | low | low | retain and test | no |
| NP-036 | client/src/config/navigation/*; constants/navigation.js | Proof System / Verified Outcomes | /proof-ledger | public | resources, product | public | none | low | low | retain and test | no |
| NP-037 | client/src/config/navigation/*; constants/navigation.js | Providers | /providers | public | public | public | none | low | low | retain and test | no |
| NP-038 | client/src/config/navigation/*; constants/navigation.js | Guides | /resources | public | resources | public | none | low | low | retain and test | no |
| NP-039 | client/src/config/navigation/*; constants/navigation.js | Saved | /saved | authenticated protected | dashboard | authenticated | none | low | low | retain and test | no |
| NP-040 | client/src/config/navigation/*; constants/navigation.js | Settings | /settings | authenticated protected | dashboard | authenticated | none | low | low | retain and test | no |
| NP-041 | client/src/config/navigation/*; constants/navigation.js | Terms | /terms | public | company | public | none | low | low | retain and test | no |
| NP-042 | client/src/config/navigation/*; constants/navigation.js | Trust & Safety | /trust-safety | public | resources | public | none | low | low | retain and test | no |

## Hardcoded Or Distributed Route Consumers

These 16 groups are inherited from the verified Prompt 1/2 navigation inventory. They require deeper consumer-level verification before any navigation or guard edit.

| ID | File | Context | Target(s) | Type | Constant | Declared | Protection | Risk | Action | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| HN-001 | `components/AdminGate.jsx` | admin forgot-password/home | `/forgot-password?role=admin`, `/` | CTA | no | yes | auth/admin component | medium; component appears unreferenced | verify reachability; do not delete | high |
| HN-002 | `components/SaaSLayout.jsx` | back fallback | `/dashboard` | module internal | no | yes | protected target | medium | verify active use |  |
| HN-003 | `features/dashboard/dashboardContent.js` | dashboard quick actions | `/providers`, `/projects`, `/messages`, `/profile`, `/marketplace` | dashboard CTA | no | yes | mixed | high | migrate only after role/metadata audit |  |
| HN-004 | `features/profile/profileOnboarding.js` | step builder | `/dashboard/profile/onboarding/${step}` | dynamic | no | yes pattern | provider | high | compare with route builder |  |
| HN-005 | `pages/Account.jsx` | login/home redirect | `/login`, `/` | CTA/redirect | no | yes | mixed | high | replace in future plan |  |
| HN-006 | `pages/Admin.jsx` | admin cards/actions | five `/admin/*` paths | admin nav | no | yes | admin | high; page appears unreferenced | verify reachability |  |
| HN-007 | `pages/Auth.jsx` | auth path detection/redirect | `/register`, `/forgot-password`, `/reset-password`, `/dashboard`, `/admin`, `/login`, `/` | auth/redirect | no | yes | mixed | critical if reachable; appears unreferenced | prove dead/live before action |  |
| HN-008 | `pages/Marketplace.jsx` | marketplace/category/provider/projects/login CTAs | multiple declared targets | public/CTA | no | yes | mixed | high | inventory exact consumers in Prompt 2 |  |
| HN-009 | `pages/Profile.jsx` | settings/dashboard/public URL | `/settings`, `/dashboard`, `/profile/${username}` | CTA/dynamic | no | yes | protected/public | high | compare public-profile builder semantics |  |
| HN-010 | `pages/ServiceDetail.jsx` | login/messages redirects | `/login`, `/messages?conversation=...` | redirect | no | yes | auth-sensitive | critical | migrate only after redirect contract |  |
| HN-011 | `pages/Connections.jsx` | network fallback/messages redirect | `/network`, `/messages` | link/redirect | no | yes | protected | high | future constant migration |  |
| HN-012 | `pages/Saved.jsx` | service detail | `/marketplace/service/${service.slug}` | dynamic link | no | shape only | public | high; route param is named `serviceId` | human semantic review |  |
| HN-013 | `sections/CTASection.jsx`, `Services.jsx`, `Blogs.jsx`, `PortfolioPreview.jsx` | marketing CTAs | `/contact`, `/services`, `/portfolio` | public CTA | no | yes | public | medium | batch after audit |  |
| HN-014 | `sections/MarketplacePreview.jsx` | marketplace/provider-services/category CTAs | three route families | public CTA | no | yes | mixed | high | compare dynamic builder |  |
| HN-015 | `config/navigation/clientNavigation.js` | legacy active pattern | `/dashboard/client` | role nav | no | yes | client | medium; compatibility | document retention/removal criteria |  |
| HN-016 | `utils/routeValidation.js` | auth prefix detection | `/login`, `/register` | guard utility | no | yes | auth | high | centralization blocker |  |

## Result

- Configured navigation: **42/42** unique enabled targets resolve.
- Material mismatch: provider navigation points to roleless `/dashboard`; current component dispatch may be intended, but policy approval is absent.
- Admin, client, and explicit provider links align with role metadata where metadata exists.
- Thirty-four route leaves lack metadata; eight are parent-auth-only dashboard routes, so deep-link and hidden-route parity is incomplete.
- No navigation visibility or target was modified.
