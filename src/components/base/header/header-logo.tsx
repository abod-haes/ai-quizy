"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { routesName } from "@/utils/constant";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";

interface HeaderLogoProps {
  logoScale: number;
  mounted: boolean;
  isDark: boolean;
}

export function HeaderLogo({ logoScale, mounted, isDark }: HeaderLogoProps) {
  const getLocalizedHref = useLocalizedHref();

  return (
    <motion.div
      className="flex justify-end will-change-transform"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Link href={getLocalizedHref(routesName.home)} aria-label="quizy home">
        <motion.div
          className="relative flex items-center gap-2"
          style={{ scale: logoScale }}
          whileHover={{ scale: 1.08, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {/* Glow effect on hover */}
          <motion.div
            className="bg-primary/20 pointer-events-none absolute -inset-2 rounded-full blur-xl"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />

          <motion.p
            className="from-primary to-primary/70 relative z-10 mt-1 bg-gradient-to-br bg-clip-text text-3xl font-bold text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            Quizy
          </motion.p>

          <motion.div
            className="relative"
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src={
                mounted && isDark
                  ? "/images/logo-dark.png"
                  : "/images/logo-light.png"
              }
              alt="quizy Logo"
              width={40}
              height={40}
              className="h-8 w-auto drop-shadow-lg"
              priority
            />
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
