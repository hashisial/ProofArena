# Server State System

## Ownership

ScaleOps uses TanStack React Query as the default owner of remote server state.

- The shared `QueryClient` is created in `client/src/services/queryClient.js`.
- `QueryClientProvider` is mounted once in `client/src/main.jsx`.
- Query keys are owned by `client/src/constants/queryKeys.js`.
- Existing feature services continue to use `client/src/services/apiClient.js`.
- Feature hooks connect services to React Query and expose data to UI components.

Do not create another query client, provider, or parallel server-state store.

## Query Client Defaults

The shared query client uses these defaults:

- Queries remain fresh for 60 seconds.
- Unused query data is garbage-collected after 5 minutes.
- Window focus does not automatically refetch.
- Queries retry once only for network failures, HTTP 408, HTTP 429, and server errors.
- Mutations do not retry automatically.

`setServerStateErrorReporter` provides a future integration point for centralized
logging or monitoring without forcing UI notifications for every background
query failure.

## Query Key Strategy

Use the `queryKeys` factory instead of inline arrays when a key group exists.
Required groups are:

- `auth`
- `profile`
- `challenges`
- `applications`
- `milestones`
- `proof`
- `leaderboard`
- `messages`
- `notifications`
- `billing`
- `admin`

The same factory also preserves established feature key shapes for providers,
saved providers, execution plans, matches, outcome offers, opportunities, proof
assets, first-client mode, and social actions.

Examples:

```js
queryKeys.profile.public(username);
queryKeys.challenges.detail(challengeId);
queryKeys.challenges.me(filters);
queryKeys.matches.challengeProviders(challengeId, filters);
```

Use root or prefix keys for broad invalidation:

```js
queryClient.invalidateQueries({ queryKey: queryKeys.challenges.meRoot });
queryClient.invalidateQueries({
  queryKey: queryKeys.matches.challengeProvidersRoot(challengeId),
});
```

Keep filter objects small, serializable, and stable. Remove empty values before
building filtered query keys.

## React Query Responsibilities

React Query owns:

- Remote records and collections
- Loading, error, and request lifecycle state
- Pagination and filtered result caches
- Mutation status
- Cache invalidation and refetching
- Background freshness

New remote-data flows should follow:

`apiClient -> feature service -> React Query hook -> UI component`

## Zustand Responsibilities

Zustand remains appropriate for:

- Auth and session coordination
- Simple UI preferences and transient layout state
- Socket connection and presence coordination
- Ephemeral realtime counters that synchronize into React Query

Do not store large remote collections, paginated API results, or duplicated
server records in Zustand.

Current stores follow this boundary:

- `useAuthStore.js`: auth/session state
- `useUIStore.js`: simple UI state
- `useSocketStore.js`: realtime connection coordination
- `useNotificationStore.js`: ephemeral notification coordination

The existing auth bootstrap in `features/auth/AuthProvider.jsx` is intentionally
preserved. Do not add a competing `useCurrentUser` query until auth ownership is
redesigned as a dedicated migration.

## Duplicate-Fetching Rules

1. Mount `QueryClientProvider` exactly once.
2. Import the shared query client; never instantiate one inside a component.
3. Reuse an existing feature hook before creating another request for the same
   resource.
4. Reuse query key factories so invalidation reaches all relevant consumers.
5. Do not mirror React Query data into Zustand.
6. Do not add direct API calls inside new UI components.
7. Preserve existing feature key shapes during incremental migrations.

## Incremental Migration Notes

Some legacy pages still use inline query keys or the aggregate
`client/src/services/api.js` module. These should be migrated feature by feature,
with behavior tests, rather than through a broad replacement.

No example `useCurrentUser` or `features/proofarena/useChallenges` hook was added
because the existing auth provider and challenge feature hooks already own those
responsibilities.
