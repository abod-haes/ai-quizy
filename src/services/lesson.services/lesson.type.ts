export interface Lesson extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  unitId: string;
}

export interface CreateLessonInput {
  name: string;
  desc: string;
  unitId: string;
}

