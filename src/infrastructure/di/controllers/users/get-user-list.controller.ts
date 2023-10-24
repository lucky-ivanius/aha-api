import { GetUserListController } from '../../../http/controllers/users/get-user-list.controller';
import { getUserListUseCase } from '../../use-cases/users/get-user-list.use-case';
import { getUserListValidation } from '../../validations/users/get-user-list.validation';

export const getUserListController = new GetUserListController(
  getUserListUseCase,
  getUserListValidation
);
