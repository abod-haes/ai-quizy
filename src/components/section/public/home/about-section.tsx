"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  createFadeInUp,
  createSlideIn,
  staggerContainer,
  useRevealedControls,
} from "@/lib/motion";
import Image from "next/image";

function AboutSection() {
  const t = useTranslation();
  const lang = useCurrentLang();

  const about = t.home?.about;

  const isRtl = lang === "ar";

  const sectionRef = useRef<HTMLElement | null>(null);
  const textControls = useRevealedControls(sectionRef, { amount: 0.25 });
  const mediaControls = useRevealedControls(sectionRef, { amount: 0.25 });

  const fadeInUp = createFadeInUp(0.6, 20);
  const slideIn = createSlideIn(isRtl, 48, 0.7);

  if (!about) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--section-padding-y)]"
    >
      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={textControls}
          className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
        >
          <motion.div variants={slideIn} className="space-y-4">
            <h2 className="mb-0 text-3xl leading-tight font-black text-balance sm:text-4xl">
              {about.title}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              {about.subtitle}
            </p>

            <motion.ul
              variants={staggerContainer}
              className="mt-4 grid gap-3 sm:grid-cols-2"
            >
              {(about.points || []).map((point: string, idx: number) => (
                <motion.li
                  key={idx}
                  variants={fadeInUp}
                  className="border-border bg-card flex items-start gap-3 rounded-xl border p-3"
                >
                  <span className="bg-primary/10 text-primary mt-0.5 inline-flex size-6 items-center justify-center rounded-full">
                    <Check className="size-4" />
                  </span>
                  <span className="text-sm sm:text-base">{point}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              variants={fadeInUp}
              className="flex w-full justify-center pt-2"
            >
              <Button size="lg">{about.cta}</Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={mediaControls}
            variants={fadeInUp}
            className="relative order-first aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted/50 sm:order-none"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <div className="absolute inset-6 flex items-center justify-center">
                <Image
                  src="/svgs/about-section.svg"
                  width={1000}
                  height={1000}
                  priority
                  alt="About illustration"
                  className="max-h-full w-auto object-contain opacity-95"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
