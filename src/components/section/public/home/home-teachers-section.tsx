"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, UserRoundCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/custom/loading";
import { EntityCover } from "@/components/custom/entity-cover";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useTeachersBrief } from "@/services/teacher.services/teacher.query";
import { routesName, TRouteName } from "@/utils/constant";

export default function HomeTeachersSection() {
  const getLocalizedHref = useLocalizedHref();
  const { data: teachers, isLoading } = useTeachersBrief();
  const previewTeachers = teachers?.slice(0, 6) || [];

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
            <GraduationCap className="size-3.5" />
            أساتذة Quizy
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight md:text-3xl">
              تمرّن بعد شرح أستاذك
            </h2>
            <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm md:text-base">
              تصفّح الأساتذة وشوف الاختبارات المرتبطة فيهم.
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={getLocalizedHref(routesName.teachers.href)}>
            عرض كل الأساتذة
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loading size="md" spinnerOnly />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previewTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.035 }}
              className="h-full"
            >
              <Card className="group h-full p-2.5">
                <EntityCover
                  entity={teacher}
                  title={`${teacher.firstName} ${teacher.lastName}`}
                  label="أستاذ Quizy"
                  className="mb-2.5 aspect-[2/1] rounded-2xl"
                />
                <CardHeader className="px-1.5 pb-1 pt-2">
                  <CardTitle className="text-lg">
                    {teacher.firstName} {teacher.lastName}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                    <UserRoundCheck className="size-3.5" />
                    أستاذ في Quizy
                  </p>
                </CardHeader>
                <CardContent className="px-1.5 pb-1.5">
                  <Button className="w-full" asChild>
                    <Link
                      href={getLocalizedHref(
                        `${routesName.quizzes.href}?teacherId=${teacher.id}` as TRouteName,
                      )}
                    >
                      اختبارات الأستاذ
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
