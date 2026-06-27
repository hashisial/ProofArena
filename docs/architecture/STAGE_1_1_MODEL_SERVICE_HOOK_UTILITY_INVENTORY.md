# Stage 1.1 Model, Service, Hook, and Utility Inventory

Generated: 2026-06-27T11:17:05.9368044+05:00

## Counts

| Category | Count |
| --- | ---: |
| Registered top-level Mongoose models | 45 |
| Model-layer files | 50 |
| Frontend service-layer files | 23 |
| Backend service-layer files | 50 |
| Total service-layer files | 73 |
| Custom hook files | 44 |
| Frontend utility files | 26 |
| Backend utility files | 13 |
| Backend validator files | 15 |

## Data Model Inventory

Main fields are abbreviated to the fields that define ownership and business purpose. “Sensitive” identifies fields requiring careful projection/logging, not a claim that other fields are public.

| Model | File | Main fields | Relationships/references | Sensitive fields | Primary users | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `AnalyticsEvent` | `server/src/models/AnalyticsEvent.js` | userId, event/type, entity, path, referrer, agent, metadata | User | User agent/metadata may contain personal data | `analyticsService`, `userService` | Analytics ownership |
| `ApiUsage` | `server/src/models/ApiUsage.js` | userId, period, requestCount, planKey, last request | User | Usage/history | `subscriptionService`, `userService` | Billing/rate ownership |
| `Blog` | `server/src/models/Blog.js` | title, slug, content, SEO, tags, status, placement | None | None obvious | `blogService` | Public content |
| `Campaign` | `server/src/models/Campaign.js` | userId, title, subject, template, status, schedule, leads | User, Lead | Outreach content/recipients | `campaignService`, activity/user services | Outreach module |
| `Category` | `server/src/models/Category.js` | name, slug, description, icon, parent, active | Self-reference | None obvious | `categoryService` | Marketplace taxonomy |
| `Challenge` | `server/src/models/Challenge.model.js` | client, outcome, criteria, proof, timeline, budget, status, moderation, quality, AI metadata | User, UserProfile | Moderation/AI metadata | challenge, match, plan, proof, admin services | Primary ProofArena challenge model |
| `Connection` | `server/src/models/Connection.js` | sender, receiver, status, blockedBy, pairKey | User | Relationship/block data | connection/messaging/admin services | Social/network ownership |
| `Conversation` | `server/src/models/Conversation.js` | type, creator, participants, last message, unread, archive/block, support status | User, Project, Message | Message/support metadata | messaging/admin services | Overlaps `/messages` and `/conversations` routes |
| `EmailTemplate` | `server/src/models/EmailTemplate.js` | userId, name, subject, body | User | Email body | outreach/user services | Outreach |
| `ExecutionPlan` | `server/src/models/ExecutionPlan.model.js` | challenge, provider, offer, plan, milestones, proof plan, price, score, status | Challenge, OutcomeOffer, User, ProviderProfile | Client feedback, attachments | execution, match, proof, opportunity services | Large aggregate |
| `Favorite` | `server/src/models/Favorite.js` | targetId, targetType, userId | User | Saved relationship | `serviceService` | Marketplace favorite |
| `Follow` | `server/src/models/Follow.js` | followerId, followingId | User | Relationship data | `followService` | Social |
| `Invoice` | `server/src/models/Invoice.js` | userId, amount, currency, Stripe invoice, status | User | Stripe invoice ID | subscription/user services | Billing |
| `Lead` | `server/src/models/Lead.js` | owner, name, email, phone, company, source, status, notes | User | Email, phone, notes | lead/contact/outreach/subscription services | PII-heavy |
| `LeadActivity` | `server/src/models/LeadActivity.js` | leadId, userId, type, description | Lead, User | Activity narrative | lead activity/feed/user services | CRM |
| `MarketplaceTransaction` | `server/src/models/MarketplaceTransaction.js` | client, provider, project, proposal, amounts, fees, status, Stripe IDs | User, Project, Proposal | Payment/Stripe identifiers, failure metadata | marketplace payment/user services | Financial record |
| `MatchRecord` | `server/src/models/MatchRecord.model.js` | challenge, provider/client, score, reasons, direction, status, timestamps | OutcomeOffer, Challenge, User, ProviderProfile | Match metadata | match, first-client, opportunity services | Matching aggregate |
| `Message` | `server/src/models/Message.js` | conversation, sender, receivers, text, attachments, reads, deletion | Conversation, User | Message body/attachments | messaging/admin/user services | Sensitive communications |
| `NetworkingComment` | `server/src/models/NetworkingComment.js` | post, author, content | NetworkingPost, User | User content | networking/user services | Social |
| `NetworkingPost` | `server/src/models/NetworkingPost.js` | author, content, media, likes, comments, shares, visibility | User, self | User content/media | networking/user services | Social |
| `Notification` | `server/src/models/Notification.js` | user, title, message, read, event/entity, action URL, metadata | User | User-specific activity | notification/campaign/user services | Notification |
| `OpportunityPipelineItem` | `server/src/models/OpportunityPipelineItem.model.js` | provider, challenge/client, plan/match/offer, stage, value, next action, notes | Challenge, User, ExecutionPlan, MatchRecord, OutcomeOffer, ProviderProfile | Notes/lost reason | opportunity/first-client services | Provider CRM |
| `OutcomeChallenge` | `server/src/models/OutcomeChallenge.model.js` | client, goal/outcome, metrics, proof, budget, status, review | User | Admin review notes/status | No controller/service import found | Appears to be an older/parallel challenge model |
| `OutcomeOffer` | `server/src/models/OutcomeOffer.model.js` | provider, outcome, criteria, proof, delivery, price, availability, quality, moderation | User, ProviderProfile | Moderation/AI metadata | offer, match, plan, admin, profile services | Primary offer model |
| `OutreachEmail` | `server/src/models/OutreachEmail.js` | owner, lead/template/job/campaign, recipient, subject/body, status | User, Lead, EmailTemplate, OutreachJob, Campaign | Recipient/body/error | outreach/subscription/user services | Email operations |
| `OutreachJob` | `server/src/models/OutreachJob.js` | owner, template, filters, status/counts/errors/times | User, EmailTemplate | Error details | outreach/user services | Queue work |
| `Portfolio` | `server/src/models/Portfolio.js` | owner, title, industry, results, media, testimonial, client | User | Client/testimonial details | portfolio/provider/profile/user services | Public profile content |
| `Project` | `server/src/models/Project.js` | client, provider, title, description, budget, status, deadline | User | Commercial details | project/payment/user services | Marketplace work |
| `ProofAsset` | `server/src/models/ProofAsset.model.js` | provider/profile, type, file/link/text, contexts, review, extraction, verification, visibility | Challenge, ExecutionPlan, OutcomeOffer, User, ProviderProfile | Files, review, AI extraction | proof/admin/first-client services | Proof vault aggregate |
| `Proposal` | `server/src/models/Proposal.js` | provider, project, text, bid, duration, status | User, Project | Commercial proposal | `userService` | No dedicated proposal route/service found |
| `ProviderProfile` | `server/src/models/ProviderProfile.js` | owner, identity, skills/categories, prices, availability, stats, moderation, verification, badges | User, Portfolio, `VerifiedOutcome` | Verification docs, moderation note | provider/search/match/offer/profile/admin services | `VerifiedOutcome` ref has no model file found |
| `Review` | `server/src/models/Review.js` | user/reviewer/target, project/provider/service, text, rating, status | User, Project, Service | Review authorship | review/user services | Multiple identity fields |
| `SavedItem` | `server/src/models/SavedItem.js` | item type, provider, service, user | User, Service | User preference | saved/service services | Legacy/general saved model |
| `SavedProvider` | `server/src/models/SavedProvider.model.js` | client, provider/profile, challenge, status, note, tags, snapshot | Challenge, User, ProviderProfile | Notes/comparison snapshot | saved-provider service | Client-specific saved model |
| `ScrapeJob` | `server/src/models/ScrapeJob.js` | owner, keyword/location, status/counts/error, leads, timing | User, Lead | Search/error data | lead scraper/user services | Aliased as `LeadScrapeJob` |
| `Service` | `server/src/models/Service.js` | provider, slug/category, description, pricing, delivery, skills/media, moderation/stats | User | Moderation note | service/provider/profile/saved services | Marketplace service |
| `Settings` | `server/src/models/Settings.js` | user, theme, timezone, email/notification preferences | User | Communication preferences | `userService` | Overlaps `UserSettings` |
| `Subscription` | `server/src/models/Subscription.js` | user, plan, status, Stripe customer/subscription/price, period, limits | User | Stripe IDs | subscription/user services | Billing |
| `SubscriptionPlan` | `server/src/models/SubscriptionPlan.js` | key, name, prices, limits, Stripe price, features, active/order | None | Stripe price ID | `subscriptionService` | Plan catalog |
| `Team` | `server/src/models/Team.js` | owner, members, permissions, name | User | Membership/permissions | `userService` | No dedicated team routes found |
| `User` | `server/src/models/User.js` | identity, email/password, refresh/reset/verify tokens, role/status, permissions, profile/subscription, Stripe Connect | UserProfile, Subscription | Password, tokens, email, admin permissions, Stripe Connect | auth and most domain services/middleware | Central security model |
| `UserActivity` | `server/src/models/UserActivity.js` | user, description, type | User | Activity narrative | feed/profile/user services | Activity |
| `UserMedia` | `server/src/models/UserMedia.js` | user, type, size, provider, public ID, URL | User | Uploaded asset identifiers | profile/user services | Media |
| `UserProfile` | `server/src/models/UserProfile.js` | owner, identity, professional/skills/services/proof/readiness/trust/matching/growth, onboarding, publish, privacy, experience/education | User | Phone, privacy, analytics, trust state | profile/search/match/offer/admin services | Very large aggregate with many embedded schemas |
| `UserSettings` | `server/src/models/UserSettings.js` | user, dark mode, email notifications, language, visibility, 2FA flag | User | Preferences/2FA state | profile/challenge/match/user services | Overlaps `Settings` |

