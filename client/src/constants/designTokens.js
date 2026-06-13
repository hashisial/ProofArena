const colors = Object.freeze({
  white: "#FFFFFF",
  black: "#1C1917",
  cream: "#FEFCE8",
  softCream: "#FFFBEB",
  olive: "#3F6212",
  darkOlive: "#365314",
  mutedOlive: "#65744B",
  accentGreen: "#65A30D",
  bronze: "#A16207",

  primary: "#3F6212",
  primaryHover: "#365314",
  primarySoft: "#ECFCCB",
  primaryGlow: "rgba(63, 98, 18, 0.20)",
  primaryRing: "rgba(63, 98, 18, 0.18)",
  secondary: "#65744B",
  secondaryHover: "#365314",
  secondarySoft: "#F7FEE7",
  accent: "#65A30D",
  accentHover: "#3F6212",
  accentSoft: "#F7FEE7",

  background: "#FEFCE8",
  surface: "#FFFFFF",
  surfaceSoft: "#FFFBEB",
  card: "#FFFFFF",
  foreground: "#1C1917",
  text: "#1C1917",
  textPrimary: "#1C1917",
  textSecondary: "#44403C",
  textMuted: "#78716C",
  textLight: "#A8A29E",
  muted: "#65744B",
  mutedSurface: "#FFFBEB",
  border: "#E7E5E4",
  borderSoft: "#E7E5E4",
  borderPrimary: "rgba(63, 98, 18, 0.28)",
  overlay: "rgba(28, 25, 23, 0.45)",

  success: "#15803D",
  successStrong: "#166534",
  successSoft: "#DCFCE7",
  warning: "#A16207",
  warningStrong: "#854D0E",
  warningSoft: "#FEF3C7",
  danger: "#DC2626",
  dangerStrong: "#B91C1C",
  dangerSoft: "#FEE2E2",
  error: "#DC2626",
  info: "#0F766E",
  infoSoft: "#CCFBF1",
  proof: "#A16207",
  proofStrong: "#854D0E",
  proofSoft: "#FEF3C7",
  verified: "#3F6212",
  verifiedStrong: "#365314",
  verifiedSoft: "#ECFCCB",
});

const typography = Object.freeze({
  family: Object.freeze({
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  }),
  size: Object.freeze({
    hero: "5rem",
    heroMobile: "2.75rem",
    display: "4rem",
    displayMobile: "2.35rem",
    pageTitle: "2.25rem",
    sectionTitle: "1.75rem",
    cardTitle: "1.125rem",
    body: "1rem",
    muted: "0.875rem",
    smallLabel: "0.75rem",
    section: "1.75rem",
    title: "1.125rem",
    small: "0.875rem",
    eyebrow: "0.75rem",
  }),
  weight: Object.freeze({
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 800,
  }),
  lineHeight: Object.freeze({
    tight: 1.1,
    heading: 1.2,
    body: 1.65,
  }),
});

const spacing = Object.freeze({
  pageX: "1rem",
  pageXSmall: "1.5rem",
  pageXLarge: "2rem",
  pageY: "2rem",
  section: "5rem",
  sectionMobile: "3rem",
  card: "1.5rem",
  layoutGap: "1.5rem",
});

const radius = Object.freeze({
  small: "0.375rem",
  medium: "0.5rem",
  large: "0.75rem",
  card: "0.5rem",
  button: "0.5rem",
  input: "0.5rem",
  full: "9999px",
});

const shadow = Object.freeze({
  soft: "0 1px 2px rgba(28, 25, 23, 0.04), 0 10px 28px rgba(28, 25, 23, 0.06)",
  card: "0 1px 3px rgba(28, 25, 23, 0.06), 0 18px 44px rgba(28, 25, 23, 0.08)",
  premium: "0 24px 64px rgba(28, 25, 23, 0.12)",
  elevated: "0 24px 64px rgba(28, 25, 23, 0.12)",
  primaryGlow: "0 18px 44px rgba(63, 98, 18, 0.18)",
  primaryStrong: "0 20px 48px rgba(54, 83, 20, 0.26)",
  danger: "0 16px 40px rgba(220, 38, 38, 0.18)",
});

const gradient = Object.freeze({
  mediaFallback:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(255, 251, 235, 0.84) 58%, rgba(236, 252, 203, 0.65))",
});

const motion = Object.freeze({
  duration: Object.freeze({
    fast: "150ms",
    standard: "200ms",
    slow: "360ms",
  }),
  easing: Object.freeze({
    standard: "ease",
    premium: "cubic-bezier(0.22, 1, 0.36, 1)",
  }),
  hoverLift: "-0.125rem",
});

export const DESIGN_TOKENS = Object.freeze({
  color: colors,
  colors,
  gradient,
  motion,
  radius,
  shadow,
  spacing,
  typography,
});
