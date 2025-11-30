"use client";

import React from "react";
import Link from "next/link";
import { Variants, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { type TRouteName } from "@/utils/constant";

interface HeaderNavLinkProps {
  href: TRouteName;
  label: string;
  isActive: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isHovered?: boolean;
  variants?: Variants;
}

export function HeaderNavLink({
  href,
  label,
  isActive,
  onMouseEnter,
  onMouseLeave,
  isHovered = false,
  variants,
}: HeaderNavLinkProps) {
  const getLocalizedHref = useLocalizedHref();

  return (
    <Link
      className="nav-link relative px-3 py-2"
      href={getLocalizedHref(href)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Active background effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          layoutId="nav-active"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
      )}

      {/* Hover background effect */}
      {isHovered && !isActive && (
        <motion.div
          className="bg-primary/10 absolute inset-0 rounded-full"
          layoutId="nav-hover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
        />
      )}

      <motion.span
        className={cn(
          "relative text-sm font-semibold transition-colors sm:text-sm",
          isActive ? "text-primary" : "text-foreground/70",
        )}
        variants={variants}
        whileHover={{ y: -2 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
      >
        {label}
        {/* Underline animation */}
        <motion.span
          className="from-primary to-primary/50 absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-gradient-to-r"
          initial={{ scaleX: isActive ? 1 : 0 }}
          animate={{
            scaleX: isActive ? 1 : isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.span>
    </Link>
  );
}
