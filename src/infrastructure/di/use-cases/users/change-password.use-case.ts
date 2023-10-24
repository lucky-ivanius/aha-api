import { ChangePasswordUseCase } from '../../../../application/use-cases/users/change-password.use-case';
import { usersRepository } from '../../repositories/users.repository';
import { bcryptService } from '../../services/bcrypt.service';

export const changePasswordUseCase = new ChangePasswordUseCase(
  usersRepository,
  bcryptService
);
