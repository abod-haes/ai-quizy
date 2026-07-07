"use client";
import { Button } from "@/components/ui/button";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { routesName } from "@/utils/constant";
import { DownloadIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "@/providers/TranslationsProvider";

export const Header = () => {
  const getLocalizedHref = useLocalizedHref();
  const t = useTranslation();
  const hero = t.home?.hero;

  if (!hero) return null;

  return (
    <div className="relative top-0 left-0 z-50 mx-auto w-full max-w-7xl px-4 py-16 text-center md:py-32 lg:py-40">
      <h1
        className="from-foreground to-foreground bg-gradient-to-b bg-clip-text text-3xl font-extrabold text-balance text-transparent md:text-6xl"
        style={{ lineHeight: "1.5" }}
      >
        {hero.title}
      </h1>
      <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base text-pretty md:text-lg">
        {hero.description}
      </p>
      <Button
        size={"lg"}
        className="mt-6"
        href={getLocalizedHref(routesName.download.href)}
      >
        <DownloadIcon className="size-5" />
        {hero.downloadButton}
      </Button>
    </div>
  );
};
