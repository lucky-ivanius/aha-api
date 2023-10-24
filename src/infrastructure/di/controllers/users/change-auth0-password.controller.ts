import { ChangeAuth0PasswordController } from '../../../http/controllers/users/change-auth0-password.controller';
import { changeAuth0PasswordUseCase } from '../../use-cases/users/change-auth0-password.use-case';
import { changeAuth0PasswordValidation } from '../../validations/users/change-auth0-password.validation';

export const changeAuth0PasswordController = new ChangeAuth0PasswordController(
  changeAuth0PasswordUseCase,
  changeAuth0PasswordValidation
);
