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
import { User, CheckCircle2, Circle, Timer } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group hover:shadow-primary/5 relative h-fit transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="mb-2 text-xl font-bold">
                {quizzesDict.card.quiz}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 text-sm">
                <User className="size-4" />
                <span>{quiz.teacherName}</span>
              </CardDescription>
            </div>
            {quiz.isSolved ? (
              <CheckCircle2 className="text-success size-6 flex-shrink-0" />
            ) : (
              <Circle className="text-muted-foreground size-6 flex-shrink-0" />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {quiz.timeSpentSeconds > 0 && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Timer className="size-4" />
              <span>
                {quizzesDict.card.timeSpent}: {quiz.timeSpentFormatted}
              </span>
            </div>
          )}

          {quiz.isSolved && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {quizzesDict.card.percentage}
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    quiz.solvedPercentage >= 80
                      ? "text-success"
                      : quiz.solvedPercentage >= 50
                        ? "text-warning"
                        : "text-destructive",
                  )}
                >
                  {quiz.solvedPercentage}%
                </span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
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

          {quiz.questionsCount && (
            <div className="text-muted-foreground border-t pt-2 text-sm">
              <span>
                {quizzesDict.card.questionsCount}: {quiz.questionsCount}
              </span>
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

      {/* Login Required Dialog */}
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
