'use client';

import { BannerSection } from "@/components/home/sections/BannerSection";
import { Footer } from "@/components/shared/Footer";
import { GetInTouchNewsletterSection } from "@/components/sections/GetInTouchNewsletterSection";
import { Header } from "@/components/shared/Header";
import { InformationSection } from "@/components/home/sections/InformationSection";
import { PassionCrewSection } from "@/components/sections/PassionCrewSection";
import { PassionSection } from "@/components/home/sections/PassionSection";
import { Preloader } from "@/components/home/sections/Preloader";
import { TrendingSection } from "@/components/home/sections/TrendingSection";

export function ThreeBrothersHomeView() {
  return (
    <>
      <div>
        <Preloader />
        <div className="wrapper">
          <Header />
          <main className="main-content">
            <BannerSection />
            <PassionSection />
            <InformationSection />
            <PassionCrewSection />
            <GetInTouchNewsletterSection />
            <TrendingSection />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
