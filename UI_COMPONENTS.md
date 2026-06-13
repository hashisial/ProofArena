# ScaleOps / ProofArena UI Components

## Canonical UI Layer

Reusable visual primitives live in:

`client/src/components/ui/`

New shared UI work should import from this directory or its barrel file:

```jsx
import {
  Badge,
  Button,
  Card,
  Container,
  EmptyState,
  Input,
  LoadingState,
  PageHeader,
  Section,
  SectionHeader,
  Textarea,
} from "../components/ui/index.js";
```

The client is a JavaScript React/Vite application, so the foundation remains
in `.js` and `.jsx` files rather than introducing a parallel TypeScript UI
system.

## Design Notes

- Cream is the dominant page background and white is the task/card surface.
- Typography uses near-black `#1C1917`.
- Primary actions and focus states use olive `#3F6212`.
- Dark olive `#365314`, accent green `#65A30D`, and proof bronze `#A16207`
  support hover, emphasis, and proof semantics.
- Components use Tailwind utility classes and accept `className` overrides.
- Focus, disabled, loading, error, and empty states must remain readable without
  relying on color alone.
- UI primitives must not fetch data or contain feature-specific business logic.

## Component Reference

### `Button`

Purpose: accessible command or navigation action.

Key props:

- `variant`: `primary`, `secondary`, `outline`, `ghost`, `danger`
- `size`: `sm`, `md`, `lg`
- `isLoading`, `loadingLabel`, `disabled`
- `iconLeft` / `iconRight`
- Compatibility icon aliases: `leftIcon` / `rightIcon`
- `as`: element name or compatible component

```jsx
<Button iconRight={<ArrowRight className="h-4 w-4" />} size="lg">
  Create Challenge
</Button>

<Button isLoading loadingLabel="Publishing..." variant="secondary">
  Publish
</Button>
```

### `Input`

Purpose: labeled single-line form input with accessible helper and error text.

Key props:

- `label`, `helperText`, `error`, `required`, `disabled`
- `leftIcon`, `rightIcon`
- `fullWidth` defaults to `true`
- `containerClassName` styles the field wrapper
- `className` styles the input

Password inputs retain the existing accessible show/hide control.

```jsx
<Input
  error={errors.title}
  helperText="Describe the measurable result."
  label="Challenge title"
  required
/>
```

### `Textarea`

Purpose: labeled multi-line form input.

Key props:

- `label`, `helperText`, `error`, `required`, `disabled`
- `rows`
- `fullWidth`, `containerClassName`, `className`

```jsx
<Textarea label="Success criteria" rows={6} />
```

### `Card`

Purpose: framed content surface.

Key props:

- `variant`: `default`, `hover`, `elevated`
- Existing compatibility variants: `bordered`, `interactive`, `muted`
- `padding`: `none`, `sm`, `md`, `lg`
- `as`, `className`

Related exports:

- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

Use `hover` or `interactive` only when the card has a clear interactive
behavior.

### `Badge`

Purpose: compact readable status or category label.

Canonical semantic variants:

- `default`
- `success`
- `warning`
- `danger`
- `proof`
- `verified`

Existing compatibility variants remain available for current screens.

```jsx
<Badge variant="verified">Verified</Badge>
<Badge variant="proof">Proof reviewed</Badge>
```

### `Container`

Purpose: responsive max-width wrapper with consistent page gutters.

Key props:

- `size`: `narrow`, `default`, `wide`, `full`
- `as`, `className`

```jsx
<Container size="wide">...</Container>
```

### `Section`

Purpose: full-width page section with an optional heading block and contained
content.

Key props:

- `eyebrow`, `title`, `subtitle`
- `align`: `left` or `center`
- `containerSize`, `containerClassName`, `className`
- `as`, `titleAs`, `id`

```jsx
<Section
  eyebrow="Proof-backed delivery"
  subtitle="Compare execution history before selecting a provider."
  title="Choose using evidence"
>
  <ProviderResults />
</Section>
```

### `PageHeader`

Purpose: route-level heading with optional back navigation and actions.

Key props:

- `title`, `description`, `eyebrow`
- `action` or compatibility alias `actions`
- `showBack`, `backFallback`
- `className`

```jsx
<PageHeader
  action={<Button>Create Challenge</Button>}
  description="Manage active and draft outcome challenges."
  title="My Challenges"
/>
```

### `SectionHeader`

Purpose: reusable section introduction with optional badge, eyebrow, and
actions.

Key props:

- `title`, `description`, `eyebrow`
- `badge`, `badgeVariant`
- `actions`
- `align`: `left` or `center`
- `titleAs`, `className`

The previous homepage `SectionHeader` path remains a compatibility export. New
shared imports should use `client/src/components/ui/SectionHeader.jsx`.

### `EmptyState`

Purpose: honest no-data or no-results state.

Key props:

- `icon`: Lucide component or React element
- `title`, `description`
- `action`, `secondaryAction`: custom action slots
- Existing action helpers: `actionText`, `actionHref`, `onAction`,
  `secondaryActionText`, `secondaryActionHref`
- `variant`, `size`, `className`

Do not use fake records to avoid an empty state.

### `LoadingState`

Purpose: shared loading feedback for lists, cards, and compact panels.

Key props:

- `mode`: `skeleton` or `spinner`
- `label`
- `columns`, `count`
- `skeletonClassName`, `className`

```jsx
<LoadingState columns={3} count={6} />
<LoadingState label="Loading provider profile" mode="spinner" />
```

## Compatibility Imports

The following files remain as re-exports so existing pages do not break:

- `client/src/components/Button.jsx`
- `client/src/components/Container.jsx`
- `client/src/components/EmptyState.jsx`
- `client/src/components/LoadingState.jsx`
- `client/src/components/common/PageHeader.jsx`

They are compatibility paths, not separate UI implementations. New code should
use `client/src/components/ui/`.

## Duplication Rules

1. Search `client/src/components/ui/` before creating a visual primitive.
2. Extend a primitive with a small, reusable prop only when multiple real
   consumers need it.
3. Keep feature-specific cards, status logic, and data fetching in the owning
   feature or domain component.
4. Do not install another UI library or create a second design-token system.
5. Do not delete compatibility exports until all consumers are migrated and
   regression checks pass.
