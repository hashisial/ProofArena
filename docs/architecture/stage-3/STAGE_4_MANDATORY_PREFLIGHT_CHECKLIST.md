# Stage 4 Mandatory Preflight Checklist

Stage 4 is the Route Governance System. All checks are mandatory before work begins.

| ID | Required action | Required doc | Pass condition | Fail condition | Stop condition |
|---|---|---|---|---|---|
| P4-01 | Read final Stage 3 handoff | `STAGE_3_FINAL_HANDOFF_PACKAGE.md` | Boundaries understood | Not read | Stop |
| P4-02 | Read final source index | `STAGE_3_FINAL_SOURCE_OF_TRUTH_DOC_INDEX.md` | Final authority identified | Non-final docs used as authority | Stop |
| P4-03 | Read module ownership lock | Stage 3.1 module lock | Route owners mapped to modules/platform | Ownership assumed | Stop |
| P4-04 | Read API-adapter lock | Stage 3.2 API lock | Route work does not create transport | API behavior mixed into routing | Stop |
| P4-05 | Read shared API-helper lock | Stage 3.3 API lock | No shared/client duplicate | Helper/client duplication proposed | Stop |
| P4-06 | Read Stage 2 prevention locks | Route/nav/dashboard/API/auth locks | Existing architecture reused | Parallel system proposed | Stop |
| P4-07 | Read ADR adoption package | ADR-0001 adoption | Product boundary preserved | ADR conflict | Stop |
| P4-08 | Confirm ScaleOps parent | Stage 2 parent lock | ScaleOps remains parent | Parent boundary weakened | Stop |
| P4-09 | Confirm ProofArena module | Stage 2 module lock | ProofArena remains module | Standalone app implied | Stop |
| P4-10 | Confirm no separate app | Stage 2 separate-app lock | Unified app retained | New app/package/entry | Stop |
| P4-11 | Confirm no duplicate route constants | Route lock + repository audit | Existing source identified | Second catalog proposed | Stop |
| P4-12 | Confirm no duplicate navigation | Navigation lock | Existing nav reused | New stack/config | Stop |
| P4-13 | Confirm no duplicate shell/layout | Dashboard/layout lock | Existing shell retained | New shell/sidebar/layout | Stop |
| P4-14 | Protect existing route behavior | Route inventory/tests | Centralization plan is behavior-neutral | Existing path breaks/changes | Stop |
| P4-15 | Protect guarded/admin/role routes | API/auth/role + route locks | Guards/roles remain authoritative | Guard/bypass change unproven | Stop |
| P4-16 | Document redirects/404 first | Stage 4 audit docs | All redirects/fallbacks mapped | Edit precedes map | Stop |
| P4-17 | Stop on ambiguous route authority | Source index + repository evidence | One source candidate and owner recorded | Authority unknown/conflicting | Stop and escalate |
| P4-18 | Prevent duplicate protected-route wrappers | Stage 2 auth/route locks | Existing protected wrapper/guard reused | Parallel protected wrapper or route group proposed | Stop |
| P4-19 | Prevent duplicate admin route guards | Stage 2 auth/role and route locks | Existing admin guard authority reused | New admin guard/permission stack proposed | Stop |
| P4-20 | Prevent duplicate role guards | Stage 2 auth/role lock | Existing role guard/middleware reused | New role-specific guard system proposed | Stop |
| P4-21 | Prevent duplicate redirect/404 definitions | Route audit and existing declarations | Redirect/fallback authority mapped and reused | Parallel redirect, fallback, or 404 behavior proposed | Stop |

Production route changes require a later explicit prompt, all 21 checks passing, and risk-appropriate tests.
