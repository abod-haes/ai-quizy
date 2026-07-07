"use client";

import React, { useCallback, Suspense } from "react";
import { useQuizzes } from "@/services/quizes.services/quizes.query";
import { useTeachersBrief } from "@/services/teacher.services/teacher.query";
import { useSubjectsBrief } from "@/services/subject.services/subject.query";
import { useSearchParamsState } from "@/hooks/useSearchParams";
import { QuizCard } from "@/components/quiz/quiz-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter, FileQuestion, Sparkles } from "lucide-react";
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
    <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden bg-background">
      <div className="container relative z-10 mx-auto flex h-full flex-1 flex-col gap-5 py-6 md:py-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2.5">
              <div className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
                <Sparkles className="size-3.5" />
                اختبارات Quizy
              </div>
              <div className="space-y-1.5">
                <h1 className="max-w-2xl text-2xl font-black tracking-tight md:text-4xl">
                  {quizzesDict.title}
                </h1>
                <p className="text-muted-foreground max-w-xl text-sm md:text-base">
                  اختر المادة أو الأستاذ وابدأ الاختبار بنفس أسلوب التطبيق: صورة واضحة، أستاذ الاختبار، عدد الأسئلة، وزر مباشر.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 shadow-sm">
              <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
                <FileQuestion className="size-4" />
              </div>
              <div>
                <p className="text-xl font-black">{data?.totalCount ?? 0}</p>
                <p className="text-muted-foreground text-[11px]">اختبار متاح</p>
              </div>
            </div>
          </div>

          <Card className="p-3">
            <div className="mb-3 flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
                <Filter className="size-4" />
              </div>
              <h2 className="text-base font-bold">{quizzesDict.filters.title}</h2>
            </div>

            <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
              <div className="space-y-1.5">
                <label className="text-xs font-bold">
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
                  triggerClassName="w-full rounded-xl min-h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold">
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
                  triggerClassName="w-full rounded-xl min-h-10 text-sm"
                />
              </div>

              <div className="flex gap-2 md:min-w-[190px]">
                <Button className="flex-1" onClick={handleFilterChange}>
                  تطبيق
                </Button>
                <Button variant="outline" className="flex-1" onClick={clearFilters}>
                  مسح
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
          <div className="flex items-center justify-center py-16">
            <Loading size="lg" spinnerOnly />
          </div>
        )}

        {!isLoading && !error && (
          <>
            {quizzes.length === 0 ? (
              <Card className="flex min-h-[220px] flex-1 flex-col justify-center p-8 text-center">
                <p className="text-muted-foreground text-base">
                  {quizzesDict.results.noQuizzesFound}
                </p>
              </Card>
            ) : (
              <div className="flex flex-1 flex-col justify-between gap-6">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
        <div className="container mx-auto flex items-center justify-center px-4 py-16">
          <Loading size="lg" spinnerOnly />
        </div>
      }
    >
      <QuizzesPageContent />
    </Suspense>
  );
}
