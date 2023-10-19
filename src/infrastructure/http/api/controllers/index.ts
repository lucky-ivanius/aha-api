import { changePasswordUseCase } from '../../../use-cases/users/change-password.use-case';
import { getUserDetailUseCase } from '../../../use-cases/users/get-user-detail.use-case';
import { getUserListUseCase } from '../../../use-cases/users/get-user-list.use-case';
import { getUserStatisticUseCase } from '../../../use-cases/users/get-user-statistic.use-case';
import { loginWithAuth0UseCase } from '../../../use-cases/users/login-with-auth0.use-case';
import { loginUseCase } from '../../../use-cases/users/login.use-case';
import { registerWithAuth0UseCase } from '../../../use-cases/users/register-with-auth0-use-case.impl';
import { registerUseCase } from '../../../use-cases/users/register.use-case';
import { updateNameUseCase } from '../../../use-cases/users/update-name.use-case';
import { ChangePasswordController } from './auth/change-password.controller';
import { LoginWithAuth0Controller } from './auth/login-with-auth0.controller';
import { LoginController } from './auth/login.controller';
import { RegisterWithAuth0Controller } from './auth/register-with-auth0.controller';
import { RegisterController } from './auth/register.controller';
import { GetCurrentUserDetailController } from './users/get-current-user-detail.controller';
import { GetUserListController } from './users/get-user-list.controller';
import { GetUserStatisticController } from './users/get-user-statistic.controller';
import { UpdateCurrentUserNameController } from './users/update-current-user-name.controller';

// auth
export const registerWithAuth0Controller = new RegisterWithAuth0Controller(
  registerWithAuth0UseCase
);
export const loginWithAuth0Controller = new LoginWithAuth0Controller(
  loginWithAuth0UseCase
);
export const registerController = new RegisterController(registerUseCase);
export const loginController = new LoginController(loginUseCase);
export const changePasswordController = new ChangePasswordController(
  changePasswordUseCase
);

// users
export const getUserListController = new GetUserListController(
  getUserListUseCase
);
export const getCurrentUserDetailController =
  new GetCurrentUserDetailController(getUserDetailUseCase);
export const updateCurrentUserNameController =
  new UpdateCurrentUserNameController(updateNameUseCase);
export const getUserStatisticController = new GetUserStatisticController(
  getUserStatisticUseCase
);
