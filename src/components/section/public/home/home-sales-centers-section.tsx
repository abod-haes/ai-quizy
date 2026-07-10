"use client";

import { motion } from "framer-motion";
import { MapPin, Store } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/custom/loading";
import { usePointsOfSale } from "@/services/sales-center.services/sales-center.query";

export default function HomeSalesCentersSection() {
  const { data, isLoading } = usePointsOfSale({ page: 1, PerPage: 6 });
  const centers = data?.items || [];

  if (!isLoading && centers.length === 0) return null;

  return (
    <section className="container relative z-10 mx-auto space-y-5 py-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.35 }}
        className="space-y-2.5"
      >
        <div className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold">
          <Store className="size-3.5" />
          مراكز البيع
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">
            اشترك من أقرب مركز بيع
          </h2>
          <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm md:text-base">
            مراكز معتمدة لشراء أكواد الكورسات والاشتراكات.
          </p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loading size="md" spinnerOnly />
        </div>
      ) : (
        <div className="custom-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {centers.map((center, index) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.035 }}
              className="w-[280px] min-w-[280px] snap-start"
            >
              <Card className="relative h-full overflow-hidden border-primary/20 p-0">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10" />
                <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-primary/5" />
                <CardContent className="relative space-y-3 p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-full">
                      <Store className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="bg-primary/10 text-primary inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold">
                        مركز بيع أكواد الكورسات
                      </span>
                      <h3 className="line-clamp-1 text-base font-black">
                        {center.name}
                      </h3>
                    </div>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <MapPin className="text-primary size-4" />
                    <span className="line-clamp-1">{center.location}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
