import { Result } from '../../../domain/common/result';
import { Session } from '../../../domain/models/session/session';
import { SessionsRepository } from '../../../domain/repositories/sessions.repository';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { LoginRequestDto } from '../../dtos/request/users/login-request.dto';
import { LoginResponseDto } from '../../dtos/request/users/login-response.dto';
import { InvalidCredentialError } from '../../errors/users/invalid-credential.error';
import { HashingService } from '../../services/hashing.service';
import { AccessPayload, TokenService } from '../../services/token.service';

export type LoginRequest = LoginRequestDto;

export type LoginResponse =
  | UnexpectedError
  | InvalidCredentialError
  | Result<LoginResponseDto>;

export class LoginUseCase implements UseCase<LoginRequest, LoginResponse> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sessionsRepository: SessionsRepository,
    private readonly tokenService: TokenService,
    private readonly hashingService: HashingService
  ) {}

  async execute(data: LoginRequest): Promise<LoginResponse> {
    try {
      const user = await this.usersRepository.findByEmail(data.email);

      if (!user?.password) return new InvalidCredentialError();

      const passwordCompare = await this.hashingService.compare(
        user.password,
        data.password
      );

      if (!passwordCompare) return new InvalidCredentialError();

      const accessPayload: AccessPayload = {
        sub: user.id.toString(),
        type: 'access',
      };

      const accessToken = this.tokenService.sign(accessPayload);

      const session = Session.create({
        userId: user.id,
        token: accessToken,
      });

      user.login();

      await this.usersRepository.save(user);
      await this.sessionsRepository.save(session.data);

      return Result.ok<LoginResponseDto>({
        accessToken,
      });
    } catch (err) {
      return new UnexpectedError(err);
    }
  }
}
