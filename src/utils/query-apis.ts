import { buildQueryString } from "@/lib/utils";
import { PartialQueryParams } from "./query-keys";

export const END_POINTS = {
  USER: {
    GET_CURRENT_USER: "/auth/current-user",
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
  QUIZ: {
    GET_QUIZZES: (params?: PartialQueryParams) =>
      `/Quizes${buildQueryString(params)}`,
    GET_QUIZ_BY_ID: (id: string) => `/Quizes/${id}`,
    CREATE_QUIZ: "/Quizzes",
    UPDATE_QUIZ: (id: string) => `/Quizes/${id}`,
    DELETE_QUIZ: (id: string) => `/Quizes/${id}`,
  },
  TEACHER: {
    GET_TEACHERS: (params?: PartialQueryParams) =>
      `/Teachers${buildQueryString(params)}`,
    GET_TEACHER_BY_ID: (id: string) => `/Teachers/${id}`,
    GET_TEACHER_BRIEFS: "/Teachers/Briefs",
  },
  SUBJECT: {
    GET_SUBJECTS: (params?: PartialQueryParams) =>
      `/Subjects${buildQueryString(params)}`,
    GET_SUBJECT_BY_ID: (id: string) => `/Subjects/${id}`,
    GET_SUBJECT_BRIEFS: "/Subjects/Brief",
  },
  AUTH: {
    REGISTER: "/Auth/register",
    VERIFY_CODE: "/Auth/register/verify",
    LOGIN: "/Auth/login",
  },
} as const;
