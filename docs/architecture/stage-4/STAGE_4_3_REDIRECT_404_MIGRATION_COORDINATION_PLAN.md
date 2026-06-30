# Stage 4.3 Redirect and 404 Migration Coordination Plan

- Preserve terminal wildcard, explicit /not-found, /403, /not-authorized, /500 and server API 404.
- Preserve Navigate replace/state behavior and query strings.
- Do not migrate window.location redirects as ordinary links.
- Do not change role landing or unauthorized fallback while replacing constants.
- Stage 4.3 owns redirect/404 behavior; Stage 4.1 may only provide approved constants.
- Required tests: login return path, wrong-role fallback, email verification, logout, invalid step, unknown path, dynamic deep links.
+
## Redirect and Fallback Coordination Matrix

| Behavior ID | File | Type | Source | Target | Proposed key | Planned action | Security risk | UX risk | Validation | Batch | Human review |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R4M-001 | client/src/routes/AppRoutes.jsx | wildcard/404 | `*` | NotFound component | none; keep literal | Keep unchanged; terminal-order policy | high if reordered | high | Unknown and explicit route matrix | B0/B7 only if approved | no for no-op |
| R4M-002 | AppRoutes.jsx and NotFound.jsx | explicit 404 | `/not-found` | NotFound component | `SYSTEM_ROUTES.NOT_FOUND` | Keep unchanged; requires 404 URL decision for any redirect | low current | medium ambiguity | Explicit versus wildcard URL/history | B7 blocked | yes |
| R4M-003 | RoleRoute/accessPolicy | unauthorized/forbidden | attempted protected path | `/not-authorized` or `/403` | Existing SYSTEM/PUBLIC keys; canonical TBD | Requires denial-policy decision; retain aliases | critical | high | Full role/priority/history matrix | B7 blocked | yes |
| R4M-004 | ProtectedRoute/RoleRoute | login redirect | protected path | `/login` | `AUTH_ROUTES.LOGIN` | Keep existing constant and state.from | critical | high | Anonymous login return and loop | B7 blocked | auth/security |
| R4M-005 | EmailVerifiedRoute | verification redirect | protected path | `/resend-verification` | `AUTH_ROUTES.RESEND_VERIFICATION` | Keep target, reason, state, replace behavior | high | high | Verified/unverified matrix | B7 blocked | auth |
| R4M-006 | PublicOnlyRoute/authRouteUtils | role landing | login/register | role dashboard | Existing dashboard/client/admin keys | Requires approved role landing parity | critical | high | Client/provider/support/admin/unknown role | B7 blocked | security/product |
| R4M-007 | Dashboard/Client/Admin layouts | unauthorized fallback | metadata denial | role/login/home/not-authorized | Existing accessPolicy constants | Keep unchanged; metadata gaps first | critical | high | Layout/child guard priority | B7 blocked | security |
| R4M-008 | Active page window redirects | imperative internal redirect | service/marketplace/profile/connections/account | login/messages/settings/home | Existing grouped keys/builders after exact review | Do not treat as ordinary link; preserve query/history semantics | critical | high | Reachability, query, history, loop | B7 blocked | yes |
| R4M-009 | Legacy Auth/Admin/guards | legacy role redirect | legacy paths | dashboard/admin/login/home | Existing keys after reachability proof | Exclude until live/dead status is proven | critical if reactivated | medium | Import/runtime graph and auth regression | Excluded | yes |
| R4M-010 | Profile onboarding step | invalid parameter fallback | invalid step | `/not-found` | `SYSTEM_ROUTES.NOT_FOUND` | Keep unchanged pending parameter tests | medium | medium | Invalid/valid step deep links | B7 blocked | domain owner |
| R4M-011 | Server API notFound | API 404 | unmatched API endpoint | Structured API error | excluded | Keep separate from browser route constants | critical boundary | none for browser | Separate API contract tests | Excluded | architecture/API |

