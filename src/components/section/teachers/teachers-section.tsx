"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, UserRoundCheck, Sparkles, FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/custom/loading";
import ApiError from "@/components/custom/api-error";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useTeachers } from "@/services/teacher.services/teacher.query";
import { routesName, TRouteName } from "@/utils/constant";

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}` || "أ";
}

function getTeacherName(teacher: { firstName?: string; lastName?: string }) {
  return `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() || "أستاذ Quizy";
}

export default function TeachersSection() {
  const getLocalizedHref = useLocalizedHref();
  const { data, isLoading, error, refetch } = useTeachers({
    page: 1,
    PerPage: 100,
  });
  const teachers = data?.items || [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
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
              الأساتذة
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
                أساتذتك موجودين معك على Quizy
              </h1>
              <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                نفس بيانات التطبيق من API الأساتذة. اختار الأستاذ وشوف الاختبارات المرتبطة فيه مباشرة.
              </p>
            </div>
          </div>

          <Card className="p-2">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-muted/45 p-4">
                <GraduationCap className="text-primary mb-3 size-6" />
                <p className="text-2xl font-black">{teachers.length}</p>
                <p className="text-muted-foreground text-sm">أستاذ متاح</p>
              </div>
              <div className="rounded-3xl border border-border bg-muted/45 p-4">
                <FileQuestion className="text-primary mb-3 size-6" />
                <p className="text-2xl font-black">Quizy</p>
                <p className="text-muted-foreground text-sm">اختبارات مرتبطة</p>
              </div>
              <div className="rounded-3xl border border-border bg-muted/45 p-4">
                <UserRoundCheck className="text-primary mb-3 size-6" />
                <p className="text-2xl font-black">API</p>
                <p className="text-muted-foreground text-sm">بيانات مباشرة</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {error && (
          <ApiError
            errorMessage="تعذر تحميل الأساتذة. حاول مرة ثانية."
            refetchFunction={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loading size="lg" spinnerOnly />
          </div>
        )}

        {!isLoading && !error && (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.035 }}
                className="h-full"
              >
                <Card className="h-full justify-between">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="bg-primary text-primary-foreground flex size-16 shrink-0 items-center justify-center rounded-3xl text-xl font-black shadow-sm">
                        {getInitials(teacher.firstName, teacher.lastName)}
                      </div>
                      <div className="min-w-0 space-y-2">
                        <CardTitle className="text-xl">
                          {getTeacherName(teacher)}
                        </CardTitle>
                        <p className="text-muted-foreground flex items-center gap-2 text-sm">
                          <UserRoundCheck className="size-4" />
                          أستاذ في Quizy
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {teacher.description && (
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {teacher.description}
                      </p>
                    )}
                    {typeof teacher.numberOfQuizzes === "number" && (
                      <div className="text-muted-foreground flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2 text-sm">
                        <FileQuestion className="size-4" />
                        {teacher.numberOfQuizzes} اختبار
                      </div>
                    )}
                    <Button className="w-full" asChild>
                      <Link
                        href={getLocalizedHref(
                          `${routesName.quizzes.href}?teacherId=${teacher.id}` as TRouteName,
                        )}
                      >
                        عرض اختبارات الأستاذ
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </section>
        )}

        {!isLoading && !error && teachers.length === 0 && (
          <Card className="flex min-h-[240px] items-center justify-center p-10 text-center">
            <p className="text-muted-foreground">لا يوجد أساتذة متاحين حاليًا.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
