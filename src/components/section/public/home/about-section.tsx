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

  // Controls to re-trigger animations whenever the section enters the viewport
  const sectionRef = useRef<HTMLElement | null>(null);
  const textControls = useRevealedControls(sectionRef, { amount: 0.25 });
  const mediaControls = useRevealedControls(sectionRef, { amount: 0.25 });

  // Custom variants
  const fadeInUp = createFadeInUp(0.6, 20);
  const slideIn = createSlideIn(isRtl, 48, 0.7);

  if (!about) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--section-padding-y)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_-10%,hsl(var(--primary)/0.06),transparent_60%)]" />

      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={textControls}
          className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
        >
          <motion.div variants={slideIn} className="space-y-4">
            <h2 className="from-foreground to-foreground/70 mb-0 bg-gradient-to-b bg-clip-text text-3xl leading-tight font-bold text-balance text-transparent sm:text-4xl">
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
                  className="border-border/60 bg-card/50 flex items-start gap-3 rounded-xl border p-3 backdrop-blur-sm"
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
            className="from-secondary/60 via-secondary/30 relative order-first aspect-[4/3] overflow-hidden rounded-2xl sm:order-none"
          >
            {/* bg-gradient-to-br to-transparent */}
            <div className="absolute inset-0" />
            {/* bg-[radial-gradient(500px_200px_at_20%_20%,hsl(var(--primary)/0.12),transparent_60%)] */}
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
              {/* Decorative animated blobs */}
              {/* <motion.span
                aria-hidden
                className="bg-primary/20 absolute -top-6 -left-6 size-28 rounded-full blur-xl"
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.span
                aria-hidden
                className="bg-secondary/60 absolute -right-8 -bottom-8 size-36 rounded-full blur-2xl"
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              /> */}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;
