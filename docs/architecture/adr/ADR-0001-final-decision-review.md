# ADR-0001 Final Decision Review

Generated: 2026-06-27

| Decision | Category | Final statement | Prior result | Evidence | Human approval | Recommendation | Reason / future impact / enforcement |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F-01 | Product boundary | ScaleOps parent; ProofArena in-product flagship | Confirmed | High | Yes | Human-review-required | Stage 2 depends on owner ratification; no separate product architecture. |
| F-02 | Repository boundary | Existing repository is current source | Confirmed | High | Yes | Accept-with-caution | External org context aside, source ownership is clear. |
| F-03 | No separate app | No separate ProofArena app/repo/router/shell/client/auth/nav | Confirmed | High | Yes | Human-review-required | Critical invariant; future ADR required to reverse. |
| F-04 | Route governance | AppRoutes/routes.js govern current routes; aliases conditional | Conditional | High/medium | Yes for aliases | Keep-proposed | Stage 4 must decide deprecation with tests/telemetry. |
| F-05 | Layout/dashboard | Preserve role wrappers/SidebarCore; only tested primitives may be shared | Conditional | High/medium | Yes for consolidation | Keep-proposed | Stages 3/36; role policy cannot merge. |
| F-06 | API governance | apiClient transport, apiEndpoints paths, feature services; facade temporary | Conditional | High/low version | Yes | Keep-proposed | Stage 5 must decide version/window. |
| F-07 | Auth/role | Reuse guards/middleware; backend authorization authoritative | Confirmed principle | High | Yes for changes | Accept-with-caution | Stages 23/26; not a claim that email/throttle gaps are closed. |
| F-08 | Module ownership | Use mapped modules; legacy exceptions remain mapped | Revised | Medium | Yes | Keep-proposed | Stage 3 must formalize exceptions. |
| F-09 | Shared code | Share stable cross-module contracts only | Confirmed | High | No | Accept | Enforce dependency/equivalence checks. |
| F-10 | Placeholder/mock | Disclosed previews allowed; fake production truth prohibited | Confirmed | High | Product/security replacement only | Accept | Stage 8/features use classification. |
| F-11 | Refactor governance | Preflight, tests, isolation, validation, rollback mandatory | Confirmed | High | No | Accept | All future stages. |
| F-12 | Safe deletion | No deletion without the safe-delete policy and approval | Confirmed | High | Yes for high risk | Accept | Unknown blocks deletion. |
| F-13 | Critical files | Protection list/prechecks mandatory | Confirmed | High | As listed | Accept | Prevent route/auth/API/data breakage. |
| F-14 | Future Codex preflight | Read official sources and enforce no-duplicate checks | Confirmed | High | No | Accept | Every future prompt must stop on failure. |

Ready to accept as governance rules: F-09 through F-14 plus the conservative portions of F-02/F-07. Boundary ratification and conditional route/layout/API/module decisions remain proposed.

Ignoring these decisions risks product fragmentation, protected-data exposure, session/API breakage, misleading production behavior, and destructive cleanup.

