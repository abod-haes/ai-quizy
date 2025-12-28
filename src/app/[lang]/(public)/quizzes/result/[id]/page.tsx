"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizResults } from "@/hooks/api/quizes.query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/custom/loading";
import ApiErrorComponent from "@/components/custom/api-error";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { routesName } from "@/utils/constant";
import { CheckCircle2, XCircle, Clock, Trophy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { MathJaxContent } from "@/components/custom/mathjax-content";
import { AxiosError } from "axios";
import { ApiError } from "@/types/common.type";
import type { Question, StudentAnswer } from "@/types/quiz.type";

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const { quizzes: quizzesDict } = useTranslation();
  const getLocalizedHref = useLocalizedHref();
  const { data: results, isLoading, error, refetch } = useQuizResults(quizId);

  const stats = useMemo(() => {
    if (!results) return null;

    const totalQuestions = results.quiz.questions?.length || 0;
    const correctAnswers = results.answers.filter(
      (a: StudentAnswer) => a.isCorrect,
    ).length;
    const incorrectAnswers = results.answers.filter(
      (a: StudentAnswer) => !a.isCorrect,
    ).length;
    const percentage =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      percentage,
      score: correctAnswers,
    };
  }, [results]);

  if (isLoading) {
    return <PageLoading message={quizzesDict.detail.results.loading} />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ApiErrorComponent
          errorMessage={
            (error as AxiosError<ApiError>)?.response?.data?.title ||
            quizzesDict.detail.results.error
          }
          refetchFunction={() => refetch()}
        />
      </div>
    );
  }

  if (!results || !stats) {
    return null;
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Results Summary */}
      <Card className="mx-auto max-w-4xl">
        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Trophy className="text-primary size-8" />
          </div>
          <CardTitle className="text-2xl">
            {quizzesDict.detail.results.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <div className="text-primary mb-2 text-5xl font-bold">
              {stats.score}/{stats.totalQuestions}
            </div>
            <div className="text-muted-foreground text-2xl font-semibold">
              {stats.percentage}%
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              {quizzesDict.detail.results.score}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div
              className={cn("rounded-lg border p-4 text-center", "bg-muted/50")}
            >
              <p className="text-muted-foreground mb-2 text-sm">
                {quizzesDict.detail.results.totalQuestions}
              </p>
              <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            </div>
            <div
              className={cn(
                "rounded-lg border p-4 text-center",
                "bg-success/10 border-success/20",
              )}
            >
              <CheckCircle2 className="text-success mx-auto mb-2 size-6" />
              <div className="text-success text-2xl font-bold">
                {stats.correctAnswers}
              </div>
              <p className="text-muted-foreground text-sm">
                {quizzesDict.detail.results.correctAnswers}
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg border p-4 text-center",
                "bg-destructive/10 border-destructive/20",
              )}
            >
              <XCircle className="text-destructive mx-auto mb-2 size-6" />
              <div className="text-destructive text-2xl font-bold">
                {stats.incorrectAnswers}
              </div>
              <p className="text-muted-foreground text-sm">
                {quizzesDict.detail.results.incorrectAnswers}
              </p>
            </div>
          </div>

          {/* Time Spent */}
          {results.quiz.timeSpentFormatted && (
            <div className="bg-muted/50 rounded-lg border p-4 text-center">
              <div className="text-muted-foreground mb-2 flex items-center justify-center gap-2 text-sm">
                <Clock className="size-4" />
                {quizzesDict.detail.results.timeSpent}
              </div>
              <p className="text-xl font-semibold">
                {results.quiz.timeSpentFormatted}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions and Answers */}
      <div className="mx-auto max-w-4xl space-y-4">
        {results.quiz.questions?.map((question: Question, index: number) => {
          const studentAnswer = results.answers.find(
            (a: StudentAnswer) => a.questionId === question.id,
          );
          const isCorrect = studentAnswer?.isCorrect || false;
          const correctAnswer = question.answers.find((a) => a.isCorrect);

          return (
            <Card
              key={question.id}
              className={cn(
                "border-2",
                isCorrect
                  ? "border-success/50 bg-success/5"
                  : "border-destructive/50 bg-destructive/5",
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {quizzesDict.detail.results.question} {index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="text-success size-5" />
                    ) : (
                      <XCircle className="text-destructive size-5" />
                    )}
                    {studentAnswer && (
                      <span className="text-muted-foreground text-xs">
                        {quizzesDict.detail.results.timeSpentOnQuestion.replace(
                          "{seconds}",
                          String(studentAnswer.timeSpentSeconds),
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <MathJaxContent html={question.title} className="text-base" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Student Answer */}
                <div>
                  <p className="text-muted-foreground mb-2 text-sm font-semibold">
                    {quizzesDict.detail.results.yourAnswer}:
                  </p>
                  <div
                    className={cn(
                      "rounded-md border p-3",
                      isCorrect
                        ? "bg-success/10 border-success/20"
                        : "bg-destructive/10 border-destructive/20",
                    )}
                  >
                    <MathJaxContent
                      html={studentAnswer?.answerTitle || ""}
                      className={cn(
                        isCorrect ? "text-success" : "text-destructive",
                      )}
                    />
                  </div>
                </div>

                {/* Correct Answer (if wrong) */}
                {!isCorrect && correctAnswer && (
                  <div>
                    <p className="text-muted-foreground mb-2 text-sm font-semibold">
                      {quizzesDict.detail.results.correctAnswer}:
                    </p>
                    <div className="bg-success/10 border-success/20 rounded-md border p-3">
                      <MathJaxContent
                        html={correctAnswer.title}
                        className="text-success"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="mx-auto max-w-4xl">
        <Button
          onClick={() =>
            router.push(
              getLocalizedHref(routesName.quizzesDetails(quizId) as string),
            )
          }
          className="w-full"
          size="lg"
        >
          <RotateCcw className="mr-2 size-4" />
          {quizzesDict.detail.results.replayQuiz}
        </Button>
      </div>
    </div>
  );
}
