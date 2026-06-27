# ADR-0001 Future Stage Governance Map

Generated: 2026-06-27

| Stage | Name | ADR rules | Required sources | Likely systems | Forbidden shortcut | Validation / first behavior |
| --- | --- | --- | --- | --- | --- | --- |
| 2 | ScaleOps parent boundary | G-01/02 | ADR, Stage 1.1 summary | Product/repo/module docs | Separate ProofArena app | Confirm boundary before edits |
| 3 | Feature module boundary | G-02/10/11 | Ownership/dependency maps | client features/server modules | Move legacy code blindly | Define owners/exceptions first |
| 4 | Route governance | G-03/04/09 | Route inventory/lock/blockers | AppRoutes/routes/metadata/guards | Delete aliases/rewrite router | Route/role baseline first |
| 5 | API contract layer | G-07/08/09 | API inventory/flow/lock | apiClient/apiEndpoints/services/server routes | New client/bulk facade removal | Method/version contract map |
| 6 | Environment/config | G-14/15 | Critical config/forbidden actions | env/Vite/server config | Expose secrets/casual change | Environment matrix/approval |
| 7 | Design tokens/shared UI | G-10/11 | Reusable/dependency maps | UI/tokens/shared helpers | Premature shared abstraction | Import/equivalence/visual QA |
| 8 | Error/loading/empty states | G-12 | Placeholder/risk acceptance | State components/fallback callers | Fake success/data | Empty/error/accessibility tests |
| 9 | Performance baseline | G-18/20 | Test gap/QA/command docs | Bundles/rendering/API | Optimize without baseline | Measure before/after |
| 10 | Technical docs | G-16/20 | Official doc map/manifests | Architecture docs | Erase history | Link/JSON consistency |
| 22 | Public navigation | G-03/05/06 | Route/nav/layout docs | Header/nav/footer | New nav stack | Keyboard/mobile/active QA |
| 23 | Auth/roles/security | G-07/09/14/15 | Critical/backend auth docs | Auth provider/guards/middleware/email | UI-only security/auth rewrite | Full auth/security E2E |
| 26 | Permission matrix | G-09/10 | Role/access/backend flow | AccessPolicy/middleware | Frontend-only permissions | Role/API matrix |
| 36 | Provider dashboard | G-05/06/10 | Layout/sidebar/route locks | DashboardLayout/SidebarCore/features | Duplicate shell | Role/mobile/collapse QA |
| Other features | Profile/offers/challenges/proof/matching/messages/payments/admin | G-02/07..13 | Ownership/API/model/critical docs | Existing module owners | Parallel service/model/shell | Preflight candidate/contract checks |

Each stage must cite the exact Stage 1.1/1.2/ADR docs it used and stop if the target is unknown or blocked.

