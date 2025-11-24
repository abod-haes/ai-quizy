"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useTranslation } from "@/providers/TranslationsProvider";
import { IOSButton } from "@/components/ui/ios-button";
import { AndroidButton } from "@/components/ui/android-button";
import {
  createFadeInUp,
  staggerContainer,
  useRevealedControls,
} from "@/lib/motion";

function AboutDownloadSocialSection() {
  const t = useTranslation();
  const download = t.download?.hero;
  const social = t.about?.social;

  // Controls to re-trigger animations whenever the section enters the viewport
  const sectionRef = useRef<HTMLElement | null>(null);
  const textControls = useRevealedControls(sectionRef, { amount: 0.25 });

  // Custom variants
  const fadeInUp = createFadeInUp(0.6, 20);

  if (!download || !social) return null;

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: social.facebook || "#",
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: social.twitter || "#",
      color: "hover:text-blue-400",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: social.instagram || "#",
      color: "hover:text-pink-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: social.linkedin || "#",
      color: "hover:text-blue-700",
    },
    {
      name: "YouTube",
      icon: Youtube,
      href: social.youtube || "#",
      color: "hover:text-red-600",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-[var(--section-padding-y)]"
    >
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_50%,hsl(var(--primary)/0.06),transparent_60%)]" />

      <div className="relative container">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Download App Section */}
          <motion.div
            initial="hidden"
            animate={textControls}
            variants={staggerContainer}
            className="flex flex-col"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wider uppercase sm:text-sm">
                {download.badge}
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="from-foreground to-foreground/70 mb-4 bg-gradient-to-b bg-clip-text text-3xl font-extrabold text-balance text-transparent sm:text-4xl md:text-5xl"
              style={{ lineHeight: "1.2" }}
            >
              {download.title}
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground mb-8 text-base leading-relaxed sm:text-lg"
            >
              {download.description}
            </motion.p>

            {/* Download buttons */}
            <motion.div
              variants={staggerContainer}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <motion.div variants={fadeInUp}>
                <IOSButton
                  label={download.appStore.label}
                  name={download.appStore.name}
                />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <AndroidButton
                  label={download.googlePlay.label}
                  name={download.googlePlay.name}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial="hidden"
            animate={textControls}
            variants={staggerContainer}
            className="flex flex-col"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="bg-primary/10 text-primary inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wider uppercase sm:text-sm">
                {social.badge}
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="from-foreground to-foreground/70 mb-4 bg-gradient-to-b bg-clip-text text-3xl font-extrabold text-balance text-transparent sm:text-4xl md:text-5xl"
              style={{ lineHeight: "1.2" }}
            >
              {social.title}
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground mb-8 text-base leading-relaxed sm:text-lg"
            >
              {social.description}
            </motion.p>

            {/* Social media links */}
            <motion.div
              variants={staggerContainer}
              className="flex flex-wrap gap-4"
            >
              {socialLinks.map((socialLink) => {
                const Icon = socialLink.icon;
                return (
                  <motion.a
                    key={socialLink.name}
                    variants={fadeInUp}
                    href={socialLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group border-border/60 bg-card/50 hover:bg-card flex items-center justify-center rounded-xl border p-4 transition-all duration-300 hover:shadow-lg ${socialLink.color}`}
                    initial={{ y: 0 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ ease: "linear", duration: 0.2 }}
                  >
                    <Icon className="size-6 transition-transform group-hover:scale-110" />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AboutDownloadSocialSection;