### Model-Layer Compatibility and Helper Files

| File | Purpose | Risk |
| --- | --- | --- |
| `server/src/models/base.model.js` | Shared schema options and sensitive-field removal | Medium: not all models visibly use it |
| `server/src/models/LeadScrapeJob.js` | Re-exports `ScrapeJob` as `LeadScrapeJob` | Medium: alias obscures canonical name |
| `server/src/models/ProviderProfile.model.js` | Compatibility re-export | Low/medium |
| `server/src/models/User.model.js` | Compatibility re-export | Low/medium |
| `server/src/models/UserProfile.model.js` | Compatibility re-export | Low/medium |

## Frontend Services and API Clients

| Name | File | Purpose | Used by | Duplicate/risk | Risk |
| --- | --- | --- | --- | --- | --- |
| `adminService` | `client/src/features/admin/adminService.js` | Admin lists/moderation | Admin hooks/pages | Legacy admin functions also in `services/api.js` | Medium |
| `authService` | `client/src/features/auth/authService.js` | Login/session/password/email | Auth provider/pages | Canonical frontend auth service | High |
| `challengeService` | `client/src/features/challenges/challengeService.js` | Challenge CRUD/lifecycle | Challenge hooks/pages | v1 prefix added in utility | Medium |
| `dashboardService` | `client/src/features/dashboard/dashboardService.js` | Account dashboard/feed | Dashboard hooks/pages | Also re-exported through legacy facade | Low |
| `executionPlanService` | `client/src/features/executionPlans/executionPlanService.js` | Plan workflow | Plan hooks/pages | Feature-specific v1 routing | Medium |
| `firstClientService` | `client/src/features/firstClient/firstClientService.js` | First-client workflow | First-client hooks/pages | None obvious | Medium |
| `matchService` | `client/src/features/matches/matchService.js` | Provider/client matching | Match hooks/pages | None obvious | Medium |
| `opportunityService` | `client/src/features/opportunities/opportunityService.js` | Opportunity pipeline | Opportunity hooks/pages | None obvious | Medium |
| `outcomeOfferService` | `client/src/features/outcomeOffers/outcomeOfferService.js` | Offer CRUD/lifecycle | Offer hooks/pages | None obvious | Medium |
| `profileService` | `client/src/features/profile/profileService.js` | Owner/public profile | Profile hooks/pages | Large legacy profile facade also exists | High |
| `proofAssetService` | `client/src/features/proofAssets/proofAssetService.js` | Proof asset CRUD/links | Proof hooks/pages | None obvious | Medium |
| `providerService` | `client/src/features/providers/providerService.js` | Directory/profile/compare | Provider hooks/pages | Some provider calls also in legacy facade | Medium |
| `savedProviderService` | `client/src/features/savedProviders/savedProviderService.js` | Client saved providers | Saved-provider hooks/pages | General saved-item system also exists | Medium |
| `socialService` | `client/src/features/social/socialService.js` | Follow/connection actions | Social hooks/provider UI | Connection functions also in legacy facade | Medium |
| API facade | `client/src/services/api.js` | Broad legacy API surface and fallback data | Many older pages/hooks | Duplicates feature services; hardcoded endpoints; fallback data | High |
| Axios client | `client/src/services/apiClient.js` | Base URL, auth, refresh, errors, verbs | All services | Security/runtime critical | High |
| API contracts | `client/src/services/apiContracts.js` | Envelope/direct response normalization | API client | Indicates mixed backend contracts | Medium |
| API errors | `client/src/services/apiErrors.js` | Error normalization | API client/features | Central error contract | Medium |
| Query client | `client/src/services/queryClient.js` | TanStack Query policy | App/hooks | Infrastructure, not domain service | Medium |
| Messaging socket | `client/src/services/messagingSocket.js` | Socket.IO connection | Messaging stores/pages | Realtime auth coupling | Medium |
| Shared service utils | `client/src/services/shared/serviceUtils.js` | Query strings and collection mapping | Feature services | Low duplication | Low |
| Service barrels | `client/src/services/index.js`, `client/src/services/shared/index.js` | Re-exports | Imports across client | Barrel/circular-import watch | Low |

