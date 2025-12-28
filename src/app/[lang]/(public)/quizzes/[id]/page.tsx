"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizById, useSubmitQuizResults } from "@/hooks/api/quizes.query";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { PageLoading } from "@/components/custom/loading";
import { useTranslation } from "@/providers/TranslationsProvider";
import ApiErrorComponent from "@/components/custom/api-error";
import { useAuthStore, useUser } from "@/store/auth.store";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { routesName } from "@/utils/constant";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiError } from "@/types/common.type";
import {
  QuizProgressBar,
  QuizQuestionCard,
  QuizFeedbackMessage,
  QuizAnswerOptions,
  QuizNavigationButtons,
  QuizResults,
} from "@/components/section/quizzes/quiz-detail";
import { useQuizTimeTracking } from "@/hooks/use-quiz-time-tracking";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const { quizzes: quizzesDict } = useTranslation();
  const { data: quiz, isLoading, error, refetch } = useQuizById(quizId);
  const isAuth = useAuthStore((state) => state.isAuth());
  const user = useUser();
  const getLocalizedHref = useLocalizedHref();
  const submitQuizResults = useSubmitQuizResults(quizId);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    correctAnswers: number;
    incorrectAnswers: number;
  } | null>(null);

  // Memoize questions to prevent unnecessary re-renders
  const questionsMemo = useMemo(() => quiz?.questions, [quiz?.questions]);

  const { currentTimeSpent, finalizeCurrentQuestion, getTimeSpent } =
    useQuizTimeTracking({
      questions: questionsMemo,
      currentQuestionIndex,
    });

  const handleAnswerChange = useCallback(
    (questionId: string, answerIndex: number) => {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: answerIndex,
      }));
    },
    [],
  );

  // Check authentication on mount
  useEffect(() => {
    if (!isLoading && !isAuth) {
      const loginUrl = getLocalizedHref(routesName.signin.href);
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

      // Clear feedback after showing it, but keep the answer
      setTimeout(() => {
        setShowFeedback(false);

        // Move to next question (keep all answers - don't delete them)
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
    if (!quiz || !user?.id) {
      toast.error(quizzesDict.detail.submitError);
      return;
    }

    // Check if all questions are answered
    const unansweredQuestions = quiz.questions?.filter(
      (q) => selectedAnswers[q.id] === undefined,
    );

    if (unansweredQuestions && unansweredQuestions.length > 0) {
      toast.error(quizzesDict.detail.pleaseAnswerAll);
      return;
    }

    // Finalize time tracking for current question
    if (!quiz.questions) {
      toast.error(quizzesDict.detail.submitError);
      return;
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (currentQuestion) {
      finalizeCurrentQuestion(currentQuestion.id);
    }

    setIsSubmitting(true);

    try {
      // Prepare questions array for submission
      const questions = quiz.questions.map((question) => {
        const answerIndex = selectedAnswers[question.id];
        if (answerIndex === undefined) {
          throw new Error(`Answer not found for question ${question.id}`);
        }

        const selectedAnswer = question.answers[answerIndex];
        // Use answerId from API (preferred), then id, otherwise generate a temporary ID
        const answerId =
          selectedAnswer.answerId ||
          selectedAnswer.id ||
          `${question.id}-${answerIndex}`;

        if (!answerId) {
          throw new Error(
            `Answer ID not found for question ${question.id} at index ${answerIndex}`,
          );
        }

        return {
          questionId: question.id,
          answerId: answerId,
          timeSpentSeconds: getTimeSpent(question.id),
        };
      });

      await submitQuizResults.mutateAsync({
        studentId: user.id,
        questions,
      });

      // Calculate results
      let correctCount = 0;
      let incorrectCount = 0;

      quiz.questions.forEach((question) => {
        const answerIndex = selectedAnswers[question.id];
        if (answerIndex !== undefined) {
          const selectedAnswer = question.answers[answerIndex];
          if (selectedAnswer.isCorrect) {
            correctCount++;
          } else {
            incorrectCount++;
          }
        }
      });

      setQuizResults({
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
      });
      setShowResults(true);

      toast.success(quizzesDict.detail.submitSuccess);
    } catch (err: unknown) {
      // Handle error with title and detail
      if (err instanceof AxiosError) {
        const errorData = err.response?.data as ApiError | undefined;

        if (errorData) {
          // Build error message with title and detail only
          const errorParts: string[] = [];

          if (errorData.title) {
            errorParts.push(errorData.title);
          }

          if (errorData.detail) {
            errorParts.push(errorData.detail);
          }

          // If we have both title and detail, join them
          const errorMessage =
            errorParts.length > 0
              ? errorParts.join(" - ")
              : errorData.title || quizzesDict.detail.submitError;

          toast.error(errorMessage);
        } else {
          toast.error(quizzesDict.detail.submitError);
        }
      } else {
        toast.error(quizzesDict.detail.submitError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading or redirect message if not authenticated
  if (!isAuth) {
    return <PageLoading message={quizzesDict.detail.redirectingToLogin} />;
  }

  if (isLoading) {
    return <PageLoading message={quizzesDict.detail.loading} />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ApiErrorComponent
          errorMessage={
            (error as AxiosError<ApiError>)?.response?.data?.title ||
            quizzesDict.detail.error
          }
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

  // Show results if submitted
  if (showResults && quizResults) {
    return (
      <QuizResults
        totalQuestions={quiz.questions.length}
        correctAnswers={quizResults.correctAnswers}
        incorrectAnswers={quizResults.incorrectAnswers}
        onGoToHome={() =>
          router.push(getLocalizedHref(routesName.quizzes.href))
        }
        translations={quizzesDict.detail.results}
      />
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

  const questionsCountText = quizzesDict.detail.questionsCount.replace(
    "{count}",
    String(quiz.questions.length),
  );

  return (
    <div className="container mx-auto space-y-6 px-4 py-8">
      <QuizProgressBar
        currentIndex={currentQuestionIndex}
        totalQuestions={quiz.questions.length}
        showCount={true}
        questionsCountText={questionsCountText}
      />

      <Card>
        <QuizQuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          questionLabel={quizzesDict.detail.question}
          descriptionLabel={quizzesDict.detail.description}
          timeSpentSeconds={currentTimeSpent}
        />
        <CardContent>
          {showFeedback && (
            <QuizFeedbackMessage
              isCorrect={isCorrect}
              correctText={quizzesDict.detail.correct}
              incorrectText={quizzesDict.detail.incorrect}
            />
          )}

          <QuizAnswerOptions
            question={currentQuestion}
            selectedAnswerIndex={selectedAnswers[currentQuestion.id]}
            showFeedback={showFeedback}
            onAnswerChange={(answerIndex: number) =>
              handleAnswerChange(currentQuestion.id, answerIndex)
            }
          />
        </CardContent>
      </Card>

      <QuizNavigationButtons
        isFirstQuestion={isFirstQuestion}
        isLastQuestion={isLastQuestion}
        isCurrentQuestionAnswered={isCurrentQuestionAnswered}
        allQuestionsAnswered={allQuestionsAnswered}
        isSubmitting={isSubmitting}
        showFeedback={showFeedback}
        previousText={quizzesDict.detail.previous}
        nextText={quizzesDict.detail.next}
        submitQuizText={quizzesDict.detail.submitQuiz}
        submittingText={quizzesDict.detail.submitting}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
