# Stage 4 Route Validation and Test Plan

Validation layers:
1. Parse constants and assert 117 entries/108 unique values until approved changes.
2. Parse AppRoutes and assert 108 unique leaf routes.
3. Compare declarations, constants, 73 metadata paths, and 42 enabled navigation paths.
4. Build/lint using existing scripts only.
5. Deep-link public, auth, dynamic, client, provider, admin, system, and wildcard paths.
6. Test anonymous/authenticated/unverified/client/provider/support/admin/unknown roles.
7. Test state.from, query strings, replace history, logout, invalid onboarding step, explicit and wildcard 404.
8. Verify no second router/constants/nav/guard/API/auth system.
9. Record before/after output and stop on unexplained change.

No production batch may proceed without an available regression baseline.

## Validation Matrix

Observed client scripts: `npm run build`, `npm run lint`, and `npm run check:boundaries`. No route-specific test script exists.

| ID | Requirement | Method | Tool/command | Manual | Pass | Fail | Blocks | Human review |
|---|---|---|---|---|---|---|---|---|
| VT-001 | Build | Existing script | npm run build | no | Exit 0 | Build/import error | yes | no |
| VT-002 | Lint | Existing script | npm run lint | no | No blocking errors | New blocking error | yes | no |
| VT-003 | Boundaries | Existing script | npm run check:boundaries | no | Exit 0 | Boundary violation | yes | architecture |
| VT-004 | One router | Static scan | rg for router APIs | no | One approved mount | Second router | yes | architecture |
| VT-005 | Declaration baseline | Parse AppRoutes | Reviewed read-only script | no | 108 unique leaves or approved delta | Missing/duplicate path | yes | architecture |
| VT-006 | Constant baseline | Import groups | Read-only Node inspection | no | 117 entries/108 values or approved delta | Unexplained delta | yes | architecture |
| VT-007 | Metadata parity | Compare paths | Read-only comparison | yes | Every gap classified | Unclassified gap | yes | product/security |
| VT-008 | Navigation parity | Compare enabled targets | Read-only comparison | yes | All enabled targets resolve | Broken target | yes | product |
| VT-009 | Public rendering | Deep-link matrix | No existing script | yes | Correct page/layout | Error/wrong page | yes | QA |
| VT-010 | Auth rendering | Flow matrix | No existing script | yes | Existing behavior preserved | Redirect/render regression | yes | auth |
| VT-011 | Dashboard rendering | Authenticated deep links | No existing script | yes | Correct shell/page | Wrong shell/page | yes | QA |
| VT-012 | Admin protection | Anonymous/wrong/admin roles | No existing script | yes | Only approved admin access | Bypass/false denial | yes | security |
| VT-013 | Client/provider roles | Full role matrix | No existing script | yes | Approved allow/deny | Access drift | yes | security |
| VT-014 | Role redirects | Target/state/history check | No existing script | yes | Destination and state unchanged | Loop/lost state | yes | auth/security |
| VT-015 | Login/logout | End-to-end flow | No existing script | yes | Intended landing | Wrong landing/loop | yes | auth |
| VT-016 | 404/wildcard | Explicit and unknown URLs | No existing script | yes | Current NotFound behavior | Interception/missing 404 | yes | QA/product |
| VT-017 | Dynamic builders | Generate/deep-link families | No existing script | yes | Encoded URL matches domain ID | ID/slug mismatch | yes | domain/API |
| VT-018 | Hardcoded disposition | Static scan and ledger | rg with reviewed exclusions | yes | No unexplained migrated-scope literal | Unclassified literal | yes | architecture |
| VT-019 | Duplicate constants | Alias comparison | Read-only script | yes | Only approved aliases | New duplicate/registry | yes | architecture |
| VT-020 | No ProofArena router | Architecture scan | rg/path inspection | no | No parallel stack | Duplicate stack | yes | architecture |
| VT-021 | Before/after contract | URL/role/history/query snapshot | Browser harness required | yes | No unexplained behavior delta | Any unexplained delta | yes | QA/security |

An implementation batch cannot start until its manual/browser expectations and rollback triggers are approved.
