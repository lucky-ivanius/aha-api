import { SendEmailVerificationController } from '../../../http/controllers/users/send-email-verification.controller';
import { sendEmailVerificationUseCase } from '../../use-cases/users/send-email-verification.use-case';

export const sendEmailVerificationController =
  new SendEmailVerificationController(sendEmailVerificationUseCase);
