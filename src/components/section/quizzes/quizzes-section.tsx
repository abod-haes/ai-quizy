"use client";

import React, { useCallback, Suspense } from "react";
import { useQuizzes } from "@/hooks/api/quizes.query";
import { useTeacherBriefs } from "@/hooks/api/teachers.query";
import { useSubjectBriefs } from "@/hooks/api/subjects.query";
import { useSearchParamsState } from "@/hooks/useSearchParams";
import { QuizCard } from "@/components/quiz/quiz-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Filter } from "lucide-react";
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
    setParam,
    setParams,
    clearParams,
    searchParams,
  } = useSearchParamsState();

  const page = getParamAsNumber("page", 1);
  const perPage = PER_PAGE;
  const subjectId = getParam("subjectId") ?? "";
  const teacherId = getParam("teacherId") ?? "";

  // Force re-render when search params change
  const searchParamsKey = searchParams.toString();
  const userId = useAuthStore((state) => state.user?.id);
  // Fetch all data using hooks
  const { data: teacherBriefs } = useTeacherBriefs();
  const { data: subjectBriefs } = useSubjectBriefs();
  const { quizzes: quizzesDict } = useTranslation();

  const { data, isLoading, error, refetch } = useQuizzes(
    {
      Page: page,
      PerPage: perPage,
      SubjectId: subjectId || undefined,
      TeacherId: teacherId || undefined,
      studentId: userId || undefined,
    },
    {
      refetchOnMount: "always", // Refetch every time the component mounts (page visit)
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setParams({
        page: newPage,
        subjectId: subjectId || undefined,
        teacherId: teacherId || undefined,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setParams, subjectId, teacherId],
  );

  const handleFilterChange = useCallback(() => {
    setParams({
      page: 1,
      subjectId: subjectId || undefined,
      teacherId: teacherId || undefined,
    });
  }, [subjectId, teacherId, setParams]);

  const clearFilters = useCallback(() => {
    clearParams();
  }, [clearParams]);

  const totalPages = data ? Math.ceil(data.totalCount / perPage) : 1;
  const quizzes = data?.items || [];
  return (
    <div className="container mx-auto flex h-full flex-1 flex-col justify-between gap-4 py-8">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">{quizzesDict.title}</h1>
          <p className="text-muted-foreground">{quizzesDict.description}</p>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
              <Filter className="size-5" />
              <h2 className="text-lg font-semibold">
                {quizzesDict.filters.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">
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
                  triggerClassName="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
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
                  triggerClassName="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleFilterChange}>
                  {quizzesDict.filters.applyFilter}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  {quizzesDict.filters.clearFilters}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <ApiError
          errorMessage={quizzesDict.results.loadingError}
          refetchFunction={() => refetch()}
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loading size="lg" spinnerOnly />
        </div>
      )}

      {/* Quizzes Grid */}
      {!isLoading && !error && (
        <>
          {quizzes.length === 0 ? (
            <Card className="flex h-full flex-1 flex-col justify-center p-12 text-center">
              <p className="text-muted-foreground text-lg">
                {quizzesDict.results.noQuizzesFound}
              </p>
            </Card>
          ) : (
            <div className="flex h-full flex-1 flex-col justify-between">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {quizzes.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>

              {/* Pagination */}
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
