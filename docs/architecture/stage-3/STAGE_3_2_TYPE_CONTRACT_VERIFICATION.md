# Stage 3.2 Type Contract Verification

| ID | Path/category | Correct owner | Status | Duplicate risk | Drift risk | Future action | Human |
|---|---|---|---|---|---|---|---|
| TV-01 | `client/src/types/auth.js` | platform auth | compliant | Critical | High | Keep canonical JSDoc auth contract | Yes |
| TV-02 | `client/src/types/access.js` | platform access | compliant | Critical | High | Reuse; no module permissions enums | Yes |
| TV-03 | `client/src/types/navigation.js` | platform navigation | compliant | Critical | High | Reuse; no module nav types | Yes |
| TV-04 | `client/src/types/routes.js` | platform routing | compliant | Critical | High | Reuse; Stage 4 governs | Yes |
| TV-05 | `client/src/types/profile.js` | profile contract currently in root | suspicious | High | High | Decide module/shared placement during migration | Yes |
| TV-06 | Offer/challenge/plan/proof/match contracts embedded in utils/services | owning modules | suspicious | High | High | Extract only with real API/schema evidence | Yes |
| TV-07 | Message/payment/admin explicit client types | modules, currently incomplete | unknown | Critical | High | Inventory real contracts; create nothing now | Yes |
| TV-08 | `client/src/services/apiContracts.js` and API errors | platform API contract | compliant with caution | High | High | Keep global envelope/error semantics | Yes |
| TV-09 | Server auth/role constants/middleware contracts | platform auth/roles | compliant with caution | Critical | Critical | Reconcile variants and preserve one role language | Yes |
| TV-10 | ProviderProfile/UserProfile/User model variants | backend profile/users/auth | violation/blocked | Critical | Critical | Human model authority decision | Yes |
| TV-11 | Payment models (`Invoice`, `MarketplaceTransaction`, subscriptions) | payment domains under platform | suspicious | Critical | Critical | Payment architecture and DTO review | Yes |
| TV-12 | Frontend JSDoc vs backend Mongoose/Zod shapes | API boundary | partial | High | Critical | Contract/schema tests or generated contracts later | Yes |

The codebase has no universal TypeScript/module-type folder convention. New type files remain blocked.

