# Stage 1.2 Risk Acceptance Table

Generated: 2026-06-27

| Risk | Category | Description/files | Decision | Expiry condition | Required action | Severity | Monitoring/check |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RA-01 | Accepted temporarily | Explicitly disclosed marketing previews (WPH-031..034/060) | Accept while labeled as examples | Live verified APIs/content available or disclosure removed | Replace through owning public-data stage | S3 | Copy review and screenshot |
| RA-02 | Accepted temporarily | Planned route/module placeholders using shared state components | Accept while route-safe and nonfunctional | Owning feature ships | Replace with real feature, not fake data | S2 | Route and disabled-action QA |
| RA-03 | Accepted only for development | VerifyEmail development outbox messaging | Development only | Production deployment/email enablement | Approved provider and E2E delivery | S1 | Environment and email logs |
| RA-04 | Accepted only for development | Generated/build/browser/temp artifacts | Local workflows only | CI/repository hygiene policy adopted | Keep outside production source/deploy | S3 | Git/deploy file audit |
| RA-05 | Not accepted | Business-looking service/portfolio/review fallbacks after errors/empty data | Reject as production truth | Replaced by real empty/error states | WPH-028..030 cleanup after tests | S1 | Simulated empty/network/5xx |
| RA-06 | Not accepted | Separate ProofArena app/router/layout/client/auth system | Reject | Only future ADR can reverse | Enforce invariants | S0 | Repository/preflight scan |
| RA-07 | Not accepted | Auth guard bypass or second API transport | Reject | Never under ADR-0001 unless superseded | Stop/revert/escalate | S0 | Boundary/auth tests |
| RA-08 | Not accepted | Production email/recovery claim without provider/throttling | Reject | Security gates pass | Implement approved controls | S1 | E2E and abuse tests |
| RA-09 | Needs human approval | Client alias canonical route | No decision yet | Product/compatibility decision recorded | ADR/deprecation plan | S1 | Usage telemetry |
| RA-10 | Needs human approval | Admin proof canonical route | No decision yet | Admin/proof owner decision | ADR and endpoint/page map | S1 | Admin QA |
| RA-11 | Needs human approval | `/api` versus `/api/v1` canonical policy | No decision yet | API ADR and support window | Contract/telemetry plan | S1 | Request telemetry |
| RA-12 | Needs human approval | RootLayout/unmapped page disposition | No deletion decision | Runtime/external ownership proven | Safe-delete review | UNKNOWN | Build/runtime/import scan |
| RA-13 | Unknown | Production index/query adequacy and deployed consumers | Not accepted as known | Production-like evidence | Separate data/ops review | UNKNOWN | Query plans/telemetry |

