import { Validation } from '../../../http/common/validation';
import {
  ChangeAuth0PasswordValidation,
  changeAuth0PasswordValidationSchema,
} from '../../../http/validations/users/change-auth0-password.validation';

export const changeAuth0PasswordValidation =
  new Validation<ChangeAuth0PasswordValidation>(
    changeAuth0PasswordValidationSchema
  );
