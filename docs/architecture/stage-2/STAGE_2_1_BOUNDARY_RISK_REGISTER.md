# Stage 2.1 Boundary Risk Register

Generated: 2026-06-28

| Risk ID | Description | Related evidence | Severity | Likelihood | Blast radius | Preventive action | Detection method | Future owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BR-01 | Future prompt creates a separate ProofArena app or repository. | ADR-0001; project structure; module READMEs | critical | medium | Entire platform, deployment, auth, data, roadmap | Enforce parent rules and formal ADR reversal gate. | Root/package/repository scan before creation. | Architecture owner | mitigated-open |
| BR-02 | Parallel ProofArena route tree or constants diverge from `AppRoutes`/central constants. | Route inventory; Stage 1.2 route lock | high | medium | Navigation, deep links, guards, SEO | Reuse central route governance. | Route/path/import search and direct-load matrix. | Stage 4 / frontend architecture | mitigated-open |
| BR-03 | Duplicate ProofArena dashboard/layout shell bypasses role wrappers. | Layout lock; dashboard critical files | high | medium | Provider/client/admin access and responsive UX | Preserve role shells and shared sidebar engine. | Layout/import/route scan and role QA. | Stages 3/36 | mitigated-open |
| BR-04 | Duplicate navigation/sidebar source creates inconsistent role visibility. | Navigation configs; control board | high | medium | Links, authorization UX, mobile navigation | Reuse central navigation configs/components. | Search nav arrays and sidebar renderers. | Frontend architecture | mitigated-open |
| BR-05 | Duplicate API client splits base URL/auth/error contracts. | API lock; `apiClient.js` | high | medium | Every frontend/backend request | Ban new transports; require service ownership mapping. | Axios/fetch/client search and import graph. | Stage 5 | mitigated-open |
| BR-06 | ProofArena-specific auth/role system bypasses platform security. | Auth provider/guards; backend middleware; ADR rules | critical | medium | Sessions, private data, admin access | Reuse shared auth and backend middleware. | Provider/store/guard/middleware search and security QA. | Stages 23/26 | mitigated-open |
| BR-07 | Product-first or generic naming obscures ScaleOps parent ownership. | Root README, package names, API health labels | medium | high | Developer decisions, deployment naming, docs consistency | Adopt an approved naming matrix without runtime edits in this prompt. | Terminology scan across root/docs/config/runtime metadata. | Product + architecture owner | open-human-review |
| BR-08 | Older docs are quoted as authority and contradict final boundary docs. | Final source index; stale report | high | low | Future prompts and architecture decisions | Require final authority index before work. | Doc-reference and authority audit. | Documentation governance | mitigated-open |
| BR-09 | Future prompt ignores ADR-0001 because status is Proposed. | ADR index/status/adoption package | critical | medium | All duplicate-system controls | Treat mandatory rules as active; record approval/deferral. | Prompt preflight and final diff review. | Architecture owner | open-human-review |
| BR-10 | Stage 2 proceeds beyond documentation without human boundary approval/deferral. | Stage 2 start conditions; SR-01/SR-18 | high | high | Product boundary and all later stages | Keep production work blocked until owner decision. | Check approval evidence before each Stage 2 prompt. | Architecture owner | blocking-human-review |
| BR-11 | `@proofarena/*` alias enables imports into private module files. | `client/jsconfig.json`; `client/vite.config.js`; module README | high | medium | Module encapsulation and migration safety | Define public-import policy and checker coverage in Prompt 2. | Import search and client boundary checker. | Frontend architecture | open |
| BR-12 | External Vercel projects/domains or other repositories may use standalone ProofArena identity. | Local Vercel configs only; external state not inspected | high | unknown | Deployment, domains, ownership, customer perception | Verify external project/domain inventory with owner-approved access. | Vercel/repository/domain audit. | Release + architecture owner | unknown-human-review |

## Counts

- Boundary risks: **12**.
- Critical: **3** (`BR-01`, `BR-06`, `BR-09`).
- High: **7**.
- Medium: **2**.
- Blocking human-review: **1** (`BR-10`).
- Unknown external-state risk: **1** (`BR-12`).

No risk entry authorizes production changes.
