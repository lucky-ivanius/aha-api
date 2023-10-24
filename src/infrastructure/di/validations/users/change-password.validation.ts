import { Validation } from '../../../http/common/validation';
import {
  ChangePasswordValidation,
  changePasswordValidationSchema,
} from '../../../http/validations/users/change-password.validation';

export const changePasswordValidation =
  new Validation<ChangePasswordValidation>(changePasswordValidationSchema);
