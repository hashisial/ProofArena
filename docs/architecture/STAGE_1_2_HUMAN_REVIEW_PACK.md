# Stage 1.2 Human Review Pack

Generated: 2026-06-27

## Ten Decisions Required

1. Confirm ScaleOps remains the parent and ProofArena remains an in-repository flagship module.
2. Select the long-term client entry among `/client`, `/dashboard/client`, and `/dashboard/workspace`.
3. Select the canonical admin proof UX among `/admin/proofs`, `/admin/proof-assets`, and `/admin/proof-review`.
4. Select the canonical API version and deprecation window for `/api` versus `/api/v1`.
5. Approve `apiClient.js` as transport and feature services as domain request owners; define the `api.js` compatibility window.
6. Decide whether shared protected-shell primitives may be extracted while role wrappers remain mandatory.
7. Determine runtime/owner status of RootLayout/Layout and six unmapped page files.
8. Approve replacement behavior for FALLBACK_SERVICES, FALLBACK_PORTFOLIO, and fallback reviews.
9. Approve production email provider and user/email/IP throttling requirements.
10. Approve the minimum automated regression baseline before cleanup execution.

## Ten Files/Systems Not to Touch Casually

- `client/src/routes/AppRoutes.jsx`
- `client/src/constants/routes.js`
- `client/src/services/apiClient.js`
- `client/src/services/api.js`
- `client/src/features/auth/AuthProvider.jsx` and auth store/hooks
- `client/src/layouts/DashboardLayout.jsx`
- `client/src/layouts/ClientLayout.jsx`
- `client/src/layouts/AdminLayout.jsx`
- `server/src/routes/index.js` and `server/src/routes/v1/index.js`
- Backend auth/payment/model critical files in the Stage 1.1 protection list

## Ten Highest Duplicate/Placeholder Risks

Protected shell drift; route fallback fragmentation; client aliases; admin proof aliases; facade/endpoint literals; API version builders; auth service generations; business fallbacks; email/rate-limit gaps; unknown legacy page ownership.

## Ten Cleanup Blockers

No tests; RootLayout ownership; six page owners; client alias policy; admin proof policy; API version policy; facade method map; auth generations; email provider/throttling; compatibility telemetry.

## Recommended Locks

Use AppRoutes for declaration, grouped routes.js exports for browser paths, routeMetadata for descriptions only, role-specific layout wrappers, SidebarCore, apiClient for HTTP transport, apiEndpoints for HTTP paths, feature services for domain requests, and shared state components for explicit placeholders.

## Cleanup Order

Tests and decisions; routes/guards; layout primitives; API facade/version; placeholder/fallback retirement; backend/model/shared utility cleanup; deletion last.

## Absolute Warnings

**Do not create a separate ProofArena app.**

**Do not duplicate route, layout, dashboard, API client, authentication, or navigation systems.**

No production file is approved for deletion.

