"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Layers3, Sparkles, FileQuestion, Route } from "lucide-react";

import ApiError from "@/components/custom/api-error";
import { EntityCover } from "@/components/custom/entity-cover";
import { Loading } from "@/components/custom/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useLessons } from "@/services/lesson.services/lesson.query";
import { useSubjects } from "@/services/subject.services/subject.query";
import { useUnits } from "@/services/unit.services/unit.query";
import { routesName, TRouteName } from "@/utils/constant";

function LessonsPageContent() {
  const getLocalizedHref = useLocalizedHref();
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId");

  const {
    data: lessonsData,
    isLoading: isLessonsLoading,
    error: lessonsError,
    refetch: refetchLessons,
  } = useLessons({ page: 1, PerPage: 200 });
  const { data: unitsData, isLoading: isUnitsLoading } = useUnits({
    page: 1,
    PerPage: 500,
  });
  const { data: subjectsData } = useSubjects({ page: 1, PerPage: 200 });

  const lessons = lessonsData?.items || [];
  const units = unitsData?.items || [];
  const subjects = subjectsData?.items || [];
  const isLoading = isLessonsLoading || isUnitsLoading;

  const unitMap = new Map(units.map((unit) => [unit.id, unit]));
  const subjectMap = new Map(subjects.map((subject) => [subject.id, subject.name]));
  const selectedSubjectName = subjectId ? subjectMap.get(subjectId) : undefined;

  const filteredLessons = subjectId
    ? lessons.filter((lesson) => unitMap.get(lesson.unitId)?.subjectId === subjectId)
    : lessons;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="container relative z-10 mx-auto space-y-6 py-6 md:py-8">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
        >
          <div className="space-y-3">
            <div className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
              <Sparkles className="size-3.5" />
              الدروس
            </div>
            <div className="space-y-2">
              <h1 className="max-w-2xl text-2xl font-black tracking-tight md:text-4xl">
                {selectedSubjectName
                  ? `دروس ${selectedSubjectName}`
                  : "دروس Quizy بطريقة واضحة"}
              </h1>
              <p className="text-muted-foreground max-w-xl text-sm md:text-base">
                الدروس مربوطة بنفس API التطبيق، ومعروضة بكروت صور ثابتة النسبة ومتجاوبة مع كل الشاشات.
              </p>
            </div>
          </div>

          <Card className="p-2">
            <CardContent className="grid gap-3 p-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/45 p-3">
                <BookOpen className="text-primary mb-2 size-5" />
                <p className="text-xl font-black">{filteredLessons.length}</p>
                <p className="text-muted-foreground text-xs">درس متاح</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/45 p-3">
                <Layers3 className="text-primary mb-2 size-5" />
                <p className="text-xl font-black">{units.length}</p>
                <p className="text-muted-foreground text-xs">وحدة مرتبطة</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/45 p-3">
                <Route className="text-primary mb-2 size-5" />
                <p className="text-xl font-black">API</p>
                <p className="text-muted-foreground text-xs">بيانات مباشرة</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {lessonsError && (
          <ApiError
            errorMessage="تعذر تحميل الدروس. حاول مرة ثانية."
            refetchFunction={() => refetchLessons()}
          />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loading size="lg" spinnerOnly />
          </div>
        )}

        {!isLoading && !lessonsError && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLessons.map((lesson, index) => {
              const unit = unitMap.get(lesson.unitId);
              const subjectName = unit?.subjectId
                ? subjectMap.get(unit.subjectId)
                : undefined;
              const quizzesHref = unit?.subjectId
                ? `${routesName.quizzes.href}?subjectId=${unit.subjectId}&isLesson=true`
                : `${routesName.quizzes.href}?isLesson=true`;

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.025 }}
                  className="h-full"
                >
                  <Card className="group h-full justify-between p-2.5">
                    <EntityCover
                      entity={lesson}
                      title={lesson.name}
                      label="درس Quizy"
                      className="mb-2.5 aspect-[2/1] rounded-2xl"
                    />
                    <CardHeader className="px-1.5 pb-1 pt-2">
                      <CardTitle className="line-clamp-2 text-lg">
                        {lesson.name}
                      </CardTitle>
                      {lesson.description && (
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {lesson.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2.5 px-1.5 pb-1.5">
                      <div className="space-y-2">
                        {unit?.name && (
                          <div className="text-muted-foreground flex items-center gap-1.5 rounded-xl bg-muted/60 px-2.5 py-2 text-xs">
                            <Layers3 className="size-3.5" />
                            {unit.name}
                          </div>
                        )}
                        {subjectName && (
                          <div className="text-muted-foreground flex items-center gap-1.5 rounded-xl bg-muted/60 px-2.5 py-2 text-xs">
                            <BookOpen className="size-3.5" />
                            {subjectName}
                          </div>
                        )}
                      </div>
                      <Button className="w-full" asChild>
                        <Link href={getLocalizedHref(quizzesHref as TRouteName)}>
                          <FileQuestion className="size-4" />
                          اختبارات الدروس
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </section>
        )}

        {!isLoading && !lessonsError && filteredLessons.length === 0 && (
          <Card className="flex min-h-[220px] items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">لا يوجد دروس متاحة حاليًا.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function LessonsSection() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex items-center justify-center px-4 py-16">
          <Loading size="lg" spinnerOnly />
        </div>
      }
    >
      <LessonsPageContent />
    </Suspense>
  );
}
