import { VerifyEmailUseCase } from '../../../application/use-cases/users/verify-email.use-case';
import { prismaUsersRepository } from '../../database/repositories';
import { jwtService } from '../../services';

export const verifyEmailUseCase = new VerifyEmailUseCase(
  prismaUsersRepository,
  jwtService
);
