import { Id } from '../../../domain/common/id';
import { Result } from '../../../domain/common/result';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { AccessDeniedError, UnexpectedError } from '../../common/errors';
import { defaultPage, defaultPageSize } from '../../common/pagination';
import { UseCase } from '../../common/use-case';
import { GetUserListRequestDto } from '../../dtos/request/users/get-user-list-request.dto';
import { GetUserListResponseDto } from '../../dtos/response/users/get-user-list-response.dto';

export type GetUserListRequest = GetUserListRequestDto;

export type GetUserListResponse =
  | UnexpectedError
  | AccessDeniedError
  | Result<GetUserListResponseDto>;

export class GetUserListUseCase
  implements UseCase<GetUserListRequest, GetUserListResponse>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(data: GetUserListRequest): Promise<GetUserListResponse> {
    try {
      const isUserVerified = await this.usersRepository.isUserVerified(
        new Id(data.requestUserId)
      );

      if (!isUserVerified) return new AccessDeniedError();

      const page = data.page ?? defaultPage;
      const pageSize = data.pageSize ?? defaultPageSize;

      const users = await this.usersRepository.getUserList(page, pageSize);

      const totalUsers = await this.usersRepository.count();

      const mappedUsers = users.map((user) => ({
        id: user.id.toString(),
        name: user.name.value,
        email: user.email.value,
        createdAt: user.createdAt.getTime(),
        loginCount: user.loginCount,
        lastSession: user.lastSession?.getTime() ?? null,
      }));

      const result: GetUserListResponseDto = {
        data: mappedUsers,
        total: totalUsers,
      };

      return Result.ok(result);
    } catch (err) {
      return new UnexpectedError(err);
    }
  }
}
