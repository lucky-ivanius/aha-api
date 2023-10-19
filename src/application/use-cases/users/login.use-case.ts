import { Result } from '../../../domain/common/result';
import { Session } from '../../../domain/models/session/session';
import { SessionsRepository } from '../../../domain/repositories/sessions.repository';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { HashingService } from '../../../domain/services/hashing.service';
import {
  AccessPayload,
  TokenService,
} from '../../../domain/services/token.service';
import { UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { LoginRequestDto } from '../../dtos/request/users/login-request.dto';
import { LoginResponseDto } from '../../dtos/request/users/login-response.dto';
import { InvalidCredentialError } from '../../errors/users/invalid-credential.error';
import { UserRegisteredWithIdProviderError } from '../../errors/users/user-registered-with-id-provider.error';

export type LoginRequest = LoginRequestDto;

export type LoginResponse =
  | UnexpectedError
  | InvalidCredentialError
  | UserRegisteredWithIdProviderError
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

      if (!user) return new InvalidCredentialError();

      if (!user.password)
        return new UserRegisteredWithIdProviderError(data.email);

      const passwordCompare = await this.hashingService.compare(
        user.password,
        data.password
      );

      if (!passwordCompare) return new InvalidCredentialError();

      const accessClaims: AccessPayload = {
        sub: user.id.toString(),
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        type: 'access',
      };

      const accessToken = this.tokenService.sign(accessClaims);

      const verifiedClaims = await this.tokenService.verify(accessToken);

      const session = Session.create({
        userId: user.id,
        token: accessToken,
        expiryDate: new Date(verifiedClaims!.exp),
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
