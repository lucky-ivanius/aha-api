import { VerifyEmailController } from '../../../http/controllers/users/verify-email.controller';
import { verifyEmailUseCase } from '../../use-cases/users/verify-email.use-case';
import { verifyEmailValidation } from '../../validations/users/verify-email.validation';

export const verifyEmailController = new VerifyEmailController(
  verifyEmailUseCase,
  verifyEmailValidation
);
