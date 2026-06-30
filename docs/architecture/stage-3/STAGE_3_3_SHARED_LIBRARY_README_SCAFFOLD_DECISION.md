# Stage 3.3 Shared Library README Scaffold Decision

| Library | Target README | Path exists | Safe now | Status | Reason | Runtime impact | Import impact | API/auth/routing impact | Duplicate risk | Human review | Stop condition |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Shared UI primitives | `client/src/components/ui/README.md` | yes | yes | approved with caution | Existing folder, 74 consumers, established barrel, and source README precedent; README will narrow generic scope and document platform exceptions | none | none | none; explicitly prohibits new route/auth/API behavior | low | yes for future additions | README must not imply route-aware files are generic shared UI |
| Shared form primitives | Covered by UI README | yes | yes through parent README | approved with caution | Existing subset has 15 consumers; separate folder/README would over-fragment | none | none | none | low | yes for changes | Do not create separate form library |
| Shared loading/empty/error states | Covered by UI README | yes | yes through parent README | approved with caution | Existing subset has 39 consumers; parent README can state caller-owned behavior | none | none | none | medium due state-folder overlap | yes | No consolidation or new folder |
| Shared API response/service helpers | `client/src/services/shared/README.md` | yes | yes | approved with caution | Existing folder, 11 feature-service consumers, three pure functions, no imports/transport | none | none | explicitly prohibits client/token/base URL/error ownership | low | yes for future additions | Any transport or domain behavior blocks change |
| Shared accessibility helpers | None | no | no | candidate only | No dedicated helper or two consumers | none | none | none | high if path created | yes | Concrete repeated need absent |
| Shared formatting utilities | None; do not add README to mixed root | mixed root exists | no | candidate only | Reuse exists but root ownership/tests are incomplete | none | none | none | high; README could imply whole-root approval | yes | Owner/test evidence absent |
| Shared date/currency helpers | None | files exist | no | candidate only | File-level candidates do not justify a library scaffold | none | none | payment display caution | medium | yes | No approved library path |
| Shared validation primitives | None | no approved path | no | blocked | Zero real consumers and unclear authority | none | none | security/API validation risk | high | yes | Consumer/authority gates fail |
| Shared type primitives | None | mixed root exists | no | blocked | Identity/route/profile ownership is mixed and sensitive | none | none | auth/role/API contract risk | critical | yes | Authoritative contracts absent |
| Shared design tokens | None | platform paths exist | no | blocked as shared | Platform-owned design authority; no new shared ownership | none | none | none | critical visual-source duplication | yes | Platform source-of-truth must remain singular |
| Shared test helpers | None | no | no | blocked | No test framework or test consumers | none | none | production mock risk | high | yes | Framework/two suites absent |
| Shared docs-only governance | Existing architecture docs | yes | no new README needed | approved docs-only | Existing trackers, locks, indexes, and manifests already govern it | none | none | none | low | yes | Avoid parallel governance index |

## Decision

Two documentation-only READMEs are safe because they target existing, evidenced folders and narrow rather than expand ownership. No new shared folder or library path is authorized.

