# Module Boundary Conflict Register

| ID | Path/system | Conflict | Modules | Evidence | Risk | Later resolution | Blocks creation | Human |
|---|---|---|---|---|---|---|---|---|
| CF-01 | Auth feature/module/route/service variants | Multiple owners/versions | auth/platform/users | Existing parallel names | Critical | Trace runtime and select authority | Yes | Yes |
| CF-02 | Profile and users models/services | Overlapping identity/profile | profile/auth/users | Duplicate model/controller names | Critical | Contract/model ownership decision | Yes | Yes |
| CF-03 | `features/proof` vs `proofAssets` | Two feature signals | proof | Split client ownership | High | Consolidation plan after tests | Yes | Yes |
| CF-04 | Challenges/plans/matching | Cross-domain coupling | three modules | API/model references | High | Explicit contracts, no direct cycles | No for docs | Yes |
| CF-05 | Offers/proof/payments | Business/payment coupling | offers/proof/payments | Workflow relationships | High | Service/API boundaries | No for docs | Yes |
| CF-06 | Messages and auth/users/socket | Platform/domain mix | messages/auth/users | messaging auth service/socket | Critical | Realtime ownership decision | Yes | Yes |
| CF-07 | Payments billing vs marketplace payments | Two payment contexts | payments/platform | Separate route/controller/services | Critical | Payment architecture review | Yes | Yes |
| CF-08 | Admin and domain moderation | Cross-domain privileged actions | admin/all | Admin API/pages | Critical | Policy boundary and contracts | Yes | Yes |
| CF-09 | Root hooks/services/utils | Feature logic in shared-like roots | mixed | Consumer paths | High | Stage 3.3 inventory | Yes | Yes |
| CF-10 | RouteShells/fallback constants | Mock/placeholder ownership | marketing/modules | Placeholder reports | High | Replace by verified owner | No for docs | Yes |
| CF-11 | ProofArena product module vs target domain modules | Composition vs domain | all ProofArena modules | Module README contracts | High | Public entry/dependency direction | No for docs | Yes |
| CF-12 | Existing server users module | Profile/auth overlap | users/profile/auth | `server/src/modules/users` | Critical | Human decision | Yes | Yes |

