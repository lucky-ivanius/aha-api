import { LoginController } from '../../../http/controllers/auth/login.controller';
import { loginUseCase } from '../../use-cases/users/login.use-case';
import { loginValidation } from '../../validations/auth/login.validation';

export const loginController = new LoginController(
  loginUseCase,
  loginValidation
);
