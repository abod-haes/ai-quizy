"use client";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useHeaderAnimations } from "./useHeaderAnimations";
import { HeaderLogo } from "./header-logo";
import { HeaderThemeToggle } from "./header-theme-toggle";
import { HeaderLoginButton } from "./header-login-button";
import { HeaderDesktopNav } from "./header-desktop-nav";
import { HeaderMobileMenu } from "./header-mobile-menu";
import { HeaderLangSwitch } from "./header-lang-switch";

function Header() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDark = resolvedTheme === "dark";

  const {
    isScrolled,
    widthPercent,
    headerY,
    leftX,
    centerY,
    logoScale,
    borderOpacity,
    scrollYProgress,
  } = useHeaderAnimations();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className={cn(
        "relative z-50 transition-all duration-500 will-change-transform",
        isScrolled ? "sticky top-2" : "",
      )}
    >
      {/* Animated progress bar */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-[60] h-[2px] w-full origin-left"
        style={{
          scaleX: scrollYProgress,
        }}
      >
        <div className="from-primary via-primary/80 to-primary/60 h-full w-full bg-gradient-to-r" />
      </motion.div>

      {/* Decorative gradient background */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: borderOpacity,
        }}
      >
        <div className="from-primary/5 absolute inset-0 bg-gradient-to-b via-transparent to-transparent" />
      </motion.div>

      <div className="relative container">
        <div className="rounded-full py-2">
          <motion.div
            className={cn(
              "group relative z-10 mx-auto flex items-center justify-between transition-all duration-500",
              isScrolled
                ? "border-border/60 bg-background/95 shadow-primary/5 supports-[backdrop-filter]:bg-background/80 rounded-full border px-4 py-3 shadow-lg backdrop-blur-xl"
                : "py-1",
            )}
            style={{
              width: widthPercent,
              minWidth: "min(100%, 320px)",
              y: headerY,
              boxShadow: isScrolled ? "var(--header-box-shadow)" : "none",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Gradient border effect on scroll */}
            <motion.div
              className="bg-header-border-gradient pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500"
              style={{
                opacity: borderOpacity,
              }}
            />

            {/* Left section - Mobile menu / Theme toggle / Login button */}
            <motion.div
              className="flex items-center gap-2 will-change-transform"
              style={{ x: leftX }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <HeaderMobileMenu
                mounted={mounted}
                isDark={isDark}
                setTheme={setTheme}
              />

              {/* Desktop theme toggle, language switch and login button */}
              <div className="hidden items-center gap-2 md:flex">
                <HeaderThemeToggle
                  isDark={isDark}
                  setTheme={setTheme}
                  mounted={mounted}
                  variant="desktop"
                />
                <HeaderLangSwitch variant="desktop" />
                <HeaderLoginButton variant="desktop" />
              </div>
            </motion.div>

            {/* Center navigation - Desktop */}
            <HeaderDesktopNav centerY={centerY.get() || 0} />

            {/* Right section - Logo */}
            <HeaderLogo
              logoScale={logoScale.get() || 1}
              mounted={mounted}
              isDark={isDark}
            />
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export default Header;
