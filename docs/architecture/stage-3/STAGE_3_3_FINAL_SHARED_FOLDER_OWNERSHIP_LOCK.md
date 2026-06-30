# Stage 3.3 Final Shared Folder Ownership Lock

| ID | Path | Classification | Final owner | Allowed | Forbidden | New shared code | Frozen | Future action | Human review | Blocks Stage 4 | Blocks production edits |
|---|---|---|---|---|---|---|---|---|---|---|---|
| SFL-001 | `client/src/components/ui/` | approved with caution | shared UI plus platform exceptions | Existing generic primitives; gated additions | Module/API/auth/new route behavior | only after gate | exceptions yes | Item-level governance | yes | no | yes for changes |
| SFL-002 | `client/src/components/common/` | suspicious shared code | platform/public/module mixed | Existing compatibility | New shared/business code | no | yes | Classify each file | yes | no | yes |
| SFL-003 | `client/src/components/states/` | suspicious/module-platform UI | current surface owners | Existing states | Blanket shared status | no | yes | Compare UI-state overlap | yes | no | yes |
| SFL-004 | Domain component folders | module-owned | owning modules | Module UI | Platform/shared ownership | no | no | Future tested module migration | yes | no | yes for moves |
| SFL-005 | `client/src/hooks/` | suspicious shared code | mixed | Existing behavior | Blanket shared additions | no | yes | File-level ownership | yes | no | yes |
| SFL-006 | Generic hook files | candidate shared | unassigned shared owner | Existing files | New shared API before proof | no | yes | Await consumers/tests | yes | no | yes |
| SFL-007 | Domain/platform root hooks | module/platform-owned in wrong place | relevant owners | Existing compatibility | Shared promotion | no | yes | Tested migration later | yes | no | yes |
| SFL-008 | `client/src/utils/` | suspicious shared code | mixed | Existing file responsibilities | Blanket shared status | no | yes | File-level classification | yes | no | yes |
| SFL-009 | Formatter/string files | candidate shared | unassigned shared utility owner | Existing pure behavior | Domain/platform behavior | no expansion | yes | Tests and owner | yes | no | yes |
| SFL-010 | Route/access/navigation/storage utils | platform-owned in broad root | ScaleOps platform | Existing policy | Shared/module copies | no | yes | Preserve | yes | no | yes |
| SFL-011 | Domain readiness/action utils | module-owned in wrong place | owning modules | Existing domain behavior | Shared promotion | no | yes | Tested migration | yes | no | yes |
| SFL-012 | `client/src/types/` | suspicious shared code | platform/profile mixed | Existing contracts | New generic sensitive types | no | yes | Establish contract authority | yes | no | yes |
| SFL-013 | `client/src/constants/` | platform/mixed | ScaleOps platform plus domain owners | Existing catalogs | Duplicate shared route/API/role/constants | no | yes | Assign status families | yes | no | yes |
| SFL-014 | `client/src/services/shared/` | approved with caution | shared helper governance | Existing pure helpers; gated additions | Transport/domain/auth/config | only after gate | no | Tests before expansion | yes | no | yes for changes |
| SFL-015 | `client/src/services/apiClient.js` | platform-owned | ScaleOps platform | Canonical transport | Copies/moves to shared/module | no | yes | Protect | yes | no | yes |
| SFL-016 | `client/src/services/api.js` | suspicious shared code | platform/module bridge | Existing compatibility | New global business layer | no | yes | Trace consumers | yes | no | yes |
| SFL-017 | `client/src/lib/` | docs-only | platform governance | README warning | Runtime library without approval | no | yes | Keep docs-only | no | no | yes |
| SFL-018 | `client/src/styles/` and tokens | platform-owned | ScaleOps design system | Global styles/tokens | Shared/module forks | no | yes | Design-system review | yes | no | yes |
| SFL-019 | `server/src/utils/` | suspicious shared code | platform/module mixed | Existing file roles | Whole-root shared status | no | yes | Per-file/security review | yes | no | yes |
| SFL-020 | `server/src/errors/` | platform-owned | ScaleOps backend | Canonical errors | Module copies | no | yes | Preserve | yes | no | yes |
| SFL-021 | `server/src/config/` | platform-owned | ScaleOps backend | Config/env/DB interfaces | Shared/module config boundary | no | yes | Preserve | yes | no | yes |
| SFL-022 | `server/src/constants/` | suspicious/mixed | platform/module owners | Existing catalogs | New generic cross-domain constants | no | yes | Assign families | yes | no | yes |
| SFL-023 | `server/src/services/` | module/platform-owned broad root | per-service owner | Existing services | Shared global business layer | no | yes | Dependency/owner map | yes | no | yes |
| SFL-024 | `docs/architecture/` | docs-only | architecture governance | ADRs/locks/manifests/audits | Runtime code/conflicting authority | docs only | no | Maintain indexes | yes | no | yes if authority unclear |
| SFL-025 | Proposed `shared/*` paths | blocked | unknown | none | Runtime/README scaffold implying approval | no | yes | Do not create | yes | no | yes |

Stage 4 documentation may proceed. These ownership issues block affected production edits, not route-governance analysis.

