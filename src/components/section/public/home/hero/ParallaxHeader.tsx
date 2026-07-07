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
    <div className="relative top-0 left-0 z-50 mx-auto w-full max-w-5xl px-4 py-12 text-center md:py-24 lg:py-28">
      <h1
        className="text-2xl font-extrabold text-balance text-foreground sm:text-3xl md:text-5xl"
        style={{ lineHeight: "1.45" }}
      >
        {hero.title}
      </h1>
      <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-sm text-pretty md:text-base">
        {hero.description}
      </p>
      <Button
        size={"lg"}
        className="mt-5"
        href={getLocalizedHref(routesName.download.href)}
      >
        <DownloadIcon className="size-4" />
        {hero.downloadButton}
      </Button>
    </div>
  );
};
