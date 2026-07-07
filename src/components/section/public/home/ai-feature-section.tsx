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

  const fadeInUp = createFadeInUp(0.5, 14);
  const sectionRef = useRef<HTMLElement | null>(null);
  const controls = useRevealedControls(sectionRef, { amount: 0.25 });

  if (!ai) return null;

  const features: { icon: React.ReactNode; title: string; desc: string }[] =
    ai.features.map((f: { title: string; desc: string }) => ({
      icon:
        f.title.includes("توليد") || f.title.includes("Auto") ? (
          <Sparkles className="size-4" />
        ) : f.title.toLowerCase().includes("adapt") ||
          f.title.includes("متكيفة") ? (
          <BrainCircuit className="size-4" />
        ) : (
          <Bot className="size-4" />
        ),
      title: f.title,
      desc: f.desc,
    }));

  return (
    <section ref={sectionRef} className="relative py-8 md:py-10">
      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={controls}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h3
            variants={fadeInUp}
            className="text-xl font-black sm:text-2xl md:text-3xl"
          >
            {ai.title}
          </motion.h3>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mx-auto mt-2 max-w-2xl text-sm sm:text-base"
          >
            {ai.subtitle}
          </motion.p>

          <motion.ul
            variants={staggerContainer}
            className="mt-6 grid gap-3 sm:grid-cols-3"
          >
            {features.map((f, i) => (
              <motion.li
                key={i}
                variants={fadeInUp}
                className="border-border bg-card group rounded-xl border p-3 text-center"
              >
                <div className="text-primary mb-1.5 inline-flex items-center gap-1.5 text-sm">
                  {f.icon}
                  <span className="font-semibold">{f.title}</span>
                </div>
                <p className="text-muted-foreground text-xs">{f.desc}</p>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={fadeInUp} className="mt-6">
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
