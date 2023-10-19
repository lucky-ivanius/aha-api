import { GetUserListUseCase } from '../../../application/use-cases/users/get-user-list.use-case';
import { prismaUsersRepository } from '../../database/repositories';

export const getUserListUseCase = new GetUserListUseCase(prismaUsersRepository);
