import { subDays } from 'date-fns';
import { Id } from '../../../domain/common/id';
import { Result } from '../../../domain/common/result';
import { SessionsRepository } from '../../../domain/repositories/sessions.repository';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { AccessDeniedError, UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { GetUserStatisticRequestDto } from '../../dtos/request/users/get-user-statistic-request.dto';
import { GetUserStatisticResponseDto } from '../../dtos/response/users/get-user-statistic-response.dto';

export type GetUserStatisticRequest = GetUserStatisticRequestDto;

export type GetUserStatisticResponse =
  | UnexpectedError
  | Result<GetUserStatisticResponseDto>;

export class GetUserStatisticUseCase
  implements UseCase<GetUserStatisticRequest, GetUserStatisticResponse>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository
  ) {}

  async execute(
    data: GetUserStatisticRequest
  ): Promise<GetUserStatisticResponse> {
    try {
      const isUserVerified = await this.usersRepository.isUserVerified(
        new Id(data.requestUserId)
      );

      if (!isUserVerified) return new AccessDeniedError();

      const now = new Date();
      const sub7Days = subDays(now, 7);

      const totalUsers = await this.usersRepository.count();

      const todaySession =
        await this.sessionsRepository.countSessionByDate(now);

      const avg7DaysSession =
        await this.sessionsRepository.avgSessionByDateRange(sub7Days, now);

      const result: GetUserStatisticResponseDto = {
        totalUsers,
        todaySession,
        avg7DaysSession,
      };

      return Result.ok(result);
    } catch (err) {
      console.log(err);
      return new UnexpectedError(err);
    }
  }
}
