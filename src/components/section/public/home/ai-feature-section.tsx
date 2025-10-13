"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, BrainCircuit, Bot } from "lucide-react";
import {
  createFadeInUp,
  staggerContainer,
  useRevealedControls,
} from "@/lib/motion";
import { useTranslation } from "@/providers/TranslationsProvider";

function AIFeatureSection() {
  const lang = useCurrentLang();
  const dict = useTranslation();
  const ai = dict.home?.aiFeature;

  const features: { icon: React.ReactNode; title: string; desc: string }[] =
    ai.features.map((f: { title: string; desc: string }) => ({
      icon:
        f.title.includes("توليد") || f.title.includes("Auto") ? (
          <Sparkles className="size-5" />
        ) : f.title.toLowerCase().includes("adapt") ||
          f.title.includes("متكيفة") ? (
          <BrainCircuit className="size-5" />
        ) : (
          <Bot className="size-5" />
        ),
      title: f.title,
      desc: f.desc,
    }));

  const fadeInUp = createFadeInUp(0.6, 16);
  const sectionRef = useRef<HTMLElement | null>(null);
  const controls = useRevealedControls(sectionRef, { amount: 0.25 });
  if (!ai) return null;
  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--section-padding-y)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_100%,hsl(var(--primary)/0.08),transparent_60%)]" />
      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={controls}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.h3
            variants={fadeInUp}
            className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
          >
            {ai.title}
          </motion.h3>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mx-auto mt-3 max-w-2xl text-sm sm:text-base"
          >
            {ai.subtitle}
          </motion.p>

          <motion.ul
            variants={staggerContainer}
            className="mt-8 grid gap-4 sm:grid-cols-3"
          >
            {features.map((f, i) => (
              <motion.li
                key={i}
                variants={fadeInUp}
                className="border-border/60 bg-card/50 group rounded-xl border p-4 text-center backdrop-blur-sm"
              >
                <div className="text-primary mb-2 inline-flex items-center gap-2">
                  {f.icon}
                  <span className="font-semibold">{f.title}</span>
                </div>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={fadeInUp} className="mt-8">
            <Button size="lg" asChild>
              <Link href={`/${lang}/Dashboard`}>{ai.cta}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default AIFeatureSection;
