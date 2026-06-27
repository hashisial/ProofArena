# Stage 1.1 Consistency Check

Generated: 2026-06-27T09:38:25.230298+00:00

## Matching Findings

| Finding | Earlier | Fresh | Result |
| --- | ---: | ---: | --- |
| Frontend routes | 108 | 108 | Match |
| Backend operations | 304 | 304 | Match |
| Endpoint variants | 537 | 537 | Match |
| Registered models | 45 | 45 | Match |
| Model-layer files | 50 | 50 | Match |
| Service files | 73 | 73 | Match |
| Custom hooks | 44 | 44 | Match |
| Dependency nodes | 811 | 811 | Match |
| Dependency edges | 3,145 | 3,145 | Match |
| Boundary violations | 18 | 18 | Match |

## Corrected Findings

| Earlier documentation | Fresh scan | Correction |
| --- | --- | --- |
| 552 frontend source files | 558 frontend code files; 571 total under client/src | Earlier count used a narrower or stale filter |
| 251 backend source files | 250 backend code files; 254 total under server/src | Earlier count used a different boundary |
| No architecture-bearing total | 817 deeply scanned code/config/tool files | Explicit Prompt 3 definition |

## Missing Earlier and Added

- Evidence IDs for graph files, routes, endpoint operations, and models.
- Route-to-service-to-endpoint-to-model traceability.
- Strict full-chain endpoint coverage.
- Refactor readiness categories.
- A 28-item duplicate radar.
- A 48-item placeholder/mock/temporary inventory.
- Machine-readable source-of-truth manifest.

## Still Uncertain

| Item | Reason | Status |
| --- | --- | --- |
| VerifiedOutcome model | ProviderProfile references it but no registered model exists. | UNKNOWN |
| Runtime route/API correctness | No maintained automated test suite exists. | BLOCKED |
| Database index adequacy | Requires production-like query plans and cardinality. | UNKNOWN |
| Seven unmapped page files | May be legacy, indirect, or dead; source evidence cannot prove intent. | UNKNOWN |
| Six controller-file-level service flows | Static handler isolation cannot prove the exact service symbol. | PARTIAL |
| Four inline endpoint operations | No controller/service boundary exists by design. | PARTIAL |
| Thirty-four route metadata gaps | Router declarations have no matching metadata record. | KNOWN GAP |
| Production model/index ownership | Static schemas do not prove deployed collection/index state. | UNKNOWN |

## Count Definition

- 825 files are enumerated under client/src and server/src.
- 808 source-code files were parsed.
- 817 architecture-bearing files were deeply scanned after package/editor/build/deployment configs and the root boundary script were included.

## Current Source of Truth

STAGE_1_1_SOURCE_OF_TRUTH_SUMMARY.md is the human-readable master. stage-1-1-source-of-truth-manifest.json is the machine-readable master.
