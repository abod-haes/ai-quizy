export interface Teacher extends Record<string, unknown> {
  id: string;
  phoneNumber: string;
  description: string;
  firstName: string;
  lastName: string;
  numberOfQuizzes: number;
}

export interface ClassSubject {
  subjectId: string;
  classId: string;
}

export interface CreateTeacherInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  description: string;
  url: string;
  classSubjects: ClassSubject[];
}