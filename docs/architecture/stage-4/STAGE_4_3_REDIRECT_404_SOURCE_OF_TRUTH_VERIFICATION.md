# Stage 4.3 Redirect and 404 Source-of-Truth Verification

Final planning status:

- Route declarations and wildcard: AppRoutes.jsx is current runtime authority.
- Explicit and wildcard browser 404: AppRoutes.jsx plus NotFound.jsx are current authority.
- Authentication and role redirects: active route guards are current authority.
- Layout policy fallback: accessPolicy.js plus three layouts are current supporting authority.
- Default authenticated destination: authRouteUtils.js and accessPolicy.js are current authority with caution.
- Page-level imperative redirects: distributed behavior, not an approved source-of-truth.
- Server API 404: separate backend authority.

There is no approved single redirect authority. Candidate status must not be promoted without migration and regression evidence.

