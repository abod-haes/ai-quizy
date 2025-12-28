import { buildQueryString } from "@/lib/utils";
import { PartialQueryParams } from "./query-keys";

export const END_POINTS = {
  USER: {
    GET_CURRENT_USER: "/auth/current-user",
    GET_USERS: "/Users",
    CREATE_USER: "/Users",
    UPDATE_USER: (id: string) => `/Users/${id}`,
    DELETE_USER: (id: string) => `/Users/${id}`,
    GET_USER_BY_ID: (id: string) => `/Users/${id}`,
  },
  STUDENT: {
    GET_STUDENTS: (params?: PartialQueryParams) =>
      `/Students?Page=${params?.page}&PerPage=${params?.PerPage}`,
    GET_STUDENT_BY_ID: (id: string) => `/Students/${id}`,
    CREATE_STUDENT: "/Students",
    UPDATE_STUDENT: (id: string) => `/Students/${id}`,
    DELETE_STUDENT: (id: string) => `/Students/${id}`,
  },
  TEACHER: {
    GET_TEACHERS: (params?: PartialQueryParams) =>
      `/Teachers?Page=${params?.page}&PerPage=${params?.PerPage}`,
    GET_TEACHER_BY_ID: (id: string) => `/Teachers/${id}`,
    CREATE_TEACHER: "/Teachers",
    UPDATE_TEACHER: (id: string) => `/Teachers/${id}`,
    DELETE_TEACHER: (id: string) => `/Teachers/${id}`,
    GET_TEACHER_BRIEFS: "/Teachers/Brief",
  },

  CLASSES: {
    GET_CLASSES: (params?: PartialQueryParams) =>
      `/Classes?Page=${params?.page || 1}&PerPage=${params?.PerPage || 10}`,
    CREATE_CLASS: "/Classes",
    GET_CLASSES_BRIEF: () => `/Classes/Brief`,
  },
  QUIZ: {
    GET_QUIZZES: (params?: PartialQueryParams) =>
      `/Quizes${buildQueryString(params)}`,
    GET_QUIZ_BY_ID: (id: string) => `/Quizes/${id}`,
    CREATE_QUIZ: "/Quizzes",
    UPDATE_QUIZ: (id: string) => `/Quizes/${id}`,
    DELETE_QUIZ: (id: string) => `/Quizes/${id}`,
    SUBMIT_QUIZ_RESULTS: (quizId: string) => `/Quizes/${quizId}/results`,
    GET_QUIZ_RESULTS: (quizId: string) => `/Quizes/${quizId}/results`,
  },

  SUBJECT: {
    GET_SUBJECTS: (params?: PartialQueryParams) =>
      `/Subjects?Page=${params?.page || 1}&PerPage=${params?.PerPage || 10}`,
    GET_SUBJECT_BY_ID: (id: string) => `/Subjects/${id}`,
    CREATE_SUBJECT: "/Subjects",
    UPDATE_SUBJECT: (id: string) => `/Subjects/${id}`,
    DELETE_SUBJECT: (id: string) => `/Subjects/${id}`,
    GET_SUBJECT_BRIEFS: "/Subjects/Brief",
    GET_SUBJECTS_BRIEF: () => `/Subjects/Brief`,
  },
  UNIT: {
    GET_UNITS: (params?: PartialQueryParams) =>
      `/Units?Page=${params?.page || 1}&PerPage=${params?.PerPage || 10}`,
    GET_UNIT_BY_ID: (id: string) => `/Units/${id}`,
    CREATE_UNIT: "/Units",
    UPDATE_UNIT: (id: string) => `/Units/${id}`,
    DELETE_UNIT: (id: string) => `/Units/${id}`,
  },
  LESSON: {
    GET_LESSONS: (params?: PartialQueryParams) =>
      `/Lessons?Page=${params?.page || 1}&PerPage=${params?.PerPage || 10}`,
    GET_LESSON_BY_ID: (id: string) => `/Lessons/${id}`,
    CREATE_LESSON: "/Lessons",
    CREATE_LESSONS_LIST: "/Lessons/List",
    UPDATE_LESSON: (id: string) => `/Lessons/${id}`,
    DELETE_LESSON: (id: string) => `/Lessons/${id}`,
  },
  QUESTION: {
    GET_QUESTIONS: (params?: PartialQueryParams) =>
      `/Qestions?Page=${params?.page || 1}&PerPage=${params?.PerPage || 10}`,
    GET_QUESTION_BY_ID: (id: string) => `/Qestions/${id}`,
    CREATE_QUESTION: "/Qestions",
    UPDATE_QUESTION: (id: string) => `/Qestions/${id}`,
    DELETE_QUESTION: (id: string) => `/Qestions/${id}`,
  },
  AUTH: {
    REGISTER: "/Auth/register",
    VERIFY_CODE: "/Auth/register/verify",
    LOGIN: "/Auth/login",
    UPDATE_PROFILE: "/Auth/profile",
    CHANGE_PASSWORD: "/Auth/password/change",
  },
  STATISTICS: {
    GET_STATISTICS: "/Statistics",
  },
} as const;
