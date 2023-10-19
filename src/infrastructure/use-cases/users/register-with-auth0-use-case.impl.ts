import { RegisterWithIdProviderUseCase } from '../../../application/use-cases/users/register-with-id-provider.use-case';
import { prismaUsersRepository } from '../../database/repositories';
import { auth0Service } from '../../services';

export const registerWithAuth0UseCase = new RegisterWithIdProviderUseCase(
  prismaUsersRepository,
  auth0Service
);
