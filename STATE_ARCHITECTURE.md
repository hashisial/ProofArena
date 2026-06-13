# Global State Architecture

ScaleOps uses Zustand for small shared client state and React Query for server state.
ProofArena remains a module inside the existing ScaleOps client and does not own a second
state-management system.

The canonical global-state directory is:

`client/src/store/`

## Store Structure

```text
client/src/store/
  index.js                    Canonical store exports
  useUIStore.js               App shell and shared UI preferences
  useAuthStore.js             Lightweight authenticated-session coordination
  useProofArenaStore.js       ProofArena cross-page UI context
  useNotificationStore.js     Notification UI and transient toast queue
  useSocketStore.js           Realtime connection coordination
  authSession.js              In-memory token compatibility helper
```

An additional `appStore` was not created because `useUIStore` already owns shared application
shell state. Creating another store would make ownership ambiguous.

## Store Responsibilities

### UI Store

Owns:

- Sidebar collapsed state
- Mobile menu open state
- Shared modal and command-menu state
- Page-title coordination
- Theme preference placeholder: `system`, `light`, or `dark`

The theme preference does not currently change the Olive + Cream theme. It exists as a safe
preference boundary for a future approved theme implementation.

### Auth Store

Owns:

- Current authenticated identity
- In-memory access token
- Role
- Auth error summary
- Auth status: `checking`, `authenticated`, `unauthenticated`, or `error`

The existing `AuthProvider` and auth service own authentication workflows. The store must not
call APIs or become the source of full editable profile data.

### ProofArena Store

Owns:

- Active ProofArena workspace role placeholder: `provider`, `client`, or `admin`

`activeRole` is a UI/workspace preference only. Authorization must always use the authenticated
user and server-side permission checks. Challenge lists, offers, proof assets, matches, plans,
and provider records do not belong in this store.

### Notification Store

Owns:

- Notification panel visibility
- Unread count
- Latest realtime notification
- Transient toast queue with `success`, `error`, `warning`, and `info` tones

The existing `ToastProvider` remains the presentation and timeout layer. Notification history
and paginated records remain React Query data.

### Socket Store

Owns only realtime coordination:

- Connection state
- Active conversation ID
- Minimal online-user presence list

It must not contain message history or full user profiles.

## State Placement Rules

Use Zustand when:

- Multiple unrelated components must coordinate small client-only state.
- State is transient UI, session coordination, or a small user preference.
- State does not represent an API-owned record collection.

Use component-local state when:

- Only one component or tightly coupled component tree needs the state.
- A form, dropdown, modal selection, or temporary filter does not need cross-page coordination.

Use React Query when:

- Data comes from or is synchronized with the server.
- Data has loading, error, pagination, mutation, or cache lifecycle.
- Data includes profiles, challenges, offers, plans, proof assets, messages, billing, or admin
  records.

Use services when:

- An API request, response mapping, or business workflow is required.
- Store actions need future server behavior. Services should perform the request, then clean
  actions may update minimal shared state if required.

## Usage Examples

```js
import { useUIStore } from "../store/index.js";

const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
const toggleSidebar = useUIStore((state) => state.toggleSidebar);
```

```js
import { useProofArenaStore } from "../store/index.js";

const activeRole = useProofArenaStore((state) => state.activeRole);
const setActiveRole = useProofArenaStore((state) => state.setActiveRole);
setActiveRole("provider");
```

```js
import { useNotificationStore } from "../store/index.js";

const addToast = useNotificationStore((state) => state.addToast);
addToast({ message: "Provider saved.", type: "success" });
```

Outside React:

```js
import { useNotificationStore } from "../store/index.js";

useNotificationStore.getState().addToast({
  message: "Connection restored.",
  type: "info",
});
```

## Future ProofArena Rules

- Dashboard filters stay local or in URL query parameters unless cross-page coordination is
  proven necessary.
- Marketplace, challenge, plan, match, and Proof Vault records remain in React Query.
- Messaging history remains in React Query; only realtime connection coordination stays in
  Zustand.
- New global stores require a distinct ownership boundary that cannot fit an existing store.
- Never copy React Query results into Zustand.
- Never use `activeRole` as an authorization decision.

