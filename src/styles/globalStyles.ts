'use client';

/**
 * Global Styles
 * CSS reset and base typography styles
 */

import { createGlobalStyle } from 'styled-components';
import { mq } from './mediaQueries';

export const GlobalStyles = createGlobalStyle`
  /* Custom Font Faces */
  @font-face {
    font-family: 'BwGradual-Medium';
    src: url('/fonts/BwGradual-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'FoundersGrotesk-Regular';
    src: url('/fonts/FoundersGrotesk-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  /* Box sizing reset */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  /* Smooth scrolling */
  ${mq.md} {
    @media (prefers-reduced-motion: no-preference) {
      :root {
        scroll-behavior: smooth;
      }
    }
  }

  /* Root/body */
  body {
    margin: 0;
    min-width: ${({ theme }) => theme.breakpoints.minWidth};
    font-family: ${({ theme }) => theme.typography.fontFamily.montserrat};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    line-height: ${({ theme }) => theme.typography.lineHeight.body};
    color: ${({ theme }) => theme.colors.textBody};
    background-color: ${({ theme }) => theme.colors.white};
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  body.body-overflow {
    overflow: hidden;
  }

  /* Images */
  img, svg {
    max-width: 100%;
    height: auto;
    vertical-align: middle;
  }

  /* Headings */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
  }

  h1 {
    font-size: calc(1.375rem + 1.5vw);
    
    ${mq.xl} {
      font-size: 2.5rem;
    }
  }

  h2 {
    font-size: calc(1.325rem + 0.9vw);
    
    ${mq.xl} {
      font-size: 2rem;
    }
  }

  h3 {
    font-size: calc(1.3rem + 0.6vw);
    
    ${mq.xl} {
      font-size: 1.75rem;
    }
  }

  h4 {
    font-size: calc(1.275rem + 0.3vw);
    
    ${mq.xl} {
      font-size: 1.5rem;
    }
  }

  h5 {
    font-size: 1.25rem;
  }

  h6 {
    font-size: 1rem;
  }

  /* Paragraphs */
  p {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  /* Lists */
  ol, ul {
    padding-left: 2rem;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  ol ol, ul ul, ol ul, ul ol {
    margin-bottom: 0;
  }

  /* Text emphasis */
  b, strong {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  small {
    font-size: 0.875em;
  }

  /* Text utilities */
  .text-center {
    text-align: center;
  }

  .text-uppercase {
    text-transform: uppercase;
  }

  .text-white {
    color: ${({ theme }) => theme.colors.white};
  }

  /* Buttons */
  button {
    cursor: pointer;
    border-radius: 0;
  }

  /* Forms */
  input, button, select, optgroup, textarea {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  textarea {
    resize: none;
  }

  /* Tables */
  table {
    width: 100%;
    caption-side: bottom;
    border-collapse: collapse;
  }

  /* Hidden */
  [hidden] {
    display: none !important;
  }

  /* Preloader */
  #preloader + .wrapper {
    display: none;
  }
`;
