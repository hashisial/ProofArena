# Stage 4.1 Route Constants Inventory

## Summary

- `client/src/constants/routes.js` contains 117 group entries representing 108 unique path values.
- Nine values are aliases across groups; they are not duplicate declarations but require compatibility review.
- All 107 explicit non-wildcard browser declarations plus the `/` index path resolve from this registry.
- `/offers` is the only unique constant path not declared as a route; it is currently a dynamic-route base only.
- `client/src/config/routeMetadata.js` defines 73 unique metadata paths with no internal duplicate, but omits 34 declared routes.

| ID | File/export | Keys and values | Scope | Router use | Navigation use | Guard use | Duplicate/alternative evidence | Future status | Risk | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|
| RC-001 | `constants/routes.js` / `PUBLIC_ROUTES` | 23 public/system values | public | yes | yes | yes | `/403`, `/500` alias system keys; `/offers` undeclared | source-of-truth candidate | medium | high |
| RC-002 | same / `AUTH_ROUTES` | 6 auth values | auth | yes | indirect metadata | yes | hardcoded auth paths in active/legacy files | source-of-truth candidate | high | high |
| RC-003 | same / `DASHBOARD_ROUTES` | 36 dashboard values | dashboard | yes | yes | yes | six provider aliases; many hardcoded consumers | source-of-truth candidate | high | high |
| RC-004 | same / `PROVIDER_ROUTES` | 9 values, six aliases to dashboard paths | module/role | yes | yes | metadata/access policy | aliases intentional but governance unclear | supporting alias source | medium | high |
| RC-005 | same / `CLIENT_ROUTES` | 5 client paths | client | yes | yes | yes | `/dashboard/client` active compatibility literal | source-of-truth candidate | medium | high |
| RC-006 | same / `ADMIN_ROUTES` | 12 admin paths | admin | yes | yes | yes | hardcoded admin paths in unused `Admin.jsx` | source-of-truth candidate | high | high |
| RC-007 | same / `SYSTEM_ROUTES` | 4 system values | system | yes | no direct nav | yes | aliases `/403` and `/500` | supporting alias source | medium | high |
| RC-008 | same / `DYNAMIC_ROUTES` | 22 dynamic patterns | global dynamic | yes | builders/components | one invalid-step redirect | onboarding-step alias; dynamic hardcoding remains | source-of-truth candidate | high | high |
| RC-009 | same / `ROUTE_GROUPS` | grouped references | global | no direct declaration | tooling/unknown | unknown | no new literals | supporting source | low | high |
| RC-010 | same / `ROUTE_TREE` | alias of `ROUTE_GROUPS` | global | no observed direct use | tooling/unknown | unknown | naming may imply router authority | duplicate-name candidate, not duplicate paths | medium | high |
| RC-011 | same / `ROUTES` | compatibility facade plus builders | global | yes | widespread | yes | mirrors group exports and builders | compatibility source; preserve | high migration risk | high |
| RC-012 | `config/routeMetadata.js` / `ROUTE_IDS` | 73 IDs | metadata | indirect | yes | yes | IDs do not cover 34 declarations | supporting source | high | high |
| RC-013 | same / `ROUTE_METADATA_LIST`, `ROUTE_METADATA` | 73 unique path records | global policy/navigation | layouts/helpers | primary nav input | access policy | no duplicate metadata paths; 34 missing | supporting policy source | critical if treated complete | high |
| RC-014 | `constants/navigation.js` and `config/navigation/*` | route IDs and metadata-derived links | navigation-only | no | yes | access filter | one hardcoded `/dashboard/client` active pattern | navigation source only | medium | high |
| RC-015 | `utils/routeValidation.js` | route group/fallback checks | guard/redirect utility | no | no | yes | hardcoded `/login`, `/register` prefixes | supporting policy source | medium | high |
| RC-016 | `ROUTE_MAP.md` | documented route map | docs | no | no | no | claims existing centralization; may lag code | supporting documentation | stale-doc risk | medium |

## Alias Values

| Path | Keys |
|---|---|
| `/403` | `PUBLIC_ROUTES.FORBIDDEN`, `SYSTEM_ROUTES.LEGACY_FORBIDDEN` |
| `/500` | `PUBLIC_ROUTES.SERVER_ERROR`, `SYSTEM_ROUTES.SERVER_ERROR` |
| `/dashboard` | `DASHBOARD_ROUTES.DASHBOARD`, `PROVIDER_ROUTES.DASHBOARD` |
| `/dashboard/challenges` | `DASHBOARD_ROUTES.MY_CHALLENGES`, `PROVIDER_ROUTES.CHALLENGES` |
| `/dashboard/offers` | `DASHBOARD_ROUTES.MY_OUTCOME_OFFERS`, `PROVIDER_ROUTES.OFFERS` |
| `/dashboard/opportunities` | `DASHBOARD_ROUTES.OPPORTUNITY_PIPELINE`, `PROVIDER_ROUTES.OPPORTUNITIES` |
| `/dashboard/proof-vault` | `DASHBOARD_ROUTES.PROOF_VAULT`, `PROVIDER_ROUTES.PROOF_VAULT` |
| `/dashboard/settings` | `DASHBOARD_ROUTES.PROVIDER_SETTINGS`, `PROVIDER_ROUTES.SETTINGS` |
| `/dashboard/profile/onboarding/:stepSegment` | `PROVIDER_ROUTES.PROFILE_ONBOARDING_STEP`, `DYNAMIC_ROUTES.PROFILE_ONBOARDING_STEP` |

## Decision

No constants were changed or consolidated. `client/src/constants/routes.js` is a strong primary candidate, but Prompt 2 must verify aliases, the stale `/offers` base, metadata coverage, hardcoded consumers, and compatibility requirements before final lock or migration planning.

