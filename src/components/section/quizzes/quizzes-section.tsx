"use client";

import React, { useCallback, Suspense } from "react";
import { useQuizzes } from "@/services/quizes.services/quizes.query";
import { useTeachersBrief } from "@/services/teacher.services/teacher.query";
import { useSubjectsBrief } from "@/services/subject.services/subject.query";
import { useSearchParamsState } from "@/hooks/useSearchParams";
import { QuizCard } from "@/components/quiz/quiz-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter, Sparkles } from "lucide-react";
import { Loading } from "@/components/custom/loading";
import ApiError from "@/components/custom/api-error";
import { SelectWithOptions } from "@/components/ui/select";
import { useTranslation } from "@/providers/TranslationsProvider";
import { PaginationComponent } from "@/components/ui/pagination";
import { PER_PAGE } from "@/utils/constant";
import { useAuthStore } from "@/store/auth.store";

function QuizzesPageContent() {
  const {
    getParam,
    getParamAsNumber,
    getParamAsBoolean,
    setParam,
    setParams,
    clearParams,
    searchParams,
  } = useSearchParamsState();

  const page = getParamAsNumber("page", 1);
  const perPage = PER_PAGE;
  const subjectId = getParam("subjectId") ?? "";
  const teacherId = getParam("teacherId") ?? "";
  const isLesson = getParamAsBoolean("isLesson") ?? false;

  const searchParamsKey = searchParams.toString();
  const userId = useAuthStore((state) => state.user?.id);
  const { data: teacherBriefs } = useTeachersBrief();
  const { data: subjectBriefs } = useSubjectsBrief();
  const { quizzes: quizzesDict } = useTranslation();

  const { data, isLoading, error, refetch } = useQuizzes(
    {
      Page: page,
      PerPage: perPage,
      SubjectId: subjectId || undefined,
      TeacherId: teacherId || undefined,
      IsLesson: isLesson || undefined,
      studentId: userId || undefined,
    },
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
    },
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setParams({
        page: newPage,
        subjectId: subjectId || undefined,
        teacherId: teacherId || undefined,
        isLesson: isLesson || undefined,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setParams, subjectId, teacherId, isLesson],
  );

  const handleFilterChange = useCallback(() => {
    setParams({
      page: 1,
      subjectId: subjectId || undefined,
      teacherId: teacherId || undefined,
      isLesson: isLesson || undefined,
    });
  }, [subjectId, teacherId, isLesson, setParams]);

  const clearFilters = useCallback(() => {
    clearParams();
  }, [clearParams]);

  const totalPages = data ? Math.ceil(data.totalCount / perPage) : 1;
  const quizzes = data?.items || [];

  return (
    <div className="from-primary/8 via-background to-background relative flex min-h-screen flex-1 flex-col overflow-hidden bg-gradient-to-b">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_70%_0%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_65%)]" />

      <div className="container relative z-10 mx-auto flex h-full flex-1 flex-col gap-6 py-8 md:py-12">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold">
              <Sparkles className="size-4" />
              تعلم → اختبر → راجع → تحسّن
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
                {quizzesDict.title}
              </h1>
              <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                {quizzesDict.description}
              </p>
            </div>
          </div>

          <Card className="bg-background/85 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-2xl">
                <Filter className="size-5" />
              </div>
              <h2 className="text-lg font-bold">{quizzesDict.filters.title}</h2>
            </div>

            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold">
                  {quizzesDict.filters.subject}
                </label>
                <SelectWithOptions
                  key={`subject-${searchParamsKey}`}
                  value={subjectId ?? "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setParam("subjectId", null);
                    } else {
                      setParam("subjectId", value);
                    }
                  }}
                  options={
                    subjectBriefs?.map((subject) => ({
                      value: subject.id,
                      label: subject.name,
                    })) || []
                  }
                  placeholder={quizzesDict.filters.selectSubject}
                  showAllOption
                  allOptionLabel={quizzesDict.filters.all}
                  triggerClassName="w-full rounded-2xl min-h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">
                  {quizzesDict.filters.teacher}
                </label>
                <SelectWithOptions
                  key={`teacher-${searchParamsKey}`}
                  value={teacherId ?? "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      setParam("teacherId", null);
                    } else {
                      setParam("teacherId", value);
                    }
                  }}
                  options={
                    teacherBriefs?.map((teacher) => ({
                      value: teacher.id,
                      label: `${teacher.firstName} ${teacher.lastName}`,
                    })) || []
                  }
                  placeholder={quizzesDict.filters.selectTeacher}
                  showAllOption
                  allOptionLabel={quizzesDict.filters.all}
                  triggerClassName="w-full rounded-2xl min-h-11"
                />
              </div>

              <div className="flex gap-2 md:col-span-2">
                <Button className="flex-1" onClick={handleFilterChange}>
                  {quizzesDict.filters.applyFilter}
                </Button>
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  {quizzesDict.filters.clearFilters}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {error && (
          <ApiError
            errorMessage={quizzesDict.results.loadingError}
            refetchFunction={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loading size="lg" spinnerOnly />
          </div>
        )}

        {!isLoading && !error && (
          <>
            {quizzes.length === 0 ? (
              <Card className="flex min-h-[260px] flex-1 flex-col justify-center p-12 text-center">
                <p className="text-muted-foreground text-lg">
                  {quizzesDict.results.noQuizzesFound}
                </p>
              </Card>
            ) : (
              <div className="flex flex-1 flex-col justify-between gap-8">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {quizzes.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} />
                  ))}
                </div>

                <PaginationComponent
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function QuizzesSection() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex items-center justify-center px-4 py-20">
          <Loading size="lg" spinnerOnly />
        </div>
      }
    >
      <QuizzesPageContent />
    </Suspense>
  );
}
