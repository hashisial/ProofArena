# Stage 4.3 Broken Route and Fallthrough Risk Audit

| Risk ID | Evidence | Severity | Required action |
|---|---|---|---|
| BR-001 | /offers is a unique constant without a declaration | high | Confirm stale alias or missing route |
| BR-002 | Saved builds marketplace service URL from slug while route names serviceId | high | Confirm identifier contract |
| BR-003 | 34 declarations lack metadata | high | Classify intentional versus missing |
| BR-004 | Eight parent-auth-only routes also lack metadata | high | Resolve role and policy ownership |
| BR-005 | Hardcoded internal full-page redirects bypass route helpers | medium | Migrate only after behavior tests |
| BR-006 | Legacy Auth/Admin files may contain stale destinations | medium | Establish reachability |
| BR-007 | Terminal wildcard depends on order | high | Add ordering regression test |
| BR-008 | Hidden/deep-link-only routes are not formally catalogued | medium | Create approved classification |
| BR-009 | Explicit and wildcard NotFound share component but differ URL | low | Approve canonical URL policy |
| BR-010 | Backend API 404 can be mistaken for browser 404 | high | Preserve separate governance |

