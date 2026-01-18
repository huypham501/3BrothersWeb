/**
 * Theme Definition
 * Typed theme object for styled-components ThemeProvider
 */

import {
  colors,
  spacing,
  typography,
  breakpoints,
  containerWidths,
  borderRadius,
  shadows,
  zIndex,
  motion,
  grid,
} from './tokens';
import { mq, mqMax, mqBetween, mqOrientation, mqMotion } from './mediaQueries';

export const theme = {
  colors,
  spacing,
  typography,
  breakpoints,
  containerWidths,
  borderRadius,
  shadows,
  zIndex,
  motion,
  grid,
  mq,
  mqMax,
  mqBetween,
  mqOrientation,
  mqMotion,
} as const;

export type Theme = typeof theme;

// Extend styled-components DefaultTheme
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
