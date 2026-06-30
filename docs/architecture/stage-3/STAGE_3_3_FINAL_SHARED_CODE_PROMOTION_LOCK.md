# Stage 3.3 Final Shared Code Promotion Lock

Every criterion is mandatory. Failed or unknown evidence stops promotion.

| ID | Requirement | Evidence required | Pass | Fail | Validation | Human review | Stop condition |
|---|---|---|---|---|---|---|---|
| PRO-001 | Two real consumers or documented platform reason | Independent import/use map or platform authority | Stable need is proven | One/speculative consumer | Consumer and semantic comparison | yes for platform reason | Consumer independence unknown |
| PRO-002 | Product-agnostic abstraction | API/examples from each consumer | No module assumptions | Feature vocabulary/workflow embedded | Semantic review | yes | Module conditionals required |
| PRO-003 | No module business logic | Stage 3.1/3.2 ownership map | Neutral presentation/transform | Domain decisions present | Boundary review | yes | Business owner differs from shared owner |
| PRO-004 | No hidden auth/session/token logic | Auth dependency/data-flow map | No security authority moves | Token/session/role behavior hidden | Security scan/review | yes | Platform auth interface insufficient |
| PRO-005 | No hidden payment-sensitive logic | Payment data-flow/classification | No processing/sensitive storage | Payment/provider logic hidden | Payment/security review | yes | Sensitive scope unclear |
| PRO-006 | No hidden admin authorization assumptions | Role/mutation/permission evidence | Caller/platform owns authorization | Privileged decision embedded | Admin/security review | yes | Authorization owner unclear |
| PRO-007 | No duplicate API client behavior | Client-instance/base URL/token/error scan | Canonical client remains sole transport | Transport policy appears in helper | Client scan and adapter validation | yes | Client/token/base URL/retry logic appears |
| PRO-008 | No circular dependency | Before/after dependency graph | Acyclic module -> shared direction | Shared imports module or cycle | Boundary script/import graph | yes | Reverse edge/cycle detected |
| PRO-009 | Stable naming and clear owner | Named owner and public API | Generic name matches behavior | Owner unknown or generic disguise | Naming/ownership review | yes | Stable contract cannot be stated |
| PRO-010 | Clear import/dependency direction | Allowed/forbidden import contract | Small public surface, no private deep imports | Broad barrel/private imports required | Import graph/lint/boundary | yes for new public export | Direction or public API unclear |
| PRO-011 | Rollback/deprecation plan | Reversible migration sequence | Behavior-neutral rollback exists | Destructive one-way move | Build/lint/tests and rollback rehearsal | yes | Rollback needs redesign |
| PRO-012 | Sensitive human review | Recorded approval for auth/payment/admin/config/API/types | Required owner approves | Approval absent | Approval record and risk review | yes | Any sensitive approval missing |

No file move, import update, barrel, or runtime promotion is authorized by this lock.

