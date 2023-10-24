import { Validation } from '../../../http/common/validation';
import {
  LoginValidation,
  loginValidationSchema,
} from '../../../http/validations/auth/login.validation';

export const loginValidation = new Validation<LoginValidation>(
  loginValidationSchema
);
