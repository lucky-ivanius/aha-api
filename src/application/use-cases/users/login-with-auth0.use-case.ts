import { Result } from '../../../domain/common/result';
import { Session } from '../../../domain/models/session/session';
import { SessionsRepository } from '../../../domain/repositories/sessions.repository';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { LoginWithAuth0RequestDto } from '../../dtos/request/users/login-with-auth0-request.dto';
import { InvalidAccessTokenError } from '../../errors/users/invalid-access-token.error';
import { ExternalAuthService } from '../../services/external-auth.service';

export type LoginWithAuth0Request = LoginWithAuth0RequestDto;

export type LoginWithAuth0Response = UnexpectedError | Result<void>;

export class LoginWithAuth0UseCase
  implements UseCase<LoginWithAuth0Request, LoginWithAuth0Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly auth0Service: ExternalAuthService
  ) {}

  async execute(data: LoginWithAuth0Request): Promise<LoginWithAuth0Response> {
    try {
      const auth0User = await this.auth0Service.getUserByToken(
        data.accessToken
      );

      if (!auth0User) return new InvalidAccessTokenError();

      const user = await this.usersRepository.findByEmail(
        auth0User.email.value
      );

      if (!user) await this.usersRepository.save(auth0User);

      const actualUser = user ?? auth0User;

      const session = Session.create({
        userId: actualUser.id,
        token: data.accessToken,
      });

      actualUser.login();

      await this.usersRepository.save(actualUser);
      await this.sessionsRepository.save(session.data);

      return Result.ok();
    } catch (err) {
      return new UnexpectedError(err);
    }
  }
}
