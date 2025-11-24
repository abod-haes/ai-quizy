/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/providers/TranslationsProvider";
import {
  createFadeInUp,
  staggerContainer,
  useRevealedControls,
} from "@/lib/motion";
import { Timeline } from "@/components/ui/timeline";
import { TimelineItem } from "@/components/ui/timeline";

function AboutTimelineSection() {
  const t = useTranslation();
  const timeline = t.about?.timeline;

  // Controls to re-trigger animations whenever the section enters the viewport
  const sectionRef = useRef<HTMLElement | null>(null);
  const textControls = useRevealedControls(sectionRef, { amount: 0.25 });

  // Custom variants
  const fadeInUp = createFadeInUp(0.6, 20);

  if (!timeline) return null;

  // Convert timeline items to TimelineItem format
  const timelineItems: TimelineItem[] = timeline.items.map((item: any) => ({
    title: item.title,
    description: item.description,
    date: item.date,
    category: item.category,
    status: item.status,
  }));

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--section-padding-y)]"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_50%,hsl(var(--primary)/0.06),transparent_60%)]" />

      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={textControls}
          className="mx-auto mb-16 max-w-4xl text-center"
        >
          {/* Section title */}
          <motion.h2
            variants={fadeInUp}
            className="from-foreground to-foreground/70 mb-4 bg-gradient-to-b bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
          >
            {timeline.title}
          </motion.h2>

          {/* Section subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg"
          >
            {timeline.subtitle}
          </motion.p>
        </motion.div>

        {/* Timeline component */}
        <motion.div
          initial="hidden"
          animate={textControls}
          variants={staggerContainer}
        >
          <Timeline items={timelineItems} />
        </motion.div>
      </div>
    </section>
  );
}

export default AboutTimelineSection;
