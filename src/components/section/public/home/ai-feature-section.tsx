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

  const fadeInUp = createFadeInUp(0.6, 16);
  const sectionRef = useRef<HTMLElement | null>(null);
  const controls = useRevealedControls(sectionRef, { amount: 0.25 });

  if (!ai) return null;

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

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--section-padding-y)]"
    >
      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={controls}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.h3
            variants={fadeInUp}
            className="text-2xl font-black sm:text-3xl"
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
                className="border-border bg-card group rounded-xl border p-4 text-center"
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
              <Link href={`/${lang}/quizzes`}>{ai.cta}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default AIFeatureSection;
