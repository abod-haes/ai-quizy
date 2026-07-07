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
import {
  User,
  CheckCircle2,
  Circle,
  Timer,
  FileQuestion,
  Clock3,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { motion } from "framer-motion";
import { TRouteName, routesName } from "@/utils/constant";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useAuthStore } from "@/store/auth.store";

interface QuizCardProps {
  quiz: Quiz;
}

function formatDuration(timeExpiration: number) {
  if (!timeExpiration || timeExpiration <= 0) return "بدون مدة";
  return `${timeExpiration} دقيقة`;
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="h-full"
    >
      <Card className="group h-full min-h-[250px] justify-between p-0">
        <CardHeader className="px-5 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-[1.15rem]">
                <FileQuestion className="size-5" />
              </div>
              <div className="min-w-0 space-y-1.5">
                <CardTitle className="line-clamp-2 text-lg font-black">
                  {quizzesDict.card.quiz}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <User className="size-4" />
                  <span className="truncate">{quiz.teacherName}</span>
                </CardDescription>
              </div>
            </div>

            <div
              className={cn(
                "flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-bold",
                quiz.isSolved
                  ? "border-success/20 bg-success/10 text-success"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              {quiz.isSolved ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Circle className="size-4" />
              )}
              {quiz.isSolved ? "منتهي" : "جاهز"}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-5">
          <div className="grid grid-cols-2 gap-2.5 text-sm">
            <div className="rounded-[1.1rem] border border-border bg-muted/45 p-3">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <FileQuestion className="size-3.5" />
                الأسئلة
              </span>
              <span className="mt-1 block font-black">
                {quiz.questionsCount || 0}
              </span>
            </div>

            <div className="rounded-[1.1rem] border border-border bg-muted/45 p-3">
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <Clock3 className="size-3.5" />
                المدة الزمنية
              </span>
              <span className="mt-1 block font-black">
                {formatDuration(quiz.timeExpiration)}
              </span>
            </div>
          </div>

          {quiz.isSolved ? (
            <div className="rounded-[1.1rem] border border-border bg-background p-3">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {quizzesDict.card.percentage}
                </span>
                <span
                  className={cn(
                    "font-black",
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
          ) : (
            <div className="text-muted-foreground flex items-center gap-2 rounded-[1.1rem] bg-muted/60 px-3 py-2 text-sm">
              <Timer className="size-4" />
              ركّز، جاوب، وبعدين راجع نتيجتك
            </div>
          )}

          {quiz.timeSpentSeconds > 0 && (
            <div className="text-muted-foreground flex items-center gap-2 rounded-[1.1rem] bg-muted/60 px-3 py-2 text-sm">
              <Timer className="size-4" />
              <span>
                {quizzesDict.card.timeSpent}: {quiz.timeSpentFormatted}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-5 pb-5">
          {quiz.isSolved ? (
            <Link
              href={getLocalizedHref(
                routesName.quizResults(quiz.id) as TRouteName,
              )}
              className="w-full"
            >
              <Button variant="outline" className="w-full">
                {quizzesDict.card.viewResults}
                <ArrowLeft className="size-4" />
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
                  <ArrowLeft className="size-4" />
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
