# Stage 3.3 Shared Code Approval Status Register

| ID | Path/library | Group/status | Evidence | Allowed future use | Forbidden future use | Validation before production edits | Human review | Blocks Prompt 9 |
|---|---|---|---|---|---|---|---|---|
| ASR-001 | Architecture governance docs | approved docs-only | Stage/ADR locks and manifests | Governance references and updates | Runtime shared code or parallel authority | Source-of-truth/staleness review | yes | no |
| ASR-002 | Product-agnostic subset of `components/ui` | approved with caution | 74 consumers; no module/API imports in generic subset | Existing primitives; gated additions | Module logic, API/auth, route/nav/shell behavior | Consumers, accessibility, visual, lint/build/boundary/tests | yes | no |
| ASR-003 | Form primitives in UI | approved with caution | 15 consumer files | Existing generic form controls | Module forms/workflows/validation | Accessibility/form tests | yes for API changes | no |
| ASR-004 | Loading/empty/error primitives in UI | approved with caution | 39 consumer files | Caller-configured generic states | Fetching/routing/feature copy ownership | Compare duplicate states; accessibility tests | yes | no |
| ASR-005 | `services/shared` neutral helpers | approved with caution | 11 feature-service consumers; no imports/transport | Existing query/collection helpers | Client/token/base URL/errors/domain workflows | Sole-client/reverse-import/purity/tests | yes | no |
| ASR-006 | Generic hook files | candidate only | Definitions exist; zero real consumers | Existing files only | New shared API or folder promotion | Two consumers, owner, tests | yes | no |
| ASR-007 | Formatter/date/currency files | candidate only | 8-32 real consumers per core formatter | Current imports; file-level evaluation | Treating entire utils root as shared | Locale/edge tests, owner, purity | yes | no |
| ASR-008 | Accessibility helpers | candidate only | No dedicated path/consumer evidence | Document repeated needs | Create speculative library | Two real consumers and tests | yes | no |
| ASR-009 | Validation library | blocked | Zero real consumers; authority unclear | None | New shared validation path | Frontend/backend contract and security review | yes | no |
| ASR-010 | Shared types library | blocked | Mixed platform/profile contracts | Existing authoritative uses only | Duplicate User/Profile/Role/Payment/API types | Contract-owner and drift review | yes | no |
| ASR-011 | Shared test helpers | blocked | No framework/test files | None | Test utility or production mock library | Framework and two suites | yes | no |
| ASR-012 | Design tokens as shared library | blocked; platform-owned | Existing platform token/style sources | Consume approved platform tokens | Shared/module token fork | Design-system source and visual tests | yes | no |
| ASR-013 | `components/common` | suspicious shared folder | Mixed aliases/placeholders/layout | Existing compatibility only | New shared primitives/business logic | File-level owner and behavior review | yes | no |
| ASR-014 | Root `hooks`, `utils`, `types` | suspicious shared folders | Mixed platform/module/candidate contents | Existing behavior only | Blanket shared additions | File-level dependency/owner/tests | yes | no |
| ASR-015 | `client/src/services/api.js` | suspicious shared/global facade | Reverse imports to features and broad operations | Existing compatibility only | New global business operations | Consumer/dependency map | yes | no |
| ASR-016 | Route-aware files in `components/ui` | platform-owned code in shared-like folder | Router and route-metadata imports | Existing platform UI behavior | Treating as generic shared primitives | Route governance and migration tests | yes | no |
| ASR-017 | Platform API/config/auth/route/design/error systems | platform-owned, often misread as shared | Stage 2/3 locks and repository paths | Modules consume approved interfaces | Any duplicate shared ownership | Platform authority/security validation | yes | yes if challenged |
| ASR-018 | Domain utilities/hooks/types/services in broad roots | module-owned code misread as shared | Domain vocabulary and dependencies | Existing compatibility pending migration | Promotion to shared | Module owner, consumers, tests | yes | no |
| ASR-019 | Server utils/constants/services roots | unknown/mixed ownership | Security, domain, infrastructure files coexist | Existing behavior only | Whole-root shared classification | Per-file backend/security review | yes | no |

## Approval Result

Stage 3.3 has evidence-backed approval only for docs governance and narrow existing shared UI/helper subsets. Candidate-only and blocked groups remain unavailable for new production shared code.

