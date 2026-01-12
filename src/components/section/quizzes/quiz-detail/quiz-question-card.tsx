"use client";

import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { MathJaxContent } from "@/components/custom/mathjax-content";
import type { Question } from "@/services/quizes.services/quiz.type";
import { QuizTimeDisplay } from "./quiz-time-display";

interface QuizQuestionCardProps {
  question: Question;
  questionNumber: number;
  questionLabel: string;
  descriptionLabel: string;
  timeSpentSeconds: number;
}

export const QuizQuestionCard = React.memo(function QuizQuestionCard({
  question,
  questionNumber,
  questionLabel,
  descriptionLabel,
  timeSpentSeconds,
}: QuizQuestionCardProps) {
  return (
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-xl">
            {questionLabel} {questionNumber}:
          </CardTitle>
          <div className="mt-2">
            <MathJaxContent html={question.title} className="text-base" />
          </div>
        </div>
        <QuizTimeDisplay timeSpentSeconds={timeSpentSeconds} />
      </div>
      {question.description && (
        <div className="bg-muted mt-4 rounded-md p-3">
          <p className="text-muted-foreground mb-2 text-sm font-semibold">
            {descriptionLabel}:
          </p>
          <MathJaxContent
            key={`question-${question.id}-description`}
            html={question.description}
            className="text-muted-foreground text-sm"
          />
        </div>
      )}
    </CardHeader>
  );
});