## Backend Services

| Service | File | Purpose | Primary users | Duplicate/risk | Risk |
| --- | --- | --- | --- | --- | --- |
| Admin | `server/src/services/admin.service.js` | Moderation/admin lists/overview | Admin controller/routes | Canonical modern admin service | High |
| Analytics | `server/src/services/analyticsService.js` | Visits/events/summary | Analytics controller | None obvious | Medium |
| Auth facade | `server/src/services/auth.service.js` | Auth compatibility/facade | Auth layers | Coexists with two auth services | High |
| Auth core | `server/src/services/authService.js` | Sessions, users, password/email tokens | Auth module/controllers/middleware | Large security-critical service | High |
| Module auth | `server/src/modules/auth/auth.service.js` | Module-owned auth orchestration | Module auth controller | Third auth service layer | High |
| Blog | `server/src/services/blogService.js` | Blog reads/admin writes | Blog/admin controllers | None obvious | Low |
| Campaign | `server/src/services/campaignService.js` | Campaign lifecycle | Account controller/queues | Coupled to leads/outreach | Medium |
| Category | `server/src/services/categoryService.js` | Marketplace taxonomy | Marketplace/admin controllers | None obvious | Low |
| Challenge | `server/src/services/challenge.service.js` | Challenge lifecycle/quality | v1 challenge/admin/match | Canonical ProofArena challenge service | High |
| Cloudinary | `server/src/services/cloudinaryService.js` | Upload/delete and local URL fallback | Profile/service/message uploads | Storage-provider boundary | High |
| Connection | `server/src/services/connectionService.js` | Connections/blocking/search | Connection/messaging | Security/privacy-sensitive | High |
| Contact | `server/src/services/contactService.js` | Contact lead creation | Contact controller | Writes Lead model | Medium |
| Database | `server/src/services/databaseService.js` | DB readiness helper | Vercel/server entry | Overlaps config/db responsibility | Medium |
| Email facade | `server/src/services/emailService.js` | Legacy email export/wrapper | Older callers | Coexists with `services/email/*` | High |
| Email delivery | `server/src/services/email/email.service.js` | SMTP/dev outbox email delivery | Auth/contact/outreach | Provider-critical | High |
| Email templates | `server/src/services/email/email.templates.js` | Verification/reset/lead templates | Email service | Content helper in service folder | Low |
| Dev email outbox | `server/src/services/email/devEmailOutbox.js` | Development email persistence | Email service | Must not be production delivery | Medium |
| Execution plan | `server/src/services/executionPlan.service.js` | Plan CRUD, scoring, decisions | Plan controller/match/proof | Large aggregate | High |
| First client | `server/src/services/firstClient.service.js` | Readiness/badges/starter challenges | First-client controller | Cross-domain coupling | High |
| Follow | `server/src/services/followService.js` | Follow status/actions | Follow controller | None obvious | Medium |
| Lead activity | `server/src/services/leadActivityService.js` | CRM activity records | Lead/account | None obvious | Low |
| Lead scraper | `server/src/services/leadScraperService.js` | Scrape jobs/queue processor | Account/jobs | External/queue behavior | High |
| Lead | `server/src/services/leadService.js` | Lead CRUD/import | Lead/account/contact | PII-heavy | High |
| Marketplace payment | `server/src/services/marketplacePaymentService.js` | Connect, checkout, transactions, release | Marketplace/admin controllers | Financial | High |
| Match | `server/src/services/match.service.js` | Scoring/generation/status | Match/plan/challenge | Large matching engine | High |
| Messaging auth | `server/src/services/messagingAuthService.js` | Resolve socket/message principal | Messaging middleware/socket | Auth-critical | High |
| Messaging | `server/src/services/messagingService.js` | Conversations/messages/support | Message controllers/socket | Sensitive data | High |
| Networking | `server/src/services/networkingService.js` | Feed/posts/comments | Network controller | User content | Medium |
| Notification | `server/src/services/notificationService.js` | Notifications | Notification/campaign | Realtime coupling | Medium |
| Opportunity pipeline | `server/src/services/opportunityPipeline.service.js` | Provider CRM lifecycle | Opportunity controller | No explicit provider route role | High |
| Outcome offer | `server/src/services/outcomeOffer.service.js` | Offer lifecycle/quality | Offer/admin/match | Large aggregate | High |
| Outreach | `server/src/services/outreachService.js` | Templates/emails/automation | Account/queues | Email/PII/queue coupling | High |
| Portfolio | `server/src/services/portfolioService.js` | Portfolio reads/writes | Portfolio/account | None obvious | Medium |
| Profile facade | `server/src/services/profile.service.js` | Thin profile operation facade | Profile controller | Wraps `userProfileService`; duplicate naming | High |
| Project | `server/src/services/projectService.js` | Project CRUD | Account/payment | None obvious | Medium |
| Proof asset | `server/src/services/proofAsset.service.js` | Proof asset lifecycle | Proof/admin/offer/plan | Files/verification | High |
| Provider public | `server/src/services/providerPublicService.js` | Public provider detail/connect | Provider controller | Overlaps search/profile services | Medium |
| Provider search | `server/src/services/providerSearchService.js` | Search/filter/compare/admin provider | Provider/admin controllers | Very large service | High |
| Provider verification | `server/src/services/providerVerificationService.js` | Verification request upload | Provider controller | Sensitive documents | High |
| Queue | `server/src/services/queueService.js` | BullMQ registration/enqueue/close | Scraper/outreach/workers | Redis-dependent | High |
| Review | `server/src/services/reviewService.js` | Review read/write/admin | Review/account/admin | None obvious | Medium |
| Saved item | `server/src/services/savedItemService.js` | General saved records | Saved controller/provider UI | Overlaps saved-provider service | Medium |
| Saved provider | `server/src/services/savedProvider.service.js` | Client provider shortlist | v1 saved-provider controller | Overlaps SavedItem | Medium |
| Marketplace service | `server/src/services/serviceService.js` | Service CRUD/search/favorites/moderation | Service/marketplace/admin | Very large, many responsibilities | High |
| Socket | `server/src/services/socketService.js` | Presence/events/server setup | Server/messaging | Realtime lifecycle | High |
| Stripe | `server/src/services/stripeService.js` | Stripe client/config assertions | Billing/payment services | Financial/config critical | High |
| Subscription | `server/src/services/subscriptionService.js` | Plans, usage, checkout, portal, webhooks | Billing/admin/middleware | Financial and quota critical | High |
| User activity feed | `server/src/services/userActivityFeedService.js` | User activity aggregation | Account/profile | Cross-model aggregation | Medium |
| User profile | `server/src/services/userProfileService.js` | Full profile, onboarding, privacy, admin | Profile/admin/provider services | 3,000+ line concentration | High |
| User | `server/src/services/userService.js` | Admin users and cross-model user deletion/update | User/admin controllers | Broad cascade ownership | High |

