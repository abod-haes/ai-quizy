"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { routesName } from "@/utils/constant";
import { HeaderNavLink } from "./header-nav-link";
import { useActiveLink } from "./useActiveLink";
import { useTranslation } from "@/providers/TranslationsProvider";

interface HeaderDesktopNavProps {
  centerY: number;
}

const navItemVariants = {
  hidden: { y: 8, opacity: 0, scale: 0.95 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
};

export function HeaderDesktopNav({ centerY }: HeaderDesktopNavProps) {
  const { isLinkActive } = useActiveLink();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { header } = useTranslation();

  const navLinks = [
    { href: routesName.home.href, label: header.navigation.home },
    { href: routesName.quizzes.href, label: header.navigation.quizzes },
    { href: routesName.download.href, label: header.navigation.download },
    { href: routesName.about.href, label: header.navigation.about },
  ];

  return (
    <motion.div
      className="hidden justify-center will-change-transform md:flex"
      style={{ y: centerY }}
    >
      <motion.nav
        className="flex items-center gap-1"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.15,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {navLinks.map((link) => {
          const isActive = isLinkActive(link.href);
          return (
            <HeaderNavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={isActive}
              isHovered={hoveredLink === link.href}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
              variants={navItemVariants}
            />
          );
        })}
      </motion.nav>
    </motion.div>
  );
}

