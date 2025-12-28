"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizFeedbackMessageProps {
  isCorrect: boolean;
  correctText: string;
  incorrectText: string;
}

export function QuizFeedbackMessage({
  isCorrect,
  correctText,
  incorrectText,
}: QuizFeedbackMessageProps) {
  return (
    <div
      className={cn(
        "mb-4 flex items-center gap-2 rounded-md p-4",
        isCorrect
          ? "bg-success/10 text-success border-success/20 border"
          : "bg-destructive/10 text-destructive border-destructive/20 border",
      )}
    >
      {isCorrect ? (
        <CheckCircle2 className="size-5" />
      ) : (
        <XCircle className="size-5" />
      )}
      <span className="font-semibold">
        {isCorrect ? correctText : incorrectText}
      </span>
    </div>
  );
}

