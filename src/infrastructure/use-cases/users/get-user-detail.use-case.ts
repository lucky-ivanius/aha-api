import { GetUserDetailUseCase } from '../../../application/use-cases/users/get-user-detail.use-case';
import { prismaUsersRepository } from '../../database/repositories';

export const getUserDetailUseCase = new GetUserDetailUseCase(
  prismaUsersRepository
);
