import { Role } from "./role";

export interface Account {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isVerified: boolean;
  jwtToken?: string;
  createdAt?: string;
  updatedAt?: string;
}
