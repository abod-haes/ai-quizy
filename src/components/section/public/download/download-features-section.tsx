"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  createFadeInUp,
  staggerContainer,
  useRevealedControls,
} from "@/lib/motion";
import {
  Download,
  Wifi,
  Zap,
  Shield,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/providers/TranslationsProvider";

const iconMap = [Download, Wifi, Zap, Shield, Smartphone, Sparkles];

interface FeatureItem {
  title: string;
  description: string;
}

function DownloadFeaturesSection() {
  const t = useTranslation();
  const featuresSection = t.download?.features;
  const sectionRef = useRef<HTMLElement | null>(null);
  const controls = useRevealedControls(sectionRef, { amount: 0.25 });
  const fadeInUp = createFadeInUp(0.6, 20);

  const features =
    featuresSection?.items?.map((item: FeatureItem, index: number) => ({
      ...item,
      icon: iconMap[index] || Download,
      color: index % 2 === 0 ? "text-primary" : "text-secondary",
      bgColor: index % 2 === 0 ? "bg-primary/10" : "bg-secondary/10",
    })) || [];

  if (!featuresSection) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--section-padding-y)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_400px_at_50%_-10%,hsl(var(--primary)/0.06),transparent_60%)]" />

      <div className="relative container">
        <motion.div
          initial="hidden"
          animate={controls}
          className="mx-auto max-w-6xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <h2 className="from-foreground to-foreground/70 mb-4 bg-gradient-to-b bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
              {featuresSection.title}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
              {featuresSection.subtitle}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="border-border/60 bg-card/50 group hover:bg-card/80 relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Background gradient */}
                  <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Content */}
                  <div className="relative">
                    {/* Icon */}
                    <motion.div
                      className={`${feature.bgColor} ${feature.color} mb-4 inline-flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="size-6" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="mb-2 text-lg font-semibold">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative element */}
                  <motion.div
                    className={`${feature.bgColor} absolute -top-2 -right-2 size-16 rounded-full blur-xl`}
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
              );
            })}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div variants={fadeInUp} className="mt-16 text-center">
            <motion.div
              className="border-border/60 bg-card/50 mx-auto max-w-2xl rounded-2xl border p-8 backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="mb-3 text-2xl font-bold">
                {featuresSection.cta.title}
              </h3>
              <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                {featuresSection.cta.subtitle}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.a
                  href="#"
                  className="border-border/60 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-12 items-center gap-3 rounded-full border px-6 font-semibold shadow-lg transition-all hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="size-5" />
                  {featuresSection.cta.button}
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default DownloadFeaturesSection;
