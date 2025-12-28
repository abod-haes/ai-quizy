export interface TopStudent {
  studentId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  totalAnswers: number;
  correctAnswers: number;
  correctPercentage: number;
}

export interface Statistics {
  studentsCount: number;
  teachersCount: number;
  quizzesCount: number;
  pointsOfSaleCount: number;
  topStudents: TopStudent[];
}

