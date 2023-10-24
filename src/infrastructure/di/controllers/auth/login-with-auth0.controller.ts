import { LoginWithAuth0Controller } from '../../../http/controllers/auth/login-with-auth0.controller';
import { loginWithAuth0UseCase } from '../../use-cases/users/login-with-auth0.use-case';
import { loginWithAuth0Validation } from '../../validations/auth/login-with-auth0.validation';

export const loginWithAuth0Controller = new LoginWithAuth0Controller(
  loginWithAuth0UseCase,
  loginWithAuth0Validation
);
