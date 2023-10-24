export interface UserDetailDto {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: number;
  loginCount: number;
  lastSession: number | null;
}
