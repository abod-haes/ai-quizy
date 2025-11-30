"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Sparkles, Globe } from "lucide-react";
import { useTranslation } from "@/providers/TranslationsProvider";
import {
  createFadeInUp,
  staggerContainer,
  useRevealedControls,
} from "@/lib/motion";

function AboutHeroSection() {
  const t = useTranslation();
  const about = t.about?.hero;

  // Controls to re-trigger animations whenever the section enters the viewport
  const sectionRef = useRef<HTMLElement | null>(null);
  const textControls = useRevealedControls(sectionRef, { amount: 0.25 });
  const visualControls = useRevealedControls(sectionRef, { amount: 0.25 });

  // Custom variants
  const fadeInUp = createFadeInUp(0.6, 20);

  // Generate random values only on client to prevent hydration mismatch
  const [particleData, setParticleData] = useState<
    Array<{
      left: number;
      top: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    // Generate random values only on client side
    setParticleData(
      Array.from({ length: 6 }, () => ({
        left: 20 + Math.random() * 60,
        top: 20 + Math.random() * 60,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    );
  }, []);

  if (!about) return null;

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden py-[8rem]"
    >
      {/* Enhanced Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,hsl(var(--primary)/0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_80%_20%,hsl(var(--secondary)/0.08),transparent_50%)]" />

      {/* Animated background elements - constrained within viewport */}
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
        {/* Text Section - matching home hero styling */}
        <motion.div
          initial="hidden"
          animate={textControls}
          className="mx-auto w-full max-w-7xl px-4 text-center"
        >
          {/* Main title - matching home hero */}
          <motion.h1
            variants={fadeInUp}
            className="from-foreground to-foreground bg-gradient-to-b bg-clip-text text-3xl font-extrabold text-balance text-transparent md:text-6xl"
            style={{ lineHeight: "1.5" }}
          >
            {about.title}
          </motion.h1>

          {/* Subtitle - matching home hero */}
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base text-pretty md:text-lg"
          >
            {about.subtitle}
          </motion.p>
        </motion.div>

        {/* Enhanced Visual elements */}
        <motion.div
          initial="hidden"
          animate={visualControls}
          variants={staggerContainer}
          className="mt-20 grid w-full max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Enhanced Feature cards */}
          {about.features?.map((feature, index) => {
            const IconComponents = [Target, Sparkles, Globe];
            const gradientClasses = [
              "from-primary/5",
              "from-secondary/5",
              "from-primary/5 via-secondary/5",
            ];
            const shadowClasses = [
              "hover:shadow-primary/10",
              "hover:shadow-secondary/10",
              "hover:shadow-primary/10",
            ];
            const bgClasses = [
              "bg-primary/5",
              "bg-secondary/5",
              "bg-primary/5",
            ];
            const colSpanClass =
              index === 2 ? "sm:col-span-2 lg:col-span-1" : "";

            const Icon = IconComponents[index] || IconComponents[0];
            const gradientClass = gradientClasses[index] || gradientClasses[0];
            const shadowClass = shadowClasses[index] || shadowClasses[0];
            const bgClass = bgClasses[index] || bgClasses[0];

            return (
          <motion.div
                key={index}
            variants={fadeInUp}
                className={`group border-border/60 bg-card/50 hover:bg-card/80 ${shadowClass} relative overflow-hidden rounded-2xl border p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${colSpanClass}`}
          >
                <div
                  className={`${gradientClass} absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />
            <div className="relative">
                  <div className="text-primary mb-6 flex items-center justify-center">
                    <Icon className="size-10" />
            </div>
                  <h3 className="mb-3 text-xl font-semibold">
                    {feature.title}
                  </h3>
              <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
              </p>
            </div>
                <div
                  className={`${bgClass} absolute -right-1 -bottom-1 h-20 w-20 rounded-full blur-xl transition-all duration-500 group-hover:scale-150`}
                />
          </motion.div>
            );
          })}
        </motion.div>

        {/* Floating decorative elements - constrained within container */}
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          {particleData.map((particle, i) => (
            <motion.div
              key={i}
              className="bg-primary/20 absolute h-1 w-1 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default AboutHeroSection;
