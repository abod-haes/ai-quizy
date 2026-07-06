"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Quiz } from "@/services/quizes.services/quiz.type";
import { User, CheckCircle2, Circle, Timer, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { motion } from "framer-motion";
import { TRouteName, routesName } from "@/utils/constant";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useAuthStore } from "@/store/auth.store";

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const { quizzes: quizzesDict } = useTranslation();
  const isAuth = useAuthStore((state) => state.isAuth());
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleStartQuiz = (e: React.MouseEvent) => {
    if (!isAuth && !quiz.isSolved) {
      e.preventDefault();
      setShowLoginDialog(true);
    }
  };

  const handleGoToLogin = () => {
    const loginUrl = getLocalizedHref(routesName.signin.href);
    router.push(loginUrl);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group h-full min-h-[285px] justify-between bg-gradient-to-b from-card to-primary/5">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-2xl">
                <FileQuestion className="size-6" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-xl">
                  {quizzesDict.card.quiz}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <User className="size-4" />
                  <span>{quiz.teacherName}</span>
                </CardDescription>
              </div>
            </div>
            <div
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full border",
                quiz.isSolved
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-primary/15 bg-primary/10 text-muted-foreground",
              )}
            >
              {quiz.isSolved ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <Circle className="size-5" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {quiz.questionsCount && (
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3">
                <span className="text-muted-foreground block text-xs">
                  {quizzesDict.card.questionsCount}
                </span>
                <span className="font-bold">{quiz.questionsCount}</span>
              </div>
            )}
            <div className="rounded-2xl border border-primary/10 bg-background/70 p-3">
              <span className="text-muted-foreground block text-xs">
                {quiz.isSolved
                  ? quizzesDict.card.percentage
                  : quizzesDict.card.noTimeLimit}
              </span>
              <span
                className={cn(
                  "font-bold",
                  quiz.isSolved &&
                    (quiz.solvedPercentage >= 80
                      ? "text-success"
                      : quiz.solvedPercentage >= 50
                        ? "text-warning"
                        : "text-destructive"),
                )}
              >
                {quiz.isSolved
                  ? `${quiz.solvedPercentage}%`
                  : quizzesDict.card.startQuiz}
              </span>
            </div>
          </div>

          {quiz.timeSpentSeconds > 0 && (
            <div className="text-muted-foreground flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2 text-sm">
              <Timer className="size-4" />
              <span>
                {quizzesDict.card.timeSpent}: {quiz.timeSpentFormatted}
              </span>
            </div>
          )}

          {quiz.isSolved && (
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {quizzesDict.card.percentage}
                </span>
                <span className="font-bold">{quiz.solvedPercentage}%</span>
              </div>
              <div className="bg-muted h-2.5 w-full overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    quiz.solvedPercentage >= 80
                      ? "bg-success"
                      : quiz.solvedPercentage >= 50
                        ? "bg-warning"
                        : "bg-destructive",
                  )}
                  style={{ width: `${quiz.solvedPercentage}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {quiz.isSolved ? (
            <Link
              href={getLocalizedHref(
                routesName.quizResults(quiz.id) as TRouteName,
              )}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                {quizzesDict.card.viewResults}
              </Button>
            </Link>
          ) : (
            <Button
              variant="default"
              className="w-full"
              onClick={handleStartQuiz}
              asChild={isAuth}
            >
              {isAuth ? (
                <Link
                  href={getLocalizedHref(
                    routesName.quizzesDetails(quiz.id) as TRouteName,
                  )}
                >
                  {quizzesDict.card.startQuiz}
                </Link>
              ) : (
                <span>{quizzesDict.card.startQuiz}</span>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{quizzesDict.card.loginRequired.title}</DialogTitle>
            <DialogDescription>
              {quizzesDict.card.loginRequired.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoginDialog(false)}>
              {quizzesDict.card.loginRequired.cancel}
            </Button>
            <Button onClick={handleGoToLogin}>
              {quizzesDict.card.loginRequired.goToLogin}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