## React Hook Inventory

### Shared Hooks (`client/src/hooks`)

| Hook file | Purpose | Used by | Duplicate/risk | Risk |
| --- | --- | --- | --- | --- |
| `useAdminLeads.js` | Admin lead queries | Admin lead UI | Legacy admin data path | Medium |
| `useAdminLogin.js` | Admin login wrapper | Admin/auth UI | General auth hook also exists | Medium |
| `useAdminMutations.js` | Admin mutations | Admin pages | Legacy API facade | Medium |
| `useAdminSaas.js` | SaaS/admin plan data | Admin dashboard | Separate feature admin hooks exist | Medium |
| `useAsync.js` | Generic async state | Shared components | Local async pattern | Low |
| `useAuth.js` | Compatibility auth hook | Older components | Duplicates `features/auth/useAuth.js` | High |
| `useBlogs.js` | Blog query | Public pages | Legacy API facade | Low |
| `useClickOutside.js` | Outside-click handling | Menus/popovers | Shared interaction utility | Low |
| `useCopyToClipboard.js` | Clipboard state | UI actions | Wraps utility | Low |
| `useDebounce.js` | Debounced values | Search/forms | Shared | Low |
| `useHealthCheck.js` | API health query | Health/status UI | Endpoint version choice | Medium |
| `useLeadMutations.js` | Lead changes | CRM | Legacy API facade | Medium |
| `useLeadScraper.js` | Scraper query/mutation | Scraper page | Queue/API coupling | High |
| `useLocalStorage.js` | Browser persistence | UI/settings | SSR/browser guard required | Medium |
| `useMediaQuery.js` | Responsive state | Layout/UI | Browser listener lifecycle | Low |
| `useMyDashboard.js` | Account dashboard | Dashboard | Feature dashboard service | Low |
| `useMyLeads.js` | Lead collection | CRM | Legacy API facade | Medium |
| `useMyProfile.js` | Account profile | Profile/dashboard | Profile feature hook also exists | High |
| `useOutreach.js` | Outreach data/actions | Outreach UI | Legacy API facade | High |
| `usePageAnalytics.js` | Page tracking | App/routes | Side-effect hook | Medium |
| `usePortfolio.js` | Portfolio query | Public/profile | Legacy API facade | Low |
| `useReviews.js` | Review query | Public/provider | Legacy API facade | Low |
| `useRoutePath.js` | Route helper | Navigation | Low | Low |
| `useServices.js` | Services query | Marketplace | Legacy API facade/fallbacks | Medium |
| `useSidebarState.js` | Persisted collapse/mobile state | Dashboard shells | Layout-critical | High |
| `useSubmitLead.js` | Contact lead mutation | Contact forms | Legacy API facade | Medium |
| `useSubscription.js` | Billing/subscription | Billing UI | Financial state | High |
| `useToast.js` | Toast context access | Shared UI | Shared | Low |
| `useToggle.js` | Boolean state | Shared UI | Shared | Low |

