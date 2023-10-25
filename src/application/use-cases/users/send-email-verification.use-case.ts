import { Id } from '../../../domain/common/id';
import { Result } from '../../../domain/common/result';
import { User } from '../../../domain/models/user/user';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { NotFoundError, UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { SendEmailVerificationRequestDto } from '../../dtos/request/users/send-email-verification-request.dto';
import { VerifyEmailDto } from '../../dtos/views/emails/verify-email.dto';
import { EmailAlreadyExistsError } from '../../errors/users/email-already-exists.error';
import { EmailHasBeenVerifiedError } from '../../errors/users/email-has-been-verified.error';
import { MailService } from '../../services/mail.service';
import { TokenService, VerifyEmailPayload } from '../../services/token.service';

export type SendEmailVerificationRequest = SendEmailVerificationRequestDto;

export type SendEmailVerificationResponse =
  | UnexpectedError
  | EmailAlreadyExistsError
  | Result<void>;

export class SendEmailVerificationUseCase
  implements
    UseCase<SendEmailVerificationRequest, SendEmailVerificationResponse>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: MailService
  ) {}

  async execute(
    data: SendEmailVerificationRequest
  ): Promise<SendEmailVerificationResponse> {
    try {
      const user = await this.usersRepository.findById(new Id(data.userId));

      if (!user) return new NotFoundError(User.name, data.userId);

      if (user.isEmailVerified)
        return new EmailHasBeenVerifiedError(user.email.value);

      const verifyEmailPayload: VerifyEmailPayload = {
        sub: user.id.toString(),
        email: user.email.value,
        type: 'verify_email',
      };

      const verifyToken = this.tokenService.sign(verifyEmailPayload);

      await this.emailService.sendWithTemplate<VerifyEmailDto>({
        to: user.email.value,
        template: 'VERIFY_EMAIL',
        args: {
          name: user.name.value,
          token: verifyToken,
          verifyEndpoint: data.verifyEndpoint,
        },
      });

      return Result.ok();
    } catch (err) {
      return new UnexpectedError(err);
    }
  }
}
