# Stage 4.3 Redirect Behavior Inventory

| ID | Trigger/source | Target | Constant | State/history | Status |
|---|---|---|---|---|---|
| RD-001 | Anonymous ProtectedRoute | login | yes | replace plus from | verified |
| RD-002 | Anonymous RoleRoute | login | yes | replace plus from | verified |
| RD-003 | Wrong-role RoleRoute | not-authorized | yes | replace plus from | verified |
| RD-004 | Unverified EmailVerifiedRoute | resend verification | yes | replace plus from/reason | verified |
| RD-005 | Authenticated PublicOnlyRoute | role default | yes through helper | replace | verified with caution |
| RD-006 | Dashboard/Client/Admin layouts | unauthorized fallback | yes through policy | replace; no from | policy overlap |
| RD-007 | Dashboard and DashboardChallenges pages | role landing/not-authorized | yes | replace | verified |
| RD-008 | Invalid onboarding step | NotFound | yes | replace | verified |
| RD-009 | Account | home | no | full reload | hardcoded internal |
| RD-010 | Connections | messages | no | full reload | hardcoded internal |
| RD-011 | Marketplace/ServiceDetail | login | no | full reload | hardcoded internal |
| RD-012 | ServiceDetail | messages query | no | full reload | hardcoded dynamic |
| RD-013 | Profile | settings/public profile | partial/no | full reload | hardcoded/dynamic |
| RD-014 | Legacy Auth/AdminGate | dashboard/admin/recovery | no | full reload/link | reachability unknown |
| RD-015 | Settings/Payments | external session URL | not applicable | external navigation | separate security domain |

Internal page redirects are migration candidates only after reachability and flow tests.

