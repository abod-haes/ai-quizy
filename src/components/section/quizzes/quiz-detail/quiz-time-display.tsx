"use client";

import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizTimeDisplayProps {
  timeSpentSeconds: number;
  className?: string;
}

export function QuizTimeDisplay({
  timeSpentSeconds,
  className,
}: QuizTimeDisplayProps) {
  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-muted-foreground",
        className,
      )}
    >
      <Clock className="size-4" />
      <span className="text-sm font-medium">
        {formatTime(timeSpentSeconds)}
      </span>
    </div>
  );
}

