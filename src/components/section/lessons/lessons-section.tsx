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
    <div className="from-primary/10 via-background to-background relative min-h-screen overflow-hidden bg-gradient-to-b">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_74%_-5%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_65%)]" />

      <div className="container relative z-10 mx-auto space-y-8 py-8 md:py-12">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
        >
          <div className="space-y-5">
            <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold">
              <Sparkles className="size-4" />
              الدروس
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
                {selectedSubjectName
                  ? `دروس ${selectedSubjectName}`
                  : "دروس Quizy بطريقة واضحة"}
              </h1>
              <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                الدروس مربوطة بنفس API التطبيق، ومعروضة بكروت صور ثابتة النسبة ومتجاوبة مع كل الشاشات.
              </p>
            </div>
          </div>

          <Card className="bg-background/85 p-2 backdrop-blur-xl">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
              <div className="rounded-3xl border border-primary/10 bg-primary/5 p-4">
                <BookOpen className="text-primary mb-3 size-6" />
                <p className="text-2xl font-black">{filteredLessons.length}</p>
                <p className="text-muted-foreground text-sm">درس متاح</p>
              </div>
              <div className="rounded-3xl border border-primary/10 bg-primary/5 p-4">
                <Layers3 className="text-primary mb-3 size-6" />
                <p className="text-2xl font-black">{units.length}</p>
                <p className="text-muted-foreground text-sm">وحدة مرتبطة</p>
              </div>
              <div className="rounded-3xl border border-primary/10 bg-primary/5 p-4">
                <Route className="text-primary mb-3 size-6" />
                <p className="text-2xl font-black">API</p>
                <p className="text-muted-foreground text-sm">بيانات مباشرة</p>
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
          <div className="flex items-center justify-center py-20">
            <Loading size="lg" spinnerOnly />
          </div>
        )}

        {!isLoading && !lessonsError && (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.035 }}
                  className="h-full"
                >
                  <Card className="group h-full justify-between bg-gradient-to-b from-card to-primary/5 p-3">
                    <EntityCover
                      entity={lesson}
                      title={lesson.name}
                      label="درس Quizy"
                      className="mb-3"
                    />
                    <CardHeader className="px-2 pb-2 pt-3">
                      <CardTitle className="line-clamp-2 text-xl">
                        {lesson.name}
                      </CardTitle>
                      {lesson.description && (
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {lesson.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3 px-2 pb-2">
                      <div className="space-y-2">
                        {unit?.name && (
                          <div className="text-muted-foreground flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2 text-sm">
                            <Layers3 className="size-4" />
                            {unit.name}
                          </div>
                        )}
                        {subjectName && (
                          <div className="text-muted-foreground flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2 text-sm">
                            <BookOpen className="size-4" />
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
          <Card className="flex min-h-[240px] items-center justify-center p-10 text-center">
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
        <div className="container mx-auto flex items-center justify-center px-4 py-20">
          <Loading size="lg" spinnerOnly />
        </div>
      }
    >
      <LessonsPageContent />
    </Suspense>
  );
}
