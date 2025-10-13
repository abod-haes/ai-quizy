"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useCurrentLang } from "@/hooks/useCurrentLang";

interface BeautifulErrorAlertProps {
  errorMessage?: string | null | undefined;
  onRetry?: () => void;
  displayGoHome?: boolean;
  title?: string;
  subTitle?: string;
}

function FullPageError({
  errorMessage,
  onRetry,
  displayGoHome,
  title,
  subTitle,
}: BeautifulErrorAlertProps) {
  const lang = useCurrentLang();
  const { error: dict } = useTranslation();

  return (
    <div className="flex h-full flex-1 items-center justify-center pb-10">
      <div className="relative w-full max-w-md">
        {/* Floating Elements */}
        <div className="absolute inset-0 top-0 left-0 z-5 h-full w-full rounded-full bg-red-500/5 blur-[100px] dark:bg-red-500/10" />

        {/* Error Content */}
        <div className="relative z-10">
          <div className="relative mx-auto mb-8 w-fit rounded-full border-2 border-red-200 bg-white p-6 shadow-2xl dark:border-red-800 dark:bg-gray-900">
            <AlertTriangle className="h-12 w-12 animate-bounce text-red-500" />
          </div>
          <div className="mb-6 space-y-3 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {title || dict.errorPage}
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {subTitle || dict.description}
            </p>

            {/* Error Details */}
            {errorMessage && (
              <div className="bg-destructive/5 border-destructive mt-4 rounded-lg border p-4 dark:bg-transparent">
                <p className="text-destructive font-mono text-base font-medium break-words">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {onRetry || displayGoHome ? (
            <div className={cn("flex justify-center gap-3 text-center")}>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="destructive"
                  size="lg"
                  className="inline-flex transform items-center gap-2 font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                  <RefreshCw className="h-4 w-4" />
                  {dict.tryAgain}
                </Button>
              )}

              {displayGoHome && (
                <Link
                  href={`/${lang}/`}
                  className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex transform items-center gap-2 border px-4 py-2 font-semibold shadow-md transition-all duration-200 hover:scale-105"
                >
                  <Home className="h-4 w-4" />
                  {dict.goHome}
                </Link>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default FullPageError;
