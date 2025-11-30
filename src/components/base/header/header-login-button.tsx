"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";
import { routesName } from "@/utils/constant";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useTranslation } from "@/providers/TranslationsProvider";
import { HeaderUserMenu } from "./header-user-menu";
import { useAuthStore } from "@/store/auth.store";

interface HeaderLoginButtonProps {
  variant?: "desktop" | "mobile";
}

export function HeaderLoginButton({
  variant = "desktop",
}: HeaderLoginButtonProps) {
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const { header } = useTranslation();
  const isAuth = useAuthStore.getState().isAuth();

  // Show user menu if authenticated
  if (isAuth) {
    return <HeaderUserMenu variant={variant} />;
  }

  if (variant === "mobile") {
    return (
      <SheetClose asChild>
        <Button
          variant="default"
          size="lg"
          onClick={() => router.push(getLocalizedHref(routesName.signin))}
          className="w-full font-semibold"
        >
          {header.auth.login}
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
        variant="default"
        size="sm"
        onClick={() => router.push(getLocalizedHref(routesName.signin))}
        className="relative overflow-hidden"
      >
        <motion.div
          className="header-button-shine absolute inset-0"
          initial={{ x: "-100%" }}
          whileHover={{
            x: "100%",
            transition: { duration: 0.6 },
          }}
        />
        <span className="relative z-10 flex items-center gap-1.5">
          <Sparkles className="size-3.5" />
          {header.auth.login}
        </span>
      </Button>
    </motion.div>
  );
}
