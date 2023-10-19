export interface GetUserDetailResponseDto {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  allowChangePassword: boolean;
}
