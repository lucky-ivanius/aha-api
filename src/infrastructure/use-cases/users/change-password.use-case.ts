import { ChangePasswordUseCase } from '../../../application/use-cases/users/change-password.use-case';
import { prismaUsersRepository } from '../../database/repositories';
import { auth0Service, bcryptHashingService } from '../../services';

export const changePasswordUseCase = new ChangePasswordUseCase(
  prismaUsersRepository,
  bcryptHashingService,
  auth0Service
);
