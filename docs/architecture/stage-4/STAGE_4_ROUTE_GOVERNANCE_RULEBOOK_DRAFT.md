# Stage 4 Route Governance Rulebook Draft

This draft governs future Stage 4 work until a final lock supersedes it.

| Rule ID | Rule | Reason | Required evidence | Forbidden action | Required validation | Stop condition |
|---|---|---|---|---|---|---|
| RG-001 | Route constants must have one source-of-truth | Prevent path drift | Complete constant/alias/consumer map | Creating a second constants file/tree | Unique paths, imports, compatibility tests | Source authority unclear |
| RG-002 | Router declarations should use approved constants where safe | Keep runtime paths aligned | Declaration-to-constant mapping | Replacing paths without migration proof | Route render/deep-link tests | Any declaration has unresolved semantics |
| RG-003 | Navigation should use approved constants/metadata where safe | Prevent broken links | Link-to-declaration map | Local duplicate nav arrays | Desktop/mobile/footer/sidebar tests | Target or role behavior unclear |
| RG-004 | Protected route logic must avoid hardcoded paths where practical | Keep fallbacks coherent | Guard/redirect inventory | Ad hoc login/unauthorized paths | Auth state and intended-destination tests | Fallback parity unknown |
| RG-005 | Admin routes require admin guard or equivalent | Prevent privilege exposure | Admin route/guard map | Unguarded admin declaration | Anonymous/non-admin/admin tests | Guard evidence absent |
| RG-006 | Role-specific routes require role or permission governance | Prevent cross-role access | Intended role contract and metadata | Guessing role from path name | Allowed/denied role matrix | Intended role unknown |
| RG-007 | Redirects must use approved route constants after safe migration | Prevent redirect drift | Redirect source/target map | Blind literal replacement | query/state/replace semantics tests | Redirect semantics differ |
| RG-008 | 404/fallback behavior must be documented before implementation | Protect deep-link behavior | Explicit/wildcard/API 404 baseline | Changing wildcard/order prematurely | unknown/static/dynamic/deep-link tests | Catch-all interaction unknown |
| RG-009 | No separate ProofArena route tree | Preserve one SaaS platform | ADR-0001 and current router evidence | New ProofArena router/app | Repository router scan | Separate boundary proposed |
| RG-010 | No duplicate dashboard shell route stack | Preserve platform shell | Layout/route nesting map | New module dashboard router/layout | Shell and role navigation audit | Existing shell reuse unclear |
| RG-011 | No duplicate public navigation route stack | Prevent competing menus | Public/mobile/footer source map | Parallel ProofArena nav config | Consumer/source comparison | Duplicate config proposed |
| RG-012 | No centralization without a migration plan | Existing aliases/literals are behavior | Consumer, compatibility, rollback, test plan | Bulk search/replace | staged diff and route matrix | Any consumer unclassified |
| RG-013 | No route edit without test/validation plan | Route changes have broad blast radius | Route/nav/guard/redirect test inventory | Production edit without tests | build, deep links, roles, redirects, 404 | Regression baseline absent |
| RG-014 | No implementation while route source-of-truth is unknown | Prevent premature architecture | Prompt 2 verified candidate decision | Treating candidate as final | Human/architecture acceptance | Candidate conflicts unresolved |
| RG-015 | Every route migration batch requires a rollback plan | Limit failure blast radius | Exact touched files and previous behavior | Irreversible or mixed-scope batch | Rollback rehearsal/documented command | Batch cannot be isolated |
| RG-016 | Dynamic builders and parameter semantics must be documented | Prevent ID/slug/profile drift | Consumer and backend contract evidence | Guessing parameter meaning | Builder and deep-link tests | Parameter contract unknown |
| RG-017 | Constants, declarations, metadata, and enabled navigation require machine comparison | Detect drift before edits | Reproducible inventory outputs | Manual-only completeness claim | Zero unexplained mismatches | Any mismatch lacks disposition |

## Absolute Draft Controls

- Do not create route constants, route trees, navigation stacks, guards, dashboards, API clients, auth systems, or separate ProofArena routing.
- Do not treat route metadata as complete until all 34 gaps are dispositioned.
- Do not remove aliases, legacy paths, unused-looking pages, or guards without reachability and compatibility evidence.
