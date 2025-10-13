"use client";
import { Button } from "@/components/ui/button";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { routesName } from "@/utils/constant";
import { DownloadIcon } from "lucide-react";
import React from "react";

export const Header = () => {
  const getLocalizedHref = useLocalizedHref();
  return (
    <div className="relative top-0 left-0 z-50 mx-auto w-full max-w-7xl px-4 py-16 text-center md:py-32 lg:py-40">
      <h1
        className="from-foreground to-foreground bg-gradient-to-b bg-clip-text text-3xl font-extrabold text-balance text-transparent md:text-6xl"
        style={{ lineHeight: "1.5" }}
      >
        اختبر معلوماتك وتعلّم بطرق ممتعة مع Quizy
      </h1>
      <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base text-pretty md:text-lg">
        أنشئ اختباراتك بسهولة، شاركها مع أصدقائك، وتابع تقدّمك لحظة بلحظة. تم
        تصميم Quizy ليمنحك تجربة عربية سلسة وحديثة في التعلّم باللعب.
      </p>
      <Button
        size={"lg"}
        className="mt-6"
        href={getLocalizedHref(routesName.download)}
      >
        <DownloadIcon className="size-5" />
        تحميل التطبيق
      </Button>
    </div>
  );
};
