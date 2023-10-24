import { GetUserDetailUseCase } from '../../../../application/use-cases/users/get-user-detail.use-case';
import { usersRepository } from '../../repositories/users.repository';

export const getUserDetailUseCase = new GetUserDetailUseCase(usersRepository);
