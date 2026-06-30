# Stage 4.3 Route Constant Alignment Verification for Redirects and 404

Constant-backed: active guards, auth default helpers, layout fallback policy, explicit NotFound, invalid onboarding fallback, dashboard role landing, and most router navigation.

Hardcoded internal: Account home, Connections messages, Marketplace and ServiceDetail login, ServiceDetail message query, Profile settings/public profile, plus apparently legacy Auth/AdminGate destinations.

Not internal candidates: external checkout/session URLs, location reload, hash anchors, and browser-origin construction. Dynamic internal migration requires approved builders and parameter contracts. No alignment edit is approved.

