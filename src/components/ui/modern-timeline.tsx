"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { TimelineItem } from "@/components/ui/timeline";

const timelineItems: TimelineItem[] = [
  {
    title: "Company Founded",
    description:
      "Started our journey with a simple idea: to revolutionize how teams collaborate. Founded by our CEO with a vision to build the ultimate productivity platform for modern businesses.",
    date: "2024-01-15",
    category: "Foundation",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "completed",
  },
  {
    title: "MVP Launch & First Customers",
    description:
      "Successfully launched our minimum viable product after 6 months of development. Onboarded our first 100 customers and achieved product-market fit with 95% user satisfaction.",
    date: "2024-03-20",
    category: "Product",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "completed",
  },
  {
    title: "Series A Funding",
    description:
      "Raised $5M in Series A funding led by top-tier VCs. This milestone enables us to scale our team, enhance our product, and expand into new markets globally.",
    date: "2024-06-10",
    category: "Funding",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "completed",
  },
  {
    title: "Global Team Expansion",
    description:
      "Expanded our team to 50+ talented individuals across 12 countries. Built diverse engineering, design, and sales teams to support our growing customer base and product development.",
    date: "2024-09-15",
    category: "Team",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    status: "completed",
  },
  {
    title: "Enterprise Platform Launch",
    description:
      "Launching our enterprise-grade platform with advanced security, SSO integration, and enterprise-level support. Currently in beta with 25+ Fortune 500 companies testing the platform.",
    date: "2024-12-01",
    category: "Product",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    status: "current",
  },
  {
    title: "AI Integration & Automation",
    description:
      "Implementing cutting-edge AI features including smart task automation, predictive analytics, and intelligent insights to help teams work more efficiently and make better decisions.",
    date: "2025-03-01",
    category: "Innovation",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    status: "upcoming",
  },
  {
    title: "International Market Expansion",
    description:
      "Expanding operations to European and Asian markets with localized products, dedicated support teams, and partnerships with regional technology leaders.",
    date: "2025-06-01",
    category: "Growth",
    image:
      "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=150&h=150&fit=crop&crop=face",
    status: "upcoming",
  },
  {
    title: "IPO Preparation",
    description:
      "Begin preparations for initial public offering with financial audits, compliance frameworks, and strategic partnerships to position the company for public markets.",
    date: "2025-10-01",
    category: "Milestone",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    status: "upcoming",
  },
];

export default function ModernTimeline() {
  return (
    <div className="bg-background min-h-screen">
      <header className="px-6 py-16 text-center">
        <h1 className="text-foreground mb-4 text-4xl font-bold sm:text-5xl">
          Our Journey
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed">
          From a simple idea to a global platform serving thousands of teams
          worldwide. Follow our story of innovation, growth, and the amazing
          people who made it possible.
        </p>
      </header>

      <main>
        <Timeline items={timelineItems} />
      </main>
    </div>
  );
}
