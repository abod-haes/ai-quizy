"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpenCheck, GraduationCap, Layers3, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/custom/loading";
import ApiError from "@/components/custom/api-error";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useSubjectsBrief } from "@/services/subject.services/subject.query";
import { useTeachersBrief } from "@/services/teacher.services/teacher.query";
import { routesName, TRouteName } from "@/utils/constant";

const steps = [
  "اختار الكورس المناسب",
  "ادخل على اختبارات المادة",
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
    <div className="from-primary/8 via-background to-background relative min-h-screen overflow-hidden bg-gradient-to-b">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_75%_-5%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent_65%)]" />

      <div className="container relative z-10 mx-auto space-y-8 py-8 md:py-12">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold">
              <Sparkles className="size-4" />
              كورسات Quizy
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
                ادرس مع أستاذك، وتمرّن على Quizy
              </h1>
              <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                صفحة الكورسات بتجمع المواد المتاحة وتفتحلك اختبارات كل مادة بنفس تجربة التطبيق: واضحة، سريعة، ومركّزة على المراجعة بعد الدرس.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
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

          <Card className="bg-background/85 p-2 backdrop-blur-xl">
            <CardContent className="space-y-4 p-5">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-3xl border border-primary/10 bg-primary/5 p-4"
                >
                  <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-2xl font-black">
                    {index + 1}
                  </div>
                  <p className="font-bold">{step}</p>
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
          <div className="flex items-center justify-center py-20">
            <Loading size="lg" spinnerOnly />
          </div>
        )}

        {!isLoading && !subjectsError && (
          <section className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">المواد والكورسات</h2>
                <p className="text-muted-foreground">
                  اختر مادة لتشوف الاختبارات المرتبطة فيها.
                </p>
              </div>
              <div className="text-muted-foreground hidden items-center gap-2 text-sm md:flex">
                <GraduationCap className="size-4" />
                {teachers?.length || 0} أستاذ متاح
              </div>
            </div>

            {subjects?.length ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {subjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="h-full"
                  >
                    <Card className="h-full justify-between bg-gradient-to-b from-card to-primary/3">
                      <CardHeader>
                        <div className="bg-primary/10 text-primary mb-4 flex size-14 items-center justify-center rounded-3xl">
                          <BookOpenCheck className="size-7" />
                        </div>
                        <CardTitle className="text-xl">{subject.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-muted-foreground flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2 text-sm">
                          <Layers3 className="size-4" />
                          اختبارات ومراجعات حسب المادة
                        </div>
                        <Button className="w-full" asChild>
                          <Link
                            href={getLocalizedHref(
                              `${routesName.quizzes.href}?subjectId=${subject.id}` as TRouteName,
                            )}
                          >
                            عرض اختبارات المادة
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="flex min-h-[240px] items-center justify-center p-10 text-center">
                <p className="text-muted-foreground">لا يوجد كورسات متاحة حاليًا.</p>
              </Card>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
