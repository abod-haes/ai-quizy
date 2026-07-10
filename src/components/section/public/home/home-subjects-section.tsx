"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/custom/loading";
import { EntityCover } from "@/components/custom/entity-cover";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useSubjectsBrief } from "@/services/subject.services/subject.query";
import { routesName } from "@/utils/constant";

export default function HomeSubjectsSection() {
  const getLocalizedHref = useLocalizedHref();
  const { data: subjects, isLoading } = useSubjectsBrief();
  const previewSubjects = subjects?.slice(0, 10) || [];

  return (
    <section className="container relative z-10 mx-auto space-y-5 py-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
      >
        <div className="space-y-2.5">
          <div className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
            <Sparkles className="size-3.5" />
            مواد Quizy
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">
              اختار المادة وابدأ مراجعتك
            </h2>
            <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm md:text-base">
              صور المواد بتاخدك بسرعة للمحتوى المناسب.
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
        <div className="flex items-center justify-center py-10">
          <Loading size="md" spinnerOnly />
        </div>
      ) : (
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {previewSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.035 }}
              className="w-[290px] min-w-[290px] snap-start sm:w-[340px] sm:min-w-[340px] lg:w-[380px] lg:min-w-[380px]"
            >
              <Link href={getLocalizedHref(routesName.subjects.href)}>
                <Card className="group p-2.5">
                  <EntityCover
                    entity={subject}
                    title={subject.name}
                    label=""
                    fit="contain"
                    className="aspect-[16/9] rounded-2xl bg-muted/30"
                  />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
