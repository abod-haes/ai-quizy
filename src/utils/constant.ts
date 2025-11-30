export const routesName = {
  home: "/",
  aiAssistant: "/ai-assistant",
  quizzes: "/quizzes",
  signup: "/sign-up",
  signin: "/sign-in",
  verify: "/verify",
  about: "/about",
  profile: "/profile",
  download: "/download",
  quizzesDetails: (id: string) => `/quizzes/${id}`,
} as const;

export const dashboardRoutesName = {
  lessons: "/dashboard/lessons",
  units: "/dashboard/units",
  quizzes: "/dashboard/quizzes",
  students: "/dashboard/students",
  teachers: "/dashboard/teachers",
  administration: "/dashboard/administration",
} as const;

export const NavLinkHeader: { label: string; href: TRouteName }[] = [
  {
    label: "رئيسية",
    href: routesName.home,
  },
  {
    label: "الاختبارات",
    href: routesName.quizzes,
  },

  {
    label: "تحميل التطبيق",
    href: routesName.download,
  },
  {
    label: "من نحن",
    href: routesName.about,
  },
];
export type TPublicRouteName = (typeof routesName)[keyof typeof routesName];
export type TDashboardRouteName =
  (typeof dashboardRoutesName)[keyof typeof dashboardRoutesName];
export type TRouteName = TPublicRouteName | TDashboardRouteName;
export const PER_PAGE = 12;
