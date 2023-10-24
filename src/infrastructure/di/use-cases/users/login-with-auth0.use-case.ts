import { LoginWithAuth0UseCase } from '../../../../application/use-cases/users/login-with-auth0.use-case';
import { sessionsRepository } from '../../repositories/sessions.repository';
import { usersRepository } from '../../repositories/users.repository';
import { auth0Service } from '../../services/auth0.service';
import { jwtService } from '../../services/jwt.service';

export const loginWithAuth0UseCase = new LoginWithAuth0UseCase(
  usersRepository,
  sessionsRepository,
  jwtService,
  auth0Service
);
