# Stage 4.2 Dashboard, Admin, and Role Protection Gap Analysis

| ID | Routes | Owner | Auth/role/guard | Navigation/constant | Gap | Severity | Action | Blocks centralization | Human review |
|---|---|---|---|---|---|---|---|---|---|
| PG-001 | /client/* (5) | client/platform | auth + client + email parent | client nav/routes | none confirmed | low | preserve | no | no |
| PG-002 | /admin/* (12) | admin/platform | auth + admin + email parent | admin nav/routes | /admin/proof-review metadata absent | medium | add to metadata plan only | yes | yes |
| PG-003 | 37 explicit role dashboard leaves | client/provider/support | auth parent plus leaf role | mixed central nav | none confirmed | low | preserve | no | no |
| PG-004 | 8 role-less metadata-backed dashboard routes | mixed | auth/email plus metadata with no role | dashboard nav | intended cross-role access unproven | high | owner decision | yes | yes |
| PG-005 | /account,/connections,/leads,/network,/payments,/projects,/provider-services,/scraper | unknown/mixed | parent auth/email; metadata absent | mixed hardcoded/hidden | role and permission policy absent from metadata | critical | classify each | yes | yes |
| PG-006 | /dashboard root and /dashboard/challenges | platform dispatch | auth plus component role branches | central | policy repeated outside accessPolicy | high | parity matrix | yes | yes |
| PG-007 | legacy profile/recommended-provider/admin aliases | module/platform | guards vary but present | constants | retention and redirect policy unknown | high | compatibility decision | yes | yes |

Admin/client group protection is present. Centralization and any guard change remain blocked by PG-004 through PG-007.

