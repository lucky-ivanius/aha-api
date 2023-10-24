import { GetUserStatisticController } from '../../../http/controllers/users/get-user-statistic.controller';
import { getUserStatisticUseCase } from '../../use-cases/users/get-user-statistic.use-case';

export const getUserStatisticController = new GetUserStatisticController(
  getUserStatisticUseCase
);
