import React from "react";
import {
  DownloadHeroSection,
  DownloadShowcaseSection,
  DownloadFeaturesSection,
} from "@/components/section/public/download";

export default function DownloadPage() {
  return (
    <div className="from-primary/10 via-background to-background relative min-h-screen w-full bg-gradient-to-b">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(var(--primary)/0.12),transparent_60%)]" />
      <div className="relative z-0">
        <DownloadHeroSection />
        <DownloadShowcaseSection />
        <DownloadFeaturesSection />
      </div>
    </div>
  );
}
