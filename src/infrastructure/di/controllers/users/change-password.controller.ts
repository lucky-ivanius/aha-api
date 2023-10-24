import { ChangePasswordController } from '../../../http/controllers/users/change-password.controller';
import { changePasswordUseCase } from '../../use-cases/users/change-password.use-case';
import { changePasswordValidation } from '../../validations/users/change-password.validation';

export const changePasswordController = new ChangePasswordController(
  changePasswordUseCase,
  changePasswordValidation
);
