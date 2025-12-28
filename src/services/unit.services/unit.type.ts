export interface Unit extends Record<string, unknown> {
  id: string;
  name: string;
  description: string;
  subjectId: string;
}

export interface CreateUnitInput {
  name: string;
  desc: string;
  subjectId: string;
}

