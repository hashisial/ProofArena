# Stage 3.2 Internal Folder Decision Table

Each folder path is `<approved module base>/<folder>`. `NO` means neither the folder nor a README may be created now. No module base is approved by Stage 3.1.

| Module | Candidate base after approval | components | hooks | services | types | api | adapters | utils | constants | validation | Reason/runtime impact/duplicate risk | Validation/human/future owner |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| auth | Existing selected auth boundary only | NO | NO | NO | NO | NO | NO | NO | NO | NO | Existing feature/module variants; creation would signal duplicate auth; runtime impact must remain none | Authority/import/security tests; human; Stage 3.2/23 |
| profile | Unresolved current profile boundary | NO | NO | NO | NO | NO | NO | NO | NO | NO | Dispersed paths and users/model overlap; parallel owner risk | Consumer/model/privacy tests; human; Stage 3.2 |
| offers | Existing outcomeOffers or approved successor | NO | NO | NO | NO | NO | NO | NO | NO | NO | Active feature/service already exists; copy risk | Vertical/import/API tests; human; future migration prompt |
| challenges | Existing challenges or approved successor | NO | NO | NO | NO | NO | NO | NO | NO | NO | Active feature/service already exists; route/shell duplication risk | Vertical/role/contract tests; human; future migration prompt |
| plans | Existing executionPlans or approved successor | NO | NO | NO | NO | NO | NO | NO | NO | NO | Active feature/service exists; cycle/payment risk | Vertical/cycle/payment tests; human; future migration prompt |
| proof | One approved proof boundary | NO | NO | NO | NO | NO | NO | NO | NO | NO | Two feature roots and privacy/storage risk | Security/visibility/storage tests; human; later security stage |
| matching | Existing matches or approved successor | NO | NO | NO | NO | NO | NO | NO | NO | NO | Active feature/service exists; role/algorithm risk | Role/algorithm/import tests; human; future migration prompt |
| messages | Unresolved message/realtime boundary | NO | NO | NO | NO | NO | NO | NO | NO | NO | No feature base and socket/auth coupling | Realtime/auth/event tests; human; later contract prompt |
| payments | Unresolved payment boundary | NO | NO | NO | NO | NO | NO | NO | NO | NO | Sensitive billing/marketplace contexts; provider/security risk | Webhook/idempotency/security tests; human; payment stage |
| admin | Existing admin feature under platform shell | NO | NO | NO | NO | NO | NO | NO | NO | NO | Active feature plus privileged platform coupling | Permission/shell/import tests; human; Stage 3.2/26 |

Common runtime impact if created now: no intended runtime effect, but high governance impact and future duplicate-import risk. Common stop condition: missing module base authority, tests, owner, or human approval.

