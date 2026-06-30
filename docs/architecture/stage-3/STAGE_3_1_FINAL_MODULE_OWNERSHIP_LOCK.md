# Stage 3.1 Final Module Ownership Lock

This lock defines future responsibility, not permission to create, move, or implement files.

## Auth

- Final ownership status: partial; migration/scaffolding blocked.
- Product responsibility: authentication screens and identity workflows under ScaleOps security governance.
- Frontend ownership: auth-specific screens, forms, workflow composition, and domain validation where current architecture supports it.
- Backend ownership: approved auth use cases only after runtime authority is selected.
- Data/model ownership: no new credential/session model; existing users/auth contract requires human review.
- API/service ownership: auth workflow services may use the platform client; global token/cookie/session behavior remains platform-owned.
- Hook ownership: auth workflow hooks may compose the platform auth API; they cannot create session authority.
- Component ownership: auth forms and workflow UI only.
- Type ownership: auth screen/use-case contracts that do not duplicate platform roles/session contracts.
- Utility ownership: pure auth-form helpers only.
- May own later: tested auth workflow internals within the selected existing authority.
- Must never own: duplicate provider, token handling, session store, guards, role system, middleware, router, or API client.
- Platform reuse: auth provider/store, route guards, role middleware, API client, route registry, errors/config.
- Confirmed candidates: `client/src/features/auth`, `server/src/modules/auth`.
- Rejected from module ownership: platform store/guards/middleware/routes and compatibility policy.
- Unknown candidates: legacy/versioned auth variants and users boundary.
- Human review: yes. Future owners: Stages 3.2, 4, 5, 23, 26.

## Profile

- Final ownership status: partial; migration/scaffolding blocked.
- Product responsibility: provider, client, and agency profile lifecycle.
- Frontend ownership: profile pages, sections, onboarding, profile hooks/services and presentation contracts.
- Backend ownership: profile handlers/services/validators after users/profile authority is resolved.
- Data/model ownership: one approved profile contract only; current ProviderProfile/UserProfile variants remain unresolved.
- API/service ownership: profile operations through the platform client and registered API.
- Hook ownership: module profile state/data composition, not auth/session or route policy.
- Component ownership: profile-specific UI, not shared primitives or shells.
- Type ownership: profile contracts local to profile until cross-module approval.
- Utility ownership: profile-only readiness/projection helpers after owner review.
- May own later: complete tested profile vertical slice.
- Must never own: credentials, auth/session, router, storage infrastructure, API client, role guards.
- Platform reuse: auth, route governance, API client, storage, shared UI, role guards.
- Confirmed candidates: client profile feature/components/pages/config/types and server profile chains.
- Rejected from module ownership: `server/src/modules/users`, auth credentials/session, storage platform.
- Unknown candidates: duplicate profile models/controllers/services.
- Human review: yes. Future owners: Stages 3.2, 4, 5, 23.

## Offers

- Final ownership status: confirmed with caution; production migration still blocked.
- Product responsibility: outcome-offer creation, discovery, status, and lifecycle.
- Frontend ownership: offer pages, forms, components, hooks, services and adapters.
- Backend ownership: outcome-offer handlers, services, validation and persistence.
- Data/model ownership: OutcomeOffer domain model and module-local contracts.
- API/service ownership: offer endpoints/operations through platform registration/client.
- Hook ownership: offer query/mutation and local workflow composition.
- Component ownership: offer-specific UI.
- Type ownership: offer contracts and statuses not already platform-governed.
- Utility ownership: pure offer transformations and display rules.
- May own later: one complete tested offer vertical slice.
- Must never own: payments, auth, global routing, marketplace-wide API client, proof/profile internals.
- Platform reuse: auth, routes, API client, shared UI, profile/proof/payment public contracts.
- Confirmed candidates: outcomeOffers feature/components/pages and backend outcome-offer chain.
- Rejected from module ownership: payment execution and platform security/routing.
- Unknown candidates: none at domain level; migration consumers/tests remain incomplete.
- Human review: yes. Future owners: Stages 3.2, 4, 5 and marketplace stages.

## Challenges

