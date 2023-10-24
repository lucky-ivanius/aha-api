import { Result } from '../../../domain/common/result';
import { IdentityProvider } from '../../../domain/models/user/identity-provider';
import { Password } from '../../../domain/models/user/password';
import { AccessDeniedError, UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { Auth0Metadata } from '../../dtos/external/auth0/auth0-metadata.dto';
import { ChangeAuth0PasswordRequestDto } from '../../dtos/request/users/change-auth0-password-request.dto';
import { InvalidAccessTokenError } from '../../errors/users/invalid-access-token.error';
import { ExternalAuthService } from '../../services/external-auth.service';

export type ChangeAuth0PasswordRequest = ChangeAuth0PasswordRequestDto;

export type ChangeAuth0PasswordResponse =
  | UnexpectedError
  | InvalidAccessTokenError
  | AccessDeniedError
  | Result<void>;

export class ChangeAuth0PasswordUseCase
  implements UseCase<ChangeAuth0PasswordRequest, ChangeAuth0PasswordResponse>
{
  constructor(private readonly auth0Service: ExternalAuthService) {}

  async execute(
    data: ChangeAuth0PasswordRequest
  ): Promise<ChangeAuth0PasswordResponse> {
    const newPasswordResult = Password.create(data.newPassword, false);

    const dtoResult = Result.combine(newPasswordResult);
    if (!dtoResult.isSuccess) return Result.fail(dtoResult.error);

    try {
      const auth0User = await this.auth0Service.getUserByToken(
        data.accessToken
      );

      if (!auth0User) return new InvalidAccessTokenError();

      const provider = auth0User.provider as IdentityProvider<Auth0Metadata>;

      if (!provider.metadata.allowChangePassword)
        return new AccessDeniedError();

      auth0User.changePassword(newPasswordResult.data);

      await this.auth0Service.save(auth0User);

      return Result.ok();
    } catch (err) {
      console.log(err);
      return new UnexpectedError(err);
    }
  }
}
