import type { UserInput } from "@/services/user.services/user.type";

export interface QueryParams {
  page: number;
  PerPage: number;
  search: string;
}

export type PartialQueryParams = Partial<QueryParams>;

export const queryKeys = {
  subject: {
    getList: (params?: PartialQueryParams) =>
      ["subject", "list", params] as const,
    detail: (id: string) => ["subject", "detail", id] as const,
    getBriefs: () => ["subject", "briefs"] as const,
    getBrief: () => ["subject", "brief"] as const,
  },
  classes: {
    getList: (params?: PartialQueryParams) =>
      ["class", "list", params] as const,
    detail: (id: string) => ["class", "detail", id] as const,
    getBrief: () => ["class", "brief"] as const,
  },
  student: {
    getList: (params?: PartialQueryParams) =>
      ["student", "list", params] as const,
    detail: (id: string) => ["student", "detail", id] as const,
  },
  user: {
    currentUser: () => ["user", "currentUser"] as const,
    getList: (params?: PartialQueryParams) => ["user", "list", params] as const,
    detail: (id: string) => ["user", "detail", id] as const,
    delete: (id: string) => ["user", "delete", id] as const,
    update: (id: string) => ["user", "update", id] as const,
    create: (data: UserInput) => ["user", "create", data] as const,
  },
  quiz: {
    getList: (params?: PartialQueryParams) => ["quiz", "list", params] as const,
    detail: (id: string) => ["quiz", "detail", id] as const,
  },
  teacher: {
    getList: (params?: PartialQueryParams) =>
      ["teacher", "list", params] as const,
    detail: (id: string) => ["teacher", "detail", id] as const,
    getBriefs: () => ["teacher", "briefs"] as const,
  },
  unit: {
    getList: (params?: PartialQueryParams) =>
      ["unit", "list", params] as const,
    detail: (id: string) => ["unit", "detail", id] as const,
  },
  lesson: {
    getList: (params?: PartialQueryParams) =>
      ["lesson", "list", params] as const,
    detail: (id: string) => ["lesson", "detail", id] as const,
  },
  question: {
    getList: (params?: PartialQueryParams) =>
      ["question", "list", params] as const,
    detail: (id: string) => ["question", "detail", id] as const,
  },
  auth: {
    register: () => ["auth", "register"] as const,
    verifyCode: () => ["auth", "verifyCode"] as const,
    login: () => ["auth", "login"] as const,
  },
  statistics: {
    getStatistics: () => ["statistics"] as const,
  },
} as const;
