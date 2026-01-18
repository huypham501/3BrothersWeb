'use client';

import type { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import { GlobalStyles } from "@/styles/globalStyles";
import { poppins } from "@/lib/fonts";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-512x512.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-512x512.png" />
        <link
          rel="preload"
          href="/metub/template/images/metub_video.mp4"
          as="video"
          type="video/mp4"
        />
      </head>
      <body className={poppins.variable}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
