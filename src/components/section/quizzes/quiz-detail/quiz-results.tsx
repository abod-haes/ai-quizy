"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trophy, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizResultsProps {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  onGoToHome: () => void;
  translations: {
    title: string;
    totalQuestions: string;
    correctAnswers: string;
    incorrectAnswers: string;
    score: string;
    percentage: string;
    goToHome: string;
  };
}

export function QuizResults({
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  onGoToHome,
  translations,
}: QuizResultsProps) {
  const score = correctAnswers;
  const percentage = totalQuestions > 0 
    ? Math.round((correctAnswers / totalQuestions) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="text-primary size-8" />
          </div>
          <CardTitle className="text-2xl">{translations.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="mb-2 text-5xl font-bold text-primary">
              {score}/{totalQuestions}
            </div>
            <div className="text-2xl font-semibold text-muted-foreground">
              {percentage}%
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {translations.score}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className={cn(
                "rounded-lg border p-4 text-center",
                "bg-success/10 border-success/20",
              )}
            >
              <CheckCircle2 className="text-success mx-auto mb-2 size-6" />
              <div className="text-2xl font-bold text-success">
                {correctAnswers}
              </div>
              <p className="text-muted-foreground text-sm">
                {translations.correctAnswers}
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg border p-4 text-center",
                "bg-destructive/10 border-destructive/20",
              )}
            >
              <XCircle className="text-destructive mx-auto mb-2 size-6" />
              <div className="text-2xl font-bold text-destructive">
                {incorrectAnswers}
              </div>
              <p className="text-muted-foreground text-sm">
                {translations.incorrectAnswers}
              </p>
            </div>
          </div>

          {/* Total Questions */}
          <div className="rounded-lg border bg-muted/50 p-4 text-center">
            <p className="text-muted-foreground text-sm">
              {translations.totalQuestions}
            </p>
            <p className="text-xl font-semibold">{totalQuestions}</p>
          </div>

          {/* Action Button */}
          <Button onClick={onGoToHome} className="w-full" size="lg">
            <Home className="mr-2 size-4" />
            {translations.goToHome}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

