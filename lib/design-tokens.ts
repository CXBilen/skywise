// Centralized design tokens for SkyWise
// Enforce consistency across all components

export const colors = {
  // Primary - Sky blue theme
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Success - Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    main: '#10b981',
    600: '#16a34a',
    dark: '#059669',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    light: '#dcfce7',
  },

  // Warning - Amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    main: '#f59e0b',
    600: '#d97706',
    dark: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    light: '#fef3c7',
  },

  // Error/Destructive - Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    main: '#ef4444',
    600: '#dc2626',
    dark: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    light: '#fee2e2',
  },

  // Neutral - Slate
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Background colors
  background: {
    default: '#ffffff',
    paper: '#f8fafc',
    subtle: '#f1f5f9',
    muted: '#e2e8f0',
  },

  // Text colors
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#64748b',
    disabled: '#94a3b8',
    inverse: '#ffffff',
  },

  // Border colors
  border: {
    default: '#e2e8f0',
    subtle: '#f1f5f9',
    strong: '#cbd5e1',
    focus: '#0ea5e9',
  },

  // Calendar status colors
  calendar: {
    fits: '#10b981',
    conflict: '#f59e0b',
    blocked: '#ef4444',
    pending: '#64748b',
  },

  // Confidence indicator colors
  confidence: {
    high: '#10b981',    // 80%+
    medium: '#f59e0b',  // 50-79%
    low: '#ef4444',     // <50%
  },
} as const;

export const typography = {
  fontFamily: {
    display: "var(--font-cal-sans), 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "var(--font-geist-sans), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "var(--font-geist-mono), 'DM Mono', ui-monospace, SFMono-Regular, monospace",
  },

  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

// 4px base unit system
export const spacing = {
  px: '1px',
  0: '0',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px', // Minimum touch target
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
} as const;

export const radii = {
  none: '0',
  sm: '6px',
  md: '10px',
  DEFAULT: '12px',
  lg: '14px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

  // Component-specific shadows
  card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
  cardHover: '0 4px 12px 0 rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.08)',
  dropdown: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  toast: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

export const transitions = {
  // Duration
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Timing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Common transitions
  DEFAULT: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const breakpoints = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  toast: 1600,
  tooltip: 1700,
} as const;

// Icon sizes
export const iconSizes = {
  xs: '12px',
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
} as const;

// Component-specific tokens
export const components = {
  button: {
    minHeight: spacing[11], // 44px minimum touch target
    paddingX: spacing[4],
    paddingY: spacing[2],
    borderRadius: radii.md,
  },

  card: {
    padding: spacing[4], // 16px
    borderRadius: radii.lg,
    shadow: shadows.card,
    shadowHover: shadows.cardHover,
  },

  input: {
    height: spacing[10], // 40px
    paddingX: spacing[3],
    borderRadius: radii.md,
  },

  avatar: {
    sm: spacing[8],  // 32px
    md: spacing[10], // 40px
    lg: spacing[12], // 48px
  },

  toast: {
    maxWidth: '420px',
    padding: spacing[4],
    borderRadius: radii.lg,
  },

  bottomSheet: {
    snapPoints: ['25%', '50%', '90%'],
    borderRadius: radii['2xl'],
    handleWidth: '48px',
    handleHeight: '4px',
  },
} as const;

// Animation variants for Framer Motion
export const motionVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 },
  },

  fadeInUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2 },
  },

  fadeInDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.15 },
  },

  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.2 },
  },

  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.2 },
  },

  slideInUp: {
    initial: { opacity: 0, y: '100%' },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '100%' },
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },

  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },

  staggerItem: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 },
  },
} as const;

// Typing indicator delays
export const typingDelays = {
  short: { min: 500, max: 800 },
  medium: { min: 800, max: 1200 },
  long: { min: 1500, max: 2500 },
  searching: { min: 1500, max: 2500 },
  error: { min: 800, max: 1200 },
} as const;

// Grace period for undo actions (in milliseconds)
export const undoGracePeriod = {
  default: 15000, // 15 seconds
  extended: 30000, // 30 seconds when hovering
  short: 5000, // 5 seconds for minor actions
} as const;

// Confidence thresholds
export const confidenceThresholds = {
  high: 0.8,
  medium: 0.5,
  low: 0,
} as const;

// Export all tokens
export const tokens = {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  iconSizes,
  components,
  motionVariants,
  typingDelays,
  undoGracePeriod,
  confidenceThresholds,
} as const;

export default tokens;
