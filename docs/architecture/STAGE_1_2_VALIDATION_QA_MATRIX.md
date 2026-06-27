# Stage 1.2 Validation and QA Matrix

Generated: 2026-06-27

## Route and Layout QA

| QA ID | Area | Test | Expected result | Failure means | Related files/candidates |
| --- | --- | --- | --- | --- | --- |
| QA-R01 | Public routes | `/`, about, pricing, providers, challenges, leaderboard, contact | Correct PublicLayout; no unexpected 404 | Route/metadata/link regression | AppRoutes, PublicLayout, RTE-001..005 |
| QA-R02 | Auth routes | Login, register, forgot/reset, verify/resend | AuthLayout and correct guest/auth redirect | Auth route policy regression | AuthLayout/guards, RTE-004, API-002 |
| QA-R03 | Provider routes | Dashboard root/profile/offers/challenges/proof/opportunities/settings | DashboardLayout, provider nav/current state | Shell/role/route regression | LAY-003, provider config |
| QA-R04 | Client routes | `/client/*` plus compatibility aliases | ClientLayout for canonical paths; documented aliases preserved | Alias/role regression | RTE-011, ClientLayout |
| QA-R05 | Admin routes | Admin root/users/providers/challenges/proofs/reports/settings | AdminLayout only for allowed role | Admin exposure or alias regression | RTE-012, LAY-004 |
| QA-R06 | Unknown | Unknown public and protected-looking paths | Polished NotFound/authorized fallback without loop | Catch-all/fallback regression | AppRoutes, routeValidation, RTE-016 |
| QA-R07 | Redirects | Guest protected; wrong-role; authenticated public-only | Stable single redirect to approved fallback | Loop or protected flash | Guards/accessPolicy |
| QA-L01 | Public shell | Header/main/footer, back/skip links | One main landmark; correct footer/header | Public ownership drift | LAY-001/002 |
| QA-L02 | Protected grid | Expanded/collapsed desktop | Content expands, no gap/overlap | Shared shell regression | LAY-003..006 |
| QA-L03 | Mobile drawers | Open/overlay/Escape/route-close/focus return | Hidden content not tabbable; focus restored | Accessibility/lifecycle regression | LAY-006 |
| QA-L04 | Topbars | Mobile trigger/account/logout/role actions | Correct role-specific actions | Topbar primitive leaked policy | LAY-007/008 |
| QA-L05 | Nested content | PageHeader, breadcrumbs, SaaS/Workspace wrapper | No duplicate shell or overflow | Inner/outer wrapper confusion | LAY-010 |
| QA-L06 | Responsive | 320, 768, 1024, 1440 widths | No horizontal scroll/collision | Layout extraction regression | All shells |

## API and Auth QA

| QA ID | Area | Test | Expected result | Failure means | Related files/candidates |
| --- | --- | --- | --- | --- | --- |
| QA-A01 | Base URL | Development and production resolution | Exactly one normalized /api base; no production loopback | Env/client regression | apiClient, API-001 |
| QA-A02 | Token | Protected request | Bearer token injected once; credentials preserved | Auth transport regression | apiClient |
| QA-A03 | Refresh | Concurrent 401 responses | One refresh promise; retry; stale auth clears on failure | Session-loop risk | API-001/002 |
| QA-A04 | Public API | Health/services/blog/reviews | Public calls omit user auth where configured | Public endpoint regression | api.js/apiEndpoints |
| QA-A05 | Protected API | Dashboard/profile/account | Correct envelope and 401/403 handling | Service/contract regression | API-003/004/005 |
| QA-A06 | Role API | Admin/provider/client-protected endpoints | Backend middleware remains authoritative | Security boundary regression | Stage 1.1 backend flow |
| QA-A07 | Errors | Network, 4xx, 5xx, validation | Safe normalized error; no raw data; no fake success | Error/fallback regression | apiErrors/api.js |
| QA-A08 | Upload | Avatar/cover multipart | Content-Type and progress handled correctly | Direct-call migration regression | API-008 |
| QA-A09 | Version | Seven feature domains | Correct /v1 behavior for deployment base | Prefix/version regression | API-006/RTE-014 |
| QA-A10 | Realtime | Message connect/reconnect/auth | Socket remains distinct and functional | Incorrect API-client consolidation | API-009 |
| QA-A11 | Email | Recovery/verification/resend | Real delivery in approved production config; no raw tokens | Security placeholder unresolved | WPH-035..037 |
| QA-A12 | Rate limits | Login/recovery abuse cases | Approved user/email/IP throttling without lockout bypass | Security control gap | WPH-036 |

## Placeholder and Deletion QA

| QA ID | Area | Test | Expected result | Failure means | Related files/candidates |
| --- | --- | --- | --- | --- | --- |
| QA-P01 | Disclosed previews | Home preview datasets | Copy clearly says preview/example | Marketing data appears real | WPH-031..034/060 |
| QA-P02 | Empty services | API returns empty | Real empty state; no invented service cards after retirement | Product fallback still masks truth | WPH-028 |
| QA-P03 | Empty portfolio | API returns empty | Real empty state | Fake proof/portfolio content | WPH-029 |
| QA-P04 | Empty reviews | API returns empty | Explicit empty/editorial state | Fake testimonial display | WPH-030 |
| QA-P05 | Unsupported action | Invite/AI/future workflow | Disabled with clear explanation; no mutation | Broken/fake workflow | WPH-049/052/053/054 |
| QA-P06 | Admin search | Field behavior | Disabled/removed or fully connected in owning stage | Visible broken control | WPH-056 |
| QA-P07 | Placeholder routes | Public/client/admin placeholders | Correct shell, title, no fake API | Placeholder architecture regression | WPH-001..024 |
| QA-D01 | Delete proof | Import/route/config/docs/runtime/replacement search | All checks known and human approval recorded | Candidate not safe | Safe-delete policy |
| QA-D02 | Build after deletion | Client build/lint/boundary | Clean with no unresolved import | Hidden consumer | All delete candidates |
| QA-D03 | Runtime after deletion | Full affected QA list | No route/action/async import failure | Runtime ownership missed | RootLayout/unmapped/adapters |

## Command Baseline

Available: client `lint`, `build`, `check:boundaries`; server `check:boundaries`. No maintained test/typecheck scripts or test/spec files were found.

