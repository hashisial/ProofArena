# ADR-0001 Contradiction and Gap Analysis

Generated: 2026-06-27

## Contradictions/Tensions

| ID | Tension | Evidence | Resolution in ADR |
| --- | --- | --- | --- |
| CG-01 | Central route governance exists while literals, aliases, and metadata gaps remain | RTE-001..020 | ADR defines direction, not completed cleanup; compatibility remains. |
| CG-02 | One HTTP transport exists while api.js, feature builders, and dual mounts overlap | API-001..008; server route indexes | apiClient is transport; facade/version policy remains conditional. |
| CG-03 | Shared sidebar engine exists while three protected shells repeat primitives | LAY-003..009 | Preserve role wrappers; share only tested non-policy primitives. |
| CG-04 | Placeholder governance permits previews while rejecting fake production data | WPH classes A-D | Explicit disclosure and data-source behavior decide acceptability. |
| CG-05 | Audit evidence is deep but runtime safety is weak | No tests/telemetry | ADR governs future work but cannot authorize cleanup. |

These are current-state tensions, not reasons to create parallel architecture.

## Gaps

| Gap | Impact | Status/action |
| --- | --- | --- |
| Canonical client route | Redirect/navigation policy | Human review |
| Canonical admin proof route | Admin workflow ownership | Human review |
| Canonical API version | Endpoint/deprecation strategy | Human/API review |
| api.js export-level runtime use | Facade retirement | Blocked pending method map |
| RootLayout/external ownership | Safe deletion | Unknown |
| Six unmapped page owners | Safe reuse/deletion | Unknown |
| Production email delivery/throttling | Auth security readiness | Blocked |
| Automated regression suite | Cleanup execution | Blocked |
| Compatibility telemetry | Alias/mount deprecation | Missing |
| Production model/index evidence | Data refactor decisions | Unknown |

No contradiction invalidates D-01/D-02. The gaps require ADR-0001 to remain proposed or accepted only with explicit conditions.

