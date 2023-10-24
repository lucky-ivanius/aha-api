import { Validation } from '../../../http/common/validation';
import {
  RegisterValidation,
  registerValidationSchema,
} from '../../../http/validations/auth/register.validation';

export const registerValidation = new Validation<RegisterValidation>(
  registerValidationSchema
);
