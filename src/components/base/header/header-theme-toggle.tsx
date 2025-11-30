"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";
import { useTranslation } from "@/providers/TranslationsProvider";

interface HeaderThemeToggleProps {
  isDark: boolean;
  setTheme: (theme: "light" | "dark") => void;
  mounted: boolean;
  variant?: "desktop" | "mobile";
}

export function HeaderThemeToggle({
  isDark,
  setTheme,
  mounted,
  variant = "desktop",
}: HeaderThemeToggleProps) {
  const { header } = useTranslation();

  if (!mounted) return null;

  if (variant === "mobile") {
    return (
      <SheetClose asChild>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="w-full font-medium"
          aria-label={header.theme.toggleTheme}
        >
          <div className="flex items-center gap-2">
            {isDark ? (
              <>
                <Sun className="size-4" />
                <span>{header.theme.lightMode}</span>
              </>
            ) : (
              <>
                <Moon className="size-4" />
                <span>{header.theme.darkMode}</span>
              </>
            )}
          </div>
        </Button>
      </SheetClose>
    );
  }

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="hover:bg-primary/10 relative"
        aria-label={header.theme.toggleTheme}
      >
        <motion.div
          initial={false}
          animate={{
            rotate: isDark ? 0 : 180,
            scale: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </motion.div>
      </Button>
    </motion.div>
  );
}

