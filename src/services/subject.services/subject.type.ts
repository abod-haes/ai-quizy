export interface Subject extends Record<string, unknown> {
  id: string;
  name: string;
}

export interface CreateSubjectInput {
  name: string;
  classIds?: string[];
}

