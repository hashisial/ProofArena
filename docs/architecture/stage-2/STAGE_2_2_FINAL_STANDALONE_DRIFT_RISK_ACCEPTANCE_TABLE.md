# Final Standalone Drift Risk Acceptance Table

| Disposition | Risk | Title/systems | Sev./likelihood | Status and reason | Expiry/action/owner | Blocks 2.3 / production |
|---|---|---|---|---|---|---|
| Accepted temporarily | SD-10 | Branding ambiguity | Medium/high | Controlled by identity and naming rules; no duplicate runtime found. | Expires on human naming decision; product owner. | No / No |
| Deferred to Stage 2.3 | SD-01 | Separate app/repo | Critical/medium | Prevention rules need final stop-ship lock. | Stage 2.3 duplicate-prevention audit. | No / Yes |
| Deferred to Stage 2.3 | SD-02 | Parallel route tree | Critical/medium | Existing authority known; prevention must be operationalized. | Stage 2.3 route audit. | No / Yes |
| Deferred to Stage 2.3 | SD-03 | Parallel dashboard shell | Critical/medium | Existing shells known; prevention audit required. | Stage 2.3 shell audit. | No / Yes |
| Deferred to Stage 2.3 | SD-04 | Separate navigation | High/medium | One config exists; prevent future stack. | Stage 2.3 navigation audit. | No / Yes |
| Deferred to Stage 2.3 | SD-05 | Separate API client | Critical/medium | Shared transport exists; prevent alternate transport. | Stage 2.3 API audit. | No / Yes |
| Deferred to Stage 2.3 | SD-06 | Separate auth/role | Critical/low | Shared guards/middleware exist; prevention audit required. | Stage 2.3 auth audit. | No / Yes |
| Deferred to Stage 2.3 | SD-11 | Future prompt duplication | High/medium | Stage 2.3 must supply reusable stop-ship controls. | Stage 2.3 rulebook/checklist. | No / Yes |
| Deferred later | SD-07 | Parallel backend stack | High/medium | No second stack found; migration is later architecture work. | Stages 3/5; architecture owner. | No / Yes |
| Deferred later | SD-08 | Separate DB/model namespace | Critical/low | No separate connection found; data changes require dedicated review. | Data/model stage; data owner. | No / Yes |
| Human approval / unknown | SD-09 | Config/deployment split | Critical/unknown | Local config is unified; external topology unknown. | Release owner verifies GitHub/Vercel/domains. | No / Yes |

No risk blocks documentation-only Stage 2.3. Any detected active duplicate becomes a stop-ship blocker.

