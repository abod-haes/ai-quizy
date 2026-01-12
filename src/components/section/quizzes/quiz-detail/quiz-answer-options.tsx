"use client";

import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MathJaxContent } from "@/components/custom/mathjax-content";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Question } from "@/services/quizes.services/quiz.type";

interface QuizAnswerOptionsProps {
  question: Question;
  selectedAnswerIndex?: number;
  showFeedback: boolean;
  onAnswerChange: (answerIndex: number) => void;
}

export const QuizAnswerOptions = React.memo(function QuizAnswerOptions({
  question,
  selectedAnswerIndex,
  showFeedback,
  onAnswerChange,
}: QuizAnswerOptionsProps) {
  return (
    <RadioGroup
      value={selectedAnswerIndex?.toString() ?? undefined}
      onValueChange={(value) => onAnswerChange(parseInt(value, 10))}
      disabled={showFeedback}
    >
      <div className="space-y-3">
        {question.answers.map((answer, answerIndex) => (
          <div
            key={answerIndex}
            className={cn(
              "hover:bg-accent flex items-center space-x-2 rounded-md border p-3 transition-colors",
              showFeedback &&
                selectedAnswerIndex === answerIndex &&
                (answer.isCorrect
                  ? "bg-success/10 border-success"
                  : "bg-destructive/10 border-destructive"),
              showFeedback &&
                answer.isCorrect &&
                "bg-success/10 border-success",
            )}
          >
            <RadioGroupItem
              value={answerIndex.toString()}
              id={`${question.id}-${answerIndex}`}
              disabled={showFeedback}
            />
            <Label
              htmlFor={`${question.id}-${answerIndex}`}
              className="flex-1 cursor-pointer text-sm font-normal"
            >
              <MathJaxContent html={answer.title} />
            </Label>
            {showFeedback && answer.isCorrect && (
              <CheckCircle2 className="text-success size-5" />
            )}
          </div>
        ))}
      </div>
    </RadioGroup>
  );
});
