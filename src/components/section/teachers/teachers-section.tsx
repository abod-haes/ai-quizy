"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, UserRoundCheck, Sparkles, FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/custom/loading";
import ApiError from "@/components/custom/api-error";
import { EntityCover } from "@/components/custom/entity-cover";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useTeachers } from "@/services/teacher.services/teacher.query";
import { routesName, TRouteName } from "@/utils/constant";

function getTeacherName(teacher: { firstName?: string; lastName?: string }) {
  return `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim() || "أستاذ Quizy";
}

export default function TeachersSection() {
  const getLocalizedHref = useLocalizedHref();
  const { data, isLoading, error, refetch } = useTeachers({ page: 1, PerPage: 100 });
  const teachers = data?.items || [];

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
              الأساتذة
            </div>
            <div className="space-y-2">
              <h1 className="max-w-2xl text-2xl font-black tracking-tight md:text-4xl">
                أساتذتك موجودين معك على Quizy
              </h1>
              <p className="text-muted-foreground max-w-xl text-sm md:text-base">
                نفس بيانات التطبيق من API الأساتذة. اختار الأستاذ وشوف الاختبارات المرتبطة فيه مباشرة.
              </p>
            </div>
          </div>

          <Card className="p-2">
            <CardContent className="grid gap-3 p-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/45 p-3">
                <GraduationCap className="text-primary mb-2 size-5" />
                <p className="text-xl font-black">{teachers.length}</p>
                <p className="text-muted-foreground text-xs">أستاذ متاح</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/45 p-3">
                <FileQuestion className="text-primary mb-2 size-5" />
                <p className="text-xl font-black">Quizy</p>
                <p className="text-muted-foreground text-xs">اختبارات مرتبطة</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/45 p-3">
                <UserRoundCheck className="text-primary mb-2 size-5" />
                <p className="text-xl font-black">API</p>
                <p className="text-muted-foreground text-xs">بيانات مباشرة</p>
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
          <div className="flex items-center justify-center py-16">
            <Loading size="lg" spinnerOnly />
          </div>
        )}

        {!isLoading && !error && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.025 }}
                className="h-full"
              >
                <Card className="group h-full justify-between p-2.5">
                  <EntityCover
                    entity={teacher}
                    title={getTeacherName(teacher)}
                    label="أستاذ Quizy"
                    className="mb-2.5 aspect-[2/1] rounded-2xl"
                  />
                  <CardHeader className="px-1.5 pb-1 pt-2">
                    <CardTitle className="line-clamp-1 text-lg">
                      {getTeacherName(teacher)}
                    </CardTitle>
                    <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <UserRoundCheck className="size-3.5" />
                      أستاذ في Quizy
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2.5 px-1.5 pb-1.5">
                    {typeof teacher.numberOfQuizzes === "number" && (
                      <div className="text-muted-foreground flex items-center gap-1.5 rounded-xl bg-muted/60 px-2.5 py-2 text-xs">
                        <FileQuestion className="size-3.5" />
                        {teacher.numberOfQuizzes} اختبار
                      </div>
                    )}
                    <Button className="w-full" asChild>
                      <Link href={getLocalizedHref(`${routesName.quizzes.href}?teacherId=${teacher.id}` as TRouteName)}>
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
          <Card className="flex min-h-[220px] items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">لا يوجد أساتذة متاحين حاليًا.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
