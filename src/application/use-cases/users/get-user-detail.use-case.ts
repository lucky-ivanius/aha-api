import { Id } from '../../../domain/common/id';
import { Result } from '../../../domain/common/result';
import { User } from '../../../domain/models/user/user';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { NotFoundError, UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { GetUserDetailRequestDto } from '../../dtos/request/users/get-user-detail-request.dto';
import { GetUserDetailResponseDto } from '../../dtos/response/users/get-user-detail-response.dto';

export type GetUserDetailRequest = GetUserDetailRequestDto;

export type GetUserDetailResponse =
  | UnexpectedError
  | Result<GetUserDetailResponseDto>;

export class GetUserDetailUseCase
  implements UseCase<GetUserDetailRequest, GetUserDetailResponse>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(data: GetUserDetailRequest): Promise<GetUserDetailResponse> {
    try {
      const user = await this.usersRepository.findById(new Id(data.userId));

      if (!user) return new NotFoundError(User.name, data.userId);

      const result: GetUserDetailResponseDto = {
        id: user.id.toString(),
        name: user.name.value,
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        loginCount: user.loginCount,
        lastSession: user.lastSession?.getTime() ?? null,
        createdAt: user.createdAt.getTime(),
      };

      return Result.ok(result);
    } catch (err) {
      return new UnexpectedError(err);
    }
  }
}
