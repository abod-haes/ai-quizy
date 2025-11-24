import React from "react";
import {
  AboutHeroSection,
  AboutMissionSection,
  AboutDownloadSocialSection,
} from "@/components/section/public/about";

export default function AboutPage() {
  return (
    <div className="from-primary/10 via-background to-background relative min-h-screen w-full bg-gradient-to-b">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(var(--primary)/0.12),transparent_60%)]" />
      <div className="relative z-0">
        <AboutHeroSection />
        <AboutMissionSection />
        <AboutDownloadSocialSection />
      </div>
    </div>
  );
}
