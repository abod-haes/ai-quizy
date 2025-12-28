"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Languages, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { useRouter, usePathname } from "next/navigation";
import { i18n, Lang } from "@/utils/translations/dictionary-utils";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface HeaderLangSwitchProps {
  variant?: "desktop" | "mobile";
}

const languageNames: Record<Lang, string> = {
  en: "English",
  ar: "العربية",
};

const languageFlags: Record<Lang, string> = {
  en: "🇬🇧",
  ar: "🇸🇦",
};

export function HeaderLangSwitch({
  variant = "desktop",
}: HeaderLangSwitchProps) {
  const currentLang = useCurrentLang();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLang: Lang) => {
    if (newLang === currentLang) return;

    // Remove current language prefix from pathname
    let pathWithoutLang = pathname;

    // Remove any existing language prefix
    for (const lang of i18n.langs) {
      if (pathWithoutLang.startsWith(`/${lang}/`)) {
        pathWithoutLang = pathWithoutLang.replace(`/${lang}/`, "/");
        break;
      } else if (pathWithoutLang === `/${lang}`) {
        pathWithoutLang = "/";
        break;
      }
    }

    // Ensure path starts with /
    if (!pathWithoutLang.startsWith("/")) {
      pathWithoutLang = `/${pathWithoutLang}`;
    }

    // Add new language prefix
    const newPath = `/${newLang}${pathWithoutLang === "/" ? "" : pathWithoutLang}`;

    router.push(newPath);
  };

  if (variant === "mobile") {
    return (
      <div className="flex flex-col gap-2">
        {i18n.langs.map((lang) => {
          const isActive = lang === currentLang;
          return (
            <SheetClose key={lang} asChild>
              <Button
                variant={isActive ? "default" : "outline"}
                size="lg"
                onClick={() => switchLanguage(lang)}
                className={cn(
                  "w-full justify-start font-medium",
                  isActive && "bg-primary text-primary-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{languageFlags[lang]}</span>
                  <span>{languageNames[lang]}</span>
                  {isActive && <Check className="ml-auto size-4" />}
                </div>
              </Button>
            </SheetClose>
          );
        })}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/10 relative"
            aria-label="Switch language"
          >
            <motion.div
              initial={false}
              animate={{
                scale: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <Languages className="size-5" />
            </motion.div>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {i18n.langs.map((lang) => {
          const isActive = lang === currentLang;
          return (
            <DropdownMenuItem
              key={lang}
              onClick={() => switchLanguage(lang)}
              className={cn(
                "cursor-pointer",
                isActive && "bg-primary/10 font-medium",
              )}
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{languageFlags[lang]}</span>
                  <span>{languageNames[lang]}</span>
                </div>
                {isActive && <Check className="text-primary size-4" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
