import type { UserInput } from "@/services/user.services/user.type";

export interface QueryParams {
  page: number;
  PerPage: number;
  search: string;
}

export type PartialQueryParams = Partial<QueryParams>;

export const queryKeys = {
  student: {
    getList: (params?: PartialQueryParams) =>
      ["student", "list", params] as const,
    detail: (id: string) => ["student", "detail", id] as const,
  },
  user: {
    me: () => ["user", "me"] as const,
    getList: (params?: PartialQueryParams) => ["user", "list", params] as const,
    detail: (id: string) => ["user", "detail", id] as const,
    delete: (id: string) => ["user", "delete", id] as const,
    update: (id: string) => ["user", "update", id] as const,
    create: (data: UserInput) => ["user", "create", data] as const,
  },
} as const;
