import { PaginationRequest } from '../../../common/pagination';

export interface GetUserListRequestDto extends PaginationRequest {
  requestUserId: string;
}