- Final ownership status: confirmed with caution; production migration still blocked.
- Product responsibility: challenge discovery, application, creation, and lifecycle.
- Frontend ownership: challenge pages/components/hooks/services/adapters.
- Backend ownership: challenge handlers/services/validation/persistence.
- Data/model ownership: Challenge domain model and contracts.
- API/service ownership: challenge operations through platform API registration/client.
- Hook ownership: challenge state, queries, mutations and local workflow composition.
- Component ownership: challenge-specific UI.
- Type ownership: challenge contracts and module statuses.
- Utility ownership: pure challenge rules/formatting.
- May own later: one complete tested challenge vertical slice.
- Must never own: route tree, dashboard shell, auth, matching/plans internals.
- Platform reuse: routes, dashboard shell, auth, API client, shared UI, public module contracts.
- Confirmed candidates: challenge feature/components/pages and backend chain.
- Rejected from module ownership: router, shell, auth/role and other domain internals.
- Unknown candidates: none at domain level; cross-module contracts remain to be approved.
- Human review: yes. Future owners: Stages 3.2, 4, 5, 36.

## Plans

- Final ownership status: confirmed with caution; production migration still blocked.
- Product responsibility: plan display, creation/review, execution-plan lifecycle, and approved package presentation.
- Frontend ownership: plan pages/editors/components/hooks/services/adapters.
- Backend ownership: execution-plan handlers/services/validation/persistence.
- Data/model ownership: ExecutionPlan domain model and contracts.
- API/service ownership: plan operations through platform API registration/client.
- Hook ownership: plan queries/mutations and local workflow composition.
- Component ownership: plan-specific UI.
- Type ownership: plan contracts and module statuses.
- Utility ownership: pure plan comparison/quality/display helpers.
- May own later: one complete tested plan vertical slice.
- Must never own: payment processing, Stripe, auth, router, dashboard shell, proof/challenge internals.
- Platform reuse: routes, shell, auth, API client, shared UI, challenge/proof/payment contracts.
- Confirmed candidates: executionPlans feature/components/pages and backend chain.
- Rejected from module ownership: payment execution and platform shell/security.
- Unknown candidates: subscription package versus payment boundary.
- Human review: yes. Future owners: Stages 3.2, 4, 5 and payment stages.

## Proof

- Final ownership status: partial; migration/scaffolding blocked.
- Product responsibility: proof ledger, proof records/assets, readiness, and outcome verification summaries.
- Frontend ownership: proof/vault UI, proof hooks/services/adapters after one owner is selected.
- Backend ownership: proof handlers/services/validation/persistence under platform security/storage.
- Data/model ownership: ProofAsset and proof domain records subject to privacy/redaction rules.
- API/service ownership: protected proof operations through platform client/registration.
- Hook ownership: proof queries/mutations and module-local state, never permission policy.
- Component ownership: proof-specific UI that respects visibility contracts.
- Type ownership: proof contracts with explicit public/private variants.
- Utility ownership: redaction-safe proof transformations only.
- May own later: one consolidated, security-tested proof vertical slice.
- Must never own: auth, permissions, storage infrastructure, global errors, private-data policy.
- Platform reuse: guards, API client, storage, routes, errors, shared UI.
- Confirmed candidates: proof/proofAssets feature roots, proof components/pages, proof-asset backend chain.
- Rejected from module ownership: storage/auth/error infrastructure.
- Unknown candidates: final proof versus proofAssets owner and visibility contract.
- Human review: yes. Future owners: Stages 3.2, 4, 5, 8 and security stages.

## Matching

- Final ownership status: confirmed with caution; production migration still blocked.
- Product responsibility: matching rules, scoring, opportunities and recommendations.
- Frontend ownership: match pages/components/hooks/services/adapters.
- Backend ownership: match handlers/services/validation/persistence and approved algorithms.
- Data/model ownership: MatchRecord and matching contracts.
- API/service ownership: match operations through platform API registration/client.
- Hook ownership: match queries/mutations and local filters/state.
- Component ownership: matching/recommendation-specific UI.
- Type ownership: scoring/reason/result contracts.
- Utility ownership: pure matching calculations only after test approval.
- May own later: one complete tested matching vertical slice.
- Must never own: auth, roles/permissions, identity/session, router, profile/challenge models.
- Platform reuse: auth/roles, routes, API client, shared UI and public challenge/profile contracts.
- Confirmed candidates: matches feature/components/pages and backend chain.
- Rejected from module ownership: permission/identity and route policy.
- Unknown candidates: algorithm and role regression baseline.
- Human review: yes. Future owners: Stages 3.2, 4, 5, 26.

