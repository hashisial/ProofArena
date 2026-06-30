# Stage 4.3 Route Constant Alignment for Redirects and 404

Core guard, role, verification, role-default, explicit NotFound, and page component links generally use the established constants registry. Hardcoded internal exceptions remain in Account, Connections, Marketplace, ServiceDetail, Profile, and apparently legacy Auth/AdminGate code.

External payment/session URLs and reload operations are not route-constant candidates. Query-bearing internal destinations require approved builders rather than string concatenation. Alignment work remains coupled to Stage 4.1 and is not authorized.

