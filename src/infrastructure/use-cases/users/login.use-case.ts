import { LoginUseCase } from '../../../application/use-cases/users/login.use-case';
import {
  prismaSessionsRepository,
  prismaUsersRepository,
} from '../../database/repositories';
import { bcryptHashingService, jwtService } from '../../services';

export const loginUseCase = new LoginUseCase(
  prismaUsersRepository,
  prismaSessionsRepository,
  jwtService,
  bcryptHashingService
);