### Feature and Layout Hooks

| Hook file | Purpose | Risk |
| --- | --- | --- |
| `client/src/features/admin/useAdmin.js` | Admin overview/list/moderation queries | High |
| `client/src/features/auth/useAuth.js` | Canonical auth context hook | High |
| `client/src/features/challenges/useChallenges.js` | Challenge queries/mutations | Medium |
| `client/src/features/executionPlans/useExecutionPlans.js` | Plan queries/mutations | Medium |
| `client/src/features/firstClient/useFirstClient.js` | First-client state | Medium |
| `client/src/features/matches/useMatches.js` | Matching queries/mutations | Medium |
| `client/src/features/opportunities/useOpportunities.js` | Opportunity state | Medium |
| `client/src/features/outcomeOffers/useOutcomeOffers.js` | Offer state | Medium |
| `client/src/features/profile/useProfile.js` | Profile queries/mutations | High |
| `client/src/features/proofAssets/useProofAssets.js` | Proof asset state | Medium |
| `client/src/features/providers/useProviders.js` | Provider search/detail/compare | Medium |
| `client/src/features/savedProviders/useSavedProviders.js` | Saved provider state | Medium |
| `client/src/features/social/useSocialActions.js` | Follow/connection mutations | Medium |
| `client/src/layouts/useSidebarShell.js` | Shared dashboard shell composition | High |
| `client/src/modules/proofarena/hooks/useProofArenaModule.js` | ProofArena module access | Medium/unknown |

