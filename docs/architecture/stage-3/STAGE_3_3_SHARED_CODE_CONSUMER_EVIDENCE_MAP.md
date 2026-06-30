# Stage 3.3 Shared-Code Consumer Evidence Map

Counts are repository files with visible imports/usages after excluding the candidate's own implementation and barrel where applicable.

| Candidate | Shared path / item | Known consumers | Consumer module/system | Count | Confidence | Meets 2-real-consumer rule | Product-agnostic | Recommendation |
|---|---|---|---|---:|---|---|---|---|
| CAND-001 | `client/src/components/ui/` | Routes, pages, feature components, dashboard/admin, public marketing sections | Multiple modules plus platform/public surfaces | 74 | high | yes | partial as a folder | Approve generic subset with caution; isolate platform exceptions |
| CAND-002 | Form primitives in UI | Login/register/reset/profile, offers, opportunities, challenges, providers | Auth, profile, offers, challenges, provider/public surfaces | 15 | high | yes | yes | Approve existing subset with caution |
| CAND-003 | Loading/empty/error/skeleton primitives | Route guards, pages, dashboards, feature components | Platform routing plus multiple modules | 39 | high | yes | yes when copy/actions stay caller-owned | Approve existing subset with caution; compare `components/states` overlap |
| CAND-004 | Accessibility helpers | No dedicated helper or import path detected | None verified | 0 | high | no | unknown | Keep candidate-only; do not scaffold |
| CAND-005 | Formatting utilities | Pages, admin, dashboard, profile, providers, opportunities, first-client, proof, plans | Multiple modules/platform surfaces | 2+ | high | yes | mostly yes | Keep candidate-only pending owner/tests |
| CAND-006A | `formatDate.js` | Pages, dashboard, admin, proof, plans, workspace, providers | Multiple modules/platform surfaces | 32 | high | yes | yes | File-level candidate only pending tests |
| CAND-006B | `formatCurrency.js` | Marketplace/pages, admin, opportunities, first-client, profile/provider UI | Multiple modules | 8 | high | yes | yes | File-level candidate only pending tests/payment-display review |
| CAND-006C | `formatNumber.js` | Admin, dashboards, workspace, provider/challenge components | Multiple modules/platform surfaces | 9 | high | yes | yes | File-level candidate only pending tests |
| CAND-007 | `client/src/utils/validators.js` | Only `utils/index.js` export found | No real runtime consumer verified | 0 | high | no | unknown | Block shared validation approval |
| CAND-008 | `client/src/types/` | Route metadata, profile config/pages, access/route utilities, profile feature | Platform routing/access and profile module | 12 | high | yes numerically | no as a folder | Keep platform/module-owned; block shared folder status |
| CAND-009 | `client/src/services/shared/` | Challenges, saved providers, admin, opportunities, first-client, matches, plans, offers, proof assets, providers, dashboard | 11 feature services | 11 | high | yes | yes | Approve current neutral helper surface with caution |
| CAND-009A | `buildQueryString` | Ten feature services plus service export surface | Multiple modules | 10 | high | yes | yes | Approved helper with caution |
| CAND-009B | `mapItemsResponse` | Eight feature services | Multiple modules | 8 | high | yes | yes | Approved helper with caution |
| CAND-009C | `mapCollectionItems` | Dashboard service | Dashboard only | 1 | high | no alone | yes | Retain under approved helper folder because sibling contract is established; do not generalize further |
| CAND-010 | `DESIGN_TOKENS` JavaScript export | No direct JavaScript consumer found; CSS custom properties are broadly used | Platform design system | 0 direct JS | high | not applicable | yes | Keep platform-owned; review duplicate token sources separately |
| CAND-011 | Shared test helpers | No test scripts, test files, or imports | None | 0 | high | no | unknown | Block |
| CAND-012 | `docs/architecture/` governance | Referenced by Stage 1-3 prompts, locks, manifests, trackers | All architecture work | platform-level reason | high | not applicable | platform-specific by design | Approve docs-only governance, not runtime shared code |

## Evidence Limits

- Consumer counts demonstrate reuse, not ownership by themselves.
- Dynamic imports or unused exports may escape static text search; uncertain cases remain candidate-only.
- The generic hook exports have zero visible consumers and therefore fail the two-consumer rule.

