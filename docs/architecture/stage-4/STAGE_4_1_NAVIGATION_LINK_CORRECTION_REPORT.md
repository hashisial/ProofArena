# Stage 4.1 Navigation Link Correction Report

| ID | File/surface | Targets | Prompt 1 class | Corrected class | Constant/hardcoded | Declaration | Protected/role | Broken/duplicate risk | Action | Confidence | Human review |
|---|---|---|---|---|---|---|---|---|---|---|---|
| NC-001 | publicNavigation.js header/dropdowns/mobile/footer | 13 public enabled paths plus disabled future items | central configured nav | verified metadata-derived nav | constants | all found | public | low/intentional reuse | keep | high | no |
| NC-002 | providerNavigation.js | 7 provider paths | provider sidebar | verified with dashboard overview caveat | constants | all found | mixed overview/provider | medium | verify overview role | high | yes |
| NC-003 | clientNavigation.js | 5 client paths | client sidebar | verified with legacy active pattern | constants plus /dashboard/client literal | all found | client | medium | retain until compatibility plan | high | yes |
| NC-004 | adminNavigation.js | 7 admin paths | admin sidebar | verified subset | constants | all found | admin | medium omission risk | document hidden admin routes | high | yes |
| NC-005 | DASHBOARD_NAV_LINKS | 17 mixed paths | shared dashboard | verified metadata-derived | constants | all found | mixed roles | high where metadata lacks role | align after access classification | high | yes |
| NC-006 | hardcoded active pages/components | 72 context occurrences | hardcoded risk | active/legacy/parsing set | no | mostly; dynamic semantics partial | mixed | high | per-file migration map | high | yes |
| NC-007 | breadcrumb helpers | metadata paths/fallback segments | breadcrumb | supporting consumer | constants plus derived segments | partial metadata | mixed | high metadata gap | verify all 34 gaps | high | yes |
| NC-008 | route declarations without nav | hidden/admin/detail/workflow routes | mismatch risk | many are intentionally hidden | mixed | yes | protected/dynamic | unknown until intent set | hidden-route ledger | medium | yes |

All enabled configured links resolve. No link was changed; hardcoded and hidden-route classification blocks implementation.

