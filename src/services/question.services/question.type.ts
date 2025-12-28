export interface Answer {
  title: string;
  isCorrect: boolean;
}

export interface Question extends Record<string, unknown> {
  id: string;
  title: string;
  hint: string;
  description: string;
  correctTitle: number;
  answers: Answer[];
  lessonNames: string[];
}

export interface CreateQuestionInput {
  title: string;
  hint: string;
  description: string;
  lessonIds: string[];
  answers: Answer[];
}


