# Stage 1.2 Placeholder Risk Classification

Generated: 2026-06-27

## Classification Counts

| Class | Meaning | Count |
| --- | --- | ---: |
| A | Acceptable temporary placeholders or explicitly disclosed previews | 20 |
| B | Product-risk placeholders or business-looking fallback behavior | 17 |
| C | Architecture-risk placeholders, compatibility shells, routes, storage, or modules | 14 |
| D | Security-risk auth/email/verification placeholders | 3 |
| E | Unknown ownership requiring human/runtime evidence | 6 |
| Total | | 60 |

A placeholder is not automatically defective. The classification is based on whether it can mislead users/developers, distort architecture ownership, or weaken security assumptions.

## Verified Classification

| ID | File path | Placeholder type | Current behavior | Risk class | Severity | Future stage owner | Blocks Stage 1.2 cleanup | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WPH-001 | `client/src/pages/RouteShells.jsx` | Public placeholder: About | Static PublicPlaceholderPage copy | A - Acceptable temporary | S3 | Public content | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-002 | `client/src/pages/RouteShells.jsx` | Public placeholder: Blog | No real blog feed | A - Acceptable temporary | S2 | Content | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-003 | `client/src/pages/RouteShells.jsx` | Public placeholder: How It Works | Workflow preview only | A - Acceptable temporary | S3 | Public content | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-004 | `client/src/pages/RouteShells.jsx` | Public placeholder: Proof Ledger | No live proof-ledger API contract | B - Product risk | S1 | Proof | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-005 | `client/src/pages/RouteShells.jsx` | Public placeholder: Leaderboard | No live leaderboard API contract | B - Product risk | S1 | Reputation | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-006 | `client/src/pages/RouteShells.jsx` | Public placeholder: Resources | Static library preview | A - Acceptable temporary | S3 | Content | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-007 | `client/src/pages/RouteShells.jsx` | Public placeholder: Case Studies | No verified case-study records | B - Product risk | S2 | Proof/content | No | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-008 | `client/src/pages/RouteShells.jsx` | Public placeholder: Help Center | Support foundation copy | A - Acceptable temporary | S2 | Support | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-009 | `client/src/pages/RouteShells.jsx` | Public placeholder: Pricing | No final commercial contract | B - Product risk | S1 | Pricing | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-010 | `client/src/pages/RouteShells.jsx` | Public placeholder: Trust Safety | Trust workflow preview | A - Acceptable temporary | S2 | Trust | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-011 | `client/src/pages/RouteShells.jsx` | Public placeholder: Privacy | Explicit pre-production legal placeholder | B - Product risk | S1 | Legal | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-012 | `client/src/pages/RouteShells.jsx` | Public placeholder: Terms | Explicit pre-production legal placeholder | B - Product risk | S1 | Legal | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-013 | `client/src/pages/RouteShells.jsx` | Public placeholder: Contact | Static route without submission flow | A - Acceptable temporary | S2 | Contact | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-014 | `client/src/pages/RouteShells.jsx` | Dashboard placeholder: My Proof | ModulePlaceholder only | C - Architecture risk | S2 | Proof | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-015 | `client/src/pages/RouteShells.jsx` | Dashboard placeholder: Billing | ModulePlaceholder only | C - Architecture risk | S1 | Payments | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-016 | `client/src/pages/RouteShells.jsx` | Admin placeholder: Proof Review | ModulePlaceholder only | C - Architecture risk | S1 | Admin proof | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-017 | `client/src/pages/RouteShells.jsx` | Admin placeholder: Disputes | ModulePlaceholder only | C - Architecture risk | S1 | Disputes | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-018 | `client/src/pages/RouteShells.jsx` | Admin placeholder: Settings | ModulePlaceholder only | C - Architecture risk | S2 | Admin config | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-019 | `client/src/pages/client/ClientOverview.jsx` | Client placeholder | ClientPagePlaceholder only | C - Architecture risk | S2 | Client dashboard | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-020 | `client/src/pages/client/ClientChallenges.jsx` | Client placeholder | ClientPagePlaceholder only | C - Architecture risk | S2 | Challenges | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-021 | `client/src/pages/client/ClientProviders.jsx` | Client placeholder | ClientPagePlaceholder only | C - Architecture risk | S2 | Provider discovery | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-022 | `client/src/pages/client/ClientActiveWork.jsx` | Client placeholder | ClientPagePlaceholder only | C - Architecture risk | S2 | Active work | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-023 | `client/src/pages/client/ClientSettings.jsx` | Client placeholder | ClientPagePlaceholder only | C - Architecture risk | S2 | Client settings | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-024 | `client/src/pages/ProviderSettingsPlaceholder.jsx` | Provider placeholder | DashboardPagePlaceholder only | C - Architecture risk | S2 | Provider settings | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-025 | `client/src/pages/Admin.jsx` | Legacy admin mock page | Static adminStats/adminActions and placeholder values | B - Product risk | S1 | Admin cleanup | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-026 | `client/src/pages/profile/ProfileOnboardingStepPage.jsx` | Future onboarding steps | Route-safe unavailable workflows | A - Acceptable temporary | S2 | Stage 4+ | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-027 | `server/src/routes/v1/user.routes.js` | Backend planned endpoint | Returns planned module status | C - Architecture risk | S2 | User module | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-028 | `client/src/utils/constants.js` | Fallback services | FALLBACK_SERVICES after empty/error response | B - Product risk | S1 | API migration | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-029 | `client/src/utils/constants.js` | Fallback portfolio | FALLBACK_PORTFOLIO after empty/error response | B - Product risk | S1 | API migration | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-030 | `client/src/sections/ReviewsSection.jsx` | Fallback reviews | Three testimonial-like records when API is empty | B - Product risk | S1 | Public proof | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-031 | `client/src/sections/home/FeaturedProvidersSection.jsx` | Provider previews | Four hardcoded provider metric examples | A - Acceptable temporary | S3 | Provider discovery | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-032 | `client/src/sections/home/FeaturedChallengesSection.jsx` | Challenge previews | Four hardcoded challenge examples | A - Acceptable temporary | S3 | Challenge discovery | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-033 | `client/src/sections/home/ProofLedgerPreview.jsx` | Proof previews | Static proof records and pipeline | A - Acceptable temporary | S3 | Proof | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-034 | `client/src/sections/home/ProofLedgerShowcase.jsx` | Proof showcase | Static proof records and workflow | A - Acceptable temporary | S3 | Proof | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-035 | `client/src/pages/VerifyEmail.jsx` | Development email fallback | Development outbox notice | D - Security risk | S1 | Auth/email | Yes | Treat as a security release gate; implement only with approved provider/rate-limit design and auth tests. |
| WPH-036 | `server/src/modules/auth/auth.routes.js` | Auth rate-limit TODOs | Login/recovery throttling TODOs | D - Security risk | S1 | Security | Yes | Treat as a security release gate; implement only with approved provider/rate-limit design and auth tests. |
| WPH-037 | `server/src/modules/auth/auth.controller.js` | Email provider TODOs | Production delivery TODOs | D - Security risk | S1 | Email operations | Yes | Treat as a security release gate; implement only with approved provider/rate-limit design and auth tests. |
| WPH-038 | `.next and client/dist` | Generated builds | Generated output beside source | A - Acceptable temporary | S3 | Repository hygiene | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-039 | `.chrome-* and responsive-shots` | Browser artifacts | Temporary verification output | A - Acceptable temporary | S3 | Repository hygiene | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-040 | `uploads and server/uploads` | Runtime uploads | Mutable local file data | C - Architecture risk | S2 | Storage | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-041 | `server/tmp` | Runtime temporary files | Mutable temp directory | A - Acceptable temporary | S3 | Repository hygiene | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-042 | `client/src/pages/Auth.jsx` | Unmapped legacy page | No direct AppRoutes ownership | E - Unknown | UNKNOWN | Auth cleanup | Yes | Establish runtime/import ownership before reuse, migration, or deletion. |
| WPH-043 | `client/src/pages/Blogs.jsx` | Unmapped legacy page | No direct AppRoutes ownership | E - Unknown | UNKNOWN | Content cleanup | Yes | Establish runtime/import ownership before reuse, migration, or deletion. |
| WPH-044 | `client/src/pages/Contact.jsx` | Unmapped legacy page | No direct AppRoutes ownership | E - Unknown | UNKNOWN | Public cleanup | Yes | Establish runtime/import ownership before reuse, migration, or deletion. |
| WPH-045 | `client/src/pages/MyChallenges.jsx` | Unmapped alternate page | No direct AppRoutes ownership | E - Unknown | UNKNOWN | Challenge cleanup | Yes | Establish runtime/import ownership before reuse, migration, or deletion. |
| WPH-046 | `client/src/pages/PublicProfile.jsx` | Unmapped direct page | RouteShell proxy owns route | E - Unknown | UNKNOWN | Stage 4 | Yes | Establish runtime/import ownership before reuse, migration, or deletion. |
| WPH-047 | `client/src/pages/ServiceDetail.jsx` | Unmapped direct page | RouteShell proxy owns route | E - Unknown | UNKNOWN | Marketplace cleanup | Yes | Establish runtime/import ownership before reuse, migration, or deletion. |
| WPH-048 | `client/src/pages/Admin.jsx` | Unmapped legacy page | No direct AppRoutes ownership | B - Product risk | S1 | Admin cleanup | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-049 | `client/src/utils/challengeNextAction.js` | Future workflow actions | Returns disabled next actions for milestone tracking and outcome proof. | A - Acceptable temporary | S2 | Milestones/proof | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-050 | `client/src/pages/ChallengeDetail.jsx` | Visible workflow placeholder | Renders activity/proof-review future-state UI without enabling the workflow. | B - Product risk | S2 | Milestones/proof review | No | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-051 | `client/src/pages/ClientExecutionPlanDetail.jsx` | Deferred connected workflows | Records plan decision while several downstream workflows remain unconnected. | B - Product risk | S2 | Milestones/payments/messaging/proof | No | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-052 | `client/src/components/matches/ProviderInviteModal.jsx` | Disabled unsupported mutation | Shows invite modal with permanently disabled action. | B - Product risk | S1 | Matching/invitations | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-053 | `client/src/pages/ChallengeBuilder.jsx` | Disabled AI placeholder | Rule-based builder shows disabled future AI action. | A - Acceptable temporary | S3 | AI challenge quality | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-054 | `client/src/pages/OutcomeOfferBuilder.jsx` | Disabled AI placeholder | Rule-based builder shows disabled future AI action. | A - Acceptable temporary | S3 | AI offer quality | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-055 | `client/src/pages/SupportDashboard.jsx` | Future operational dashboard | Displays safe explanatory state without operational data. | C - Architecture risk | S2 | Support/admin operations | Yes | Freeze as a compatibility/placeholder boundary; verify route, shell, storage, or endpoint ownership before cleanup. |
| WPH-056 | `client/src/components/navigation/AdminTopbar.jsx` | Nonfunctional visible control | Renders search input without value, onChange, submit, or search handler. | B - Product risk | S1 | Admin search | Yes for the affected cleanup | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-057 | `client/src/utils/profile/profileReadinessTypes.js` | Explicit non-fake score placeholders | Returns not-calculated placeholder objects without inventing scores. | A - Acceptable temporary | S2 | Profile scoring/trust | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |
| WPH-058 | `client/src/components/dashboard/ClientDashboard.jsx` | Partial proof-review dashboard data | Shows known proof-review-related challenges without full review workflow. | B - Product risk | S2 | Proof review | No | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-059 | `client/src/sections/home/FinalCTASection.jsx` | Commercial preview | Explains pricing/product model without live paid plans. | B - Product risk | S2 | Pricing/payments | No | Do not present as production truth; replace through the owning product/API stage with contract tests. |
| WPH-060 | `client/src/sections/home/HeroSection.jsx; client/src/sections/home/HowItWorksSection.jsx; client/src/sections/home/HomeHowItWorksSection.jsx` | Static marketing preview datasets | Renders fixed illustrative metrics/workflow rows. | A - Acceptable temporary | S3 | Public content | No | Keep clearly labeled and isolated; replace only when the owning feature delivers real data/workflow. |

## Class Rules

### A - Acceptable Temporary

Keep only while the UI clearly says preview, planned, disabled, or not calculated. These items must not silently become fake production data. `WPH-031` through `WPH-034` were downgraded to S3 because their source includes explicit preview disclosure.

### B - Product Risk

These items can be mistaken for real commercial, provider, challenge, proof, admin, invitation, or dashboard behavior. Fallback collections in `client/src/services/api.js` are especially sensitive because they appear after empty/error responses.

### C - Architecture Risk

These files can establish false route, shell, API, storage, or module ownership. They must not be deleted or promoted to canonical architecture without route/import/runtime evidence.

### D - Security Risk

`WPH-035` through `WPH-037` concern development email delivery and missing production throttling/provider completion. Documentation must not imply that verification/recovery is production-complete until those controls are implemented and tested.

### E - Unknown

The six page files exist but static AppRoutes evidence does not prove whether they are legacy, indirectly rendered, or dead. They are candidates only; no deletion is authorized.

## Cleanup Rule

Stage 1.2 may plan removal of misleading fallback behavior and nonfunctional controls, but implementation must follow route/API/auth tests and feature ownership. Acceptable previews can remain when visibly disclosed. Unknown files require human or runtime evidence.

