import { PaginationResponseDto } from '../common/pagination-response.dto';

interface UserDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  loginCount: number;
  lastSession?: Date;
}

export type GetUserListResponseDto = PaginationResponseDto<UserDto>;
