# Stage 3.1 Module Boundary Violation Register

This register separates confirmed boundary direction problems from potential conflicts. It does not authorize fixes or file movement.

| Violation ID | File path/system | Type | Module | Evidence/status | Risk | Severity | Future action | Blocks scaffolding | Human review |
|---|---|---|---|---|---|---|---|---|---|
| BV-01 | `client/src/hooks/useMyProfile.js` | Shared-like root imports feature implementations | profile/dashboard/shared | Confirmed imports from `features/dashboard` and `features/profile` | Reverse dependency and cycle risk | High | Classify hook owner and expose a stable module/platform contract later | Yes | Yes |
| BV-02 | `client/src/hooks/useMyDashboard.js` | Shared-like root imports feature implementation | dashboard/shared | Confirmed import from `features/dashboard` | Shared-to-feature dependency | High | Keep frozen; assign owner during shared-code migration planning | Yes | Yes |
| BV-03 | `client/src/hooks/useAuth.js` | Root hook re-exports feature auth | auth/platform | Confirmed re-export from `features/auth/useAuth.js` | Compatibility bridge can mask authority | High | Treat as compatibility facade until consumers and authority are proven | Yes | Yes |
| BV-04 | `client/src/services/api.js` | Root service facade imports feature services | auth/profile/dashboard/API | Confirmed imports from three feature services | Mixed facade ownership and API migration risk | High | Keep compatibility facade; do not copy into modules | Yes | Yes |
| BV-05 | `client/src/components/profile/ProfilePhotoModal.jsx`, `ProfileHeader.jsx`, `CoverPhotoModal.jsx` | UI imports platform API-client helper | profile | Confirmed `getRealtimeBaseUrl` import | UI/platform coupling; not a second client | Medium | Introduce an approved adapter only in a later migration | No for docs | Yes |
| BV-06 | Auth controllers/services/routes/middleware with dotted and camel-case variants | Duplicate/ambiguous authority | auth/platform | Confirmed parallel file names and existing auth module | Wrong runtime owner could be moved or duplicated | Critical | Trace registrations/callers and select authority before migration | Yes | Yes |
| BV-07 | Profile controllers/services/models with dotted and camel-case variants | Duplicate/ambiguous data ownership | profile/users | Confirmed `ProviderProfile` and `UserProfile` variants | Contract/data divergence | Critical | Human model and compatibility decision | Yes | Yes |
| BV-08 | `client/src/features/proof` and `client/src/features/proofAssets` | Split domain ownership | proof | Confirmed two feature roots | Duplicate domain abstractions and visibility drift | High | Establish one future proof boundary after security tests | Yes | Yes |
| BV-09 | Message routes/model/socket events plus messaging auth service/middleware | Domain/platform mix | messages/auth/users | Confirmed cross-cutting realtime/security files | Auth bypass or duplicate realtime layer | Critical | Define platform realtime/auth contract before module work | Yes | Yes |
| BV-10 | Billing and marketplace-payment chains | Split sensitive domain context | payments/platform | Confirmed marketplace payment files; Stage 1/2 evidence records billing overlap | Webhook, secret, and financial divergence | Critical | Payment architecture and security review | Yes | Yes |
| BV-11 | Admin feature/pages/API plus admin layout/guard/navigation | Privileged domain/platform mix | admin/platform | Confirmed cross-domain admin surface | Role bypass or duplicate admin shell | Critical | Keep shell/roles platform-owned; define moderation contracts | Yes | Yes |
| BV-12 | `client/src/components/{profile,challenges,outcomeOffers,executionPlans,matches,proof}` | Feature UI dispersed in broad component root | Multiple modules | Confirmed domain-named component directories | Future duplicate if new module components are copied instead of migrated | High | Map consumers and move only as tested vertical slices | Yes | Yes |
| BV-13 | `client/src/modules/proofarena`, `server/src/modules/proofarena` versus target modules | Composition/domain boundary ambiguity | ProofArena/all modules | Confirmed existing ProofArena composition module | Nested standalone or copied domain architecture | High | Keep composition-only; prohibit platform/domain duplication | Yes | Yes |
| BV-14 | Server target chains spread across `routes/controllers/services/models/validators` | Layered-to-module migration risk | All backend modules | Confirmed current layered architecture; route scan found no direct model imports | Partial move could duplicate active handlers | High | Migrate only complete registered vertical slices after tests | Yes | Yes |

## Negative Findings

- No direct model imports were found in `server/src/routes` during this audit.
- No hardcoded leading route paths were found in the searched feature/component files.
- These negative scans reduce evidence of those specific violations; they do not prove repository-wide absence.

