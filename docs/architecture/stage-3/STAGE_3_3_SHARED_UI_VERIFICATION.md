# Stage 3.3 Shared UI Verification

| ID | Path / component group | Correct owner | Product-agnostic | Consumer count | Sensitive behavior | Approval status | Risk | Future action |
|---|---|---|---|---:|---|---|---|---|
| UIV-001 | `Badge`, `Button`, `Card` family | approved shared UI | yes | 64 UI-import files across basic control group | no detected | approved with caution | Public API/accessibility regressions | Retain; gate changes and add tests |
| UIV-002 | `Input`, `Select`, `Textarea`, `Checkbox`, `FormField` | approved shared UI | yes | 15 UI-import files | no auth ownership detected; password reveal is local UI | approved with caution | Form/accessibility behavior affects many flows | Retain; caller owns workflow/validation |
| UIV-003 | `LoadingState`, `EmptyState`, `ErrorState`, loaders/skeletons | approved shared UI | yes when caller owns copy/action | 39 UI-import files | no detected | approved with caution | Overlap with `components/states` | Compare semantics before consolidation |
| UIV-004 | `Modal`, `Tooltip`, `Spinner`, `Skeleton` | approved shared UI | yes | 2+ via UI consumers | no detected | approved with caution | Focus/portal/accessibility regressions | Retain and validate accessibility |
| UIV-005 | `Container`, `Section`, `SectionHeader` | candidate shared UI | mostly | 2+ | no detected | candidate only | Marketing/layout semantics may over-generalize | Verify consumers and platform layout boundary |
| UIV-006 | `BackgroundVideo` | public marketing/shared candidate | partial | unknown | no auth/payment/admin behavior | candidate only | Atmospheric/public behavior may not be generic | Keep in place; no new shared use without proof |
| UIV-007 | `Breadcrumbs` | platform routing UI | no | multiple platform/page consumers | route/location behavior | blocked as generic shared | Route governance hidden in shared UI | Treat as platform exception |
| UIV-008 | `PageHeader` | platform page-shell UI | partial | multiple pages | route metadata/location behavior | blocked as generic shared | Page-shell policy duplicated | Treat as platform exception |
| UIV-009 | `UniversalBackButton` | platform navigation UI | no | multiple pages/common alias | route fallback/navigation behavior | blocked as generic shared | Navigation source-of-truth dilution | Treat as platform exception |
| UIV-010 | `components/common/PageHeader.jsx`, `BackButton.jsx`, `Footer.jsx` | platform compatibility/public layout | no | common consumers | routing/layout behavior | suspicious shared | Aliases obscure source-of-truth | Freeze; no new common aliases |
| UIV-011 | Common placeholder components | module/public surface | no | page consumers | fake/placeholder workflow semantics | blocked | Placeholder becomes shared production truth | Keep surface-owned and classify data source |
| UIV-012 | Domain cards/forms under `components/*` and features | module-owned UI | no | module-specific | may include admin/payment/profile/proof behavior | keep module-owned | Promotion couples shared UI to feature data | Use shared primitives through props only |
| UIV-013 | Styling and design-token sources | ScaleOps platform design system | platform-wide | CSS variables broadly used; direct JS token consumers 0 | no business logic | platform-owned, not shared | Parallel token authorities may drift | Design-system review only |

## UI Result

- Approved with caution: product-agnostic primitive subset already in `components/ui`.
- Blocked from generic shared status: route-aware header/breadcrumb/back behavior, common aliases/placeholders, and module compositions.
- No shared UI component imports module services or API adapters.

