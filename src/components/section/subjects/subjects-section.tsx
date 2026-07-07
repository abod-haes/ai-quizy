"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpenCheck, Layers3, SearchCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loading } from "@/components/custom/loading";
import ApiError from "@/components/custom/api-error";
import { EntityCover } from "@/components/custom/entity-cover";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useSubjects } from "@/services/subject.services/subject.query";
import { routesName, TRouteName } from "@/utils/constant";

export default function SubjectsSection() {
  const getLocalizedHref = useLocalizedHref();
  const { data, isLoading, error, refetch } = useSubjects({
    page: 1,
    PerPage: 100,
  });
  const subjects = data?.items || [];

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
              المواد
            </div>
            <div className="space-y-2">
              <h1 className="max-w-2xl text-2xl font-black tracking-tight md:text-4xl">
                كل مواد Quizy بمكان واحد
              </h1>
              <p className="text-muted-foreground max-w-xl text-sm md:text-base">
                اختار المادة وشوف الاختبارات والدروس المرتبطة فيها مباشرة.
              </p>
            </div>
          </div>

          <Card className="p-2">
            <CardContent className="grid gap-3 p-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-muted/45 p-3">
                <BookOpenCheck className="text-primary mb-2 size-5" />
                <p className="text-xl font-black">{subjects.length}</p>
                <p className="text-muted-foreground text-xs">مادة متاحة</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/45 p-3">
                <SearchCheck className="text-primary mb-2 size-5" />
                <p className="text-xl font-black">جاهزة</p>
                <p className="text-muted-foreground text-xs">اختيار سريع</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/45 p-3">
                <Layers3 className="text-primary mb-2 size-5" />
                <p className="text-xl font-black">Quizy</p>
                <p className="text-muted-foreground text-xs">مراجعة واختبارات</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {error && (
          <ApiError
            errorMessage="تعذر تحميل المواد. حاول مرة ثانية."
            refetchFunction={() => refetch()}
          />
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loading size="lg" spinnerOnly />
          </div>
        )}

        {!isLoading && !error && (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    label="مادة Quizy"
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
                      اختبارات ودروس حسب المادة
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
          </section>
        )}

        {!isLoading && !error && subjects.length === 0 && (
          <Card className="flex min-h-[220px] items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">لا يوجد مواد متاحة حاليًا.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
