export const routesName = {
  home: {
    keyName: "common.home",
    href: "/",
  },
  aiAssistant: {
    keyName: "common.aiAssistant",
    href: "/ai-assistant",
  },
  quizzes: {
    keyName: "common.quizzes",
    href: "/quizzes",
  },
  signup: {
    keyName: "common.signup",
    href: "/sign-up",
  },
  signin: {
    keyName: "common.signin",
    href: "/sign-in",
  },
  verify: {
    keyName: "common.verify",
    href: "/verify",
  },
  about: {
    keyName: "common.about",
    href: "/about",
  },
  profile: {
    keyName: "common.profile",
    href: "/profile",
  },
  download: {
    keyName: "common.download",
    href: "/download",
  },
  quizzesDetails: (id: string) => `/quizzes/${id}`,
  quizResults: (id: string) => `/quizzes/result/${id}`,
} as const;

export const dashboardRoutesName = {
  dashboard: {
    keyName: "sidebar.dashboard",
    href: "/dashboard",
  },
  lessons: {
    keyName: "sidebar.lessons",
    href: "/dashboard/lessons",
  },
  classes: {
    keyName: "sidebar.classes",
    href: "/dashboard/classes",
  },
  subjects: {
    keyName: "sidebar.subjects",
    href: "/dashboard/subjects",
  },
  units: {
    keyName: "sidebar.units",
    href: "/dashboard/units",
  },
  questions: {
    keyName: "sidebar.questions",
    href: "/dashboard/qestions",
  },
  quizzes: {
    keyName: "sidebar.quizzes",
    href: "/dashboard/quizzes",
  },
  students: {
    keyName: "sidebar.students",
    href: "/dashboard/students",
  },
  studentDetails: {
    keyName: "dashboard.students.detailsTitle",
    href: "/dashboard/students/:id",
  },
  teachers: {
    keyName: "sidebar.teachers",
    href: "/dashboard/teachers",
  },
  administration: {
    keyName: "sidebar.administration",
    href: "/dashboard/administration",
  },
} as const;

// Helper type to extract href from route objects, excluding functions
type ExtractHref<T> = T extends { href: infer H } ? H : never;
type ExcludeFunctions<T> = T extends (...args: never[]) => unknown ? never : T;

export type TPublicRouteName = ExtractHref<
  ExcludeFunctions<(typeof routesName)[keyof typeof routesName]>
>;

export type TDashboardRouteName = ExtractHref<
  ExcludeFunctions<
    (typeof dashboardRoutesName)[keyof typeof dashboardRoutesName]
  >
>;

export type TRouteName = TPublicRouteName | TDashboardRouteName | string;

export const NavLinkHeader: { label: string; href: TRouteName }[] = [
  {
    label: "رئيسية",
    href: routesName.home.href,
  },
  {
    label: "الاختبارات",
    href: routesName.quizzes.href,
  },

  {
    label: "تحميل التطبيق",
    href: routesName.download.href,
  },
  {
    label: "من نحن",
    href: routesName.about.href,
  },
];
export const PER_PAGE = 12;
