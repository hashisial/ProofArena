# Module Ownership Rulebook

| ID | Rule | Reason | Forbidden outcome | Validation/stop condition |
|---|---|---|---|---|
| OR-01 | Components remain UI-only unless explicitly approved as module containers. | Prevent hidden business/platform logic. | API/auth/router logic in UI. | Dependency review; stop on platform ownership. |
| OR-02 | Hooks own module state/data composition only. | Global state remains platform-owned. | Module auth/session or router hook. | Hook import review. |
| OR-03 | Services own module business operations. | Keeps domain logic explicit. | Global API client or unrelated orchestration. | Service call graph review. |
| OR-04 | API adapters use the approved ScaleOps API client. | Preserves auth/base/errors. | Axios/fetch wrapper, token/base logic. | Request scan; stop on new client. |
| OR-05 | Types remain module-local until reused by at least two modules or platform. | Avoid premature coupling. | Shared dumping. | Consumer proof and approval. |
| OR-06 | Validation remains module-local unless a real shared contract exists. | Maintains domain ownership. | Duplicated global/auth validation. | Contract-owner review. |
| OR-07 | Constants remain local unless platform-wide. | Prevents global catalogs from domain leakage. | Module route/role/API/env constants. | Constants audit. |
| OR-08 | Tests belong with the owning module and cover migration behavior. | Enables safe vertical moves. | Untested scaffold/migration. | Stop production migration without tests. |
| OR-09 | Modules do not own app entry, router, navigation, dashboard/sidebar/layout. | Platform invariants. | Parallel app shell. | Stage 2 stop-ship. |
| OR-10 | Modules do not own global API client, auth provider, role system, config/env. | Security/runtime invariants. | Duplicate platform system. | Immediate stop. |
| OR-11 | Modules do not govern shared UI or shared utilities. | Shared ownership needs independent approval. | Module exporting a “shared” library. | Stage 3.3 gate. |
| OR-12 | Cross-module workflows require an explicit orchestrator owner and contract. | Prevents tangled domains. | Direct circular feature imports. | Dependency graph; stop on cycle. |
| OR-13 | Backend domain layers migrate as tested vertical slices. | Avoids duplicate live paths. | Compatibility copies/partial layer move. | Endpoint/import/model tests. |
| OR-14 | README claims must match actual implementation. | Prevents fake architecture. | Placeholder module presented as live. | File/runtime evidence. |
| OR-15 | ScaleOps parent and ProofArena composition boundaries remain intact. | Product governance. | Standalone ProofArena architecture. | ADR/Stage 2 compliance. |

