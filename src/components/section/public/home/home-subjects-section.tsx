"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpenCheck, ArrowLeft, Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/custom/loading";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useSubjectsBrief } from "@/services/subject.services/subject.query";
import { routesName, TRouteName } from "@/utils/constant";

export default function HomeSubjectsSection() {
  const getLocalizedHref = useLocalizedHref();
  const { data: subjects, isLoading } = useSubjectsBrief();
  const previewSubjects = subjects?.slice(0, 6) || [];

  return (
    <section className="container relative z-10 mx-auto space-y-6 py-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div className="space-y-3">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold">
            <Sparkles className="size-4" />
            مواد Quizy
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              اختار المادة وابدأ مراجعتك
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              المواد مربوطة بنفس API التطبيق، وكل مادة بتاخدك مباشرة لاختباراتها وتمارينها.
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={getLocalizedHref(routesName.subjects.href)}>
            عرض كل المواد
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loading size="md" spinnerOnly />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previewSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="h-full"
            >
              <Card className="h-full bg-gradient-to-b from-card to-primary/5">
                <CardHeader>
                  <div className="bg-primary/10 text-primary mb-4 flex size-12 items-center justify-center rounded-2xl">
                    <BookOpenCheck className="size-6" />
                  </div>
                  <CardTitle className="text-xl">{subject.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" asChild>
                    <Link
                      href={getLocalizedHref(
                        `${routesName.quizzes.href}?subjectId=${subject.id}` as TRouteName,
                      )}
                    >
                      اختبارات المادة
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
