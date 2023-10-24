import { GetUserListUseCase } from '../../../../application/use-cases/users/get-user-list.use-case';
import { usersRepository } from '../../repositories/users.repository';

export const getUserListUseCase = new GetUserListUseCase(usersRepository);
