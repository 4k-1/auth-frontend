export interface Account {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'Admin' | 'User';
  isVerified: boolean;
  jwtToken?: string;
  createdAt?: string;
  updatedAt?: string;
}
