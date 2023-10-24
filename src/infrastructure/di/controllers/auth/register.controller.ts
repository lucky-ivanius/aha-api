import { RegisterController } from '../../../http/controllers/auth/register.controller';
import { registerUseCase } from '../../use-cases/users/register.use-case';
import { registerValidation } from '../../validations/auth/register.validation';

export const registerController = new RegisterController(
  registerUseCase,
  registerValidation
);
