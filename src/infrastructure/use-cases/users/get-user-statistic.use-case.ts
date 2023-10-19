import { GetUserStatisticUseCase } from '../../../application/use-cases/users/get-user-statistic.use-case';
import {
  prismaSessionsRepository,
  prismaUsersRepository,
} from '../../database/repositories';

export const getUserStatisticUseCase = new GetUserStatisticUseCase(
  prismaUsersRepository,
  prismaSessionsRepository
);
