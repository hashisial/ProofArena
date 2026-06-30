# Hook Ownership Contract

1. Module hooks manage module-specific query, mutation, state composition, and UI workflow behavior.
2. Global auth/session hooks and state remain platform-owned.
3. Hooks call module services/adapters; they do not create API clients or duplicate transport/error/token logic.
4. Hooks do not own router declarations, route policy, navigation, dashboard shell state, or global configuration.
5. Cross-module hooks require genuinely generic behavior, at least two consumers, shared governance approval, and no domain naming.
6. Hooks may consume another module's public contract only through an approved dependency and never through deep imports.
7. Circular hook/service/module dependencies are forbidden.
8. Remote server state remains in the approved query strategy; global stores are not a shortcut for domain caching.
9. Tests cover success, loading, failure, cancellation/race behavior, mutation invalidation, and permission-sensitive presentation.
10. Stop on auth/session duplication, new API client, circular dependency, or platform ownership.

## Prompt 4 Category Lock

| ID | Category/owner | Allowed location | Forbidden location | Allowed dependencies | Forbidden dependencies | API/auth/shared rule | Risk | Validation |
|---|---|---|---|---|---|---|---|---|
| HC-01 | Module data/module | Owning feature/module hook path | Root shared by default | Module service/adapter, query client, public types | Raw client creation, private cross-module service | Platform client via service; platform auth only | High cache/transport drift | Query/mutation/error/invalidation tests |
| HC-02 | Module form/module | Owning module | Shared unless generic | Module validation/types/services | Router/auth internals | No direct raw request; promote only if domain-neutral | Medium logic leakage | Form/validation/race tests |
| HC-03 | Module UI state/module | Owning module | Global store without evidence | React and module components/types | API/auth/router/platform state | No server-state duplication | Medium state split | State/reset/render tests |
| HC-04 | Auth/platform | Existing auth feature/store public API | Any business module | Platform auth/session APIs | Module token/session/role implementation | Never shared-promoted by modules | Critical security | Login/logout/expiry/denial tests |
| HC-05 | Route/navigation/platform | Routes/layout/navigation platform | Business module | Route constants/platform navigation | Module router/nav registry | No API ownership | Critical routing drift | Route/link/redirect tests |
| HC-06 | API/query/module | Owning module hook path | Components/shared root by default | Module service/adapter and query keys | New axios/fetch/client, backend imports | Auth handled by platform client | High network/caching | Contract/cancellation/error tests |
| HC-07 | Shared utility/shared | Approved shared hooks | Feature/module internals | React/platform-neutral APIs | Product state, API, auth, router | 2+ consumers and generic semantics | High hidden feature | Consumer/cycle tests |
| HC-08 | Dashboard/platform composition | Existing dashboard feature/components | Single domain module | Public module hooks and platform shell | Private services/models | Does not own module data rules | High orchestration coupling | Role/loading/failure tests |
| HC-09 | Admin/admin under platform | Existing admin feature | Shared or unrelated modules | Admin service/adapter and platform roles | Private domain services, role implementation | Backend auth remains authoritative | Critical privilege | Negative-access/audit tests |

No hook may import backend-only code, create a client, or bypass platform auth/roles.

