"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, UserRoundCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/custom/loading";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { useTeachersBrief } from "@/services/teacher.services/teacher.query";
import { routesName, TRouteName } from "@/utils/constant";

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}` || "أ";
}

export default function HomeTeachersSection() {
  const getLocalizedHref = useLocalizedHref();
  const { data: teachers, isLoading } = useTeachersBrief();
  const previewTeachers = teachers?.slice(0, 6) || [];

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
            <GraduationCap className="size-4" />
            أساتذة Quizy
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">
              تمرّن بعد شرح أستاذك
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              الأساتذة ظاهرين من نفس API التطبيق، لتختار أستاذك وتشوف الاختبارات المرتبطة فيه.
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
        <div className="flex items-center justify-center py-12">
          <Loading size="md" spinnerOnly />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previewTeachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="h-full"
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground flex size-14 shrink-0 items-center justify-center rounded-3xl text-lg font-black">
                      {getInitials(teacher.firstName, teacher.lastName)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {teacher.firstName} {teacher.lastName}
                      </CardTitle>
                      <p className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                        <UserRoundCheck className="size-4" />
                        أستاذ في Quizy
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
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
