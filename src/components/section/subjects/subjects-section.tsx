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
              المواد
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
                كل مواد Quizy بمكان واحد
              </h1>
              <p className="text-muted-foreground max-w-xl text-base md:text-lg">
                المواد مربوطة بنفس API التطبيق. اختار المادة وشوف الاختبارات والدروس المرتبطة فيها مباشرة.
              </p>
            </div>
          </div>

          <Card className="p-2">
            <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-muted/45 p-4">
                <BookOpenCheck className="text-primary mb-3 size-6" />
                <p className="text-2xl font-black">{subjects.length}</p>
                <p className="text-muted-foreground text-sm">مادة متاحة</p>
              </div>
              <div className="rounded-3xl border border-border bg-muted/45 p-4">
                <SearchCheck className="text-primary mb-3 size-6" />
                <p className="text-2xl font-black">API</p>
                <p className="text-muted-foreground text-sm">بيانات مباشرة</p>
              </div>
              <div className="rounded-3xl border border-border bg-muted/45 p-4">
                <Layers3 className="text-primary mb-3 size-6" />
                <p className="text-2xl font-black">Quizy</p>
                <p className="text-muted-foreground text-sm">مراجعة واختبارات</p>
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
          <div className="flex items-center justify-center py-20">
            <Loading size="lg" spinnerOnly />
          </div>
        )}

        {!isLoading && !error && (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.035 }}
                className="h-full"
              >
                <Card className="group h-full justify-between p-3">
                  <EntityCover
                    entity={subject}
                    title={subject.name}
                    label="مادة Quizy"
                    className="mb-3"
                  />
                  <CardHeader className="px-2 pb-2 pt-3">
                    <CardTitle className="line-clamp-2 text-xl">
                      {subject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 px-2 pb-2">
                    <div className="text-muted-foreground flex items-center gap-2 rounded-2xl bg-muted/60 px-3 py-2 text-sm">
                      <Layers3 className="size-4" />
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
          <Card className="flex min-h-[240px] items-center justify-center p-10 text-center">
            <p className="text-muted-foreground">لا يوجد مواد متاحة حاليًا.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
