# ScaleOps / ProofArena Hooks Architecture

## Purpose

Hooks coordinate reusable React behavior. They do not replace services, React
Query, Zustand, or domain modules.

The ScaleOps client uses JavaScript, so reusable hooks use `.js` files. The
canonical reusable-hook barrel is:

```text
client/src/hooks/index.js
```

## Hook Ownership

### Global Reusable Hooks

Create a hook in `client/src/hooks/` when it:

- Is useful across unrelated ScaleOps and ProofArena features.
- Does not know about a domain API or business rule.
- Coordinates generic browser or React behavior.
- Has a stable, small interface.

Current reusable hooks:

| Hook | Responsibility |
| --- | --- |
| `useDebounce` | Delay propagation of a changing value |
| `useLocalStorage` | SSR-safe localStorage-backed state |
| `useMediaQuery` | Subscribe to responsive media-query changes |
| `useClickOutside` | Detect pointer events outside one or more refs |
| `useToggle` | Manage a small local boolean |
| `useCopyToClipboard` | Copy text and expose copy status |
| `useAsync` | Coordinate a one-off async service call |

### Feature Hooks

Create a hook beside its feature when it owns a domain query, mutation, or
workflow:

```text
client/src/features/<domain>/use<Domain>.js
```

Feature hooks call feature services and use centralized query keys. They should
not call Axios or `fetch`.

### ProofArena Module Hooks

Create a hook under `client/src/modules/proofarena/hooks/` only when it
coordinates multiple ProofArena features and cannot belong to one domain.

`useProofArenaModule` currently exposes only stable module identity and enabled
status. It deliberately does not implement active provider/client context,
module preferences, dashboard filters, or opportunity filters before real
consumers and ownership rules exist.

## Correct Data Flow

```text
UI component
  -> feature React Query hook
  -> feature service
  -> shared API client
```

Correct:

```js
const providersQuery = usePublicProviders(filters);
```

Incorrect:

```js
useEffect(() => {
  fetch("/api/providers").then(/* ... */);
}, []);
```

Hooks should call services because services own endpoint selection, request
construction, response mapping, and normalized API errors. This prevents raw
API contracts from spreading through components.

## Usage Examples

Debounced search:

```js
import { useDebounce } from "../hooks/index.js";

const debouncedSearch = useDebounce(search, 300);
```

Responsive behavior:

```js
const isDesktop = useMediaQuery("(min-width: 1024px)");
```

Local UI preference:

```js
const [density, setDensity, resetDensity] = useLocalStorage(
  "dashboard-density",
  "comfortable",
);
```

Outside-click handling:

```js
const menuRef = useRef(null);
useClickOutside(menuRef, closeMenu, { enabled: isOpen });
```

One-off service call:

```js
const { data, error, execute, isLoading } = useAsync(reportService.exportReport);
```

Use React Query instead of `useAsync` for cached server records, lists,
background refetching, mutations that invalidate caches, and shared remote
state.

## Lifecycle and Safety Rules

1. Clean up timers, listeners, and subscriptions.
2. Guard browser-only APIs for non-browser rendering.
3. Do not update state after a component unmounts.
4. Keep hook dependencies explicit.
5. Use React Query for remote server state.
6. Use Zustand only for small shared client state.
7. Keep isolated UI state local.
8. Do not hide feature business rules inside global hooks.
9. Reuse an existing hook before creating another.
10. Do not create a hook solely to rename one service method.

## What Not To Do

- Do not call raw `fetch` or Axios from hooks.
- Do not duplicate feature queries in global hooks.
- Do not mirror React Query data into localStorage or Zustand.
- Do not use `useAsync` as a replacement for React Query.
- Do not place ProofArena-specific filters or role rules in global hooks.
- Do not expose browser event listeners without cleanup.

## Expansion Checklist

Before adding a hook:

1. Search global hooks, feature hooks, layout hooks, and stores.
2. Confirm whether the concern is generic, feature-owned, module-owned, or
   shared client state.
3. Confirm whether React Query or a service already owns the behavior.
4. Define cleanup and non-browser behavior.
5. Add the hook to the correct barrel only when its API is stable.
