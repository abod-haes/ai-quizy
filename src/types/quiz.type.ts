export interface LinkedQuiz {
  id: string;
  entityId: string;
  quizBelong: number;
}

export interface Answer {
  id?: string;
  answerId?: string;
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

export interface QuizQuestionResult {
  questionId: string;
  answerId: string;
  timeSpentSeconds: number;
}

export interface SubmitQuizResultsInput {
  studentId: string;
  questions: QuizQuestionResult[];
}

export interface StudentAnswer {
  questionId: string;
  answerId: string;
  answerTitle: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
}

export interface QuizResultsResponse {
  quiz: Quiz;
  studentId: string;
  answers: StudentAnswer[];
}
