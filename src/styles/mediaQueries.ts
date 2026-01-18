/**
 * Media Query Helpers
 * Mobile-first responsive design utilities
 */

import { breakpoints } from './tokens';

type Breakpoint = keyof typeof breakpoints;

/**
 * Media query helper for mobile-first design
 * Usage: ${mq.md} { ... }
 */
export const mq = {
  sm: `@media only screen and (min-width: ${breakpoints.sm})`,
  md: `@media only screen and (min-width: ${breakpoints.md})`,
  lg: `@media only screen and (min-width: ${breakpoints.lg})`,
  xl: `@media only screen and (min-width: ${breakpoints.xl})`,
  xxl: `@media only screen and (min-width: ${breakpoints.xxl})`,
  custom: `@media only screen and (min-width: ${breakpoints.custom})`,
} as const;

/**
 * Max-width media queries (for specific overrides)
 * Usage: ${mqMax.md} { ... }
 */
export const mqMax = {
  sm: `@media (max-width: 575.98px)`,
  md: `@media (max-width: 767.98px)`,
  lg: `@media (max-width: 991.98px)`,
  xl: `@media (max-width: 1199.98px)`,
  xxl: `@media (max-width: 1399.98px)`,
} as const;

/**
 * Range media queries
 * Usage: ${mqBetween('md', 'lg')} { ... }
 */
export const mqBetween = (min: Breakpoint, max: Breakpoint) => {
  const minValue = breakpoints[min];
  const maxBreakpoint = max === 'sm' ? '575.98px'
    : max === 'md' ? '767.98px'
    : max === 'lg' ? '991.98px'
    : max === 'xl' ? '1199.98px'
    : max === 'xxl' ? '1399.98px'
    : breakpoints[max];
  
  return `@media only screen and (min-width: ${minValue}) and (max-width: ${maxBreakpoint})`;
};

/**
 * Orientation media queries
 */
export const mqOrientation = {
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
} as const;

/**
 * Motion preference media query
 */
export const mqMotion = {
  reduce: '@media (prefers-reduced-motion: reduce)',
  noPreference: '@media (prefers-reduced-motion: no-preference)',
} as const;
