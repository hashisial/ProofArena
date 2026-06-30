# Stage 4.1 Route Source-of-Truth Verification Matrix

| ID | File | Prompt 1 status | Verified status | Coverage/use | Weakness | Risk/test need | Prompt 3 treatment | Human review |
|---|---|---|---|---|---|---|---|---|
| C-001 | constants/routes.js | primary candidate | strong source-of-truth candidate with gaps | all non-wildcard declarations; router/nav/guards/redirects | aliases, /offers, facade, hardcoded alternatives | high; exhaustive consumer/compatibility tests | plan around this candidate | yes |
| C-002 | routes/AppRoutes.jsx | runtime authority | supporting runtime source | all 108 leaves/layout/guards/404 | not constants owner | critical behavior/deep-link tests | inspect and preserve | yes |
| C-003 | config/routeMetadata.js | supporting incomplete | source candidate with gaps only for policy metadata | 73/107 non-wildcard paths; nav/guards | 34 omissions | critical access/nav tests | inspect deeper; do not use as sole source | yes |
| C-004 | navigation configs | navigation source | supporting source | 42 enabled paths | subset and compatibility literal | nav/role tests | preserve as consumer | no |
| C-005 | accessPolicy.js | policy source | strong supporting guard/redirect source | role/fallback/nav | metadata dependency | role matrix tests | preserve, coordinate | yes |
| C-006 | routeValidation/metadata utils | supporting | supporting source with overlap | group/fallback/breadcrumb | literals and incomplete metadata | helper parity tests | inspect deeper | yes |
| C-007 | ROUTE_MAP/NAVIGATION_SYSTEM docs | supporting docs | stale-supporting source | broad intent | may lag runtime | doc reconciliation | do not use as authority | no |
| C-008 | server API registries | excluded API authority | separate source | API only | overlapping versions | API tests | do not merge | yes |

No final route source-of-truth is declared. Prompt 3 may plan around C-001 with C-002/C-005 as behavior constraints.

