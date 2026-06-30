# Stage 3.3 Final Shared Library Approval Lock

Candidate-only is not approved. Approved-with-caution status permits existing use, not production expansion without validation.

| ID | Library/folder | Path | Final status | Evidence / consumers | Product-agnostic | Module logic | Platform logic | Sensitive logic | Allowed future use | Forbidden future use | Validation | Human review | Stop condition |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SAL-001 | Architecture governance | `docs/architecture/` | approved docs-only | Stage/ADR locks used across architecture work | platform-specific by design | no runtime | yes | governance-sensitive | Maintain authoritative docs | Runtime code or parallel authority | Source-of-truth/staleness review | yes | Conflicting authority appears |
| SAL-002 | Generic shared UI subset | `client/src/components/ui/` | approved with caution | 74 consumers; generic subset has no module/API imports | yes for subset | no | yes in three exceptions | no detected | Existing primitives; gated additions | Module logic, API/auth, new routing/shell behavior | Accessibility, consumers, visual, build/lint/boundary/tests | yes | Proposed item fails promotion gate |
| SAL-003 | Form primitives | Existing UI folder | approved with caution | 15 consumers | yes | no | no | no | Existing controls | Module forms/workflows/validation | Accessibility/form tests | yes for changes | Business workflow enters primitive |
| SAL-004 | Generic states | Existing UI folder | approved with caution | 39 consumers | yes with caller-owned behavior | no | platform consumers only | no | Existing generic states | Data fetching, routing, feature copy ownership | Duplicate-state comparison and accessibility | yes | State owns module/platform behavior |
| SAL-005 | Neutral service helpers | `client/src/services/shared/` | approved with caution | 11 feature-service consumers; no imports/transport | yes | no | no | no | Existing three pure helpers | Client/token/base URL/errors/version/domain logic | Sole-client scan, purity, reverse imports, tests | yes | Transport or domain behavior appears |
| SAL-006 | Generic hooks | Individual root hook files | candidate only | Definitions/barrel; zero real consumers | likely | no detected | browser/storage effects | no | Existing code only | New shared API/folder or promotion | Two consumers, owner, tests | yes | Consumer gate fails |
| SAL-007 | Formatters/date/currency | Individual root utility files | candidate only | 8-32 consumers per core formatter | mostly yes | no detected | no | payment-display caution | Existing imports | Whole-utils approval or expansion | Locale/edge tests, owner, purity | yes | Semantics or owner unclear |
| SAL-008 | Accessibility helpers | No path | candidate only | No dedicated implementation/consumers | unknown | unknown | unknown | unknown | Record repeated needs | Create speculative library | Two consumers and accessibility tests | yes | Evidence absent |
| SAL-009 | Shared validation | No approved path | blocked | Zero real consumers; authority unclear | unknown | unknown | unknown | possibly | None | New shared validation code/path | Frontend/backend contract/security review | yes | Authority unresolved |
| SAL-010 | Shared types | Mixed `client/src/types/` | blocked | Platform/profile contracts and 12 consumers | no as folder | yes | yes | identity/role/payment refs | Existing authoritative use | Duplicate sensitive/platform contracts | Contract owner and drift validation | yes | Authoritative contract absent |
| SAL-011 | Shared test helpers | No path | blocked | No test scripts/files/consumers | unknown | unknown | unknown | mock risk | None | Test helper or production mock library | Framework and two suites | yes | Framework absent |
| SAL-012 | Design tokens as shared | Platform token/style paths | blocked as shared; platform-owned | Central platform visual sources | yes | no | yes | no | Consume approved tokens | Shared/module token fork | Design-system and visual regression review | yes | Second token authority proposed |
| SAL-013 | Common components | `client/src/components/common/` | suspicious shared | Aliases/placeholders/layout composition | no as folder | yes | yes | no | Existing compatibility only | New shared primitives/business logic | File owner and behavior review | yes | New code proposed |
| SAL-014 | Root hooks/utils/types | Client roots | suspicious shared | Mixed module/platform/candidate files | no as folders | yes | yes | auth/role/profile | Existing behavior only | Blanket shared additions | File-level owner/dependency/tests | yes | Whole-root approval proposed |
| SAL-015 | Global API facade | `client/src/services/api.js` | suspicious shared | Reverse feature imports and broad operations | no | yes | yes | auth/admin/payment | Existing compatibility only | New global business operations | Consumer/dependency map | yes | New operation or shared promotion proposed |
| SAL-016 | Route-aware UI | Three files under UI | platform-owned in shared-like path | Router/route metadata imports | no | no | yes | no | Existing platform behavior | Generic shared reuse/copy | Route-governance review | yes | Route policy duplicated |
| SAL-017 | Platform systems | Route/auth/API/config/design/error paths | platform-owned | Stage 2/3 locks and source paths | not applicable | no | yes | often | Approved interface consumption | Any shared/module replacement | Platform/security validation | yes | Authority challenged |
| SAL-018 | Domain code in broad roots | Domain hooks/utils/types/services | module-owned in wrong place | Domain semantics and dependencies | no | yes | sometimes | module-dependent | Existing compatibility | Promotion to shared | Module owner and regression tests | yes | Domain rule generalized |
| SAL-019 | Server broad roots | `server/src/utils`, `constants`, `services` | unknown/mixed | Security, domain, infrastructure coexist | no as roots | yes | yes | auth/payment/admin | Existing behavior only | Whole-root shared classification | Per-file backend/security review | yes | Ownership unknown |

## Final Approval Result

- Approved docs-only: one governance system.
- Approved with caution: four existing shared subsets/surfaces.
- Candidate-only: three groups.
- Blocked: four groups.
- Suspicious/mixed/platform/module classifications: seven groups.
- New runtime shared libraries approved: none.

