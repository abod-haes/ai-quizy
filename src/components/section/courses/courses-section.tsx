"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Layers3, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/custom/loading";
import ApiError from "@/components/custom/api-error";
import { EntityCover } from "@/components/custom/entity-cover";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useSubjectsBrief } from "@/services/subject.services/subject.query";
import { useTeachersBrief } from "@/services/teacher.services/teacher.query";
import { routesName, TRouteName } from "@/utils/constant";

const steps = [
  "اختار الكورس المناسب",
  "ادخل على دروس واختبارات المادة",
  "راجع أخطاءك وحسّن نتيجتك",
];

export default function CoursesSection() {
  const getLocalizedHref = useLocalizedHref();
  const {
    data: subjects,
    isLoading: subjectsLoading,
    error: subjectsError,
    refetch: refetchSubjects,
  } = useSubjectsBrief();
  const { data: teachers, isLoading: teachersLoading } = useTeachersBrief();

  const isLoading = subjectsLoading || teachersLoading;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="container relative z-10 mx-auto space-y-6 py-6 md:py-8">
        <section className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-3">
            <div className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
              <Sparkles className="size-3.5" />
              كورسات Quizy
            </div>
            <div className="space-y-2">
              <h1 className="max-w-2xl text-2xl font-black tracking-tight md:text-4xl">
                ادرس مع أستاذك، وتمرّن على Quizy
              </h1>
              <p className="text-muted-foreground max-w-xl text-sm md:text-base">
                صفحة الكورسات بتجمع المواد المتاحة وتفتحلك دروس واختبارات كل مادة بنفس تجربة التطبيق: واضحة، سريعة، ومركّزة على المراجعة بعد الدرس.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href={getLocalizedHref(routesName.quizzes.href)}>
                  ابدأ الاختبارات
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={getLocalizedHref(routesName.download.href)}>
                  حمّل التطبيق
                </Link>
              </Button>
            </div>
          </div>

          <Card className="p-2">
            <CardContent className="space-y-3 p-3">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-2.5 rounded-2xl border border-border bg-muted/45 p-3"
                >
                  <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-black">
                    {index + 1}
                  </div>
                  <p className="text-sm font-bold">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {subjectsError && (
          <ApiError
            errorMessage="تعذر تحميل الكورسات. حاول مرة ثانية."
            refetchFunction={() => refetchSubjects()}
          />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loading size="lg" spinnerOnly />
          </div>
        )}

        {!isLoading && !subjectsError && (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-black md:text-2xl">المواد والكورسات</h2>
                <p className="text-muted-foreground text-sm">
                  اختر مادة لتشوف الدروس والاختبارات المرتبطة فيها.
                </p>
              </div>
              <div className="text-muted-foreground hidden items-center gap-1.5 text-xs md:flex">
                <GraduationCap className="size-3.5" />
                {teachers?.length || 0} أستاذ متاح
              </div>
            </div>

            {subjects?.length ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.025 }}
                    className="h-full"
                  >
                    <Card className="group h-full justify-between p-2.5">
                      <EntityCover
                        entity={subject}
                        title={subject.name}
                        label="كورس Quizy"
                        className="mb-2.5 aspect-[2/1] rounded-2xl"
                      />
                      <CardHeader className="px-1.5 pb-1 pt-2">
                        <CardTitle className="line-clamp-2 text-lg">
                          {subject.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2.5 px-1.5 pb-1.5">
                        <div className="text-muted-foreground flex items-center gap-1.5 rounded-xl bg-muted/60 px-2.5 py-2 text-xs">
                          <Layers3 className="size-3.5" />
                          دروس واختبارات حسب المادة
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <Button className="w-full" asChild>
                            <Link
                              href={getLocalizedHref(
                                `${routesName.quizzes.href}?subjectId=${subject.id}` as TRouteName,
                              )}
                            >
                              الاختبارات
                            </Link>
                          </Button>
                          <Button className="w-full" variant="outline" asChild>
                            <Link
                              href={getLocalizedHref(
                                `${routesName.lessons.href}?subjectId=${subject.id}` as TRouteName,
                              )}
                            >
                              الدروس
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="flex min-h-[220px] items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">لا يوجد كورسات متاحة حاليًا.</p>
              </Card>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
