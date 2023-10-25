import { SendEmailVerificationUseCase } from '../../../../application/use-cases/users/send-email-verification.use-case';
import { usersRepository } from '../../repositories/users.repository';
import { jwtService } from '../../services/jwt.service';
import { nodemailerService } from '../../services/nodemailer.service';

export const sendEmailVerificationUseCase = new SendEmailVerificationUseCase(
  usersRepository,
  jwtService,
  nodemailerService
);
