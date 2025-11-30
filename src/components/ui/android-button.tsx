import React from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AndroidButtonProps {
  href?: string;
  className?: string;
}

export function AndroidButton({ href = "#", className }: AndroidButtonProps) {
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
        <div className="relative h-6 w-6">
          <Image
            src="/images/google-play.png"
            alt="Google Play"
            width={24}
            height={24}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-col items-start">
          {/* <span className="text-xs leading-none">{label}</span> */}
          <span className="text-base leading-tight font-semibold">
            Google Play
          </span>
        </div>
        <ArrowDown className="size-5 transition-transform group-hover:translate-y-1" />
      </a>
    </Button>
  );
}
