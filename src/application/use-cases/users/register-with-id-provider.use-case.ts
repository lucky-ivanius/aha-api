import { Result } from '../../../domain/common/result';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { IdentityProviderService } from '../../../domain/services/identity-provider.service';
import { UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { RegisterWithIdProviderRequestDto } from '../../dtos/request/users/register-with-id-provider-request.dto';
import { EmailAlreadyExistsError } from '../../errors/users/email-already-exists.error';
import { InvalidAccessTokenError } from '../../errors/users/invalid-access-token.error';

export type RegisterWithIdProviderRequest = RegisterWithIdProviderRequestDto;

export type RegisterWithIdProviderResponse =
  | UnexpectedError
  | InvalidAccessTokenError
  | EmailAlreadyExistsError
  | Result<void>;

export class RegisterWithIdProviderUseCase
  implements
    UseCase<RegisterWithIdProviderRequest, RegisterWithIdProviderResponse>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly identityProviderService: IdentityProviderService
  ) {}

  async execute(
    data: RegisterWithIdProviderRequest
  ): Promise<RegisterWithIdProviderResponse> {
    try {
      const user = await this.identityProviderService.getUserInfo(
        data.accessToken
      );

      if (!user) return new InvalidAccessTokenError();

      const isUserExists = await this.usersRepository.findByEmail(
        user.email.value
      );

      if (!!isUserExists) return new EmailAlreadyExistsError(user.email.value);

      await this.usersRepository.save(user);

      return Result.ok();
    } catch (err) {
      return new UnexpectedError(err);
    }
  }
}
