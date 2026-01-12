export interface LinkedQuiz {
  id: string;
  entityId: string;
  name?: string;
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

export interface Quiz extends Record<string, unknown> {
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
  isPurchased?: boolean;
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

// Question input structure for creating a quiz
export interface QuizQuestionInput {
  id: string;
  title: string;
  hint: string;
  description: string;
  correctTitle: number;
  lessonIds: string[];
  answers: Array<{
    title: string;
    isCorrect: boolean;
  }>;
  order: number;
}

// Create quiz input matching the API schema
export interface CreateQuizInput {
  teacherId: string;
  timeExpiration: number;
  entityIds: string[]; // Array of lesson IDs
  questions: QuizQuestionInput[]; // Array of question objects
}
