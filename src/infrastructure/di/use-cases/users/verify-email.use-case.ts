import { VerifyEmailUseCase } from '../../../../application/use-cases/users/verify-email.use-case';
import { usersRepository } from '../../repositories/users.repository';
import { jwtService } from '../../services/jwt.service';

export const verifyEmailUseCase = new VerifyEmailUseCase(
  usersRepository,
  jwtService
);
