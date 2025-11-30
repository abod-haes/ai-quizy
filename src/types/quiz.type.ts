export interface LinkedQuiz {
  id: string;
  entityId: string;
  quizBelong: number;
}

export interface Answer {
  title: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  title: string;
  hint: string;
  description: string;
  correctTitle: number;
  answers: Answer[];
  lessonNames: string[];
}

export interface Quiz {
  id: string;
  teacherId: string;
  teacherName: string;
  timeExpiration: number;
  isSolved: boolean;
  solvedPercentage: number;
  timeSpentSeconds: number;
  timeSpentFormatted: string;
  questionsCount: number;
  linkedQuiz: LinkedQuiz[];
  questions?: Question[];
}

export interface QuizzesQueryParams {
  Page?: number;
  PerPage?: number;
  SubjectId?: string;
  TeacherId?: string;
  IsLesson?: boolean;
  studentId?: string;
}
