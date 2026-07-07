"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { createFadeInUp, useRevealedControls } from "@/lib/motion";
import { useTranslation } from "@/providers/TranslationsProvider";
import { Card, CardContent } from "@/components/ui/card";

function AIFeatureSection() {
  const lang = useCurrentLang();
  const dict = useTranslation();
  const ai = dict.home?.aiFeature;

  const fadeInUp = createFadeInUp(0.5, 14);
  const sectionRef = useRef<HTMLElement | null>(null);
  const controls = useRevealedControls(sectionRef, { amount: 0.25 });

  if (!ai) return null;

  return (
    <section ref={sectionRef} className="relative py-8 md:py-10">
      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={controls}
          className="mx-auto max-w-3xl space-y-4"
        >
          <motion.div variants={fadeInUp} className="space-y-2 text-center">
            <div className="bg-primary/10 text-primary mx-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
              <Sparkles className="size-3.5" />
              مميزات Quizy
            </div>
            <h3 className="text-xl font-black sm:text-2xl md:text-3xl">
              {ai.title}
            </h3>
            <p className="text-muted-foreground mx-auto max-w-2xl text-sm sm:text-base">
              {ai.subtitle}
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="mx-auto max-w-2xl p-0">
              <CardContent className="space-y-3 p-4">
                {ai.features.map((feature: { title: string; desc: string }, index: number) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <div className="bg-primary/10 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full">
                      <Check className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground mt-0.5 text-xs leading-5">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex justify-center">
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
