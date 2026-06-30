# Stage 4 Prompt 9 Handoff

Prompt 9 must verify Prompt 8 against active guards, layouts, pages, constants, route declarations, NotFound, and wildcard ordering. Correct the redirect and 404 matrices, establish source-of-truth status, and produce hardening, batch, validation, rollback, risk, and readiness decisions.

Remain documentation-only. Preserve external URL classification, browser/API 404 separation, Stage 4.1 and 4.2 blockers, and the single platform routing stack. Do not edit redirects, routes, constants, navigation, guards, auth, 404 behavior, or imports.

Do not implement redirect or 404 changes until existing redirect behavior, wildcard ordering, NotFound handling, auth/role redirects, route constants, loop risks, and rollback conditions are fully verified and an explicit safe implementation gate approves the exact batch.

## Exact Warning

Do not modify redirect rules, 404 behavior, wildcard routes, unauthorized redirects, forbidden redirects, login redirects, logout redirects, onboarding redirects, role-landing redirects, route constants, navigation, or guards until the redirect/404 audit is verified and a safe hardening plan exists.
