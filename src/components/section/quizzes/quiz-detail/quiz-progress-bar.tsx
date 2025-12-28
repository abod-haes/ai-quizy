"use client";

import React from "react";

interface QuizProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  showCount?: boolean;
  questionsCountText?: string;
}

export function QuizProgressBar({
  currentIndex,
  totalQuestions,
  showCount = false,
  questionsCountText,
}: QuizProgressBarProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className="w-full space-y-2">
      {showCount && questionsCountText && (
        <div className="text-muted-foreground text-center text-sm font-medium">
          {questionsCountText}
        </div>
      )}
      <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

