import { RegisterUseCase } from '../../../../application/use-cases/users/register.use-case';
import { usersRepository } from '../../repositories/users.repository';
import { bcryptService } from '../../services/bcrypt.service';
import { jwtService } from '../../services/jwt.service';
import { nodemailerService } from '../../services/nodemailer.service';

export const registerUseCase = new RegisterUseCase(
  usersRepository,
  bcryptService,
  jwtService,
  nodemailerService
);