Zustand files named `use*Store.js` are documented as state stores, not counted as custom hooks.

## Utility Inventory

### Frontend Utilities

| File | Purpose | Possible duplicate/ownership | Risk |
| --- | --- | --- | --- |
| `utils/accessPolicy.js` | Auth/role/route/nav decisions | Overlaps feature role access by design | High |
| `utils/challengeNextAction.js` | Challenge workflow next action | Challenges | Medium |
| `utils/cn.js` | Class-name composition | Shared UI | Low |
| `utils/constants.js` | Fallback marketplace/service/portfolio data | Duplicates constants folder; fake/fallback data boundary | High |
| `utils/copyToClipboard.js` | Clipboard helper | Hook wrapper | Low |
| `utils/formatCurrency.js` | Currency formatting | Shared | Low |
| `utils/formatDate.js` | Date formatting | Shared | Low |
| `utils/formatFileSize.js` | File sizes | Upload/proof | Low |
| `utils/formatNumber.js` | Numeric formatting | Shared | Low |
| `utils/getDashboardPathForRole.js` | Role dashboard fallback | Access policy also exposes this behavior | Medium |
| `utils/getInitials.js` | Avatar initials | Shared | Low |
| `utils/motion.js` | Motion/reduced-motion support | Shared UI | Medium |
| `utils/navigationActive.js` | Active path matching | Navigation | High |
| `utils/navigationFilter.js` | Visibility filtering | Access policy/navigation | High |
| `utils/proofReadiness.js` | Proof readiness calculation | Proof/profile | Medium |
| `utils/providerActions.js` | Provider CTA decisions | Provider/profile | Medium |
| `utils/providerReadiness.js` | Provider readiness | Provider/profile | Medium |
| `utils/routeHelpers.js` | Registry construction/path matching | Route metadata | High |
| `utils/routeMetadata.js` | Metadata lookup/breadcrumb helpers | Config metadata | High |
| `utils/routeValidation.js` | Known route/group/fallback checks | Access policy | High |
| `utils/slugify.js` | Client slug generation | Backend has separate slugify | Low |
| `utils/storage.js` | Browser storage wrapper | Local-storage hook/store overlap | Medium |
| `utils/truncateText.js` | Display truncation | Shared | Low |
| `utils/validators.js` | Shared frontend validators | Feature-local validation also exists | Medium |
| `utils/profile/profileReadinessTypes.js` | Profile readiness constants/types | Profile | Medium |
| `utils/index.js` | Barrel exports | Circular import watch | Low |

