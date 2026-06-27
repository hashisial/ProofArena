# Stage 1.1 Audit Coverage Report

Generated: 2026-06-27T09:38:25.230298+00:00

## File Coverage

| Measure | Count | Definition |
| --- | ---: | --- |
| Architecture-bearing files deeply scanned | 817 | 808 source-code files, eight package/editor/build/deployment configs, one root boundary script |
| Frontend files scanned | 564 | 558 source-code files plus six frontend configs |
| Backend files scanned | 252 | 250 source-code files plus two backend configs |
| Shared/root files scanned | 1 | scripts/check-module-boundaries.mjs |
| Files enumerated under client/src and server/src | 825 | Includes 17 non-code source assets/styles/support files |
| Dependency nodes | 811 | Import-classified code/tool files |
| Dependency edges | 3145 | Direct internal dependencies |

## Mapping Coverage

| Area | Found | Mapped/used | Unknown/gap | Coverage |
| --- | ---: | ---: | ---: | ---: |
| Frontend routes | 108 | 108 | 0 unknown layout/guard chains | 100% |
| Backend endpoint variants | 537 | 436 complete controller/service/direct-model chains | 101 partial chains | 81.2% strict |
| Endpoint controller mapping | 537 | 531 | 6 inline | 98.9% |
| Endpoint frontend caller candidates | 537 | 531 | 6 | 98.9% |
| Model-layer files | 50 | 45 with known use | 5 aliases/base/orphan | 90.0% |
| Custom hooks | 44 | 37 imported | 7 | 84.1% |
| Frontend services | 23 | 22 imported | 1 | 95.7% |
| Backend services | 50 | 49 imported | 1 | 98.0% |
| Utilities | 79 | 74 imported | 5 | 93.7% |

## Gaps

1. Four operations use inline status/discovery handlers.
2. Six operations have controller-file-level rather than handler-level service evidence.
3. One hundred and one endpoint variants lack a complete controller/service/direct-model chain.
4. Thirty-four named routes lack route metadata.
5. Seven page files have no direct AppRoutes ownership.
6. ProviderProfile references an unregistered VerifiedOutcome model.
7. Index adequacy requires production-like query plans.
8. Runtime verification is blocked by the missing automated test suite.

## Audit Confidence

**89/100**

The score reflects complete static file and route coverage, exact endpoint count reconciliation, strong controller mapping, partial strict service/model coverage, verified boundaries, and machine-readable consistency. Missing runtime tests and production database evidence prevent a higher score.
