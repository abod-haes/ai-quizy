import React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GooglePlayIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface AndroidButtonProps {
  label: string;
  name: string;
  href?: string;
  className?: string;
}

export function AndroidButton({
  label,
  name,
  href = "#",
  className,
}: AndroidButtonProps) {
  return (
    <Button
      size="lg"
      variant="secondary"
      className={cn(
        "group relative h-14 gap-3 overflow-hidden px-8 text-base",
        className,
      )}
      asChild
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3"
      >
        <div className="relative">
          <GooglePlayIcon className="size-6" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-xs leading-none">{label}</span>
          <span className="text-base leading-tight font-semibold">{name}</span>
        </div>
        <ArrowDown className="size-5 transition-transform group-hover:translate-y-1" />
      </a>
    </Button>
  );
}

