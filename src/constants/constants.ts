import { dashboardRoutesName } from "@/utils/constant";
import type { TRouteName } from "@/utils/constant";
import {
  BookOpen,
  GraduationCap,
  Folder,
  FileQuestion,
  Users,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const authPaths = ["login", "register", "reset-password"];
export const privatePaths = [];

export type NavMainItem = {
  title: string;
  url?: TRouteName;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: TRouteName | string;
  }[];
};

export type ProjectItem = {
  name: string;
  url: TRouteName | string;
  icon: LucideIcon;
};

export const data = {
  user: {
    name: "Latifa",
    email: "latifa@student.edu",
    avatar: "https://i.pravatar.cc/100?u=latifa",
    role: "Student",
  },

  teachers: [
    {
      name: "Dr. Ahmed Ali",
      email: "ahmed.ali@university.edu",
      avatar: "https://i.pravatar.cc/100?u=ahmed",
      subject: "Mathematics",
    },
    {
      name: "Prof. Sara Hassan",
      email: "sara.hassan@university.edu",
      avatar: "https://i.pravatar.cc/100?u=sara",
      subject: "Physics",
    },
  ],

  navMain: [
    {
      title: "Subjects",
      icon: BookOpen,
      items: [
        { title: "Mathematics", url: dashboardRoutesName.lessons },
        { title: "Physics", url: dashboardRoutesName.lessons },
        { title: "Chemistry", url: dashboardRoutesName.lessons },
        { title: "Computer Science", url: dashboardRoutesName.lessons },
      ],
    },
    {
      title: "Lessons",
      url: dashboardRoutesName.lessons,
      icon: GraduationCap,
    },
    {
      title: "Units",
      url: dashboardRoutesName.units,
      icon: Folder,
    },
    {
      title: "Quizzes",
      url: dashboardRoutesName.quizzes,
      icon: FileQuestion,
    },
    {
      title: "Users",
      icon: Users,
      items: [
        { title: "Students", url: dashboardRoutesName.students },
        { title: "Teachers", url: dashboardRoutesName.teachers },
        { title: "Administration", url: dashboardRoutesName.administration },
      ],
    },
  ],

  // Study programs or training projects
  projects: [
    {
      name: "Artificial Intelligence Course",
      url: dashboardRoutesName.lessons,
      icon: ClipboardList,
    },
    {
      name: "Engineering Program",
      url: dashboardRoutesName.lessons,
      icon: GraduationCap,
    },
    {
      name: "Web Development Bootcamp",
      url: dashboardRoutesName.lessons,
      icon: BookOpen,
    },
  ],
};
