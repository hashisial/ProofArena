# Stage 4.3 404, NotFound, and Wildcard Inventory

## Inventory Result

The frontend has one explicit not-found route, one terminal global wildcard, and one NotFound page. No separate dashboard, admin, module, or nested wildcard was found. The backend has one terminal API 404 handler exposed through compatibility re-exports; it is a separate response system, not a duplicate browser page.

| Fallback ID | File path | Pattern/path | Component/page | Scope | Route order/position | Uses route constant | Hardcoded path | Layout used | Auth/role dependency | Duplicate fallback risk | Missing fallback risk | Route swallowing risk | UX risk | SEO/indexing concern | Confidence | Human review needed |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| NF-001 | client/src/routes/AppRoutes.jsx | ROUTES.SYSTEM.NOT_FOUND (/not-found) | NotFound | global | explicit route before terminal wildcard | yes | no | router-level page | none | low | low | low | low | explicit error URL may be indexed unless deployment policy prevents it | high | no |
| NF-002 | client/src/routes/AppRoutes.jsx | path=* | NotFound | global | final Route in the active Routes tree | not applicable | wildcard literal | router-level page | indirect only | low | low globally | low at current terminal position | medium | unmatched URLs render client 404; host fallback must still serve the SPA | high | no |
| NF-003 | client/src/pages/NotFound.jsx | rendered by explicit and wildcard routes | NotFound | global | component only; order owned by AppRoutes | recovery links use constants | no | no separate shell identified | none | low | low | none | medium | recovery links and noindex policy require later browser/SEO validation | high | yes |
| NF-004 | client/src/pages/profile/ProfileOnboardingStepPage.jsx | invalid dynamic step | redirect to ROUTES.SYSTEM.NOT_FOUND | module-specific | evaluated after the onboarding route matched | yes | no | dashboard/onboarding context | auth required; role policy indirect | low | low for invalid step | none | low | not material | high | no |
| NF-005 | client/src/utils/accessPolicy.js | route metadata not found | fallback ROUTES.SYSTEM.NOT_FOUND | global access decision | helper result consumed by caller | yes | no | caller-owned | auth/role helper | medium | medium because not every caller uses getAccessDecision | none | medium | not material | high | yes |
| NF-006 | server/src/app.js; server/src/errors/notFoundHandler.js | unmatched API request after registered middleware | structured API error | backend | terminal server middleware | not applicable | no | not applicable | middleware/auth may have run earlier | low | low for API | none | low | not applicable | high | no |
| NF-007 | server/src/errors/index.js; server/src/middleware/errorMiddleware.js; server/src/middleware/notFound.middleware.js | re-export aliases for notFoundHandler | same API handler | backend | no independent execution order | not applicable | no | not applicable | none added | medium naming risk; no duplicate implementation found | low | none | low | not applicable | high | no |
| NF-008 | no scoped declaration found | nested/module path=* | none | nested/module-specific | absent | unknown | unknown | unknown | unknown | low current duplication | medium where local recovery is expected | low because no nested wildcard exists | medium | unknown | medium | yes |
| NF-009 | no scoped declaration found | dashboard/admin fallback | global NotFound handles unmatched leaves | dashboard/admin | absent; global wildcard is final authority | unknown | unknown | no scoped shell recovery | auth/role context is lost at global fallback | low current duplication | medium | low | high for signed-in recovery | unknown | medium | yes |

## Scope Interpretation

- The terminal global wildcard is the only browser catch-all and currently does not precede valid routes.
- Adding scoped fallbacks is not automatically required; product and UX ownership must first decide whether signed-in users should retain their shell on invalid nested URLs.
- Explicit /not-found and wildcard rendering share one page. Their URL semantics differ and must be tested before any redirect is added.
- Browser 404 and API 404 behavior must remain separate authorities.

No wildcard route or 404 behavior was modified.
