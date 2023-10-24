import { UpdateNameUseCase } from '../../../../application/use-cases/users/update-name.use-case';
import { usersRepository } from '../../repositories/users.repository';

export const updateNameUseCase = new UpdateNameUseCase(usersRepository);
