export interface UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  loginCount: number;
  lastSession: number | null;
}
