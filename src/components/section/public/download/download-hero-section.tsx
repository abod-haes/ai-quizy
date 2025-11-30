"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { Sparkles } from "lucide-react";
import { IOSButton } from "@/components/ui/ios-button";
import { AndroidButton } from "@/components/ui/android-button";
import {
  createFadeInUp,
  createSlideIn,
  staggerContainer,
  useRevealedControls,
} from "@/lib/motion";

function DownloadHeroSection() {
  const t = useTranslation();
  const lang = useCurrentLang();
  const isRtl = lang === "ar";
  const download = t.download?.hero;

  // Controls to re-trigger animations whenever the section enters the viewport
  const sectionRef = useRef<HTMLElement | null>(null);
  const textControls = useRevealedControls(sectionRef, { amount: 0.25 });
  const mediaControls = useRevealedControls(sectionRef, { amount: 0.25 });

  // Custom variants
  const fadeInUp = createFadeInUp(0.6, 20);
  const slideIn = createSlideIn(isRtl, 48, 0.7);

  if (!download) return null;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden py-[var(--section-padding-y)]"
    >
      {/* Enhanced Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(var(--primary)/0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_20%,hsl(var(--secondary)/0.08),transparent_50%)]" />

      {/* Animated background elements */}
      <motion.div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <motion.div
          className="bg-primary/5 absolute top-0 right-0 size-64 translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="bg-secondary/5 absolute bottom-0 left-0 size-48 -translate-x-1/2 translate-y-1/2 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </motion.div>

      <div className="relative container flex flex-col items-center justify-center">
        <motion.div
          initial="hidden"
          animate={textControls}
          className="mx-auto w-full max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="border-border/60 bg-card/50 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm backdrop-blur-sm">
              <Sparkles className="size-4" />
              <span>{download.badge}</span>
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            variants={fadeInUp}
            className="from-foreground to-foreground/70 mb-6 bg-gradient-to-b bg-clip-text text-4xl font-extrabold text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ lineHeight: "1.2" }}
          >
            {download.title}
            <br />
            <span className="from-primary to-secondary bg-gradient-to-r bg-clip-text text-transparent">
              {download.subtitle}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mx-auto mb-8 max-w-2xl text-base text-pretty sm:text-lg md:text-xl"
          >
            {download.description}
          </motion.p>

          {/* Download buttons */}
          <motion.div
            variants={staggerContainer}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.div variants={fadeInUp}>
              <IOSButton />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <AndroidButton />
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            className="mt-12 grid grid-cols-3 gap-6 sm:gap-8"
          >
            {[
              { value: "10K+", label: download.stats.downloads },
              { value: "4.8★", label: download.stats.rating },
              { value: "50K+", label: download.stats.users },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="text-center">
                <div className="text-primary mb-1 text-2xl font-bold sm:text-3xl">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Phone mockup */}
        <motion.div
          initial="hidden"
          animate={mediaControls}
          variants={slideIn}
          className="relative mt-12 w-full max-w-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            whileInView={{ scale: 1, opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Phone frame */}
            <div className="border-border/60 bg-card/50 relative mx-auto aspect-[9/19] w-[280px] overflow-hidden rounded-[3rem] border-8 shadow-2xl backdrop-blur-sm sm:w-[320px]">
              {/* Screen content */}
              <div className="bg-background relative h-full w-full overflow-hidden">
                {/* App preview placeholder */}
                <div className="from-primary/20 via-background to-background flex h-full flex-col bg-gradient-to-b">
                  <div className="bg-primary/10 flex items-center justify-between p-4">
                    <div className="bg-primary h-2 w-2 rounded-full" />
                    <div className="text-primary text-xs font-semibold">
                      Quizzy
                    </div>
                    <div className="bg-primary h-2 w-2 rounded-full" />
                  </div>
                  <div className="flex-1 space-y-4 p-6">
                    <div className="bg-primary/10 h-24 rounded-xl" />
                    <div className="space-y-2">
                      <div className="bg-primary/5 h-4 w-3/4 rounded" />
                      <div className="bg-primary/5 h-4 w-full rounded" />
                      <div className="bg-primary/5 h-4 w-5/6 rounded" />
                    </div>
                    <div className="bg-secondary/10 h-32 rounded-xl" />
                  </div>
                </div>

                {/* Animated gradient overlay */}
                <motion.div
                  className="from-primary/20 to-secondary/20 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>

            {/* Floating decorative elements */}
            <motion.div
              className="bg-primary/20 absolute top-1/4 -left-4 size-16 rounded-full blur-xl"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="bg-secondary/20 absolute -right-4 bottom-1/4 size-20 rounded-full blur-xl"
              animate={{
                y: [0, 20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default DownloadHeroSection;
