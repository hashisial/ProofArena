# Stage 3.3 Shared Hook, Utility, and Type Verification

| ID | Path / item | Category | Correct owner | Product-agnostic | Platform-sensitive | Module-specific | Duplicate type risk | Approval status | Future action | Human review |
|---|---|---|---|---|---|---|---|---|---|---|
| HUT-001 | Seven generic exports in `client/src/hooks/index.js` | hook | candidate shared | yes by source semantics | `useLocalStorage`/media/browser side effects | no detected | n/a | candidate only | Require two consumers and tests | yes for approval |
| HUT-002 | `useAsync`, click/copy/debounce/localStorage/media/toggle | hook | candidate shared | yes | browser/storage behavior | no detected | n/a | candidate only; zero visible consumers | Keep frozen | no |
| HUT-003 | `useSidebarState.js`, `useRoutePath.js` | hook | platform-owned | no | yes, UI store/router | no | n/a | blocked as shared | Keep platform-governed | yes |
| HUT-004 | `useAuth.js` | hook | platform auth bridge | no | critical auth/session | auth surface | n/a | blocked | Freeze; preserve auth authority | yes |
| HUT-005 | `useMyDashboard.js`, `useMyProfile.js` | hook | dashboard/profile module bridge | no | auth/query context may apply | yes | n/a | blocked | Trace consumers; tested future migration | yes |
| HUT-006 | Admin/lead/outreach/subscription/blog/service hooks | hook | respective module/platform | no | admin/payment/API behavior | yes | n/a | blocked | Assign owner by use case | yes |
| HUT-007 | `formatDate.js`, `formatCurrency.js`, `formatNumber.js` | formatter | candidate shared | yes | currency display needs payment caution | no | n/a | candidate only | Add locale/edge tests and owner | yes |
| HUT-008 | `formatFileSize`, `getInitials`, `slugify`, `truncateText`, copy helper | utility | candidate shared | likely | low | no detected | n/a | candidate only | Verify two consumers per item | no |
| HUT-009 | `cn.js` | utility | approved lower-level shared candidate | yes | no | no | n/a | approved with caution as existing UI dependency | Keep pure and stable | yes for public move |
| HUT-010 | Access/route/navigation helpers | utility/constant | platform-owned | no | critical route/role policy | no | n/a | blocked as shared | Preserve platform source-of-truth | yes |
| HUT-011 | `storage.js` | utility | platform utility | generic mechanics, platform policy | persistence/security implications | no | n/a | blocked as generic shared pending policy | Keep platform-owned | yes |
| HUT-012 | Challenge/proof/provider/profile readiness/actions | utility | module-owned | no | route/permission interactions possible | yes | n/a | blocked | Future module migration with tests | yes |
| HUT-013 | `utils/validators.js` | validation | unknown/candidate | unknown | validation authority unclear | unknown | n/a | blocked; zero real consumers | Inventory rules and backend authority | yes |
| HUT-014 | `types/auth.js`, `access.js`, `routes.js`, `navigation.js` | type/constant | platform-owned | platform-wide, not generic | critical identity/role/route | no | high if duplicated | blocked as shared library | Keep authoritative platform contracts | yes |
| HUT-015 | `types/profile.js`, profile readiness types | type/constant | profile module | no | privacy/role references | yes | high | blocked | Establish profile contract owner | yes |
| HUT-016 | API/route/nav/query/design constants | constant | platform-owned | platform-wide | critical platform policy | no | high if duplicated | blocked as shared | Preserve catalogs | yes |
| HUT-017 | Status constants in client/server roots | constant | platform/module mixed | no as a group | auth/role plus domain status | yes in status families | high | blocked | Assign each status family before migration | yes |
| HUT-018 | Shared type library proposal | type | blocked | unknown | identity/payment/API concerns | unknown | critical | blocked | Define generated/authoritative contract strategy first | yes |

## Result

- No root hook, utility, type, or constant folder is approved wholesale.
- Formatting and generic hook files remain candidates only.
- Platform and module semantics are explicitly excluded from shared ownership.

