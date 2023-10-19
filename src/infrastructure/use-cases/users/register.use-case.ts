import { RegisterUseCase } from '../../../application/use-cases/users/register.use-case';
import { prismaUsersRepository } from '../../database/repositories';
import {
  bcryptHashingService,
  jwtService,
  nodemailerService,
} from '../../services';

export const registerUseCase = new RegisterUseCase(
  prismaUsersRepository,
  bcryptHashingService,
  jwtService,
  nodemailerService
);
