# ProofArena Surface Dependency Map

Legend: Y = confirmed dependency; N = not applicable; U = unknown. “Backend” means a route/controller/service/model chain is known.

| ID | Surface (type/path) | Route | Layout | Auth | API client | Backend | Shared | Data | Reused system | Duplicate/drift risk | Notes |
|---|---|---:|---:|---:|---:|---:|---:|---|---|---|---|
| FS-01 | Home, public page, `pages/Home.jsx` | Y | Y | N | Y | Y | Y | Mixed | Public router/layout/API | Low | Static and API sections. |
| FS-02 | Marketplace, public page, `pages/Marketplace.jsx` | Y | Y | N | Y | Y | Y | API/fallback | Router/API | Medium | Fallback must stay explicit. |
| FS-03 | Providers, public page/feature | Y | Y | N | Y | Y | Y | API | Provider API | Low | Shared query client. |
| FS-04 | Compare, public page/component | Y | Y | N | Y | Y | Y | API/local | Router/state | Medium | Local comparison state is not a store clone. |
| FS-05 | Public profile, public page/shell | Y | Y | N | Y | Y | Y | API/partial | Profile/provider API | Medium | Route-shell ownership mixed. |
| FS-06 | Public challenges, public pages | Y | Y | N | Y | Y | Y | API | Challenge API | Low | Public data contract. |
| FS-07 | Challenge management, dashboard pages | Y | Y | Y | Y | Y | Y | API | Client/provider shells | High | Role-sensitive. |
| FS-08 | Execution plans, dashboard pages | Y | Y | Y | Y | Y | Y | API | Dashboard/guards | High | Provider workflow. |
| FS-09 | Client plan review, client pages | Y | Y | Y | Y | Y | Y | API | Client shell/role guard | High | Client role. |
| FS-10 | Outcome offers, mixed pages | Y | Y | Y | Y | Y | Y | API | Router/API/guards | High | Public and protected paths. |
| FS-11 | Opportunities, dashboard page | Y | Y | Y | Y | Y | Y | API | Dashboard/API | High | Provider role. |
| FS-12 | Matching, dashboard page/feature | Y | Y | Y | Y | Y | Y | API | Guards/API | High | Client/provider states. |
| FS-13 | Proof Vault, dashboard page/feature | Y | Y | Y | Y | Y | Y | API | Auth/storage/API | High | Sensitive proof data. |
| FS-14 | Proof detail, dashboard page | Y | Y | Y | Y | Y | Y | API | Router/API | High | Asset authorization. |
| FS-15 | Proof ledger, route-shell page | Y | Y | N | U | U | Y | Placeholder | Public shell | High | Not a verified ledger backend. |
| FS-16 | Leaderboard, shell/preview | Y | Y | N | U | U | Y | Static/placeholder | Public shell | Medium | Do not imply live ranking. |
| FS-17 | First-client mode, dashboard feature | Y | Y | Y | Y | Y | Y | Mixed | Dashboard/API | High | Onboarding workflow. |
| FS-18 | Starter challenges, dashboard page | Y | Y | Y | Y | Y | Y | API | Dashboard/API | Medium | Provider access. |
| FS-19 | Saved providers, client feature | Y | Y | Y | Y | Y | Y | API | Client shell/API | Medium | Client ownership. |
| FS-20 | Client workspace, dashboard pages | Y | Y | Y | Y | Y | Y | Mixed | Client shell/guards | Critical | Shell/role coupling. |
| FS-21 | Provider dashboard, dashboard pages | Y | Y | Y | Y | Y | Y | Mixed | Dashboard shell/guards | Critical | Do not create second shell. |
| FS-22 | Admin moderation, admin pages | Y | Y | Y | Y | Y | Y | API/partial | Admin shell/guard | Critical | Admin security. |
| FS-23 | Messages, dashboard page | Y | Y | Y | Y | Y | Y | API/socket | Shared messaging | High | Platform-owned channel. |
| FS-24 | Payments, dashboard page | Y | Y | Y | Y | Y | Y | API/partial | Shared billing | Critical | Payment controls. |
| FS-25 | Marketing resources, shell pages | Y | Y | N | N/U | N/U | Y | Static/placeholder | Public shell | Medium | Content completion varies. |
| FS-26 | Public navigation, config | Y | Y | N | N | N | Y | Static | Navigation governance | High | One nav source. |
| FS-27 | Route constants, config | Y | N | N | N | N | Y | Static | Route governance | Critical | Do not fork. |
| FS-28 | Endpoint constants, config | N | N | N | Y | Y | Y | Static | API governance | High | Contract catalog. |
| FS-29 | Module hook, hook | N | N | Y | N | N | Y | Local state | Shared store | Medium | Identity/role preference only. |
| FS-30 | Challenge endpoint chain | N | N | Y | N | Y | Y | Database | Express/auth/DB | High | Full backend chain. |
| FS-31 | Plan endpoint chain | N | N | Y | N | Y | Y | Database | Express/auth/DB | High | Full backend chain. |
| FS-32 | Match endpoint chain | N | N | Y | N | Y | Y | Database | Express/auth/DB | High | Full backend chain. |
| FS-33 | Offer endpoint chain | N | N | Y | N | Y | Y | Database | Express/auth/DB | High | Full backend chain. |
| FS-34 | Proof endpoint chain | N | N | Y | N | Y | Y | Database/storage | Express/auth/storage | Critical | Sensitive data. |
| FS-35 | Provider endpoint chains | N | N | Y | N | Y | Y | Database | Express/auth/DB | High | Public/private split. |
| FS-36 | Opportunity endpoint chain | N | N | Y | N | Y | Y | Database | Express/auth/DB | High | Provider ownership. |
| FS-37 | Saved-provider endpoint chain | N | N | Y | N | Y | Y | Database | Express/auth/DB | Medium | Client ownership. |
| FS-38 | First-client endpoint chain | N | N | Y | N | Y | Y | Database | Express/auth/DB | High | Provider state. |
| FS-39 | Backend module boundary, docs-only | N | N | N | N | N | N | Docs-only | Architecture governance | Low | No executable second server. |
| FS-40 | Fallback/placeholder sources | U | U | U | Y/U | U | Y | Static/fallback | Shared UI/API | High | Classification required. |

