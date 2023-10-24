import { PaginationResult } from '../../../common/pagination';
import { UserDto } from '../../transforms/users/user.dto';

export interface GetUserListResponseDto extends PaginationResult<UserDto> {}
