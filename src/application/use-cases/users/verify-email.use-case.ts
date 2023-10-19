import { Id } from '../../../domain/common/id';
import { Result } from '../../../domain/common/result';
import { User } from '../../../domain/models/user/user';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import {
  TokenService,
  VerifyEmailPayload,
} from '../../../domain/services/token.service';
import { NotFoundError, UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { VerifyEmailRequestDto } from '../../dtos/request/users/verify-email-request.dto';
import { InvalidAccessTokenError } from '../../errors/users/invalid-access-token.error';

export type VerifyEmailRequest = VerifyEmailRequestDto;

export type VerifyEmailResponse =
  | UnexpectedError
  | NotFoundError
  | Result<void>;

export class VerifyEmailUseCase
  implements UseCase<VerifyEmailRequest, VerifyEmailResponse>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    try {
      const payload = (await this.tokenService.verify(
        data.verifyToken
      )) as VerifyEmailPayload;

      if (!payload || payload.type !== 'verify_email')
        return new InvalidAccessTokenError();

      const user = await this.usersRepository.findById(new Id(payload.sub));

      if (!user) return new NotFoundError(User.name, payload.email);

      if (user.isEmailVerified) return new InvalidAccessTokenError();

      user.verifyEmail();

      await this.usersRepository.save(user);

      return Result.ok();
    } catch (err) {
      return new UnexpectedError(err);
    }
  }
}
