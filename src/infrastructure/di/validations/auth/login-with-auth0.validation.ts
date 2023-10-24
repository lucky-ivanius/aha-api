import { Validation } from '../../../http/common/validation';
import {
  LoginWithAuth0Validation,
  loginWithAuth0ValidationSchema,
} from '../../../http/validations/auth/login-with-auth0.validation';

export const loginWithAuth0Validation =
  new Validation<LoginWithAuth0Validation>(loginWithAuth0ValidationSchema);