## Messages

- Final ownership status: partial; migration/scaffolding blocked.
- Product responsibility: conversations, messages and messaging UI/product logic.
- Frontend ownership: message views/components/module hooks/services after a boundary exists.
- Backend ownership: message handlers/services/models; socket runtime remains platform-owned.
- Data/model ownership: Message/conversation domain records under platform identity/permissions.
- API/service ownership: message operations/events through approved API/realtime services.
- Hook ownership: thread/message composition, not session or socket infrastructure.
- Component ownership: message-specific UI.
- Type ownership: message/thread/event contracts.
- Utility ownership: pure message formatting only.
- May own later: tested messaging domain behind platform auth/realtime contracts.
- Must never own: auth/session, socket server/client platform, guards, notifications platform.
- Platform reuse: auth/users, API client, socket/realtime platform, routes, guards, shared UI.
- Confirmed candidates: Messages page, message routes/controller/model/socket events.
- Rejected from module ownership: messaging auth middleware/service and realtime runtime.
- Unknown candidates: final domain/platform split and event ownership.
- Human review: yes. Future owners: Stages 3.2, 4, 5, 23.

## Payments

- Final ownership status: partial; migration/scaffolding blocked.
- Product responsibility: payment, payout, invoice and marketplace transaction workflows.
- Frontend ownership: payment views and domain workflow composition after architecture approval.
- Backend ownership: payment domain handlers/services/models under platform Stripe/webhook/security controls.
- Data/model ownership: non-sensitive transaction records as approved; no raw payment credentials.
- API/service ownership: payment operations through platform client, auth, config and provider adapter.
- Hook ownership: payment workflow state that never fakes settlement/authorization.
- Component ownership: payment-specific UI and honest states.
- Type ownership: payment request/result contracts excluding secrets.
- Utility ownership: pure amount/display helpers only.
- May own later: security-approved payment vertical slices.
- Must never own: secrets/env, DB connection, API client, auth, Stripe/webhook platform, fake paid state.
- Platform reuse: auth, API, config/env, Stripe/webhook infrastructure, errors/audit.
- Confirmed candidates: Payments page and billing/marketplace-payment chains.
- Rejected from module ownership: secrets/config/raw-body/webhook platform and global billing policy.
- Unknown candidates: billing versus marketplace payment authority and provider integration ownership.
- Human review: yes. Future owners: Stages 3.2, 5, 6 and payment stages.

## Admin

- Final ownership status: confirmed with caution; production migration still blocked.
- Product responsibility: moderation and administrative workflows.
- Frontend ownership: admin resource views/components/hooks/services under platform admin shell/security.
- Backend ownership: admin handlers/services/validation that invoke public domain contracts.
- Data/model ownership: admin-specific moderation/audit records only; business models remain domain-owned.
- API/service ownership: protected admin operations through platform API/role policy.
- Hook ownership: admin query/mutation composition, not permission policy.
- Component ownership: moderation/admin workflow UI, not shell/navigation.
- Type ownership: admin request/result/view contracts.
- Utility ownership: admin presentation helpers, not cross-domain business rules.
- May own later: tested moderation workflows with explicit domain contracts.
- Must never own: role system, admin route policy, shell/sidebar/navigation, router, unrelated business logic/models.
- Platform reuse: admin routes/guards/roles, shell/navigation, API client, audit/errors, shared UI.
- Confirmed candidates: admin feature/components/pages and backend admin chain.
- Rejected from module ownership: AdminLayout, AdminGate, admin navigation, role middleware, domain models.
- Unknown candidates: final moderation-to-domain command contracts.
- Human review: yes. Future owners: Stages 3.2, 4, 5, 23, 26.

## Lock Result

No module is approved to create folders, move files, rewrite imports, register routes/APIs, or implement runtime behavior.

