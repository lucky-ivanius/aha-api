import { Id } from '../../../domain/common/id';
import { Result } from '../../../domain/common/result';
import { Password } from '../../../domain/models/user/password';
import { User } from '../../../domain/models/user/user';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { HashingService } from '../../../domain/services/hashing.service';
import { IdentityProviderService } from '../../../domain/services/identity-provider.service';
import {
  AccessDeniedError,
  NotFoundError,
  UnexpectedError,
} from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { ChangePasswordRequestDto } from '../../dtos/request/users/change-password-request.dto';
import { ChangePasswordNotAllowedError } from '../../errors/users/change-password-not-allowed.error';
import { IncorrectPasswordError } from '../../errors/users/incorrect-password.error';

export type ChangePasswordRequest = ChangePasswordRequestDto;

export type ChangePasswordResponse =
  | UnexpectedError
  | NotFoundError
  | AccessDeniedError
  | IncorrectPasswordError
  | ChangePasswordNotAllowedError
  | Result<void>;

export class ChangePasswordUseCase
  implements UseCase<ChangePasswordRequest, ChangePasswordResponse>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly identityProviderService: IdentityProviderService
  ) {}

  async execute(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const newPasswordResult = Password.create(data.newPassword, false);

    const dtoResult = Result.combine(newPasswordResult);
    if (!dtoResult.isSuccess) return Result.fail(dtoResult.error);

    try {
      const user = await this.usersRepository.findById(new Id(data.userId));

      if (!user) return new NotFoundError(User.name, data.userId.toString());

      if (!user.password && !user.identityProvider)
        return new AccessDeniedError();

      if (user.password) {
        if (!data.currentPassword) return new IncorrectPasswordError();

        const isPasswordMatch = await this.hashingService.compare(
          user.password,
          data.currentPassword
        );

        if (!isPasswordMatch) return new IncorrectPasswordError();

        const hashedPassword = await this.hashingService.hash(
          newPasswordResult.data
        );

        user.changePassword(hashedPassword);

        await this.usersRepository.save(user);
      }

      if (user.identityProvider) {
        if (!user.identityProvider.allowChangePassword)
          return new ChangePasswordNotAllowedError();

        await this.identityProviderService.changePassword(
          user,
          data.newPassword
        );
      }

      return Result.ok();
    } catch (err) {
      console.log(err);
      return new UnexpectedError(err);
    }
  }
}
