# Stage 3.3 Final Shared UI Lock

| ID | Category | Final owner | Allowed location | Forbidden location | Product-neutral / consumer rule | Styling rule | Data/API restriction | Auth restriction | Promotion rule | Stop condition |
|---|---|---|---|---|---|---|---|---|---|---|
| UIL-001 | UI primitives | shared UI | Existing `components/ui` subset | Module services/platform router | Product-agnostic; 2 consumers | Approved ScaleOps tokens | Props/callbacks only; no transport | No session/role ownership | All promotion gates | Module/platform logic appears |
| UIL-002 | Form primitives | shared UI | Existing UI folder | Shared business forms | Generic fields; 2 consumers | Approved tokens/accessibility | No submission/API workflow | No auth workflow ownership | Form/accessibility tests | Domain validation/workflow embedded |
| UIL-003 | Loading/empty/error states | shared UI with caution | Existing UI folder | Module services/router | Generic; caller owns copy/action | Approved tokens | No fetch/refetch ownership | No access decisions | Compare duplicate states | State owns navigation/data |
| UIL-004 | Badges/cards/tables/modals | shared UI | Existing UI folder | Domain component folders only for primitives | Generic API; 2 consumers | Approved tokens/accessibility | No module data imports | No sensitive behavior | Consumer/API tests | Mode flags encode modules |
| UIL-005 | Public marketing UI | platform/public marketing | Existing public sections/pages | Generic shared library | Brand/page composition need not be generic | Platform design system | No hidden API client | No session behavior | Promote only primitives | Brand composition generalized |
| UIL-006 | Dashboard shell UI | platform | Existing dashboard/layout paths | Shared/module folders | Platform-owned regardless of reuse | Platform tokens/layout | Shell owns approved composition only | Platform guards | Never module-promoted | New shell/sidebar appears |
| UIL-007 | Navigation/sidebar UI | platform | Existing nav/sidebar paths | Shared UI/module | Route-governed | Platform design system | No module route catalog | Platform role policy | Formal route governance | Duplicate nav/route source |
| UIL-008 | Module-specific UI | owning module | Module components | Shared UI | Feature-specific until promotion passes | May consume tokens/primitives | Module hooks/services/adapters | Consume platform auth interfaces | Full promotion gate | Shared API needs domain props/logic |
| UIL-009 | Admin/payment/auth-sensitive UI | module/platform sensitive owner | Approved sensitive module/platform path | Generic shared UI | Generic primitive only may be shared | Approved tokens | No privileged/payment/auth action in shared | Platform security authority | Human security review | Sensitive behavior hidden |

Absolute locks: shared UI never imports module services, owns business logic, or owns route/auth/API behavior. Dashboard/sidebar/layout remain platform-governed.

