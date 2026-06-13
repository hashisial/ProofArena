# ScaleOps / ProofArena Design System

## Purpose

ScaleOps owns the application shell and ProofArena is its flagship product
module. The shared visual language is Option 11 Olive + Cream: warm cream
backgrounds, white task surfaces, charcoal typography, restrained olive
actions, and proof-focused bronze accents.

This document defines the foundation. It does not require feature pages to be
redesigned at once.

## Canonical Token Owners

The existing project uses two coordinated token representations:

- `client/src/styles/tokens.css`: runtime CSS custom properties used by global
  styles and UI components.
- `client/src/constants/designTokens.js`: frozen JavaScript values for cases
  where code needs a programmatic token.

`client/src/styles.css` remains the global stylesheet and imports the token
layer through `client/src/styles/index.css`.

Tailwind is version 4 and is loaded with the Vite plugin. There is no
`tailwind.config.js`; do not introduce one only to define these tokens.

## Brand Colors

| Role | Token | Value |
| --- | --- | --- |
| Cream background | `--color-background` / `--color-cream` | `#FEFCE8` |
| Soft cream surface | `--color-surface-soft` / `--color-soft-cream` | `#FFFBEB` |
| Primary olive | `--color-primary` / `--color-olive` | `#3F6212` |
| Dark olive | `--color-primary-hover` / `--color-olive-dark` | `#365314` |
| Muted olive | `--color-secondary` / `--color-olive-muted` | `#65744B` |
| Accent green | `--color-accent` / `--color-accent-green` | `#65A30D` |
| Proof bronze | `--color-proof` / `--color-bronze` | `#A16207` |
| Card surface | `--color-card` | `#FFFFFF` |
| Foreground | `--color-foreground` | `#1C1917` |
| Secondary text | `--color-text-secondary` | `#44403C` |
| Muted text | `--color-text-muted` | `#78716C` |
| Border | `--color-border` | `#E7E5E4` |

Semantic states must retain their actual meaning:

- Success: green through `--color-success`, `--color-success-strong`, and
  `--color-success-soft`.
- Warning: amber through `--color-warning`, `--color-warning-strong`, and
  `--color-warning-soft`.
- Danger: red through `--color-danger`, `--color-danger-strong`, and
  `--color-danger-soft`.
- Proof uses bronze through `--color-proof`, `--color-proof-strong`, and
  `--color-proof-soft`.
- Verified uses olive through `--color-verified`, `--color-verified-strong`,
  and `--color-verified-soft`.
- Brand colors must not replace actual success, warning, or danger semantics.

## Typography

- The default font stack is `--font-family-sans`.
- Page titles use `--font-size-page-title` or `.page-title`.
- Section titles use `--font-size-section-title` or `.section-title`.
- Card titles use `--font-size-card-title` or `.card-title`.
- Body copy uses `--font-size-body` and `--line-height-body`.
- Muted copy uses `--font-size-muted` and the muted text token.
- Small labels use `--font-size-small-label` or `.small-label`.
- Headings use normal letter spacing and restrained weight.
- Hero-scale type belongs only in genuine hero sections.

Existing reusable typography classes in
`client/src/styles/typography.css` consume the typography tokens.

## Spacing

- Page gutters: `--space-page-x`, responsive through token media queries.
- Section spacing: `--space-section`.
- Card content spacing: `--space-card`.
- Repeated layout gaps: `--space-layout-gap`.

Use these values for shared layout primitives. Feature components may use
smaller Tailwind spacing steps where the token would be too coarse.

## Radius

- Cards: `--radius-card`
- Buttons: `--radius-button`
- Inputs: `--radius-input`
- Small, medium, and large surfaces: `--radius-sm`, `--radius-md`,
  `--radius-lg`

Cards should remain at a restrained radius. Do not introduce a second set of
feature-specific radius constants.

## Shadows

- Quiet surface: `--shadow-soft`
- Standard card: `--shadow-card`
- Elevated surface or modal: `--shadow-elevated`
- Premium elevated surface: `--shadow-premium`
- Olive emphasis: `--shadow-primary-glow`
- Strong olive hover: `--shadow-primary-strong`

The legacy `--shadow-purple-*` aliases remain temporarily for compatibility
and resolve to the olive primary shadows. New components must use the primary
shadow names. Shadows communicate hierarchy; do not apply glow shadows to
every surface.

## Motion

- Fast feedback: `--motion-duration-fast`
- Standard component transition: `--motion-duration-standard`
- Deliberate surface movement: `--motion-duration-slow`
- Premium easing: `--ease-premium`
- Standard lift: `--motion-hover-lift`

Motion must support hierarchy and feedback. Reduced-motion media queries set
motion token durations and lift to near-zero values, while the existing global
reduced-motion rules disable nonessential animation.

## Component Usage

Shared components live in `client/src/components/ui/` and consume CSS variables
with Tailwind arbitrary-value utilities:

```jsx
<div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-card)]" />
```

New shared primitives should:

1. Reuse a semantic token before adding a raw color, shadow, or radius.
2. Keep feature-specific business state outside the UI primitive.
3. Support `className` overrides.
4. Preserve visible focus, disabled, loading, and error states.
5. Use semantic status colors rather than color-only labels.

## Styling Systems Audit

There is no separate Tailwind theme or third-party UI theme to reconcile.
However, two areas require controlled migration:

- `client/src/styles.css` is a large legacy compatibility stylesheet with many
  raw colors and broad shell selectors.
- Feature components still contain many raw purple arbitrary color utilities
  from the previous theme.

These are not new token systems, but they can drift from the canonical tokens.
Migrate them incrementally when their owning feature is changed. A broad
search-and-replace would risk regressions.

## UI Mistakes To Avoid

- Do not create another token file or Tailwind configuration for the same
  values.
- Do not introduce new raw purple values. Migrate legacy values only when
  their owning feature is changed and visually verified.
- Do not use glow shadows on every card.
- Do not make every surface a floating card.
- Do not rely on color alone for status or selection.
- Do not add decorative motion that competes with task completion.
- Do not hardcode localhost URLs, feature data, or business rules in UI
  primitives.

## Migration Rule

When touching an existing feature, migrate only the styles in that feature
that map cleanly to an established token. Add a new token only when it
represents a reusable semantic decision, not a one-off visual value.
