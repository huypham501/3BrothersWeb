import type { ReactNode } from "react";
import { poppins, montserrat } from "@/lib/fonts";
import ClientProviders from "@/components/ClientProviders";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Geist } from "next/font/google";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
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
      <body suppressHydrationWarning className={`${poppins.variable} ${montserrat.variable}`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
