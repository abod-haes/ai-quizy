import { PartialQueryParams } from "./query-keys";

export const END_POINTS = {
  USER: {
    GET_USERS: "/users",
    CREATE_USER: "/users/create",
    UPDATE_USER: "/users/update",
    DELETE_USER: (id: string) => `/users/delete/${id}`,
    GET_USER_BY_ID: (id: string) => `/users/${id}`,
  },
  STUDENT: {
    GET_STUDENTS: (params?: PartialQueryParams) =>
      `/Students?Page=${params?.page}&PerPage=${params?.PerPage}`,
    GET_STUDENT_BY_ID: (id: string) => `/Students/${id}`,
    CREATE_STUDENT: "/Students",
    UPDATE_STUDENT: (id: string) => `/Students/${id}`,
    DELETE_STUDENT: (id: string) => `/Students/${id}`,
  },
} as const;
