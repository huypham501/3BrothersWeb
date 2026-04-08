/**
 * Font Configuration
 * next/font optimized Google Fonts setup
 */

import { Poppins, Montserrat } from 'next/font/google';

/**
 * Poppins - Primary font family
 * Replaces: SVN-Poppins, DVN-Poppins, MePoppins variants
 * Supports Vietnamese characters via latin-ext subset
 */
export const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-poppins',
  fallback: ['sans-serif'],
});

/**
 * Montserrat - Secondary font family for V2 components
 */
export const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-montserrat',
  fallback: ['sans-serif'],
});
