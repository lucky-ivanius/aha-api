import { Result } from '../../../domain/common/result';
import { Email } from '../../../domain/models/user/email';
import { Name } from '../../../domain/models/user/name';
import { Password } from '../../../domain/models/user/password';
import { User } from '../../../domain/models/user/user';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { EmailService } from '../../../domain/services/email.service';
import { HashingService } from '../../../domain/services/hashing.service';
import {
  TokenService,
  VerifyEmailPayload,
} from '../../../domain/services/token.service';
import { UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { RegisterRequestDto } from '../../dtos/request/users/register-request.dto';
import { EmailAlreadyExistsError } from '../../errors/users/email-already-exists.error';

export type RegisterRequest = RegisterRequestDto;

export type RegisterResponse =
  | UnexpectedError
  | EmailAlreadyExistsError
  | Result<void>;

export class RegisterUseCase
  implements UseCase<RegisterRequest, RegisterResponse>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService
  ) {}

  async execute(data: RegisterRequest): Promise<RegisterResponse> {
    const nameResult = Name.create(data.name);
    const emailResult = Email.create(data.email);
    const passwordResult = Password.create(data.password, false);

    const dtoResult = Result.combine(nameResult, emailResult, passwordResult);

    if (!dtoResult.isSuccess) return Result.fail(dtoResult.error);

    try {
      const isUserExists = await this.usersRepository.findByEmail(data.email);

      if (!!isUserExists) return new EmailAlreadyExistsError(data.email);

      const hashedPassword = await this.hashingService.hash(
        passwordResult.data
      );

      const userResult = User.create({
        name: nameResult.data,
        email: emailResult.data,
        isEmailVerified: false,
        password: hashedPassword,
        loginCount: 0,
        createdAt: new Date(),
      });

      await this.usersRepository.save(userResult.data);

      const verifyEmailPayload: VerifyEmailPayload = {
        sub: userResult.data.id.toString(),
        email: userResult.data.email.value,
        isEmailVerified: false,
        type: 'verify_email',
      };

      const verifyToken = this.tokenService.sign(verifyEmailPayload);

      await this.emailService.sendWithTemplate(
        userResult.data.email.value,
        'verifyEmail',
        {
          name: userResult.data.name.value,
          url: data.verifyUrl,
          token: verifyToken,
        }
      );

      return Result.ok();
    } catch (err) {
      console.log(err);
      return new UnexpectedError(err);
    }
  }
}
