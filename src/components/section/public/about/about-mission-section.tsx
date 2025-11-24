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
import { Target, Users, Zap, Heart } from "lucide-react";

function AboutMissionSection() {
  const t = useTranslation();
  const mission = t.about?.mission;

  // Controls to re-trigger animations whenever the section enters the viewport
  const sectionRef = useRef<HTMLElement | null>(null);
  const textControls = useRevealedControls(sectionRef, { amount: 0.25 });
  const valuesControls = useRevealedControls(sectionRef, { amount: 0.25 });

  // Custom variants
  const fadeInUp = createFadeInUp(0.6, 20);

  // Icon mapping for values
  const getIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("innovation") || titleLower.includes("ابتكار")) {
      return <Zap className="size-6" />;
    }
    if (titleLower.includes("accessibility") || titleLower.includes("وصول")) {
      return <Users className="size-6" />;
    }
    if (titleLower.includes("engagement") || titleLower.includes("تفاعل")) {
      return <Heart className="size-6" />;
    }
    return <Target className="size-6" />;
  };

  if (!mission) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--section-padding-y)]"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_100%,hsl(var(--primary)/0.08),transparent_60%)]" />

      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={textControls}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Section title */}
          <motion.h2
            variants={fadeInUp}
            className="from-foreground to-foreground/70 mb-4 bg-gradient-to-b bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
          >
            {mission.title}
          </motion.h2>

          {/* Section subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mx-auto mb-12 max-w-2xl text-base sm:text-lg"
          >
            {mission.subtitle}
          </motion.p>
        </motion.div>

        {/* Values grid */}
        <motion.div
          initial="hidden"
          animate={valuesControls}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {mission.values.map((value: any, index: number) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="border-border/60 bg-card/50 group hover:bg-card/80 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
            >
              {/* Background gradient */}
              <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="text-primary bg-primary/10 group-hover:bg-primary/20 mb-4 inline-flex size-12 items-center justify-center rounded-xl transition-colors duration-300">
                  {getIcon(value.title)}
                </div>

                {/* Title */}
                <h3 className="mb-3 text-lg font-semibold">{value.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>

              {/* Decorative element */}
              <motion.div
                className="bg-primary/5 absolute -top-2 -right-2 size-16 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom decorative elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={valuesControls}
          variants={fadeInUp}
          className="mt-16 flex justify-center"
        >
          <div className="text-muted-foreground/60 flex items-center gap-4">
            <div className="to-primary/30 h-px w-12 bg-gradient-to-r from-transparent" />
            <div className="bg-primary/30 size-2 rounded-full" />
            <div className="to-primary/30 h-px w-12 bg-gradient-to-l from-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutMissionSection;