### Backend Utilities

| File | Purpose | Duplicate/ownership | Risk |
| --- | --- | --- | --- |
| `utils/apiResponse.js` | Success/error/pagination envelopes | Legacy direct responses coexist | High |
| `utils/AppError.js` | Legacy app error | Also `errors/AppError.js` | High |
| `utils/asyncHandler.js` | Async controller wrapper | Shared | Low |
| `utils/buildQuery.js` | Query/filter builder | Service-specific query code also exists | Medium |
| `utils/cookie.utils.js` | Refresh cookie options/path | Auth security | High |
| `utils/logger.js` | Structured logging | Shared | Medium |
| `utils/ownerScope.js` | Ownership query scoping | Authorization-sensitive | High |
| `utils/pagination.js` | Pagination parsing | Shared | Low |
| `utils/profileProjection.js` | Public/owner profile projection | Profile security | High |
| `utils/sanitizeInput.js` | Input cleaning | Sanitization middleware also exists | Medium |
| `utils/slugify.js` | Backend slug generation | Client has separate implementation | Low |
| `utils/token.utils.js` | JWT/token helpers | Auth security | High |
| `utils/index.js` | Barrel exports | Circular import watch | Low |

## Validation Helpers

| File | Domain | Used by | Risk |
| --- | --- | --- | --- |
| `validators/admin.validator.js` | Admin list/moderation | Admin routes | High |
| `validators/auth.validator.js` | Legacy/shared auth | Auth layers | High |
| `validators/challenge.validator.js` | Challenges | v1 challenge routes | Medium |
| `validators/common.validator.js` | Shared Zod fragments | Multiple validators | Medium |
| `validators/contactValidators.js` | Express contact rules | Contact route | Medium |
| `validators/executionPlan.validator.js` | Execution plans | v1 plan routes | Medium |
| `validators/firstClient.validator.js` | First-client query | First-client route | Low |
| `validators/match.validator.js` | Matching | Match routes | Medium |
| `validators/opportunityPipeline.validator.js` | Opportunities | Opportunity routes | Medium |
| `validators/outcomeOffer.validator.js` | Offers | Offer routes | Medium |
| `validators/profile.validator.js` | Profile | Profile routes | High |
| `validators/proofAsset.validator.js` | Proof assets | Proof routes | Medium |
| `validators/provider.validator.js` | Provider search/compare | Provider/marketplace routes | Medium |
| `validators/savedProvider.validator.js` | Saved providers | Saved-provider routes | Medium |
| `validators/search.validator.js` | Search | Search/provider services | Low |

