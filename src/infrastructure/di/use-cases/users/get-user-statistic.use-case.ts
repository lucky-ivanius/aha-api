import { GetUserStatisticUseCase } from '../../../../application/use-cases/users/get-user-statistic.use-case';
import { sessionsRepository } from '../../repositories/sessions.repository';
import { usersRepository } from '../../repositories/users.repository';

export const getUserStatisticUseCase = new GetUserStatisticUseCase(
  usersRepository,
  sessionsRepository
);
