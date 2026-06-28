# Duplicate Architecture Prevention Rulebook

| ID | Rule / why | Required docs | Forbidden action | Validation | Stop condition |
|---|---|---|---|---|---|
| DP-01 | Never create a separate ProofArena app; one product runtime is invariant. | ADR, Stage 2 locks | New app/repo/package | Entry/package scan | Second runtime proposed |
| DP-02 | Never create a separate ProofArena route tree. | Route audit/authority | Module router | Declaration scan | Second route owner |
| DP-03 | Never create duplicate route constants/metadata. | Route lock | New path catalog | Constant/reference scan | Conflicting path |
| DP-04 | Never create a ProofArena navigation stack. | Nav audit | Product nav config hierarchy | Config/import scan | Second nav authority |
| DP-05 | Public/mobile/footer links reuse public navigation registry. | Nav audit | Hardcoded duplicate arrays | Link/registry QA | Divergent link set |
| DP-06 | Provider/client/admin navigation remains role-specialized under shared governance. | Nav/ownership locks | ProofArena role nav clone | Role link/access QA | Guard mismatch |
| DP-07 | Never create a duplicate dashboard shell. | Layout audit | New module shell | Route/layout import scan | Parallel shell |
| DP-08 | Never create a duplicate sidebar; responsive variants reuse existing nav data. | Layout/nav audits | New sidebar framework | Responsive/role QA | New independent state/config |
| DP-09 | Never create a duplicate layout system. | Layout ownership | Module layout framework | Layout dependency scan | Existing shell bypassed |
| DP-10 | Never create a ProofArena API client. | API audit/contract | New axios/fetch wrapper | Request/base/token/error scan | Alternate transport |
| DP-11 | Never create a ProofArena auth provider/session store. | Auth audit | Module auth context/store | Provider/store scan | Second session source |
| DP-12 | Never bypass shared client guards or server middleware. | Auth/role docs | UI-only protection | Negative access tests | Unauthorized path |
| DP-13 | Existing backend auth variants are cleanup debt, not templates. | AR audit | More auth variant files | Import/route flow scan | New duplicate variant |
| DP-14 | Backend module behavior composes through one Express app/layers. | Backend flow/contract | Module server/layer copy | Listener/registry/boundary check | Second server/app |
| DP-15 | Never create ProofArena config/deployment/data boundary without superseding ADR. | ADR/config controls | Product env/deploy/DB connection | Local/external topology review | Approval absent |
| DP-16 | Module-specific architecture is forbidden when ScaleOps-wide architecture exists. | Reuse/authority locks | Compatibility copy | Do-not-duplicate scan | Existing owner found |
| DP-17 | Similar role/responsive files are not duplicates without dependency and behavior proof. | Prompt 7 audits | Premature merge/delete | Imports/runtime/QA | Proof incomplete |
| DP-18 | Docs must identify primary versus supporting authority. | Final source index | Parallel source-of-truth doc | Authority review | Conflicting authority |
| DP-19 | Audit-only prompts change docs only. | Prompt contract | Source/config/package edits | Git diff | Any non-doc change |
| DP-20 | On violation, stop, document, rollback safely, and request human review. | ADR violation plan | Continue after violation | Diff/runtime evidence | Violation unresolved |

