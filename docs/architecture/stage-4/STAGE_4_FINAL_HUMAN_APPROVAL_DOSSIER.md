# Stage 4 Final Human Approval Dossier

| ID | System | Question | Recommended default | Final status | Blocks Stage 5 | Blocks production edits |
|---|---|---|---|---|---|---|
| HD-001 | Route constants | Which aliases and keys are canonical? | Preserve current exports | required before production edit | no | yes |
| HD-002 | Route declarations | Is /offers stale, missing, or an alias? | Do not declare or delete it | required before production edit | no | yes |
| HD-003 | Dynamic routes/API | Is marketplace service identity ID or slug? | Preserve current behavior; audit contract | required before production edit | no | yes |
| HD-004 | Protected routes | Which roles may access 16 shared dashboard routes? | Preserve current authenticated access | required before production edit | no | yes |
| HD-005 | Auth/roles | What are support, admin override, and unknown-role rules? | Fail closed; preserve current code | required before production edit | no | yes |
| HD-006 | Redirects | What is canonical denial and redirect priority? | Preserve current destinations | required before production edit | no | yes |
| HD-007 | 404 | Should wildcard retain the unknown URL or redirect to /not-found? | Preserve current render-in-place behavior | optional before Stage 5; required before change | no | yes |
| HD-008 | Legacy files | Are Auth, AdminGate, and RequireRole intentionally retained? | Do not delete | deferred | no | yes for cleanup |
| HD-009 | Validation | Who owns route/role/history regression acceptance? | QA lead plus security reviewer | required before production edit | no | yes |
| HD-010 | API authorization | Which endpoint permissions correspond to frontend route roles? | Audit in Stage 5; do not infer | required before production edit | no | yes |

Human approval required before Stage 5 documentation audit: **no**.  
Human approval required before production edits: **yes**.  
Recommended reviewers: product owner, lead engineer, security reviewer, architecture owner, and QA lead.

