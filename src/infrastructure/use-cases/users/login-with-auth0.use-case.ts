import { LoginWithIdProviderUseCase } from '../../../application/use-cases/users/login-with-id-provider.use-case';
import {
  prismaSessionsRepository,
  prismaUsersRepository,
} from '../../database/repositories';
import { auth0Service } from '../../services';

export const loginWithAuth0UseCase = new LoginWithIdProviderUseCase(
  prismaUsersRepository,
  prismaSessionsRepository,
  auth0Service
);
