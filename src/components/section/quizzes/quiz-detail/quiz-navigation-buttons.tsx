"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonLoading } from "@/components/custom/loading";
import { cn } from "@/lib/utils";

interface QuizNavigationButtonsProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isCurrentQuestionAnswered: boolean;
  allQuestionsAnswered: boolean;
  isSubmitting: boolean;
  showFeedback: boolean;
  previousText: string;
  nextText: string;
  submitQuizText: string;
  submittingText: string;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function QuizNavigationButtons({
  isFirstQuestion,
  isLastQuestion,
  isCurrentQuestionAnswered,
  isSubmitting,
  showFeedback,
  previousText,
  nextText,
  submitQuizText,
  submittingText,
  onPrevious,
  onNext,
  onSubmit,
}: QuizNavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        onClick={onPrevious}
        disabled={isFirstQuestion}
        variant="outline"
        size="lg"
        className="min-w-[120px]"
      >
        <ChevronLeft className="mr-2 size-4" />
        {previousText}
      </Button>

      {isLastQuestion ? (
        <Button
          onClick={onSubmit}
          disabled={!isCurrentQuestionAnswered || isSubmitting}
          size="lg"
          className="min-w-[200px]"
          title={
            !isCurrentQuestionAnswered
              ? "Please select an answer"
              : isSubmitting
                ? "Submitting..."
                : "Submit quiz"
          }
          style={{
            opacity: !isCurrentQuestionAnswered || isSubmitting ? 0.5 : 1,
            cursor:
              !isCurrentQuestionAnswered || isSubmitting
                ? "not-allowed"
                : "pointer",
          }}
        >
          {isSubmitting ? (
            <>
              <ButtonLoading />
              <span className={cn("ml-2")}>{submittingText}</span>
            </>
          ) : (
            submitQuizText
          )}
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!isCurrentQuestionAnswered || showFeedback}
          size="lg"
          className="min-w-[120px]"
        >
          {nextText}
          <ChevronRight className="ml-2 size-4" />
        </Button>
      )}
    </div>
  );
}

