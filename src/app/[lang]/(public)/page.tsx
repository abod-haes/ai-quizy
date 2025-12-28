"use client";
import React from "react";
import { HeroParallax } from "@/components/section/public/home/hero-parallax";
import AboutSection from "@/components/section/public/home/about-section";
import AIFeatureSection from "@/components/section/public/home/ai-feature-section";

export default function Page() {
  const products = [
    {
      title: "quizy Feature 1",
      link: "#",
      thumbnail: "/images/home/1.jpg",
    },
    {
      title: "quizy Feature 2",
      link: "#",
      thumbnail: "/images/home/2.jpg",
    },
    {
      title: "quizy Feature 3",
      link: "#",
      thumbnail: "/images/home/3.jpg",
    },
    {
      title: "quizy Feature 4",
      link: "#",
      thumbnail: "/images/home/4.jpg",
    },
    {
      title: "quizy Feature 5",
      link: "#",
      thumbnail: "/images/home/5.jpg",
    },
    {
      title: "quizy Feature 6",
      link: "#",
      thumbnail: "/images/home/6.jpg",
    },
    {
      title: "quizy Feature 7",
      link: "#",
      thumbnail: "/images/home/7.jpg",
    },
    {
      title: "quizy Feature 8",
      link: "#",
      thumbnail: "/images/home/11.jpg",
    },
    {
      title: "quizy Feature 9",
      link: "#",
      thumbnail: "/images/home/22.jpg",
    },
    {
      title: "quizy Feature 10",
      link: "#",
      thumbnail: "/images/home/33.jpg",
    },
    {
      title: "quizy Feature 11",
      link: "#",
      thumbnail: "/images/home/44.jpg",
    },
    {
      title: "quizy Feature 12",
      link: "#",
      thumbnail: "/images/home/55.jpg",
    },
    {
      title: "quizy Feature 13",
      link: "#",
      thumbnail: "/images/home/66.jpg",
    },
    {
      title: "quizy Feature 14",
      link: "#",
      thumbnail: "/images/home/77.jpg",
    },
  ];
  return (
    <div className="from-primary/10 via-background to-background relative min-h-screen w-full bg-gradient-to-b">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(var(--primary)/0.12),transparent_60%)]" />
      <div className="relative z-0">
        <HeroParallax products={products} />
        <AboutSection />
        <AIFeatureSection />
      </div>
    </div>
  );
}
