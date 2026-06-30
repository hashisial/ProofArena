# Component Ownership Contract

1. Module components are feature-specific and remain inside the owning module after approved migration.
2. Generic visual primitives remain under shared UI governance; a module cannot copy or redefine them as a private design system.
3. Page-level route shells, public/auth layouts, dashboard/client/admin shells, sidebars, topbars, headers, and footers remain platform-owned.
4. Presentational components receive data/actions through props or approved module hooks; container components may compose same-module hooks/services only.
5. Components cannot instantiate API clients, own base/token/error logic, or call backend endpoints directly when an approved hook/service exists.
6. Components cannot make global auth/session/role decisions. UI visibility hints must be backed by shared guards and backend enforcement.
7. Components cannot own route declarations, redirects, navigation registries, or dashboard configuration.
8. Cross-module component reuse requires promotion through the shared-code approval gate, not direct private imports.
9. Required tests: rendering, accessibility, loading/error/empty states, permissions as presentation only, and interaction behavior.
10. Stop on shared/platform duplication, private cross-module import, business logic leakage, or missing owner.

## Prompt 4 Category Lock

| ID | Category/owner | Allowed location | Forbidden location | Shared promotion/stay rule | Import and token rule | Risk | Validation |
|---|---|---|---|---|---|---|---|
| CC-01 | Module-specific/module | Approved module `components` after migration; current domain component path meanwhile | Shared UI, layouts, navigation | Stay module-owned while domain language/behavior exists | Same-module public dependencies; use platform tokens | High coupling | Render, a11y, dependency tests |
| CC-02 | Shared UI/shared governance | `client/src/components/ui` or approved common boundary | Feature/module internals | Promote only with 2+ consumers and no product assumptions | No module/API/auth imports; platform tokens only | High leakage | Consumer, a11y, visual tests |
| CC-03 | Layout/platform | `client/src/layouts` | Any module | Never module-owned | May compose route/auth/platform APIs | Critical shell duplication | Route/nesting/responsive tests |
| CC-04 | Dashboard shell/platform | Dashboard shell/layout components | Domain module | Module dashboard cards may stay module-owned; shell never moves | Shell may call public module hooks only | Critical policy duplication | Role/responsive/loading tests |
| CC-05 | Navigation/sidebar/platform | Navigation configs/components/sidebar core | Any module | Never promoted from module as architecture | Uses route constants/auth public APIs | Critical nav divergence | Link/role/mobile tests |
| CC-06 | Form/module | Owning module component path after approval | Shared unless generic field primitive | Domain schema keeps form module-owned | Calls module hooks; shared controls/tokens | Medium logic leakage | Validation/error/submit tests |
| CC-07 | Data display/module or shared UI | Module for domain cards/tables; shared for neutral primitives | Platform shell unless composition | Domain labels/actions stay module-owned | Props/public types; no raw API | Medium coupling | States, formatting, a11y tests |
| CC-08 | Empty/loading/error/shared primitive plus module composition | Shared primitive and module-specific composition | Global error policy inside module | Generic shell shared; domain copy/actions module-owned | Uses platform error contracts/tokens | High false behavior | Error/empty/loading tests |
| CC-09 | Admin/admin module under platform | Admin domain components under existing admin feature | Shared UI or platform shell for domain logic | Generic primitives shared; moderation stays admin | Uses admin hooks/public contracts/roles | Critical privilege leakage | Negative-access/audit tests |
| CC-10 | Public marketing/public marketing | Home sections/public pages | Target business module unless true product feature | Marketing composition stays public-owned | Public data only; public layout/tokens | Medium boundary confusion | Public/privacy/responsive tests |

Module components never declare routes, own auth/session, instantiate clients, or bypass hooks/services.
