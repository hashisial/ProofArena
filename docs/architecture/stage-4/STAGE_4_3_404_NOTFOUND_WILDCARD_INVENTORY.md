# Stage 4.3 404, NotFound, and Wildcard Inventory

| ID | Source | Path/trigger | Render/target | Status | Risk |
|---|---|---|---|---|---|
| NF-001 | AppRoutes | /not-found constant | NotFound | active explicit route | low |
| NF-002 | AppRoutes terminal route | * | NotFound under PublicLayout | active wildcard | ordering-sensitive |
| NF-003 | ProfileOnboardingStepPage | invalid step | /not-found | active redirect | low with tests |
| NF-004 | accessPolicy | route metadata absent/denied contexts | not-found or other fallback | caller-dependent | medium |
| NF-005 | NotFound page | unknown path | context-aware links | active | metadata/group heuristics |
| NF-006 | Server API fallback | unmatched API | backend 404 response | separate domain | must not be merged |

There is one browser NotFound component and one terminal wildcard declaration. No duplicate browser 404 stack was found.

