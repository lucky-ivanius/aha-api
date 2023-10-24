import { GetCurrentUserDetailController } from '../../../http/controllers/users/get-current-user-detail.controller';
import { getUserDetailUseCase } from '../../use-cases/users/get-user-detail.use-case';

export const getCurrentUserDetailController =
  new GetCurrentUserDetailController(getUserDetailUseCase);
