"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  FileQuestion,
  Timer,
  User,
} from "lucide-react";

import { EntityCover } from "@/components/custom/entity-cover";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { cn } from "@/lib/utils";
import { Quiz } from "@/services/quizes.services/quiz.type";
import { useAuthStore } from "@/store/auth.store";
import { TRouteName, routesName } from "@/utils/constant";
import { useTranslation } from "@/providers/TranslationsProvider";

interface QuizCardProps {
  quiz: Quiz;
  teacher?: object | null;
  subject?: object | null;
}

function getTextValue(entity: object | null | undefined, keys: string[]) {
  if (!entity) return undefined;
  const record = entity as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function getSubjectName(quiz: Quiz, subject?: object | null) {
  return (
    getTextValue(subject, ["name"]) ||
    getTextValue(quiz, ["subjectName", "subject", "entityName", "courseName"]) ||
    quiz.linkedQuiz?.find((item) => item.name)?.name ||
    "مادة Quizy"
  );
}

export function QuizCard({ quiz, teacher, subject }: QuizCardProps) {
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const { quizzes: quizzesDict } = useTranslation();
  const isAuth = useAuthStore((state) => state.isAuth());
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const subjectName = getSubjectName(quiz, subject);

  const handleStartQuiz = (e: React.MouseEvent) => {
    if (!isAuth && !quiz.isSolved) {
      e.preventDefault();
      setShowLoginDialog(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="h-full"
    >
      <Card className="group h-full min-h-[270px] justify-between p-2.5">
        <div className="relative">
          <EntityCover
            entity={subject || quiz}
            title={subjectName}
            label="مادة Quizy"
            className="aspect-[2/1] rounded-2xl"
          />
          <div
            className={cn(
              "absolute start-2 top-2 flex h-7 items-center gap-1.5 rounded-full border bg-card/90 px-2 text-[11px] font-bold shadow-sm backdrop-blur",
              quiz.isSolved ? "text-success" : "text-muted-foreground",
            )}
          >
            {quiz.isSolved ? (
              <CheckCircle2 className="size-3.5" />
            ) : (
              <Circle className="size-3.5" />
            )}
            {quiz.isSolved ? "منتهي" : "جاهز"}
          </div>
        </div>

        <CardHeader className="px-1.5 pb-1 pt-2.5">
          <div className="flex items-start gap-2.5">
            <EntityCover
              entity={teacher || quiz}
              title={quiz.teacherName || "أستاذ Quizy"}
              label=""
              className="aspect-square size-10 shrink-0 rounded-xl"
            />
            <div className="min-w-0 space-y-1">
              <CardTitle className="line-clamp-1 text-base font-black">
                {quizzesDict.card.quiz}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 text-xs">
                <User className="size-3.5" />
                <span className="truncate">{quiz.teacherName}</span>
              </CardDescription>
              <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <BookOpen className="size-3.5" />
                <span className="truncate">{subjectName}</span>
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-2.5 px-1.5">
          <div className="rounded-xl border border-border bg-muted/45 p-2.5 text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
              <FileQuestion className="size-3.5" />
              الأسئلة
            </span>
            <span className="mt-0.5 block text-sm font-black">
              {quiz.questionsCount || 0}
            </span>
          </div>

          {quiz.isSolved ? (
            <div className="rounded-xl border border-border bg-background p-2.5">
              <div className="mb-2 flex items-center justify-between text-xs">
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
              <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
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
            <div className="text-muted-foreground flex items-center gap-1.5 rounded-xl bg-muted/60 px-2.5 py-2 text-xs">
              <Timer className="size-3.5" />
              ركّز، جاوب، وبعدين راجع نتيجتك
            </div>
          )}

          {quiz.timeSpentSeconds > 0 && (
            <div className="text-muted-foreground flex items-center gap-1.5 rounded-xl bg-muted/60 px-2.5 py-2 text-xs">
              <Timer className="size-3.5" />
              <span>
                {quizzesDict.card.timeSpent}: {quiz.timeSpentFormatted}
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="px-1.5 pb-1.5">
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
            <Button onClick={() => router.push(getLocalizedHref(routesName.signin.href))}>
              {quizzesDict.card.loginRequired.goToLogin}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
