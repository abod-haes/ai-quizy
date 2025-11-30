"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import {
  createFadeInUp,
  createSlideIn,
  useRevealedControls,
} from "@/lib/motion";
import { useTranslation } from "@/providers/TranslationsProvider";

function FooterSection() {
  const lang = useCurrentLang();
  const t = useTranslation();
  const f = t.footer;
  const isRtl = lang === "ar";

  const ref = useRef<HTMLElement | null>(null);
  const controls = useRevealedControls(ref, { amount: 0.2 });

  const fadeIn = createFadeInUp(0.5, 12);
  const slide = createSlideIn(isRtl, 24, 0.55);

  const year = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      className="border-border/60 bg-background/70 relative mt-16 border-t backdrop-blur-md"
    >
      <div className="bg-card pointer-events-none absolute inset-0" />
      <div className="relative container py-10">
        <motion.div
          initial="hidden"
          animate={controls}
          className="grid grid-cols-2 place-items-center gap-8 text-center md:grid-cols-3 md:place-items-start md:text-start"
        >
          <motion.div variants={slide} className="space-y-2 max-md:col-span-2">
            <div className="text-2xl font-bold">{t.siteMeta.siteName}</div>
            <p className="text-muted-foreground text-sm">{f.tagline}</p>
          </motion.div>

          <motion.ul variants={fadeIn} className="grid gap-2 text-sm">
            <li className="text-muted-foreground/80">{f.links.product}</li>
            <li className="text-muted-foreground/80">{f.links.pricing}</li>
            <li className="text-muted-foreground/80">{f.links.features}</li>
          </motion.ul>

          <motion.ul variants={fadeIn} className="grid gap-2 text-sm">
            <li className="text-muted-foreground/80">{f.links.support}</li>
            <li className="text-muted-foreground/80">{f.links.privacy}</li>
            <li className="text-muted-foreground/80">{f.links.terms}</li>
          </motion.ul>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={fadeIn}
          className="border-border/60 text-muted-foreground mt-8 flex flex-col items-center justify-center gap-2 border-t pt-6 text-center text-xs md:flex-row md:justify-between md:gap-4 md:text-left"
        >
          <span>
            © {year} {t.siteMeta.siteName}. {f.rights}.
          </span>
        </motion.div>
      </div>
    </footer>
  );
}

export default FooterSection;
