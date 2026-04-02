export type Role = "user" | "technician" | "admin";

export interface User {
  readonly id: string;
  name: string;
  phone: string;
  email: string;
  imgUrl: string | null;
  role: Role;
}
