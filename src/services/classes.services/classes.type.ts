export interface ClassSubject {
  id: string;
  name: string;
}

export interface Class extends Record<string, unknown> {
  id: string;
  name: string;
  subjects?: ClassSubject[];
}

export interface CreateClassInput {
  name: string;
}

