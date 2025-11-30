"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { routesName } from "@/utils/constant";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useActiveLink } from "./useActiveLink";
import { HeaderThemeToggle } from "./header-theme-toggle";
import { HeaderLoginButton } from "./header-login-button";
import { useTranslation } from "@/providers/TranslationsProvider";

interface HeaderMobileMenuProps {
  mounted: boolean;
  isDark: boolean;
  setTheme: (theme: "light" | "dark") => void;
}

export function HeaderMobileMenu({
  mounted,
  isDark,
  setTheme,
}: HeaderMobileMenuProps) {
  const getLocalizedHref = useLocalizedHref();
  const { isLinkActive } = useActiveLink();
  const { header } = useTranslation();

  const navLinks = [
    { href: routesName.home, label: header.navigation.home },
    { href: routesName.quizzes, label: header.navigation.quizzes },
    { href: routesName.download, label: header.navigation.download },
    { href: routesName.about, label: header.navigation.about },
  ];

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={header.menu.openMenu}
            className="hover:bg-primary/10"
          >
            <MenuIcon className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          title={header.menu.navigationMenu}
          hideTitle
          className="w-[280px] sm:w-[320px]"
        >
          {/* Logo Section */}
          <div className="border-border/50 mb-8 flex items-center gap-2 border-b py-4">
            <Image
              src={
                mounted && isDark
                  ? "/images/logo-dark.png"
                  : "/images/logo-light.png"
              }
              alt="Quizy Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent">
              Quizy
            </span>
          </div>

          {/* Navigation Links */}
          <motion.nav
            className="flex flex-col gap-1"
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {navLinks.map((link) => {
              const isActive = isLinkActive(link.href);
              return (
                <SheetClose asChild key={link.href as string}>
                  <motion.div
                    variants={{
                      hidden: { x: -15, opacity: 0 },
                      show: {
                        x: 0,
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 300,
                          damping: 24,
                        },
                      },
                    }}
                  >
                    <Link
                      href={getLocalizedHref(link.href)}
                      className={cn(
                        "group/mobile text-foreground hover:bg-primary/5 hover:text-primary relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                        isActive && "bg-primary/10 text-primary",
                      )}
                    >
                      <div
                        className={cn(
                          "bg-primary absolute inset-y-0 left-0 w-1 rounded-r-full transition-opacity",
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover/mobile:opacity-100",
                        )}
                      />
                      <span className="relative">{link.label}</span>
                    </Link>
                  </motion.div>
                </SheetClose>
              );
            })}
          </motion.nav>

          {/* Theme Toggle and Login Button */}
          <motion.div
            className="absolute right-6 bottom-6 left-6 flex flex-col gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <HeaderThemeToggle
              isDark={isDark}
              setTheme={setTheme}
              mounted={mounted}
              variant="mobile"
            />
            <HeaderLoginButton variant="mobile" />
          </motion.div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
