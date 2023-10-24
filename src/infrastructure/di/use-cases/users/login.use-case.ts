import { LoginUseCase } from '../../../../application/use-cases/users/login.use-case';
import { sessionsRepository } from '../../repositories/sessions.repository';
import { usersRepository } from '../../repositories/users.repository';
import { bcryptService } from '../../services/bcrypt.service';
import { jwtService } from '../../services/jwt.service';

export const loginUseCase = new LoginUseCase(
  usersRepository,
  sessionsRepository,
  jwtService,
  bcryptService
);
