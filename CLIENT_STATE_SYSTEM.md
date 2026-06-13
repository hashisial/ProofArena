# Client State System

## Purpose

ScaleOps uses Zustand only for small client-side state that must be shared
across components. ProofArena server data remains owned by React Query.

The canonical store directory is:

`client/src/store/`

Do not create a parallel `stores/` directory or feature-level store when an
existing shared store already owns the concern.

## Existing Stores

### `useUIStore.js`

Owns shared application-shell and transient UI state:

- `isSidebarCollapsed`
- `isMobileMenuOpen`
- `activeModal`
- `commandMenuOpen`
- `pageTitle`
- `themePreference`

Canonical sidebar and mobile-menu actions:

- `toggleSidebar`
- `setSidebarCollapsed`
- `openMobileMenu`
- `closeMobileMenu`
- `toggleMobileMenu`

The dashboard and admin shells share the collapse preference and mobile-drawer
state. This is intentional for the current single-shell-at-a-time routing
model. Split these preferences only if both shells need independent persisted
behavior.

The theme preference is a non-persisted placeholder and does not currently
change the approved global theme.

### `useAuthStore.js`

Owns lightweight authenticated-session coordination:

- Access token held in memory
- Authenticated user identity
- Role
- Authentication/checking status
- Authentication errors
- Explicit auth status (`checking`, `authenticated`, `unauthenticated`, or
  `error`)

It must not become the owner of the full editable profile, public provider
profile, or profile analytics. Those remain React Query data.

### `useSocketStore.js`

Owns realtime connection coordination:

- Socket connection status
- Active conversation ID
- Minimal online-user presence list

The online-user list must remain presence-oriented. Do not expand it into full
user profiles or message history.

### `useNotificationStore.js`

Owns ephemeral realtime notification UI coordination:

- Notification panel visibility
- Unread count
- Latest realtime notification
- Transient toast queue and actions

Notification history and paginated notification records remain in React Query.
`ToastProvider` remains the visual presentation and timeout layer.

### `useProofArenaStore.js`

Owns the minimal cross-page ProofArena active workspace-role placeholder:

- `activeRole`
- `setActiveRole`
- `clearActiveRole`

This role is a UI preference only. Authorization continues to use the
authenticated user and server-side permission checks. ProofArena API records
remain in React Query.

### `authSession.js`

This is a small token-storage compatibility helper, not a Zustand store. It
keeps user/admin tokens in memory and clears old browser-storage values.

## React Query vs Zustand

Use React Query for:

- Full user and provider profiles
- Challenge and application lists
- Proof assets, proof ledger records, and leaderboard data
- Messages and notification history
- Billing records
- Admin tables
- Loading, error, pagination, mutation, and cache state for API data

Use Zustand for:

- Shared shell state
- Small UI preferences
- Auth/session coordination
- Realtime connection coordination
- Ephemeral toast, modal, or notification UI state

Do not copy React Query results into Zustand. Components should read remote data
from the existing feature hooks and read only shared client state from stores.

## Local State vs Shared UI Store

Component-local state should remain local when no unrelated component needs to
control it.

Current examples that should remain local:

- Public-header navigation and account menus in `components/Header.jsx`
- Dashboard/admin topbar account menus
- Profile workflow modal and selected-record state in `pages/Profile.jsx`

The dashboard and admin sidebars already use `useUIStore`; no later sidebar
migration is required. Their shared behavior is coordinated by
`layouts/useSidebarShell.js`.

## Rules for New State

1. Prefer component-local state for isolated UI behavior.
2. Add state to Zustand only when multiple distant components must coordinate.
3. Keep store actions explicit and narrowly scoped.
4. Keep server records and API lifecycle state in React Query.
5. Do not create a store solely to avoid passing one or two props.
6. Do not persist access tokens or sensitive session values in browser storage.
7. Audit an existing store before adding a new store file.

## Audit Result

No prohibited large server-state collections were found in Zustand. The
existing stores remain appropriately scoped, with the following boundaries to
protect:

- Keep `useAuthStore.user` limited to authenticated identity/session needs.
- Keep `useSocketStore.onlineUsers` limited to presence data.
- Keep `useNotificationStore.latestNotification` ephemeral and keep history in
  React Query.
