# Stage 4.3 Redirect and 404 Gap Register

| Gap ID | Gap | Severity | Blocks hardening | Human review |
|---|---|---|---|---|
| R4G-001 | No canonical denial priority across guards/layouts/policy | high | yes | yes |
| R4G-002 | Unknown-role destination varies by caller | high | yes | yes |
| R4G-003 | Internal full-page redirects are hardcoded | medium | yes for migration | no |
| R4G-004 | Attempted-location state is not preserved by layouts/page redirects | medium | yes | yes |
| R4G-005 | /offers has no declaration | high | yes | yes |
| R4G-006 | Dynamic service ID/slug semantics unresolved | high | yes | yes |
| R4G-007 | No redirect-loop/history regression suite | high | yes | no |
| R4G-008 | Explicit versus wildcard NotFound URL policy unapproved | medium | yes | yes |
| R4G-009 | Legacy redirect reachability unknown | medium | yes for cleanup | yes |
| R4G-010 | Browser and API 404 domains need explicit separation | high | no for docs | no |

