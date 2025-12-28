"use client";

import { Breadcrumbs } from "@/components/custom";
import React from "react";
import { useStatistics } from "@/services/statistics.services/statistics.query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  FileQuestion,
  Store,
  Trophy,
  TrendingUp,
  BarChart as BarChartIcon,
} from "lucide-react";
import { Loading } from "@/components/custom/loading";
import {
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "@/providers/TranslationsProvider";
import { cn } from "@/lib/utils";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

function DashboardPage() {
  const { data: statistics, isLoading } = useStatistics();
  const t = useTranslation();
  const dashboardDict =
    ((t.dashboard as Record<string, unknown>)?.dashboard as Record<
      string,
      string
    >) || {};

  if (isLoading) {
    return (
      <div className="dashboard-container flex min-h-[400px] items-center justify-center">
        <Loading size="lg" spinnerOnly />
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="dashboard-container">
        <Breadcrumbs className="mb-4" />
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No statistics available</p>
        </div>
      </div>
    );
  }

  const statsData = [
    {
      label: dashboardDict.students || "Students",
      value: statistics.studentsCount,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: dashboardDict.teachers || "Teachers",
      value: statistics.teachersCount,
      icon: GraduationCap,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: dashboardDict.quizzes || "Quizzes",
      value: statistics.quizzesCount,
      icon: FileQuestion,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: dashboardDict.pointsOfSale || "Points of Sale",
      value: statistics.pointsOfSaleCount,
      icon: Store,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  const chartData = [
    {
      name: dashboardDict.students || "Students",
      value: statistics.studentsCount,
    },
    {
      name: dashboardDict.teachers || "Teachers",
      value: statistics.teachersCount,
    },
    {
      name: dashboardDict.quizzes || "Quizzes",
      value: statistics.quizzesCount,
    },
    {
      name: dashboardDict.pointsOfSale || "Points of Sale",
      value: statistics.pointsOfSaleCount,
    },
  ];

  const barChartData = [
    {
      category: dashboardDict.overview || "Overview",
      [dashboardDict.students || "Students"]: statistics.studentsCount,
      [dashboardDict.teachers || "Teachers"]: statistics.teachersCount,
      [dashboardDict.quizzes || "Quizzes"]: statistics.quizzesCount,
    },
  ];

  return (
    <div className="dashboard-container">
      <Breadcrumbs className="mb-6" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <Card className="border-border/50 overflow-hidden transition-shadow hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm font-medium">
                          {stat.label}
                        </p>
                        <motion.p
                          className="text-3xl font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                        >
                          {stat.value.toLocaleString()}
                        </motion.p>
                      </div>
                      <div
                        className={cn(
                          "rounded-full p-3",
                          stat.bgColor,
                          stat.color,
                        )}
                      >
                        <Icon className="size-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  {dashboardDict.distribution || "Distribution"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bar Chart */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartIcon className="size-5" />
                  {dashboardDict.comparison || "Comparison"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey={dashboardDict.students || "Students"}
                      fill={COLORS[0]}
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey={dashboardDict.teachers || "Teachers"}
                      fill={COLORS[1]}
                      radius={[8, 8, 0, 0]}
                    />
                    <Bar
                      dataKey={dashboardDict.quizzes || "Quizzes"}
                      fill={COLORS[2]}
                      radius={[8, 8, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Top Students */}
        {statistics.topStudents && statistics.topStudents.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="size-5 text-amber-500" />
                  {dashboardDict.topStudents || "Top Students"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics.topStudents.map((student, index) => (
                    <motion.div
                      key={student.studentId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full font-bold text-white",
                            index === 0 && "bg-amber-500",
                            index === 1 && "bg-gray-400",
                            index === 2 && "bg-amber-700",
                            index > 2 && "bg-muted text-muted-foreground",
                          )}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {student.fullName ||
                              `${student.firstName} ${student.lastName}`}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {student.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground text-sm">
                            {dashboardDict.correctAnswers || "Correct"}:
                          </span>
                          <span className="font-semibold">
                            {student.correctAnswers}/{student.totalAnswers}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-sm font-medium text-green-600">
                            {student.correctPercentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default DashboardPage;
