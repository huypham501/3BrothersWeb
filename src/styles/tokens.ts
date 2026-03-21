/**
 * Design Tokens
 * Centralized design values extracted from style.css
 * All magic numbers must come from here
 */

export const colors = {
  // Brand colors - New palette
  primary: '#003CA6',        // Primary 1st
  primaryHover: '#002f7d',   // Darker shade of primary
  primaryLight: '#6395ED',   // Primary 2nd
  secondary: '#FFE773',      // Secondary 1st
  secondaryLight: '#F9F9F9', // Secondary 2nd
  secondaryDark: '#061530',  // Secondary 3rd

  // Text colors
  textPrimary: '#061530',    // Using secondary 3rd for primary text
  textSecondary: '#363B53',
  textBody: '#54586D',
  textMuted: '#727687',
  textLight: '#7C808F',
  textDisabled: '#9B9DA9',
  textPlaceholder: '#CDCFD0',

  // Grayscale
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FCFCFC',
  gray100: '#F5F5F6',
  gray200: '#ECECEE',
  gray300: '#CECECE',
  gray400: '#e0e0e0',
  gray500: '#999999',
  gray600: '#cccccc',

  // Background
  bgPrimary: '#003CA6',
  bgSecondary: '#6395ED',
  bgDark: '#061530',
  bgLight: '#F9F9F9',
  bgLightAlt: '#F5F5F6',
  brandLightBlue: '#E0EBFF',
  brandLightBlueDark: '#D4E2FF',

  // Borders
  border: '#F5F5F6',
  borderLight: '#ECECEE',
  borderInput: '#e0e0e0',

  // Semantic colors
  success: '#28a745',
  successBg: '#d4edda',
  successText: '#155724',
  successBorder: '#c3e6cb',
  error: '#dc3545',
  errorBg: '#f8d7da',
  errorText: '#721c24',
  errorBorder: '#f5c6cb',
  warning: '#fcf8e3',
  info: '#007bff',
  infoHover: '#0056b3',

  // Image fallback
  imageFallback: '#F9F9F9', // Secondary 2nd
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '1rem',       // 16px
  4: '1.5rem',     // 24px
  5: '3rem',       // 48px

  // Additional spacing values found in CSS
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
  '4xl': '64px',
  '5xl': '80px',
  '6xl': '96px',
  '7xl': '120px',
} as const;

export const typography = {
  fontFamily: {
    base: "var(--font-poppins, 'Poppins', sans-serif)",
    heading: "var(--font-poppins, 'Poppins', sans-serif)",
    gradual: "'BwGradual-Medium', sans-serif",
    founders: "'FoundersGrotesk-Regular', sans-serif",
    poppins: "var(--font-poppins, 'Poppins', sans-serif)",
    mono: 'var(--bs-font-monospace)',
  },

  fontSize: {
    xs: '11px',
    sm: '13px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
    '5xl': '36px',
    '6xl': '42px',
    '7xl': '48px',
    '8xl': '56px',
    '9xl': '64px',
    '10xl': '72px',
    '11xl': '80px',
    '12xl': '90px',
    '13xl': '108px',
    '14xl': '120px',
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  lineHeight: {
    none: 1,
    tight: 1.125,
    snug: 1.25,
    normal: 1.3,
    relaxed: 1.5,
    loose: 1.6,
    body: 1.715,
    xl: 1.7,
  },
} as const;

export const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1400px',
  custom: '1300px',
} as const;

export const mediaQueries = {
  up: {
    sm: `@media (min-width: ${breakpoints.sm})`,
    md: `@media (min-width: ${breakpoints.md})`,
    lg: `@media (min-width: ${breakpoints.lg})`,
    xl: `@media (min-width: ${breakpoints.xl})`,
    xxl: `@media (min-width: ${breakpoints.xxl})`,
  },
  down: {
    sm: `@media (max-width: ${breakpoints.sm})`,
    md: `@media (max-width: ${breakpoints.md})`,
    lg: `@media (max-width: ${breakpoints.lg})`,
    xl: `@media (max-width: ${breakpoints.xl})`,
    xxl: `@media (max-width: ${breakpoints.xxl})`,
  }
} as const;

export const containerWidths = {
  sm: '540px',
  md: '720px',
  lg: '960px',
  xl: '1140px',
  xxl: '1246px',
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.2rem',     // 3.2px
  base: '0.25rem',  // 4px
  md: '8px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  full: '50%',
  round: '60px',
} as const;

export const shadows = {
  sm: '0 4px 6px rgba(0, 0, 0, 0.16)',
  md: '0 4px 8px rgba(0, 0, 0, 0.2)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.24)',
} as const;

export const zIndex = {
  base: 1,
  overlay: 10,
  modal: 20,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  header: 1040,
  popover: 1060,
  tooltip: 1070,
  preloader: 1099,
} as const;

export const motion = {
  duration: {
    fast: '0.15s',
    base: '0.2s',
    slow: '0.3s',
    slower: '0.5s',
  },

  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    custom: 'cubic-bezier(0.73, 1, 0.28, 0.08)',
  },
} as const;

export const grid = {
  gutter: '15px',
  columns: 12,
} as const;
