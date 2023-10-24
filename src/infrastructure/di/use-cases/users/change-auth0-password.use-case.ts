import { ChangeAuth0PasswordUseCase } from '../../../../application/use-cases/users/change-auth0-password.use-case';
import { auth0Service } from '../../services/auth0.service';

export const changeAuth0PasswordUseCase = new ChangeAuth0PasswordUseCase(
  auth0Service
);
