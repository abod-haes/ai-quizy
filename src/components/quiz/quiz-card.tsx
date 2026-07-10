"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  FileQuestion,
  Lock,
  Timer,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

function getBooleanValue(entity: object, key: string) {
  const value = (entity as Record<string, unknown>)[key];
  return typeof value === "boolean" ? value : undefined;
}

function getQuizTitle(quiz: Quiz) {
  return getTextValue(quiz, ["title", "name", "quizName"]) || "اختبار";
}

function getSubjectName(quiz: Quiz, subject?: object | null) {
  return (
    getTextValue(subject, ["name"]) ||
    getTextValue(quiz, ["subjectName", "subject", "entityName", "courseName"]) ||
    quiz.linkedQuiz?.find((item) => item.name)?.name
  );
}

function normalizePercentage(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function QuizCard({ quiz, subject }: QuizCardProps) {
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const { quizzes: quizzesDict } = useTranslation();
  const isAuth = useAuthStore((state) => state.isAuth());
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showLockedDialog, setShowLockedDialog] = useState(false);

  const title = getQuizTitle(quiz);
  const subjectName = getSubjectName(quiz, subject);
  const isFree = getBooleanValue(quiz, "isFree");
  const isPurchased = getBooleanValue(quiz, "isPurchased");
  const hasAccessFlags = isFree !== undefined || isPurchased !== undefined;
  const isLocked = hasAccessFlags && !isFree && !isPurchased;
  const solvedPercent = normalizePercentage(quiz.solvedPercentage);

  const handleStartQuiz = (e: React.MouseEvent) => {
    if (!isAuth && !quiz.isSolved) {
      e.preventDefault();
      setShowLoginDialog(true);
      return;
    }

    if (isLocked) {
      e.preventDefault();
      setShowLockedDialog(true);
    }
  };

  const status = quiz.isSolved
    ? {
        label: "محلول",
        icon: Award,
        className: "border-success/20 bg-success/10 text-success",
      }
    : isLocked
      ? {
          label: "مغلق",
          icon: Lock,
          className: "border-destructive/20 bg-destructive/10 text-destructive",
        }
      : {
          label: "جاهز",
          icon: Brain,
          className: "border-primary/20 bg-primary/10 text-primary",
        };

  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="h-full"
    >
      <Card
        className={cn(
          "group h-full min-h-[190px] justify-between p-0",
          quiz.isSolved && "border-success/30",
          isLocked && "border-dashed border-muted-foreground/35 opacity-75",
        )}
      >
        <CardContent className="flex h-full flex-col justify-between gap-3 p-3.5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border",
                  status.className,
                )}
              >
                <StatusIcon className="size-4" />
              </div>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-bold",
                  status.className,
                )}
              >
                {status.label}
              </span>
            </div>

            {quiz.isSolved && (
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      solvedPercent >= 80
                        ? "bg-success"
                        : solvedPercent >= 50
                          ? "bg-warning"
                          : "bg-destructive",
                    )}
                    style={{ width: `${solvedPercent}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-black",
                    solvedPercent >= 80
                      ? "text-success"
                      : solvedPercent >= 50
                        ? "text-warning"
                        : "text-destructive",
                  )}
                >
                  {solvedPercent}%
                </span>
              </div>
            )}

            {subjectName && (
              <p className="text-muted-foreground flex items-center gap-1.5 text-[11px] font-semibold">
                <BookOpen className="size-3.5" />
                <span className="line-clamp-1">{subjectName}</span>
              </p>
            )}

            <div className="space-y-1.5">
              <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-black leading-5 text-foreground">
                {title}
              </h3>
              {quiz.teacherName && (
                <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-semibold">
                  <User className="size-3.5" />
                  <span className="line-clamp-1">{quiz.teacherName}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <FileQuestion className="size-3.5" />
              <span>{quiz.questionsCount || 0} سؤال</span>
            </div>

            {quiz.isSolved && quiz.timeSpentSeconds > 0 && (
              <div className="text-success flex items-center gap-1.5 text-xs font-semibold">
                <Timer className="size-3.5" />
                <span>{quiz.timeSpentFormatted}</span>
              </div>
            )}
          </div>

          {quiz.isSolved ? (
            <Link
              href={getLocalizedHref(
                routesName.quizResults(quiz.id) as TRouteName,
              )}
              className="w-full"
            >
              <Button variant="outline" size="sm" className="w-full">
                {quizzesDict.card.viewResults}
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
          ) : (
            <Button
              variant={isLocked ? "outline" : "default"}
              size="sm"
              className="w-full"
              onClick={handleStartQuiz}
              asChild={isAuth && !isLocked}
            >
              {isAuth && !isLocked ? (
                <Link
                  href={getLocalizedHref(
                    routesName.quizzesDetails(quiz.id) as TRouteName,
                  )}
                >
                  {quizzesDict.card.startQuiz}
                  <ArrowLeft className="size-4" />
                </Link>
              ) : (
                <span>{isLocked ? "تفعيل الاختبار" : quizzesDict.card.startQuiz}</span>
              )}
            </Button>
          )}
        </CardContent>
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

      <Dialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>الاختبار مغلق</DialogTitle>
            <DialogDescription>
              فعّل الاختبار من التطبيق باستخدام كود الكورس أو من أحد مراكز البيع.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLockedDialog(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