Additional auth validators exist in `server/src/modules/auth/auth.validators.js`.

## Constants and Configuration Helpers

### Frontend

- `client/src/constants/routes.js`: route paths.
- `client/src/constants/apiEndpoints.js`: frontend API contract.
- `client/src/constants/queryKeys.js`: TanStack Query keys.
- `client/src/constants/statuses.js`: roles and workflow statuses.
- `client/src/constants/designTokens.js`: design tokens.
- `client/src/constants/navigation.js`: navigation compatibility exports.
- `client/src/config/routeMetadata.js`: route registry.
- `client/src/config/navigation/*.js`: public/provider/client/admin navigation.
- `client/src/config/modulePlaceholders.js`: future-module placeholder copy.
- `client/src/config/profile/*.js`: profile sections, completion, onboarding.
- `client/src/config/env.js`: Vite environment validation.

### Backend

- `server/src/constants/roles.js`, `statuses.js`: role/status vocabulary.
- `server/src/constants/subscriptionPlans.js`: plan defaults.
- `server/src/constants/serviceCategories.js`: marketplace taxonomy defaults.
- `server/src/constants/queueNames.js`: queue identifiers.
- `server/src/constants/profile.constants.js`: profile vocabulary.
- `server/src/config/env.js`: environment validation.
- `server/src/config/db.js`: database connection/index repair.
- `server/src/config/cors.js`: origin policy.
- `server/src/config/cloudinary.js`: storage provider.

## Ownership Conclusions

1. Feature folders are the clearest frontend ownership boundary for new ProofArena work.
2. Backend ProofArena domains are still service/route/model files rather than fully moved into `server/src/modules/proofarena`.
3. Auth is the only backend domain with an explicit module boundary, but legacy facades remain.
4. Profile, provider search, service marketplace, and auth have the highest concentration/duplication risk.
5. Saved providers and saved items, Settings and UserSettings, Challenge and OutcomeChallenge, and the three profile model filenames need explicit canonical ownership before refactoring.

## Prompt 2 Verification Update

- Confirmed 45 registered Mongoose models across 50 model-layer files.
- Confirmed 23 frontend and 50 backend service-layer files.
- Confirmed 44 custom hook files; five Zustand `useStore` files remain classified as state stores.
- Expanded utility coverage to 79 shared, feature, validator, route, and error-helper files.
- Model route/controller/service usage and syntactic index evidence are recorded in `STAGE_1_1_MODEL_USAGE_MAP.md`.
- Importer, dependency, duplicate-candidate, reuse-safety, and risk evidence is recorded in `STAGE_1_1_REUSABLE_CODE_MAP.md`.
