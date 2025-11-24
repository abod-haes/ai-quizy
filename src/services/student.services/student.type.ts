export interface Student extends Record<string, unknown> {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}
