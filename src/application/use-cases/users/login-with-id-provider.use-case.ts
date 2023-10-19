import { addHours } from 'date-fns';
import { Result } from '../../../domain/common/result';
import { Session } from '../../../domain/models/session/session';
import { SessionsRepository } from '../../../domain/repositories/sessions.repository';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { IdentityProviderService } from '../../../domain/services/identity-provider.service';
import { UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { LoginWithIdProviderRequestDto } from '../../dtos/request/users/login-with-id-provider-request.dto';
import { InvalidAccessTokenError } from '../../errors/users/invalid-access-token.error';
import { InvalidCredentialError } from '../../errors/users/invalid-credential.error';
import { UserRegisteredWithEmailError } from '../../errors/users/user-registered-with-email.error';

export type LoginWithIdProviderRequest = LoginWithIdProviderRequestDto;

export type LoginWithIdProviderResponse = UnexpectedError | Result<void>;

export class LoginWithIdProviderUseCase
  implements UseCase<LoginWithIdProviderRequest, LoginWithIdProviderResponse>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly identityProviderService: IdentityProviderService
  ) {}

  async execute(
    data: LoginWithIdProviderRequest
  ): Promise<LoginWithIdProviderResponse> {
    try {
      const idProviderUser = await this.identityProviderService.getUserInfo(
        data.accessToken
      );

      if (!idProviderUser) return new InvalidAccessTokenError();

      const user = await this.usersRepository.findByEmail(
        idProviderUser.email.value
      );

      if (!user) return new InvalidCredentialError();

      if (!user.identityProvider)
        return new UserRegisteredWithEmailError(idProviderUser.email.value);

      const expiryHours = 24;

      const session = Session.create({
        userId: user.id,
        token: data.accessToken,
        expiryDate: addHours(new Date(), expiryHours),
      });

      user.login();

      await this.usersRepository.save(user);
      await this.sessionsRepository.save(session.data);

      return Result.ok();
    } catch (err) {
      return new UnexpectedError(err);
    }
  }
}
