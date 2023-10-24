import { Validation } from '../../../http/common/validation';
import {
  VerifyEmailValidation,
  verifyEmailValidationSchema,
} from '../../../http/validations/users/verify-email.validation';

export const verifyEmailValidation = new Validation<VerifyEmailValidation>(
  verifyEmailValidationSchema
);
