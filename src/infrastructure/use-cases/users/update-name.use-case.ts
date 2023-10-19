import { UpdateNameUseCase } from '../../../application/use-cases/users/update-name.use-case';
import { prismaUsersRepository } from '../../database/repositories';

export const updateNameUseCase = new UpdateNameUseCase(prismaUsersRepository);
