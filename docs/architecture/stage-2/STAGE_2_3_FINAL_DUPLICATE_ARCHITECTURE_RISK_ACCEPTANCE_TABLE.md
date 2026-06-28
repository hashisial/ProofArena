# Final Duplicate Architecture Risk Acceptance Table

| Disposition | ID | Risk / systems | Sev./likelihood | Status/reason | Expiry/action/owner | Blocks Stage 3 / production |
|---|---|---|---|---|---|---|
| Accepted temporarily | R23-01 | Branding/naming ambiguity | Medium/high | Controls distinguish branding from ownership. | Human naming decision; product owner. | No / No |
| Accepted temporarily | R23-02 | Legacy Header/Footer/Layout overlap | Medium/medium | No new stack; reachability not fully proven. | Import/runtime proof; Stage 7/22. | No / Yes |
| Accepted temporarily | R23-03 | Role/responsive nav/sidebar overlap | Medium/high | Likely intentional behavior variants. | Regression tests before consolidation; Stage 22/36. | No / Yes |
| Deferred to Stage 3 | R23-04 | Feature-domain ownership/migration boundary | High/medium | Stage 3 defines modules. | Documentation-first module map; Stage 3. | No / Yes |
| Deferred to Stage 3 | R23-05 | Shared-vs-module utility/component ownership | Medium/medium | Current boundaries known but mixed items remain. | Stage 3 ownership contract. | No / Yes |
| Deferred to Stage 3 | R23-06 | Backend domain module migration | High/medium | Current layers are live; no copies allowed. | Vertical-slice policy; Stage 3. | No / Yes |
| Deferred later | R23-07 | Hardcoded/legacy route references | Medium/high | No parallel tree; cleanup needs route tests. | Stage 4 route governance. | No / Yes |
| Deferred later | R23-08 | `/api` and `/api/v1` registry overlap | High/high | Intentional compatibility/versioning may exist. | Stage 5 API contract review. | No / Yes |
| Deferred later | R23-09 | Backend auth file variants | Critical/high | Confirmed overlap; deletion/consolidation unsafe now. | Stage 23/26 security review. | No / Yes |
| Deferred later | R23-10 | Partial/mock/fallback surfaces | High/medium | Classified, not production truth. | Stage 8/feature stages. | No / Yes |
| Human approval | R23-11 | External GitHub/Vercel/domain topology | Critical/unknown | Local evidence cannot prove external boundary. | Release-owner verification. | No / Yes |
| Human approval | R23-12 | Production edit and test authorization | Critical/high | Stage 2 is documentation-only. | Explicit stage prompt and test plan. | No / Yes |

No risk blocks documentation-first Stage 3. Detection of an active duplicate app, router, shell, API client, auth system, or deployment boundary would immediately block Stage 3.

