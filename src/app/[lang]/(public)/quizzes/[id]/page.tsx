"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizById } from "@/hooks/api/quizes.query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useTranslation } from "@/providers/TranslationsProvider";
import ApiError from "@/components/custom/api-error";
import { HtmlContent } from "@/components/custom/html-content";
import { useAuthStore } from "@/store/auth.store";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { routesName } from "@/utils/constant";
import { cn } from "@/lib/utils";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const { quizzes: quizzesDict } = useTranslation();
  const { data: quiz, isLoading, error, refetch } = useQuizById(quizId);
  const isAuth = useAuthStore((state) => state.isAuth());
  const getLocalizedHref = useLocalizedHref();
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  // Check authentication on mount
  useEffect(() => {
    if (!isLoading && !isAuth) {
      const loginUrl = getLocalizedHref(routesName.signin);
      router.push(loginUrl);
    }
  }, [isAuth, isLoading, router, getLocalizedHref]);

  const handleNext = () => {
    if (!quiz?.questions || quiz.questions.length === 0) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const selectedAnswerIndex = selectedAnswers[currentQuestion.id];

    if (selectedAnswerIndex !== undefined) {
      // Check if answer is correct
      const selectedAnswer = currentQuestion.answers[selectedAnswerIndex];
      const correct = selectedAnswer.isCorrect;

      // Show feedback
      setIsCorrect(correct);
      setShowFeedback(true);

      // Clear selection after showing feedback
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswers((prev) => {
          const newAnswers = { ...prev };
          delete newAnswers[currentQuestion.id];
          return newAnswers;
        });

        // Move to next question
        if (
          quiz.questions &&
          currentQuestionIndex < quiz.questions.length - 1
        ) {
          setCurrentQuestionIndex((prev) => prev + 1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 2000); // Show feedback for 2 seconds
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions?.filter(
      (q) => selectedAnswers[q.id] === undefined,
    );

    if (unansweredQuestions && unansweredQuestions.length > 0) {
      // You can add a toast notification here
      return;
    }

    setIsSubmitting(true);
    // TODO: Implement submit logic
    // await submitQuizAnswers(quizId, selectedAnswers);
    setTimeout(() => {
      setIsSubmitting(false);
      // Handle success/error
    }, 1000);
  };

  // Show loading or redirect message if not authenticated
  if (!isAuth) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary size-8 animate-spin" />
          <p className="text-muted-foreground">
            {quizzesDict.detail.redirectingToLogin}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary size-8 animate-spin" />
          <p className="text-muted-foreground">{quizzesDict.detail.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ApiError
          errorMessage={quizzesDict.detail.error}
          refetchFunction={() => refetch()}
        />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <AlertCircle className="text-muted-foreground mx-auto mb-4 size-12" />
          <p className="text-muted-foreground text-lg">
            {quizzesDict.detail.noQuestions}
          </p>
        </Card>
      </div>
    );
  }

  if (!quiz?.questions || quiz.questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground text-lg">
            {quizzesDict.detail.noQuestions}
          </p>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isCurrentQuestionAnswered =
    selectedAnswers[currentQuestion.id] !== undefined;
  const allQuestionsAnswered = quiz.questions.every(
    (q) => selectedAnswers[q.id] !== undefined,
  );

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      {/* Progress Bar */}
      <div className="w-full">
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {quizzesDict.detail.question} {currentQuestionIndex + 1}:
          </CardTitle>
          <div className="mt-2">
            <HtmlContent html={currentQuestion.title} className="text-base" />
          </div>
          {currentQuestion.description && (
            <div className="bg-muted mt-4 rounded-md p-3">
              <p className="text-muted-foreground mb-2 text-sm font-semibold">
                {quizzesDict.detail.description}:
              </p>
              <HtmlContent
                html={currentQuestion.description}
                className="text-muted-foreground text-sm"
              />
            </div>
          )}
          {currentQuestion.hint && (
            <div className="bg-muted mt-2 rounded-md p-3">
              <p className="text-muted-foreground mb-2 text-sm font-semibold">
                <strong>{quizzesDict.detail.hint}:</strong>
              </p>
              <HtmlContent
                html={currentQuestion.hint}
                className="text-muted-foreground text-sm"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Feedback Message */}
          {showFeedback && (
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
                {isCorrect
                  ? quizzesDict.detail.correct
                  : quizzesDict.detail.incorrect}
              </span>
            </div>
          )}

          <RadioGroup
            value={selectedAnswers[currentQuestion.id]?.toString() ?? undefined}
            onValueChange={(value) =>
              handleAnswerChange(currentQuestion.id, parseInt(value, 10))
            }
            disabled={showFeedback}
          >
            <div className="space-y-3">
              {currentQuestion.answers.map((answer, answerIndex) => (
                <div
                  key={answerIndex}
                  className={cn(
                    "hover:bg-accent flex items-center space-x-2 rounded-md border p-3 transition-colors",
                    showFeedback &&
                      selectedAnswers[currentQuestion.id] === answerIndex &&
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
                    id={`${currentQuestion.id}-${answerIndex}`}
                    disabled={showFeedback}
                  />
                  <Label
                    htmlFor={`${currentQuestion.id}-${answerIndex}`}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    <HtmlContent html={answer.title} />
                  </Label>
                  {showFeedback && answer.isCorrect && (
                    <CheckCircle2 className="text-success size-5" />
                  )}
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          variant="outline"
          size="lg"
          className="min-w-[120px]"
        >
          <ChevronLeft className="mr-2 size-4" />
          {quizzesDict.detail.previous}
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmitting}
            size="lg"
            className="min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {quizzesDict.detail.submitting}
              </>
            ) : (
              quizzesDict.detail.submitQuiz
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!isCurrentQuestionAnswered || showFeedback}
            size="lg"
            className="min-w-[120px]"
          >
            {quizzesDict.detail.next}
            <ChevronRight className="ml-2 size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
